import supertest from "supertest";
import { Test as NestTest } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { HelloModule } from "./hello.module";

describe("Hello controller", () => {
  let app: INestApplication;

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
