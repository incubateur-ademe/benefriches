/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from "@nestjs/common";
import supertest from "supertest";
import { Test } from "@nestjs/testing";
import { Knex } from "knex";
import { AppModule } from "src/app.module";
import { User } from "src/users/domain/models/user";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

describe("Users controller", () => {
  let app: INestApplication;
  let sqlConnection: Knex;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    sqlConnection = app.get(SqlConnection);
  });

  afterAll(async () => {
    await app.close();
    await sqlConnection.destroy();
  });

  describe("POST /users", () => {
    it("can't create a user without email", async () => {
      const response = await supertest(app.getHttpServer())
        .post("/users")
        .send({ password: "strong-password-1234" });

      expect(response.status).toEqual(400);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].path).toEqual(["email"]);
    });

    it("can't create a user without password", async () => {
      const response = await supertest(app.getHttpServer())
        .post("/users")
        .send({ email: "user@mail.com" });

      expect(response.status).toEqual(400);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].path).toEqual(["password"]);
    });

    it("can create user", async () => {
      const userEmail = "user@mail.com";
      const response = await supertest(app.getHttpServer())
        .post("/users")
        .send({ email: userEmail, password: "password-long-enough" });

      expect(response.status).toEqual(201);
      expect(response.body).toEqual({});

      const usersInDb = await sqlConnection<User>("users")
        .select("email")
        .where({ email: userEmail });
      expect(usersInDb.length).toEqual(1);
      expect(usersInDb[0]).toEqual({ email: userEmail });
    });
  });
});
