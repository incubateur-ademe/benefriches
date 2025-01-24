import { INestApplication } from "@nestjs/common";
import { Server } from "net";
import supertest from "supertest";
import { createTestApp } from "test/testApp";

describe("Hello controller", () => {
  let app: INestApplication<Server>;

  beforeAll(async () => {
    app = await createTestApp();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`/GET /hello`, async () => {
    const response = await supertest(app.getHttpServer()).get("/api/hello");

    expect(response.statusCode).toEqual(200);
    expect(response.text).toEqual("Hello!");
  });
});
