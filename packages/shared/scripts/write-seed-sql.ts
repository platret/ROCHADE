import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { buildSeedSql } from '../src/demo/seed-sql'

const target = fileURLToPath(new URL('../../../supabase/seed.sql', import.meta.url))
writeFileSync(target, buildSeedSql())
console.log(`seed.sql geschrieben: ${target}`)
