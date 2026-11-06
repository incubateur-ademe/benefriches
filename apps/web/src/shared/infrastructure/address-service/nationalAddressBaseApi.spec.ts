import { afterEach, describe, expect, it, vi } from "vitest";

import { NationalAddressBaseService } from "./nationalAddressBaseApi";

const stubFetchResponse = (response: Response) => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("NationalAddressBaseService", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("adds the postcode to municipality labels so homonymous towns can be told apart", async () => {
    stubFetchResponse(
      jsonResponse({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [2.361503, 48.937483] },
            properties: {
              label: "Saint-Denis",
              id: "93066",
              name: "Saint-Denis",
              postcode: "93200",
              citycode: "93066",
              city: "Saint-Denis",
              type: "municipality",
              municipality: "Saint-Denis",
              population: 149077,
            },
          },
        ],
      }),
    );

    const result = await new NationalAddressBaseService().search("Saint-Denis", {});

    expect(result).toEqual([
      {
        banId: "93066",
        value: "Saint-Denis (93200)",
        city: "Saint-Denis",
        cityCode: "93066",
        postCode: "93200",
        long: 2.361503,
        lat: 48.937483,
      },
    ]);
  });

  it("keeps the label of a street address, which already holds the postcode", async () => {
    stubFetchResponse(
      jsonResponse({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: [2.33, 48.86] },
            properties: {
              label: "8 Rue de la Paix 75002 Paris",
              id: "75102_6981_00008",
              name: "8 Rue de la Paix",
              postcode: "75002",
              citycode: "75102",
              city: "Paris",
              type: "housenumber",
              street: "Rue de la Paix",
              housenumber: "8",
            },
          },
        ],
      }),
    );

    const result = await new NationalAddressBaseService().search("8 rue de la paix", {});

    expect(result).toEqual([
      {
        banId: "75102_6981_00008",
        value: "8 Rue de la Paix 75002 Paris",
        city: "Paris",
        cityCode: "75102",
        postCode: "75002",
        long: 2.33,
        lat: 48.86,
        streetName: "Rue de la Paix",
        streetNumber: "8",
      },
    ]);
  });

  it("rejects when the API answers with an error body", async () => {
    stubFetchResponse(jsonResponse({ code: 400, message: "Failed parsing query" }, 400));

    await expect(new NationalAddressBaseService().search("rue", {})).rejects.toThrow(
      "Failed parsing query",
    );
  });

  it("rejects when the API answers with a non-JSON error", async () => {
    stubFetchResponse(new Response("", { status: 503 }));

    await expect(new NationalAddressBaseService().search("rue", {})).rejects.toThrow(
      "Address search failed with HTTP status 503",
    );
  });
});
