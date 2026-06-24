import { Inject } from "@nestjs/common";
import { Knex } from "knex";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import {
  UserFeatureAlertRepository,
  UserFeatureAlert,
} from "src/users/core/usecases/createUserFeatureAlert.usecase";

export class SqlUserFeatureAlertRepository implements UserFeatureAlertRepository {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async save(props: UserFeatureAlert): Promise<void> {
    await this.sqlConnection.transaction(async (trx) => {
      await trx("users_feature_alerts").insert(
        {
          id: props.id,
          email: props.email,
          user_id: props.userId,
          feature_type: props.featureType,
          feature_options:
            props.featureType === "compare_impacts" || props.featureType === "export_impacts"
              ? props.featureOptions
              : null,
          created_at: props.createdAt,
        },
        "id",
      );
    });
  }
}
