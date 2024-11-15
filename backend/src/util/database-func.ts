import {Expression, RawBuilder, Simplify, sql} from 'kysely'

// prevent ide formatting from breaking the code
const raw = sql

/**
 * For **multiple** rows from **inline** query (provided as `expr`)
 */
export function pgJsonArrayFrom<O>(
  expr: Expression<O>,
): RawBuilder<Simplify<O>[]> {
  return raw`(SELECT COALESCE(JSON_AGG(agg), '[]') FROM ${expr} AS agg)`
}

/**
 * For **single** row from **inline** query (provided as `expr`)
 */
export function pgJsonObjectFrom<O>(
  expr: Expression<O>,
): RawBuilder<Simplify<O>> {
  return raw`(SELECT TO_JSON(obj) FROM ${expr} AS obj)`
}

export function pgToJsonObject<O>(
  expr: Expression<O>,
): RawBuilder<Simplify<O>> {
  return raw`TO_JSON(${expr})`
}

/**
 * For **multiple** rows from **current** query context
 */
export function pgJsonAgg<O>(
  expr: Expression<O>,
): RawBuilder<Simplify<O>> {
  return raw`JSONB_AGG(${expr})`
}

/**
 * For **single** row from **current** query context
 */
export function pgJsonAggSingle<O>(
  expr: Expression<O>,
): RawBuilder<Simplify<O>> {
  return raw`(JSONB_AGG(${expr}) -> 0)`
}

export function pgArray(arr: Array<string | number>) {
  return `{${arr.map(el => JSON.stringify(el)).join(',')}}`
}
