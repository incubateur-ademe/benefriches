import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { Knex } from "knex";
import { z } from "nestjs-zod/z";
import { Server } from "net";
import supertest from "supertest";
import { AppModule } from "src/app.module";
import {
  buildExhaustiveIdentityProps,
  buildMinimalIdentityProps,
} from "src/identities/domain/model/identity.mock";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { createIdentityInputSchema } from "./identities.controller";

type BadRequestResponseBody = {
  errors: { path: string[] }[];
};

describe("Identities controller", () => {
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

  describe("POST /identities", () => {
    it.each(["id", "email"] as (keyof z.infer<typeof createIdentityInputSchema>)[])(
      "can't create an identity without mandatory field %s",
      async (mandatoryField) => {
        const requestBody = buildMinimalIdentityProps();
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete requestBody[mandatoryField];

        const response = await supertest(app.getHttpServer()).post("/identities").send(requestBody);

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty("errors");

        const responseErrors = (response.body as BadRequestResponseBody).errors;
        expect(responseErrors).toHaveLength(1);
        expect(responseErrors[0].path).toContain(mandatoryField);
      },
    );

    it.each([
      { case: "with minimal data", requestBody: buildMinimalIdentityProps() },
      { case: "with exhaustive data", requestBody: buildExhaustiveIdentityProps() },
    ])("get a 201 response and identity is created $case", async ({ requestBody }) => {
      const response = await supertest(app.getHttpServer()).post("/identities").send(requestBody);

      expect(response.status).toEqual(201);

      const identitiesInDb = await sqlConnection("identities").select("id", "email");
      expect(identitiesInDb.length).toEqual(1);
      expect(identitiesInDb[0]).toEqual({
        id: requestBody.id,
        email: requestBody.email,
      });
    });
  });
});
