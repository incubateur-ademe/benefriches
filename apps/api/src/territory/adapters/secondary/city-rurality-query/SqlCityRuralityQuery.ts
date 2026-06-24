import { Inject } from "@nestjs/common";
import { Knex } from "knex";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { CityRuralityQuery } from "src/territory/core/gateways/CityRuralityQuery";

export class SqlCityRuralityQuery implements CityRuralityQuery {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async isCityRural(cityCode: string): Promise<boolean> {
    const row = await this.sqlConnection("france_ruralites")
      .select("city_code")
      .where("city_code", cityCode)
      .first();

    return Boolean(row);
  }
}
