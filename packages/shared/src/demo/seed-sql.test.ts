import { describe, expect, it } from 'vitest'
import { buildSeedSql } from './seed-sql'

const sql = buildSeedSql()
const count = (text: string, needle: string) => text.split(needle).length - 1
const rowsOf = (table: string) => count(sql.split(`insert into public.${table} `)[1]?.split(';')[0] ?? '', '\n  (')

describe('buildSeedSql', () => {
  it('starts with the run order hint', () => {
    expect(sql.startsWith('-- ROCHADE demo data. Run schema.sql first, then this file.')).toBe(true)
  })

  it('inserts the whole fixture', () => {
    expect(rowsOf('projects')).toBe(1)
    expect(rowsOf('phases')).toBe(3)
    expect(rowsOf('flats')).toBe(16)
    expect(rowsOf('households')).toBe(11)
    expect(rowsOf('assignments')).toBe(11)
  })

  it('contains the computed plan', () => {
    expect(count(sql, "'conflict'")).toBe(1)
    expect(count(sql, "'ok'")).toBe(10)
    expect(sql).toContain("'Für Herrn Brunner fehlt vom 01.09.2027 bis 30.11.2027 eine hindernisfreie 2-Zimmer-Wohnung.'")
  })

  it('uses Swiss spelling', () => {
    expect(sql).not.toContain('ß')
  })
})
