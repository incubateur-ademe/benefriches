import { NestExpressApplication } from "@nestjs/platform-express";
import type { Knex } from "knex";
import { createTestApp } from "test/testApp";
import { v4 as uuid } from "uuid";
import { describe, it, expect } from "vitest";

import { createSiteCreatedFromEvaluationEvent } from "src/reconversion-compatibility/core/events/siteCreatedFromEvaluation.event";
import { RealEventPublisher } from "src/shared-kernel/adapters/events/publisher/RealEventPublisher";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

describe("SiteCreatedFromEvaluationHandler integration test", () => {
  let app: NestExpressApplication;
  let sqlConnection: Knex;
  let eventPublisher: RealEventPublisher;

  beforeAll(async () => {
    app = await createTestApp();
    await app.init();
    sqlConnection = app.get(SqlConnection);
    eventPublisher = app.get(RealEventPublisher);
  });

  afterAll(async () => {
    await app.close();
    await sqlConnection.destroy();
  });

  it("should update EVALUATE_COMPATIBILITY action to done when site created from evaluation", async () => {
    const siteId = uuid();
    const actionId = uuid();
    const evaluationId = uuid();
    const createdBy = uuid();

    // Create a site
    await sqlConnection("sites").insert({
      id: siteId,
      name: "Test Site",
      nature: "FRICHE",
      surface_area: 10000,
      owner_structure_type: "company",
      created_by: createdBy,
      created_at: new Date(),
    });
    // Create the EVALUATE_COMPATIBILITY action as "todo"
    await sqlConnection("site_actions").insert({
      id: actionId,
      site_id: siteId,
      action_type: "EVALUATE_COMPATIBILITY",
      status: "todo",
      created_at: new Date(),
    });

    // Publish the SITE_CREATED_FROM_EVALUATION event
    await eventPublisher.publish(
      createSiteCreatedFromEvaluationEvent(uuid(), {
        evaluationId,
        relatedSiteId: siteId,
      }),
    );

    const updatedAction = await sqlConnection("site_actions").where("id", actionId).first();

    expect(updatedAction?.status).toEqual("done");
    expect(updatedAction?.completed_at).toBeInstanceOf(Date);
  });

  it("should gracefully handle missing action (no error thrown)", async () => {
    const siteId = uuid();
    const evaluationId = uuid();

    await sqlConnection("sites").insert({
      id: siteId,
      name: "Test Site",
      nature: "FRICHE",
      surface_area: 10000,
      owner_structure_type: "company",
      created_by: uuid(),
      created_at: new Date(),
    });

    await eventPublisher.publish(
      createSiteCreatedFromEvaluationEvent(uuid(), {
        evaluationId,
        relatedSiteId: siteId,
      }),
    );

    const actions = await sqlConnection("site_actions").where("site_id", siteId);

    expect(actions).toHaveLength(0);
  });
});
