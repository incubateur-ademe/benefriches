import { describe, it } from "node:test";

import { RuleTester } from "oxlint/plugins-dev";

import plugin from "./api-conventions.mjs";

// RuleTester uses describe/it globals when present; node:test doesn't define them.
RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();
const API_SRC = "/repo/apps/api/src";

ruleTester.run("no-local-dto-schema", plugin.rules["no-local-dto-schema"], {
  valid: [
    {
      name: "controller importing its schema from shared",
      filename: `${API_SRC}/sites/adapters/primary/sites.controller.ts`,
      code: 'import { createSiteDtoSchema } from "shared";\nexport const schema = createSiteDtoSchema;',
    },
    {
      name: "controller with a type-only zod import",
      filename: `${API_SRC}/sites/adapters/primary/sites.controller.ts`,
      code: 'import type { z } from "zod";\nexport type Output<T extends z.ZodType> = z.infer<T>;',
    },
    {
      name: "controller with an inline type-only zod specifier",
      filename: `${API_SRC}/sites/adapters/primary/sites.controller.ts`,
      code: 'import { type z } from "zod";\nexport type Output<T extends z.ZodType> = z.infer<T>;',
    },
    {
      name: "zod schema outside a controller",
      filename: `${API_SRC}/sites/core/usecases/createSite.usecase.ts`,
      code: 'import { z } from "zod";\nexport const schema = z.object({ id: z.string() });',
    },
  ],
  invalid: [
    {
      name: "z.object in a controller",
      filename: `${API_SRC}/sites/adapters/primary/sites.controller.ts`,
      code: 'import { z } from "zod";\nexport const schema = z.object({ id: z.string() });',
      errors: [{ message: /^Controllers must not build Zod schemas\./, line: 1 }],
    },
    {
      name: "namespace import from a zod subpath in a controller",
      filename: `${API_SRC}/sites/adapters/primary/sites.controller.ts`,
      code: 'import * as z from "zod/v4";\nexport const schema = z.object({});',
      errors: 1,
    },
  ],
});

ruleTester.run("file-naming", plugin.rules["file-naming"], {
  valid: [
    {
      name: "use case file",
      filename: `${API_SRC}/sites/core/usecases/createSite.usecase.ts`,
      code: "export class CreateSiteUseCase {}",
    },
    {
      name: "use case unit test",
      filename: `${API_SRC}/sites/core/usecases/createSite.usecase.spec.ts`,
      code: "export {};",
    },
    {
      name: "domain event file",
      filename: `${API_SRC}/sites/core/events/siteCreated.event.ts`,
      code: "export const createSiteCreatedEvent = () => ({});",
    },
    {
      name: "events folder outside core/ is not constrained",
      filename: `${API_SRC}/shared-kernel/adapters/events/publisher/InMemoryEventPublisher.ts`,
      code: "export class InMemoryEventPublisher {}",
    },
    {
      name: "Sql class in a file of the same name",
      filename: `${API_SRC}/sites/adapters/secondary/site-query/SqlSitesQuery.ts`,
      code: "export class SqlSitesQuery {}",
    },
    {
      name: "NestJS module class keeps the <name>.module.ts convention",
      filename: `${API_SRC}/shared-kernel/adapters/sql-knex/sqlConnection.module.ts`,
      code: "export class SqlConnectionModule {}",
    },
  ],
  invalid: [
    {
      name: "use case file without the .usecase.ts suffix",
      filename: `${API_SRC}/sites/core/usecases/getSite.ts`,
      code: "export class GetSiteUseCase {}",
      errors: [{ message: /^"getSite\.ts" is in core\/usecases\/, so it must be named/ }],
    },
    {
      name: "use case test without the .usecase.spec.ts suffix",
      filename: `${API_SRC}/sites/core/usecases/getSite.spec.ts`,
      code: "export {};",
      errors: 1,
    },
    {
      name: "event file without the .event.ts suffix",
      filename: `${API_SRC}/sites/core/events/siteCreated.ts`,
      code: "export const createSiteCreatedEvent = () => ({});",
      errors: [{ message: /^"siteCreated\.ts" is in core\/events\/, so it must be named/ }],
    },
    {
      name: "InMemory class in a differently named file",
      filename: `${API_SRC}/sites/adapters/secondary/site-repository/InMemorySiteRepository.ts`,
      code: "export class InMemorySitesRepository {}",
      errors: [
        {
          message:
            /^Class "InMemorySitesRepository" must live in "InMemorySitesRepository\.ts", not "InMemorySiteRepository\.ts"\./,
        },
      ],
    },
    {
      name: "Sql class next to another class in a differently named file",
      filename: `${API_SRC}/stats/adapters/secondary/SqlStatsQuery.ts`,
      code: "export class InvalidStatsQueryError extends Error {}\nexport class SqlPeriodicityQuery {}",
      errors: 1,
    },
  ],
});
