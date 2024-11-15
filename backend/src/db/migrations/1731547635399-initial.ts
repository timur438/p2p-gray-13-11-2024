import {Kysely, sql} from 'kysely'

export async function up(db: Kysely<any>) {
  await sql`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      CREATE TABLE apps
      (
          id         BIGSERIAL PRIMARY KEY,
          name       VARCHAR(255) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE bank_accounts
      (
          id         BIGSERIAL PRIMARY KEY,
          type       VARCHAR(20)  NOT NULL,
          number     VARCHAR(255) NOT NULL,
          auth       JSONB        NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE bank_account_transactions
      (
          id              BIGSERIAL PRIMARY KEY,
          bank_account_id BIGINT  NOT NULL REFERENCES bank_accounts (id) ON DELETE RESTRICT,
          amount          INTEGER NOT NULL,
          created_at      TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE invoices
      (
          id              BIGSERIAL PRIMARY KEY,
          secure_key      VARCHAR(32) NOT NULL DEFAULT ENCODE(gen_random_bytes(16), 'hex'),
          status          SMALLINT    NOT NULL, -- 0: pending, 1: paid, 2: canceled
          app_id          BIGINT      NOT NULL REFERENCES apps (id) ON DELETE RESTRICT,
          amount          INTEGER     NOT NULL CHECK ( amount > 0 ),
          bank_account_id BIGINT      NOT NULL REFERENCES bank_accounts (id) ON DELETE RESTRICT,
          expires_at      TIMESTAMPTZ NOT NULL,
          created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

  `.execute(db)
}

export async function down(db: Kysely<any>) {
  await sql`
      DROP TABLE IF EXISTS invoices;
      DROP TABLE IF EXISTS bank_account_transactions;
      DROP TABLE IF EXISTS bank_accounts;
      DROP TABLE IF EXISTS apps;
  `.execute(db)
}
