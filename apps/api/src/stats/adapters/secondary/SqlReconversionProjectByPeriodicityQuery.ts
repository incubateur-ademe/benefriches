import { Inject } from "@nestjs/common";
import type { Knex } from "knex";
import { GetPeriodicityStatsRequestDto, GetPeriodicityStatsResponseDto } from "shared";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

export class InvalidStatsQueryError extends Error {}

export class SqlReconversionProjectByPeriodicityQuery {
  private readonly sqlConnection: Knex;
  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  async getReconversionProjectByPeriodicity({
    since,
    periodicity,
  }: GetPeriodicityStatsRequestDto): Promise<{
    startDate: Date;
    stats: GetPeriodicityStatsResponseDto["stats"];
  }> {
    const startDateRequestRawPromise: Knex.Raw<{
      rows: {
        start: Date;
      }[];
    }> = since
      ? this.sqlConnection.raw<{ rows: { start: Date }[] }>(
          `select date_trunc(?, now() - (? || ' ' || ?)::interval) AS start`,
          [periodicity, since, periodicity],
        )
      : this.sqlConnection.raw<{ rows: { start: Date }[] }>(
          `SELECT date_trunc(?, coalesce(min(created_at), now())) AS start FROM reconversion_projects`,
          [periodicity],
        );

    const startDateRequestResult = await startDateRequestRawPromise;

    if (!startDateRequestResult.rows[0]) {
      throw new Error("Unexpected empty result when computing stats startDate");
    }
    const startDate = startDateRequestResult.rows[0].start;

    const { rows } = await this.sqlConnection.raw<{
      rows: { date: string; value: number }[];
    }>(
      `
    WITH periods AS (
      SELECT generate_series(
        ?::timestamptz,
        date_trunc(?, now()),
        (('1 ' || ?))::interval
      ) AS period_start
    ),
    counts AS (
      SELECT
        date_trunc(?, created_at) AS period_start,
        count(*)::int AS value
      FROM reconversion_projects
      WHERE created_at >= ?::timestamptz
      GROUP BY 1
    )
    SELECT
      (extract(epoch from p.period_start) * 1000)::bigint AS date,
      coalesce(c.value, 0) AS value
    FROM periods p
    LEFT JOIN counts c ON c.period_start = p.period_start
    ORDER BY p.period_start
    `,
      [startDate, periodicity, periodicity, periodicity, startDate],
    );

    return {
      startDate,
      stats: rows.map((r) => ({ value: r.value, date: Number(r.date) })),
    };
  }
}
