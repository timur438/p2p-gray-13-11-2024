import {Kysely, sql} from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
      ALTER TABLE bank_accounts
          ADD COLUMN card_number VARCHAR(20) NULL;
  `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
      ALTER TABLE bank_accounts
          DROP COLUMN card_number;
  `.execute(db)
}
