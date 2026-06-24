import type { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { AxiosError, AxiosHeaders } from "axios";
import assert from "node:assert/strict";
import { describe, it, beforeEach, mock } from "node:test";
import { of, throwError } from "rxjs";

import { ConnectCrm } from "./ConnectCrm";

const buildAxiosResponse = <T>(data: T, status = 200): AxiosResponse<T> => {
  const headers = new AxiosHeaders();
  return {
    data,
    status,
    statusText: "OK",
    headers,
    config: { headers } as InternalAxiosRequestConfig,
  };
};

const buildAxiosError = (status: number): AxiosError => {
  const headers = new AxiosHeaders();
  const error = new AxiosError(`Request failed with status code ${status}`, String(status), {
    headers,
  } as InternalAxiosRequestConfig);
  error.response = {
    data: undefined,
    status,
    statusText: "",
    headers,
    config: { headers } as InternalAxiosRequestConfig,
  };
  return error;
};

const expectedAuthHeaders = {
  client_id: "client-id",
  client_secret: "client-secret",
};

describe("ConnectCrm", () => {
  let httpService: {
    get: ReturnType<typeof mock.fn>;
    post: ReturnType<typeof mock.fn>;
    put: ReturnType<typeof mock.fn>;
  };
  let crm: ConnectCrm;

  beforeEach(() => {
    httpService = { get: mock.fn(), post: mock.fn(), put: mock.fn() };
    const configService = new ConfigService({
      CONNECT_CRM_HOST: "https://crm.example.com",
      CONNECT_CRM_CLIENT_ID: "client-id",
      CONNECT_CRM_CLIENT_SECRET: "client-secret",
    });
    crm = new ConnectCrm(httpService as unknown as HttpService, configService);
  });

  describe("findContactByEmail", () => {
    it("returns subscribedToNewsletter=true when listeAbonnementNewsletter contains 'Bénéfriches'", async () => {
      httpService.get.mock.mockImplementation(() =>
        of(
          buildAxiosResponse({
            success: true,
            contact: { listeAbonnementNewsletter: ["Bénéfriches"] },
          }),
        ),
      );

      const result = await crm.findContactByEmail("user@example.com");

      assert.deepStrictEqual(result, { subscribedToNewsletter: true });
    });

    it("returns subscribedToNewsletter=false when listeAbonnementNewsletter is empty", async () => {
      httpService.get.mock.mockImplementation(() =>
        of(
          buildAxiosResponse({
            success: true,
            contact: { listeAbonnementNewsletter: [] },
          }),
        ),
      );

      const result = await crm.findContactByEmail("user@example.com");

      assert.deepStrictEqual(result, { subscribedToNewsletter: false });
    });

    it("returns subscribedToNewsletter=false when subscribed to other newsletters but not Bénéfriches", async () => {
      httpService.get.mock.mockImplementation(() =>
        of(
          buildAxiosResponse({
            success: true,
            contact: { listeAbonnementNewsletter: ["AutreNewsletter"] },
          }),
        ),
      );

      const result = await crm.findContactByEmail("user@example.com");

      assert.deepStrictEqual(result, { subscribedToNewsletter: false });
    });

    it("returns subscribedToNewsletter=false when listeAbonnementNewsletter is null/missing", async () => {
      httpService.get.mock.mockImplementation(() =>
        of(
          buildAxiosResponse({
            success: true,
            contact: {},
          }),
        ),
      );

      const result = await crm.findContactByEmail("user@example.com");

      assert.deepStrictEqual(result, { subscribedToNewsletter: false });
    });

    it("returns null when envelope success is false", async () => {
      httpService.get.mock.mockImplementation(() =>
        of(
          buildAxiosResponse({
            success: false,
          }),
        ),
      );

      const result = await crm.findContactByEmail("user@example.com");

      assert.strictEqual(result, null);
    });

    it("returns null on 404 not-found", async () => {
      httpService.get.mock.mockImplementation(() => throwError(() => buildAxiosError(404)));

      const result = await crm.findContactByEmail("user@example.com");

      assert.strictEqual(result, null);
    });

    it("throws on 500 server error", async () => {
      httpService.get.mock.mockImplementation(() => throwError(() => buildAxiosError(500)));

      await assert.rejects(() => crm.findContactByEmail("user@example.com"));
    });

    it("URL-encodes the email so addresses with '+' or '@' are not misinterpreted", async () => {
      httpService.get.mock.mockImplementation(() =>
        of(buildAxiosResponse({ success: true, contact: { listeAbonnementNewsletter: [] } })),
      );

      await crm.findContactByEmail("foo+bar@example.com");

      assert.deepStrictEqual(httpService.get.mock.calls[0]?.arguments, [
        "https://crm.example.com/api/v1/personnes/mail/foo%2Bbar%40example.com",
        { headers: expectedAuthHeaders },
      ]);
    });
  });

  describe("createContact", () => {
    beforeEach(() => {
      httpService.post.mock.mockImplementation(() => of(buildAxiosResponse({ success: true })));
    });

    it("POSTs the contact without newsletter fields when subscribedToNewsletter is false", async () => {
      await crm.createContact({
        email: "user@example.com",
        firstName: "Jane",
        lastName: "Doe",
        subscribedToNewsletter: false,
      });

      assert.deepStrictEqual(httpService.post.mock.calls[0]?.arguments, [
        "https://crm.example.com/api/v1/personnes",
        {
          email: "user@example.com",
          prenom: "Jane",
          nom: "Doe",
          source: "Bénéfriches",
          acceptationRGPD: true,
        },
        { headers: expectedAuthHeaders },
      ]);
    });

    it("POSTs with abonnementNewsletter=true and today's dateNewsletter when subscribedToNewsletter is true", async () => {
      mock.timers.enable({ apis: ["Date"], now: new Date("2026-05-04T10:30:00Z") });

      try {
        await crm.createContact({
          email: "user@example.com",
          firstName: "Jane",
          lastName: "Doe",
          subscribedToNewsletter: true,
        });

        assert.deepStrictEqual(httpService.post.mock.calls[0]?.arguments, [
          "https://crm.example.com/api/v1/personnes",
          {
            email: "user@example.com",
            prenom: "Jane",
            nom: "Doe",
            source: "Bénéfriches",
            acceptationRGPD: true,
            abonnementNewsletter: true,
            dateNewsletter: "2026-05-04",
          },
          { headers: expectedAuthHeaders },
        ]);
      } finally {
        mock.timers.reset();
      }
    });
  });

  describe("updateContactLastLoginDate", () => {
    beforeEach(() => {
      httpService.put.mock.mockImplementation(() => of(buildAxiosResponse({ success: true })));
    });

    it("PUTs the login date formatted as yyyy-MM-dd'T'HH:mm:ss with source and email", async () => {
      await crm.updateContactLastLoginDate(
        "user@example.com",
        new Date("2026-05-04T14:23:45.000Z"),
      );

      const args = httpService.put.mock.calls[0]?.arguments;
      assert.ok(args !== undefined);
      assert.strictEqual(args[0], "https://crm.example.com/api/v1/personnes/mail/user@example.com");
      const body = args[1] as { dateConnexion: string; source: string; email: string };
      // Test the regex-matched field separately
      assert.ok(/^2026-05-04T\d{2}:23:45$/.test(body.dateConnexion));
      // Then assert the rest without the dynamic field
      const { dateConnexion: _dateConnexion, ...rest } = body;
      assert.deepStrictEqual(rest, {
        source: "Bénéfriches",
        email: "user@example.com",
      });
      assert.deepStrictEqual(args[2], { headers: expectedAuthHeaders });
    });
  });
});
