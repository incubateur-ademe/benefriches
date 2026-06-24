import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import type { DomainEvent } from "src/shared-kernel/domainEvent";

import type { DomainEventsRepository } from "./DomainEventsRepository";

@Injectable()
export class SqlDomainEventsRepository implements DomainEventsRepository {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async save(event: DomainEvent): Promise<void> {
    await this.sqlConnection("domain_events").insert({
      id: event.id,
      name: event.name,
      payload: event.payload,
    });
  }
}
