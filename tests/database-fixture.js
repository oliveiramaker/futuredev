import {PGlite} from '@electric-sql/pglite';
import {readFile, readdir} from 'node:fs/promises';

export const USER_A = '11111111-1111-4111-8111-111111111111';
export const USER_B = '22222222-2222-4222-8222-222222222222';
export async function createDatabase() {
  const db = new PGlite();
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create schema auth;
    create table auth.users (id uuid primary key);
    insert into auth.users values ('${USER_A}'), ('${USER_B}');
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth, public to anon, authenticated;
    grant execute on function auth.uid() to anon, authenticated;
  `);
  const migrations = (await readdir(new URL('../supabase/migrations/', import.meta.url))).filter(f=>f.endsWith('.sql')).sort();
  for (const file of migrations) await db.exec(await readFile(new URL(`../supabase/migrations/${file}`, import.meta.url),'utf8'));
  // The fixture uses real PostgreSQL RLS. Only Auth's request identity is
  // emulated; the migration and RPC are the production SQL, unchanged.
  let queue = Promise.resolve();
  return {
    db,
    as(userId, callback, role = 'authenticated') {
      const result = queue.then(async () => {
        await db.exec(`set role ${role}`);
        await db.query("select set_config('request.jwt.claim.sub', $1, false)", [userId || '']);
        try {return await callback(db);} finally {await db.exec('reset role');}
      });
      queue = result.catch(()=>{});
      return result;
    },
    async close() {await queue; await db.close();}
  };
}
