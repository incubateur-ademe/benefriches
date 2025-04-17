import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import cookie from "cookie";
import { Knex } from "knex";
import { Server } from "net";
import request from "supertest";
import { createTestApp } from "test/testApp";
import { z } from "zod";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { UserBuilder } from "src/users/core/model/user.mock";

import { AccessTokenPayload } from "./JwtAuthGuard";
import { ACCESS_TOKEN_COOKIE_KEY } from "./access-token/accessTokenCookie";
import { registerUserBodySchema, RegisterUserBodyDto } from "./auth.controller";
import { FakeProConnectClient } from "./pro-connect/FakeProConnectClient";
import { PRO_CONNECT_CLIENT_INJECTION_TOKEN } from "./pro-connect/ProConnectClient";
import { mapUserToSqlRow } from "./user-repository/SqlUserRepository";

type BadRequestResponseBody = {
  errors: { path: string[] }[];
};

function extractCookieFromResponseHeaders<TCookieName extends string>(
  headers: Record<string, string | string[] | undefined>,
  cookieName: TCookieName,
): (Record<TCookieName, string> & Record<string, string | undefined>) | undefined {
  const cookies = headers["set-cookie"];

  if (!cookies) return undefined;

  if (Array.isArray(cookies)) {
    for (const cookieString of cookies) {
      const parsedCookie = cookie.parse(cookieString);
      if (parsedCookie[cookieName]) return parsedCookie as Record<TCookieName, string>;
    }
  }
}

