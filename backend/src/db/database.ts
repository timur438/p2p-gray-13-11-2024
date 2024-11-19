import {ColumnType, Generated, Selectable} from 'kysely'
import {SerializedCookieJar} from 'tough-cookie'

type TDateField = ColumnType<Date, Date | string, Date | string>
type TNullableDateField = ColumnType<Date | null, Date | string | null, Date | string | null>
type TAutoDateField = ColumnType<Date, Date | string | undefined, Date | string>
type TAutoBigNumberField = ColumnType<string, string | number | undefined, string | number | undefined>
type TBigNumberField = ColumnType<string, string | number, string | number>
type TNullableBigNumberField = ColumnType<string, string | number | undefined, string | number | undefined>
type TANullableDateField = ColumnType<Date | null, Date | string | null | undefined, Date | string | null | undefined>
type TNullable<T> = ColumnType<T | null, string | null | undefined, string | null | undefined>
type TJsonValue<T> = ColumnType<T, T | string, T | string>
type TAutoJsonValue<T> = ColumnType<T, T | string | undefined, T | string>

export type DbEntity<T extends keyof DB> = Selectable<DB[T]>

export interface DB {

  managers: {
    id: Generated<string>
    login: string
    password: string
    active: boolean
    permissions: TJsonValue<Array<string>>
    created_at: TAutoDateField
  }

  apps: {
    id: Generated<string>
    name: string
    created_at: TAutoDateField
  }

  bank_accounts: {
    id: Generated<string>
    type: string
    number: string
    auth: TJsonValue<{
      cookies?: SerializedCookieJar
      proxy?: { ip: string, port: number, login: string, password: string }
    }>
    created_at: TAutoDateField
  }

  bank_account_transactions: {
    id: Generated<string>
    bank_account_id: TBigNumberField
    amount: number
    created_at: TAutoDateField
  }

  invoices: {
    id: Generated<string>
    secure_key: Generated<string>
    status: Generated<number>
    app_id: TBigNumberField
    amount: number
    user_approved_at: TNullableDateField
    bank_account_id: TNullableBigNumberField
    expires_at: TAutoDateField
    created_at: TAutoDateField
  }
}
