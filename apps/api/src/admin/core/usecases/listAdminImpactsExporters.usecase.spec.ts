import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ListAdminImpactsExportersResponseDto } from "shared";

import { InMemoryAdminImpactsExportersQuery } from "src/admin/adapters/secondary/InMemoryAdminImpactsExportersQuery";
import type { SuccessResult } from "src/shared-kernel/result";

import { ListAdminImpactsExportersUseCase } from "./listAdminImpactsExporters.usecase";

describe("ListAdminImpactsExporters use case", () => {
  it("returns the first page of impacts exporters with ISO dates and the page size", async () => {
    const query = new InMemoryAdminImpactsExportersQuery();
    query._setExporters([
      {
        id: "user-1",
        email: "jane@collectivite.fr",
        firstName: "Jane",
        lastName: "Doe",
        structureName: "Mairie de Blajan",
        impactsExportsCount: 3,
        exportedProjectsCount: 2,
        lastImpactsExportedAt: new Date("2026-10-01T08:00:00.000Z"),
      },
    ]);

    const result = (await new ListAdminImpactsExportersUseCase(query).execute({
      page: 1,
    })) as SuccessResult<ListAdminImpactsExportersResponseDto>;

    assert.deepStrictEqual(result.getData(), {
      users: [
        {
          id: "user-1",
          email: "jane@collectivite.fr",
          firstName: "Jane",
          lastName: "Doe",
          structureName: "Mairie de Blajan",
          impactsExportsCount: 3,
          exportedProjectsCount: 2,
          lastImpactsExportedAt: "2026-10-01T08:00:00.000Z",
        },
      ],
      total: 1,
      page: 1,
      pageSize: 25,
    } satisfies ListAdminImpactsExportersResponseDto);
  });
});
