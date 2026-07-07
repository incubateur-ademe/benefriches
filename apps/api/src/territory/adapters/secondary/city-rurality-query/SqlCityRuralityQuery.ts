import { Inject } from "@nestjs/common";
import type { Knex } from "knex";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { CityRuralityQuery } from "src/territory/core/gateways/CityRuralityQuery";

export class SqlCityRuralityQuery implements CityRuralityQuery {
  private readonly sqlConnection: Knex;
  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  async isCityRural(cityCode: string): Promise<boolean> {
    const row = await this.sqlConnection("france_ruralites")
      .select("city_code")
      .where("city_code", cityCode)
      .first();

    return Boolean(row);
  }
}
