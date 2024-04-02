import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { Knex } from "knex";
import { z } from "nestjs-zod/z";
import { Server } from "net";
import supertest from "supertest";
import { AppModule } from "src/app.module";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { buildExhaustiveUserProps, buildMinimalUserProps } from "src/users/domain/model/user.mock";
import { createUserBodychema } from "./users.controller";

type BadRequestResponseBody = {
  errors: { path: string[] }[];
};

describe("Users controller", () => {
  let app: INestApplication<Server>;
  let sqlConnection: Knex;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(ConfigModule)
      .useModule(ConfigModule.forRoot({ envFilePath: ".env.test" }))
      .compile();

    app = moduleRef.createNestApplication();
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

      const response = await supertest(app.getHttpServer()).post("/users").send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty("errors");

      const responseErrors = (response.body as BadRequestResponseBody).errors;
      expect(responseErrors).toHaveLength(1);
      expect(responseErrors[0].path).toContain(mandatoryField);
    });

    it.each([
      { case: "with minimal data", requestBody: buildMinimalUserProps() },
      { case: "with exhaustive data", requestBody: buildExhaustiveUserProps() },
    ])("get a 201 response and user is created $case", async ({ requestBody }) => {
      const response = await supertest(app.getHttpServer()).post("/users").send(requestBody);

      expect(response.status).toEqual(201);

      const usersInDb = await sqlConnection("users").select("id", "email");
      expect(usersInDb.length).toEqual(1);
      expect(usersInDb[0]).toEqual({
        id: requestBody.id,
        email: requestBody.email,
      });
    });
  });
});
