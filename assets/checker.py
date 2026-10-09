"""Avaliador compartilhado entre o laboratório Pyodide e a validação do currículo.

Os testes são contratos didáticos, não uma barreira antifraude. Nunca execute
este avaliador com código de terceiros em um backend sem isolamento adicional.
"""
import ast
import builtins
import contextlib
import copy
import dataclasses
import inspect
import io
import json
import os
import sys
import tempfile
import traceback
import types
from pathlib import Path


class LimitedOutput(io.StringIO):
    def write(self, text):
        if self.tell() + len(text) > 16000:
            raise RuntimeError("Saída muito longa. Reduza a quantidade de print().")
        return super().write(text)


def raises(kind, fn, *args, **kwargs):
    try:
        fn(*args, **kwargs)
    except kind:
        return True
    except Exception:
        return False
    return False


def unchanged(fn, value):
    original = copy.deepcopy(value)
    fn(value)
    return value == original


def independent_stock(cls):
    a, b = cls(), cls()
    a.entrar(2)
    return a.saldo == 2 and b.saldo == 0


class TestItem:
    def __init__(self, value):
        self.value = value

    def subtotal(self):
        return self.value


def pedido_copies(cls):
    itens = [TestItem(1)]
    pedido = cls(itens)
    itens.append(TestItem(2))
    return len(pedido.itens) == 1 and pedido.total() == 1


def sql_min(fn, minimum):
    import sqlite3
    with contextlib.closing(sqlite3.connect(":memory:")) as con:
        con.execute("CREATE TABLE produtos (sku TEXT, saldo INTEGER)")
        con.executemany("INSERT INTO produtos VALUES (?, ?)", [("A",5),("B",20),("C",0)])
        return fn(con, minimum)


def sql_rank(fn, empty=False, tie=False):
    import sqlite3
    with contextlib.closing(sqlite3.connect(":memory:")) as con:
        con.execute("CREATE TABLE produtos (sku TEXT, nome TEXT)")
        con.execute("CREATE TABLE vendas (sku TEXT, quantidade INTEGER)")
        con.executemany("INSERT INTO produtos VALUES (?, ?)", [("A","Sacola"),("B","Saco"),("C","Sem vendas")])
        if not empty:
            con.executemany("INSERT INTO vendas VALUES (?, ?)", [("A",2),("A",1 if tie else 5),("B",3)])
        return fn(con)


def sql_transfer(fn, quantity, missing=False):
    import sqlite3
    with contextlib.closing(sqlite3.connect(":memory:")) as con:
        con.execute("CREATE TABLE estoque (sku TEXT PRIMARY KEY, saldo INTEGER)")
        con.executemany("INSERT INTO estoque VALUES (?, ?)", [("A",10),("B",0)])
        con.commit()
        try:
            outcome = fn(con, "A", "C" if missing else "B", quantity)
        except ValueError:
            outcome = "ValueError"
        return outcome, con.execute("SELECT * FROM estoque ORDER BY sku").fetchall()


def api_create(fn):
    pedidos = []
    result = fn({"sku":" A ","quantidade":2}, pedidos)
    return result == {"id":1,"sku":"A","quantidade":2} and pedidos == [result]


sales = [
    {"data":"2027-01-01","sku":"A","quantidade":2},
    {"data":"2027-01-31","sku":"A","quantidade":3},
    {"data":"2027-01-15","sku":"B","quantidade":4},
    {"data":"2027-02-01","sku":"C","quantidade":100},
]
final_sales = [{**v,"status":"concluido"} for v in sales] + [{"data":"2027-01-10","sku":"D","quantidade":999,"status":"cancelado"}]
tie_sales = [{"data":"2027-01-10","sku":sku,"quantidade":2,"status":"concluido"} for sku in ["B","A"]]


async def futuredev_execute(code, tests, inputs):
    output, error_output = LimitedOutput(), LimitedOutput()
    module = types.ModuleType("futuredev_user")
    sys.modules[module.__name__] = module
    namespace = module.__dict__
    input_values = iter(inputs)

    def read_input(prompt=""):
        print(prompt, end="")
        try:
            value = next(input_values)
        except StopIteration:
            raise EOFError("Faltou uma entrada. Preencha o campo de input(), uma linha por chamada.")
        print(value)
        return value

    namespace.update({
        "__builtins__": {**vars(builtins), "input":read_input},
        "__raises":raises, "__unchanged":unchanged, "__io":io,
        "__Path":Path, "__dataclasses":dataclasses, "__inspect":inspect,
        "__independent_stock":independent_stock, "__Item":TestItem,
        "__pedido_copies":pedido_copies, "__sql_min":sql_min,
        "__sql_rank":sql_rank, "__sql_transfer":sql_transfer,
        "__api_create":api_create, "__sales":copy.deepcopy(sales),
        "__final_sales":copy.deepcopy(final_sales), "__tie_sales":copy.deepcopy(tie_sales),
    })
    previous_directory = os.getcwd()
    result = {"output":"", "error":"", "tests":[]}
    with tempfile.TemporaryDirectory(prefix="futuredev-") as directory:
        os.chdir(directory)
        try:
            with contextlib.redirect_stdout(output), contextlib.redirect_stderr(error_output):
                compiled = compile(code, "main.py", "exec", flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
                response = eval(compiled, namespace)
                if inspect.isawaitable(response):
                    await response
            result["output"] = output.getvalue() + error_output.getvalue()
            namespace["__output"] = output.getvalue()
            for test in tests:
                outcome = {"label":test["label"], "passed":False, "error":""}
                try:
                    with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
                        compiled_test = compile(test["expr"], "test.py", "eval", flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
                        correct = eval(compiled_test, namespace)
                        if inspect.isawaitable(correct):
                            correct = await correct
                        outcome["passed"] = bool(correct)
                    if not outcome["passed"]:
                        outcome["error"] = "A resposta não atende a este caso."
                except Exception as exc:
                    outcome["error"] = f"{type(exc).__name__}: {exc}"[:500]
                result["tests"].append(outcome)
        except BaseException as exc:
            result["output"] = output.getvalue() + error_output.getvalue()
            result["error"] = "".join(traceback.format_exception(type(exc), exc, exc.__traceback__, limit=2))[-5000:]
        finally:
            os.chdir(previous_directory)
            sys.modules.pop(module.__name__, None)
    return result
