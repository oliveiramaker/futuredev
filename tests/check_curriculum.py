"""Executa todas as soluções e starters no mesmo avaliador usado pelo browser."""
import asyncio
import importlib.util
import json
from pathlib import Path
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
curriculum = subprocess.run(["node", "--input-type=module", "-e", "import {lessons} from './js/curriculum.js'; console.log(JSON.stringify(lessons));"], cwd=root, capture_output=True, text=True, check=True)
lessons = json.loads(curriculum.stdout)
spec = importlib.util.spec_from_file_location("checker", root / "assets/checker.py")
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)

async def main():
    failures = []
    total = 0
    for lesson in lessons:
        result = await checker.futuredev_execute(lesson["solution"], lesson["tests"], [])
        wrong = [t for t in result["tests"] if not t["passed"]]
        if result["error"] or wrong or len(result["tests"]) != len(lesson["tests"]):
            failures.append({"id":lesson["id"],"result":result})
        starter = await checker.futuredev_execute(lesson["starter"], lesson["tests"], [])
        if not starter["error"] and len(starter["tests"]) == len(lesson["tests"]) and all(t["passed"] for t in starter["tests"]):
            failures.append({"id":lesson["id"],"problem":"Starter já atende a todos os testes."})
        total += len(lesson["tests"])
    if failures:
        print(json.dumps(failures,ensure_ascii=False,indent=2))
        sys.exit(1)
    print(f"Currículo verificado: {len(lessons)} soluções, {total} casos e {len(lessons)} starters que exigem implementação.")

asyncio.run(main())
