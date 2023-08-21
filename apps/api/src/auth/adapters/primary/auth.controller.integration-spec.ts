import { INestApplication } from "@nestjs/common";
import supertest from "supertest";
import { Test } from "@nestjs/testing";
import { Knex } from "knex";
import { AppModule } from "src/app.module";
import { DeterministicHashGenerator } from "src/users/adapters/hash-generator/DeterministicHashGenerator";
import { RandomUiidGenerator } from "src/users/adapters/uuid-generator/RandomUuidGenerator";
import { JwtService } from "@nestjs/jwt";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

describe("Auth controller", () => {
  let app: INestApplication;
  let sqlConnection: Knex;
  let hashGenerator: DeterministicHashGenerator;

  beforeAll(async () => {
    hashGenerator = new DeterministicHashGenerator("hashed");
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider("HashGenerator")
      .useValue(hashGenerator)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    sqlConnection = app.get(SqlConnection);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
    await app.close();
  });

  afterEach(async () => {
    await sqlConnection("users").truncate();
  });

  describe("POST /auth/login", () => {
    it("can't login with wrong credentials", async () => {
      const userEmail = "user@mail.com";
      const password = "very-strong-password-123@&/";

      // create user in DB
      await sqlConnection("users").insert({
        id: new RandomUiidGenerator().generate(),
        email: userEmail,
        password: await hashGenerator.generate(password),
      });

      const response = await supertest(app.getHttpServer())
        .post("/auth/login")
        .send({ email: userEmail, password: "not-valid" });

      expect(response.ok).toEqual(false);
    });

    it("can get access token", async () => {
      const userEmail = "user@mail.com";
      const password = "very-strong-password-123@&/";

      // create user in DB
      await sqlConnection("users").insert({
        id: new RandomUiidGenerator().generate(),
        email: userEmail,
        password: await hashGenerator.generate(password),
      });

      const response = await supertest(app.getHttpServer())
        .post("/auth/login")
        .send({ email: userEmail, password });

      expect(response.status).toEqual(200);
      //   eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const accessToken = response.body.accessToken as string;

      const jwtService: JwtService = app.get(JwtService);
      const decodedToken = await jwtService.verifyAsync<{
        email: string;
      }>(accessToken);
      expect(decodedToken.email).toEqual(userEmail);
    });
  });
});