describe("Auth integration tests", () => {
  let app: INestApplication<Server>;
  let sqlConnection: Knex;

  beforeAll(async () => {
    app = await createTestApp({
      providerOverrides: [
        { token: PRO_CONNECT_CLIENT_INJECTION_TOKEN, useClass: FakeProConnectClient },
      ],
    });
    await app.init();
    sqlConnection = app.get(SqlConnection);
  });

  afterAll(async () => {
    await app.close();
    await sqlConnection.destroy();
  });

  describe("POST /auth/register", () => {
    const buildRegisterUserPayload = (): RegisterUserBodyDto => ({
      id: "ecf6d4b1-d394-48c8-8208-fad936afe6ca",
      firstname: "John",
      lastname: "Doe",
      email: "user@collectivite.fr",
      structureActivity: "urban_planner",
      structureType: "company",
      personalDataAnalyticsUseConsented: false,
      personalDataCommunicationUseConsented: false,
      personalDataStorageConsented: true,
      createdFrom: "features_app",
    });

    it.each([
      "id",
      "email",
      "firstname",
      "lastname",
      "structureType",
      "structureActivity",
      "personalDataStorageConsented",
      "personalDataAnalyticsUseConsented",
    ] as (keyof z.infer<typeof registerUserBodySchema>)[])(
      "cannot register a user without field '%s'",
      async (mandatoryField) => {
        const requestBody = buildRegisterUserPayload();
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete requestBody[mandatoryField];

        const response = await request(app.getHttpServer())
          .post("/api/auth/register")
          .send(requestBody);

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty("errors");

        const responseErrors = (response.body as BadRequestResponseBody).errors;
        expect(responseErrors).toHaveLength(1);
        expect(responseErrors[0]?.path).toContain(mandatoryField);
      },
    );

    it("cannot register a user when email is already taken", async () => {
      const registerUserPayload = buildRegisterUserPayload();
      await sqlConnection("users").insert({
        id: registerUserPayload.id,
        firstname: "Jane",
        lastname: "Doe",
        email: registerUserPayload.email,
        structure_activity: registerUserPayload.structureActivity,
        structure_type: registerUserPayload.structureType,
        personal_data_analytics_use_consented_at: new Date(),
        personal_data_communication_use_consented_at: new Date(),
        structure_name: "Mairie de Blajan",
        personal_data_storage_consented_at: new Date(),
        created_from: "demo_app",
        created_at: new Date(),
      });

      const response = await request(app.getHttpServer())
        .post("/api/auth/register")
        .send(registerUserPayload);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        message: "Email already taken",
        error: "EMAIL_ALREADY_EXISTS",
      });
    });

    it("creates user in DB and sends access token in response cookie", async () => {
      const registerUserPayload = buildRegisterUserPayload();

      const response = await request(app.getHttpServer())
        .post("/api/auth/register")
        .send(registerUserPayload);

      expect(response.status).toBe(201);

      const usersInDb = await sqlConnection("users")
        .select("id", "email", "firstname", "lastname")
        .where({ email: registerUserPayload.email });

      expect(usersInDb).toHaveLength(1);
      expect(usersInDb[0]).toEqual({
        id: registerUserPayload.id,
        email: registerUserPayload.email,
        firstname: registerUserPayload.firstname,
        lastname: registerUserPayload.lastname,
      });

      const accessTokenCookie = extractCookieFromResponseHeaders(
        response.headers,
        ACCESS_TOKEN_COOKIE_KEY,
      );
      expect(accessTokenCookie).toBeDefined();

      const jwtValue = accessTokenCookie?.access_token ?? "";
      expect(jwtValue).toBeDefined();
      const jwtPayload = app.get(JwtService).verify<AccessTokenPayload>(jwtValue);
      expect(jwtPayload).toBeDefined();
      expect(jwtPayload.sub).toBe(registerUserPayload.id);
      expect(jwtPayload.email).toBe(registerUserPayload.email);
      expect(jwtPayload.authProvider).toBe("benefriches");
    });
  });

  describe("GET /auth/login-callback/pro-connect", () => {
    it("fails when no state or nonce in session", async () => {
      // use agent to maintain session and cookies
      const agent = request.agent(app.getHttpServer());
      const response = await agent.get("/api/auth/login-callback/pro-connect");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Bad Request",
        statusCode: 400,
        message: "Missing expected state or nonce",
      });
    });

    it("sets email as verified and redirects to given redirectTo URL with access token when user exists and Pro Connect authentication is successful", async () => {
      const redirectTo = "http://some-website.fr";
      const userEmail = "jean.doe@example.fr";
      const proConnectClient: FakeProConnectClient = app.get(PRO_CONNECT_CLIENT_INJECTION_TOKEN);
      proConnectClient._setMockUserIdentity({
        email: userEmail,
      });

      const user = new UserBuilder().asUrbanPlanner().withEmail(userEmail).build();
      await sqlConnection("users").insert(mapUserToSqlRow(user));

      // use agent to maintain session and cookies
      const agent = request.agent(app.getHttpServer());

      // simulate login with Pro Connect
      await agent.get("/api/auth/login/pro-connect").query({ redirectTo });
      const loginCallbackResponse = await agent.get("/api/auth/login-callback/pro-connect");

      // Assertions
      // is user redirected to given URL?
      expect(loginCallbackResponse.status).toBe(302);
      expect(loginCallbackResponse.headers.location).toBe(redirectTo);

      // valid access token in response cookie?
      const accessTokenCookie = extractCookieFromResponseHeaders(
        loginCallbackResponse.headers,
        ACCESS_TOKEN_COOKIE_KEY,
      );
      expect(accessTokenCookie).toBeDefined();
      const jwtValue = accessTokenCookie?.access_token ?? "";
      expect(jwtValue).toBeDefined();
      const jwtPayload = app.get(JwtService).verify<AccessTokenPayload>(jwtValue);
      expect(jwtPayload).toBeDefined();
      expect(jwtPayload.sub).toBe(user.id);
      expect(jwtPayload.email).toBe(userEmail);
      expect(jwtPayload.authProvider).toBe("pro-connect");

      // is email set as verified?
      const verifiedEmails = await sqlConnection("verified_emails").select("*");
      expect(verifiedEmails).toEqual([{ email: userEmail, verified_at: expect.any(Date) }]);
    });

    it("redirects to account creation URL with email, first name and last name as hints when Pro Connect authentication is successful but returned email does not match any user", async () => {
      const redirectTo = "http://some-website.fr";
      const userEmail = "jean.doe@example.fr";
      const proConnectClient: FakeProConnectClient = app.get(PRO_CONNECT_CLIENT_INJECTION_TOKEN);
      proConnectClient._setMockUserIdentity({
        email: userEmail,
      });

      // use agent to maintain session and cookies
      const agent = request.agent(app.getHttpServer());

      // simulate login with Pro Connect
      await agent.get("/api/auth/login/pro-connect").query({ redirectTo });
      const loginCallbackResponse = await agent.get("/api/auth/login-callback/pro-connect");

      // Assertions
      // is user redirected to account creation URL?
      expect(loginCallbackResponse.status).toBe(302);
      const redirectedUrl = new URL(loginCallbackResponse.headers.location ?? "");
      expect(redirectedUrl.origin + redirectedUrl.pathname).toBe(
        "http://app.test.benefriches.fr/premiers-pas/identite",
      );
      expect(redirectedUrl.searchParams.get("hintEmail")).toBe(userEmail);
      expect(redirectedUrl.searchParams.get("hintFirstName")).toBe(
        proConnectClient.mockUserIdentity.firstName,
      );
      expect(redirectedUrl.searchParams.get("hintLastName")).toBe(
        proConnectClient.mockUserIdentity.lastName,
      );

      // no access token in response cookie?
      const accessTokenCookie = extractCookieFromResponseHeaders(
        loginCallbackResponse.headers,
        ACCESS_TOKEN_COOKIE_KEY,
      );
      expect(accessTokenCookie).toBeUndefined();
    });
  });
});
