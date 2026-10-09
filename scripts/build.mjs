import {build} from 'esbuild';
import {mkdir, cp, readFile, writeFile, rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

export function publicConfig(env) {
  const url = env.SUPABASE_URL?.trim(), key = env.SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key) throw new Error('Configure SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY antes de publicar.');
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:') throw new Error('SUPABASE_URL deve usar HTTPS.');
  if (parsed.username || parsed.password || parsed.search || parsed.hash || !['','/'].includes(parsed.pathname)) throw new Error('SUPABASE_URL deve ser a URL pública do projeto, sem credenciais.');
  if (!key.startsWith('sb_publishable_')) {
    let payload;
    try {payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString());} catch { /* invalid public key */ }
    if (payload?.role !== 'anon') throw new Error('Use somente uma chave publishable ou anon. Chaves secret e service_role nunca podem ir para o navegador.');
  }
  return {url: parsed.origin, key};
}
export async function buildSite(env = process.env) {
  const config = publicConfig(env);
  const out = resolve('dist');
  await rm(out, {recursive: true, force: true});
  await mkdir(out, {recursive: true});
  for (const name of ['assets', 'js']) await cp(name, `${out}/${name}`, {recursive: true});
  for (const name of ['index.html', 'manifest.webmanifest', 'sw.js', '.nojekyll']) await cp(name, `${out}/${name}`);
  // Non-secret project configuration is compiled into the client. Source and
  // environment files are not included in the publish directory.
  await build({entryPoints: ['js/app.js'], outfile: `${out}/js/app.js`, bundle: true,
    format: 'esm', target: ['es2022'], minify: true, sourcemap: false,
    define: {__FUTUREDEV_CONFIG__: JSON.stringify(config)}});
  // Prevent bare SDK imports from being served as an alternative entry point.
  await rm(`${out}/js/account.js`);
  await writeFile(`${out}/build-info.json`, JSON.stringify({version: JSON.parse(await readFile('package.json','utf8')).version}));
  console.log('FutureDev compilado em dist/ com autenticação Supabase.');
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await buildSite();
}
