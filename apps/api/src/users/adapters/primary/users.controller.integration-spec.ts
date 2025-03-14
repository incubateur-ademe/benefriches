import { INestApplication } from "@nestjs/common";
import { Knex } from "knex";
import { Server } from "net";
import supertest from "supertest";
import { createTestApp } from "test/testApp";
import z from "zod";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { buildExhaustiveUserProps, buildMinimalUserProps } from "src/users/core/model/user.mock";

import { createUserBodychema } from "./users.controller";

type BadRequestResponseBody = {
  errors: { path: string[] }[];
};

describe("Users controller", () => {
  let app: INestApplication<Server>;
  let sqlConnection: Knex;

  beforeAll(async () => {
    app = await createTestApp();
    await app.init();
    sqlConnection = app.get(SqlConnection);
  });

  afterAll(async () => {
    await app.close();
    await sqlConnection.destroy();
  });

  describe("POST /users", () => {
    it.each(["id", "email", "structureType", "structureActivity"] as (keyof z.infer<
      typeof createUserBodychema
    >)[])("can't create an user without mandatory field %s", async (mandatoryField) => {
      const requestBody = buildMinimalUserProps();
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete requestBody[mandatoryField];

      const response = await supertest(app.getHttpServer()).post("/api/users").send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty("errors");

      const responseErrors = (response.body as BadRequestResponseBody).errors;
      expect(responseErrors).toHaveLength(1);
      expect(responseErrors[0]?.path).toContain(mandatoryField);
    });

    it.each([
      { case: "with minimal data", requestBody: buildMinimalUserProps() },
      { case: "with exhaustive data", requestBody: buildExhaustiveUserProps() },
    ])("get a 201 response and user is created $case", async ({ requestBody }) => {
      const response = await supertest(app.getHttpServer()).post("/api/users").send(requestBody);

      expect(response.status).toEqual(201);

      const usersInDb = await sqlConnection("users").select("id", "email");
      expect(usersInDb.length).toEqual(1);
      expect(usersInDb[0]).toEqual({
        id: requestBody.id,
        email: requestBody.email,
      });
    });
  });

  describe("POST /users/feature-alert", () => {
    it.each(["id", "userId", "email", "feature"] as ("id" | "userId" | "email" | "feature")[])(
      "can't create a feature alert without mandatory field %s",
      async (mandatoryField) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [mandatoryField]: _, ...props } = {
          id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
          userId: "cc5fefe9-3bcb-4271-a27b-50ab9bb33596",
          email: "user@ademe.fr",
          feature: {
            type: "duplicate_project",
          },
        };
        const response = await supertest(app.getHttpServer())
          .post("/api/users/feature-alert")
          .send(props);

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty("errors");

        const responseErrors = (response.body as BadRequestResponseBody).errors;
        expect(responseErrors).toHaveLength(1);
        expect(responseErrors[0]?.path).toContain(mandatoryField);
      },
    );

    it.each([
      { type: "export_impacts", options: ["pdf", "excel", "sharing_link"] },
      { type: "duplicate_project" },
      { type: "compare_impacts", options: ["other_project_on_same_site"] },
    ])("get a 201 response and user is created $type", async ({ type, options }) => {
      await sqlConnection("users").insert({
        id: "cc5fefe9-3bcb-4271-a27b-50ab9bb33596",
        email: "user@ademe.fr",
        personal_data_storage_consented_at: new Date(),
        created_at: new Date(),
      });

      const response = await supertest(app.getHttpServer()).post("/api/users/feature-alert").send({
        id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
        userId: "cc5fefe9-3bcb-4271-a27b-50ab9bb33596",
        email: "user@ademe.fr",
        feature: {
          type,
          options,
        },
      });

      expect(response.status).toEqual(201);

      const result = await sqlConnection("users_feature_alerts").select(
        "id",
        "email",
        "feature_type",
        "feature_options",
      );
      expect(result.length).toEqual(1);
      expect(result[0]?.id).toEqual("2096a04d-4876-4e1e-b071-d5355fd0ee4c");
      expect(result[0]?.email).toEqual("user@ademe.fr");
      expect(result[0]?.feature_type).toEqual(type);
      expect(result[0]?.feature_options === null).toBe(type === "duplicate_project");
    });
  });
});
