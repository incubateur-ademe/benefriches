import { INestApplication } from "@nestjs/common";
import { Test as NestTest } from "@nestjs/testing";
import { Server } from "net";
import supertest from "supertest";
import { HelloModule } from "./hello.module";

describe("Hello controller", () => {
  let app: INestApplication<Server>;

  beforeAll(async () => {
    const moduleRef = await NestTest.createTestingModule({
      imports: [HelloModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`/GET /hello`, async () => {
    const response = await supertest(app.getHttpServer()).get("/hello");

    expect(response.statusCode).toEqual(200);
    expect(response.text).toEqual("Hello!");
  });
});
