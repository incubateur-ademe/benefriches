import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { Server } from "net";
import supertest from "supertest";
import { AppModule } from "src/app.module";

describe("Partners controller", () => {
  let app: INestApplication<Server>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(ConfigModule)
      .useModule(ConfigModule.forRoot({ envFilePath: ".env.test" }))
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`/GET /partners/:partnerId/embed-urls/project-impacts/:projectId`, async () => {
    const response = await supertest(app.getHttpServer()).get(
      "/partners/random-partner/embed-urls/project-impacts/project-1-id",
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      url: "https://testapp.benefriches.fr/my-projects",
      iframe: "https://testapp.benefriches.fr/embed/my-projects/project-1234/impacts",
    });
  });
});
