import {ReferenceExpression, SelectQueryBuilder, Simplify, sql as raw, StringReference} from 'kysely'

export function queryPaginationFn<
  QB extends SelectQueryBuilder<any, any, any>,
>(limit: number, offset: number) {
  return function (qb: QB): QB {
    return qb.limit(limit).offset(offset) as QB
  }
}

export function querySearchFn<
  QB extends SelectQueryBuilder<any, any, any>,
  DB extends (QB extends SelectQueryBuilder<infer DB, any, any> ? DB : any),
  TB extends (QB extends SelectQueryBuilder<any, infer T, any> ? T : keyof DB),
>(
  searchTerm: string | null | undefined,
  columns: Array<ReferenceExpression<DB, TB>>,
) {
  return function (qb: QB): QB {
    if (!searchTerm || !searchTerm || searchTerm.length === 0) {
      return qb
    }

    return qb.where(qb => qb.parens(qb.or(
      columns.map(c => qb(qb.cast(c, 'text'), 'ilike', `%${searchTerm}%`)),
    ))) as QB

  }
}

export async function fetchItemsAndCountWithPagination<
  QB extends SelectQueryBuilder<any, any, any>,
  DB extends (QB extends SelectQueryBuilder<infer DB, any, any> ? DB : never),
  TB extends (QB extends SelectQueryBuilder<any, infer T, any> ? T : never),
  O extends (QB extends SelectQueryBuilder<any, any, infer O> ? O : never),
>(
  baseQuery: QB,
  limit: number,
  offset: number,
  uniqAlias: StringReference<DB, TB> | null,
) {

  const [count, users] = await Promise.all([
    baseQuery
      .clearSelect()
      .select(qb => qb.cast<number>(
        uniqAlias
          ? qb.fn('count', [raw`DISTINCT ${qb.ref(uniqAlias!)}`])
          : qb.fn.countAll(),
        'integer',
      ).as('count'))
      .executeTakeFirst(),

    baseQuery
      .$call(queryPaginationFn(limit, offset))
      .$if(uniqAlias !== null, qb => qb.distinctOn(uniqAlias!))
      .execute(),
  ])

  return {
    items: users as Simplify<Array<O>>,
    count: count?.count ?? 0,
    limit: limit,
    offset: offset,
  }
}
