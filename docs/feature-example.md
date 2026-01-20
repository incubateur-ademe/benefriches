# End-to-End Feature Example

> **Purpose**: Complete example of a "Get Site by ID" feature across all layers. Reference this when implementing new features.

---

## 1. Shared Package: DTO

```typescript
// packages/shared/src/api-dtos/sites/getSite.dto.ts
import z from "zod";

export const getSiteResponseDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  nature: z.enum(["FRICHE", "AGRICULTURAL", "NATURAL"]),
  surfaceArea: z.number(),
});

export type GetSiteResponseDto = z.infer<typeof getSiteResponseDtoSchema>;
```

---

## 2. API Core: Gateway Interface

```typescript
// apps/api/src/sites/core/gateways/SitesQuery.ts
import type { GetSiteResponseDto } from "shared";

export interface SitesQuery {
  getById(id: string): Promise<GetSiteResponseDto | undefined>;
}
```

---

## 3. API Core: UseCase

```typescript
// apps/api/src/sites/core/usecases/getSite.usecase.ts
import { fail, success, type TResult } from "@/shared-kernel/result";
import type { UseCase } from "@/shared-kernel/usecase";
import type { GetSiteResponseDto } from "shared";
import type { SitesQuery } from "../gateways/SitesQuery";

type Request = { id: string };
type Response = TResult<GetSiteResponseDto, "SiteNotFound">;

export class GetSiteUseCase implements UseCase<Request, Response> {
  constructor(private readonly sitesQuery: SitesQuery) {}

  async execute({ id }: Request): Promise<Response> {
    const site = await this.sitesQuery.getById(id);
    if (!site) return fail("SiteNotFound");
    return success(site);
  }
}
```

---

## 4. API Core: Unit Test

```typescript
// apps/api/src/sites/core/usecases/getSite.usecase.spec.ts
import { GetSiteUseCase } from "./getSite.usecase";
import { InMemorySitesQuery } from "../../adapters/secondary/sites-query/InMemorySitesQuery";

describe("GetSiteUseCase", () => {
  it("should return site when found", async () => {
    const sitesQuery = new InMemorySitesQuery();
    sitesQuery._setSites([
      { id: "site-1", name: "My Site", nature: "FRICHE", surfaceArea: 1000 },
    ]);

    const useCase = new GetSiteUseCase(sitesQuery);
    const result = await useCase.execute({ id: "site-1" });

    expect(result.isSuccess).toBe(true);
    expect(result.value).toEqual({
      id: "site-1",
      name: "My Site",
      nature: "FRICHE",
      surfaceArea: 1000,
    });
  });

  it("should return SiteNotFound when site does not exist", async () => {
    const sitesQuery = new InMemorySitesQuery();
    const useCase = new GetSiteUseCase(sitesQuery);

    const result = await useCase.execute({ id: "nonexistent" });

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe("SiteNotFound");
  });
});
```

---

## 5. API Adapter: InMemory Implementation

```typescript
// apps/api/src/sites/adapters/secondary/sites-query/InMemorySitesQuery.ts
import type { GetSiteResponseDto } from "shared";
import type { SitesQuery } from "../../../core/gateways/SitesQuery";

export class InMemorySitesQuery implements SitesQuery {
  private sites: GetSiteResponseDto[] = [];

  async getById(id: string): Promise<GetSiteResponseDto | undefined> {
    return this.sites.find((s) => s.id === id);
  }

  // Test helper
  _setSites(sites: GetSiteResponseDto[]): void {
    this.sites = sites;
  }
}
```

---

## 6. API Adapter: SQL Implementation

```typescript
// apps/api/src/sites/adapters/secondary/sites-query/SqlSitesQuery.ts
import type { Knex } from "knex";
import type { GetSiteResponseDto } from "shared";
import type { SitesQuery } from "../../../core/gateways/SitesQuery";

export class SqlSitesQuery implements SitesQuery {
  constructor(private readonly sqlConnection: Knex) {}

  async getById(id: string): Promise<GetSiteResponseDto | undefined> {
    const row = await this.sqlConnection("sites").where({ id }).first();
    if (!row) return undefined;
    return {
      id: row.id,
      name: row.name,
      nature: row.nature,
      surfaceArea: row.surface_area, // snake_case -> camelCase
    };
  }
}
```

---

## 7. API Controller

```typescript
// apps/api/src/sites/adapters/primary/sites.controller.ts
import { Controller, Get, Param, NotFoundException } from "@nestjs/common";
import { GetSiteUseCase } from "../../core/usecases/getSite.usecase";

@Controller("sites")
export class SitesController {
  constructor(private readonly getSiteUseCase: GetSiteUseCase) {}

  @Get(":id")
  async getSite(@Param("id") id: string) {
    const result = await this.getSiteUseCase.execute({ id });
    if (!result.isSuccess) {
      throw new NotFoundException("Site not found");
    }
    return result.value;
  }
}
```

---

# Web App Implementation

---

## 8. Web Gateway Interface

```typescript
// apps/web/src/features/sites/core/sites.gateway.ts
import type { GetSiteResponseDto } from "shared";

export type SitesGateway = {
  getById(id: string): Promise<GetSiteResponseDto>;
};
```

---

## 9. Web HTTP Implementation

```typescript
// apps/web/src/features/sites/infrastructure/sites-service/HttpSitesApi.ts
import type { GetSiteResponseDto } from "shared";
import type { SitesGateway } from "../../core/sites.gateway";

export class HttpSitesApi implements SitesGateway {
  async getById(id: string): Promise<GetSiteResponseDto> {
    const response = await fetch(`/api/sites/${id}`);
    if (!response.ok) throw new Error("Site not found");
    return response.json();
  }
}
```

---

## 10. Web InMemory Implementation (Required for Tests)

```typescript
// apps/web/src/features/sites/infrastructure/sites-service/InMemorySitesService.ts
import type { GetSiteResponseDto } from "shared";
import type { SitesGateway } from "../../core/sites.gateway";

export class InMemorySitesService implements SitesGateway {
  private sites: Map<string, GetSiteResponseDto> = new Map();

  async getById(id: string): Promise<GetSiteResponseDto> {
    const site = this.sites.get(id);
    if (!site) throw new Error("Site not found");
    return site;
  }

  // Test helper
  _setSite(site: GetSiteResponseDto): void {
    this.sites.set(site.id, site);
  }
}
```

---

## 11. Web Redux Action (Async Thunk)

```typescript
// apps/web/src/features/sites/core/actions/fetchSite.action.ts
import type { GetSiteResponseDto } from "shared";
import { createAppAsyncThunk } from "@/shared/core/store-config/store";

// Action named in passive tense (event that happened)
export const siteFetched = createAppAsyncThunk<
  GetSiteResponseDto, // Return type
  { siteId: string }  // Argument type
>("sites/fetched", async ({ siteId }, { extra }) => {
  // Access gateway via extra (dependency injection)
  return await extra.sitesService.getById(siteId);
});
```

---

## 12. Web Reducer (using createReducer)

```typescript
// apps/web/src/features/sites/core/sites.reducer.ts
import { createReducer } from "@reduxjs/toolkit";
import type { GetSiteResponseDto } from "shared";
import { siteFetched } from "./actions/fetchSite.action";

type LoadingState = "idle" | "loading" | "success" | "error";

type State = {
  site: GetSiteResponseDto | undefined;
  loadingState: LoadingState;
  error: string | undefined;
};

const getInitialState = (): State => ({
  site: undefined,
  loadingState: "idle",
  error: undefined,
});

export const sitesReducer = createReducer(getInitialState(), (builder) => {
  builder
    .addCase(siteFetched.pending, (state) => {
      state.loadingState = "loading";
      state.error = undefined;
    })
    .addCase(siteFetched.fulfilled, (state, action) => {
      state.loadingState = "success";
      state.site = action.payload;
    })
    .addCase(siteFetched.rejected, (state, action) => {
      state.loadingState = "error";
      state.error = action.error.message;
    });
});
```

---

## 13. Web Selector (ViewData Pattern)

```typescript
// apps/web/src/features/sites/core/sites.selectors.ts
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/shared/core/store-config/store";

const selectSelf = (state: RootState) => state.sites;

// ViewData selector - single selector per container
export const selectSiteViewData = createSelector(selectSelf, (state) => ({
  site: state.site,
  isLoading: state.loadingState === "loading",
  isError: state.loadingState === "error",
  error: state.error,
}));
```

---

## 14. Web Container Component

```typescript
// apps/web/src/features/sites/views/index.tsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { siteFetched } from "../core/actions/fetchSite.action";
import { selectSiteViewData } from "../core/sites.selectors";
import { SitePage } from "./SitePage";

type Props = {
  siteId: string;
};

export default function SitePageContainer({ siteId }: Props) {
  const dispatch = useAppDispatch();
  // Single ViewData selector
  const viewData = useAppSelector(selectSiteViewData);

  useEffect(() => {
    void dispatch(siteFetched({ siteId }));
  }, [dispatch, siteId]);

  return <SitePage viewData={viewData} />;
}
```

---

## 15. Web Presentational Component

```typescript
// apps/web/src/features/sites/views/SitePage.tsx
import type { GetSiteResponseDto } from "shared";

type ViewData = {
  site: GetSiteResponseDto | undefined;
  isLoading: boolean;
  isError: boolean;
  error: string | undefined;
};

type Props = {
  viewData: ViewData;
};

export function SitePage({ viewData }: Props) {
  const { site, isLoading, isError, error } = viewData;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error}</div>;
  if (!site) return <div>No site found</div>;

  return (
    <div>
      <h1>{site.name}</h1>
      <p>Nature: {site.nature}</p>
      <p>Surface: {site.surfaceArea} m²</p>
    </div>
  );
}
```

---

## 16. Web Unit Test (with Builder Pattern)

```typescript
// apps/web/src/features/sites/core/__tests__/sites.spec.ts
import { siteFetched } from "../actions/fetchSite.action";
import { selectSiteViewData } from "../sites.selectors";
import { StoreBuilder } from "@/test/builders/StoreBuilder";
import { InMemorySitesService } from "../../infrastructure/sites-service/InMemorySitesService";

describe("Sites feature", () => {
  it("should fetch site and update state", async () => {
    const sitesService = new InMemorySitesService();
    sitesService._setSite({
      id: "site-1",
      name: "My Site",
      nature: "FRICHE",
      surfaceArea: 1000,
    });

    const store = new StoreBuilder()
      .withDependencies({ sitesService })
      .build();

    await store.dispatch(siteFetched({ siteId: "site-1" }));

    const viewData = selectSiteViewData(store.getState());
    expect(viewData.site).toEqual({
      id: "site-1",
      name: "My Site",
      nature: "FRICHE",
      surfaceArea: 1000,
    });
    expect(viewData.isLoading).toBe(false);
  });

  it("should handle fetch error", async () => {
    const sitesService = new InMemorySitesService();
    // No site set - will throw

    const store = new StoreBuilder()
      .withDependencies({ sitesService })
      .build();

    await store.dispatch(siteFetched({ siteId: "nonexistent" }));

    const viewData = selectSiteViewData(store.getState());
    expect(viewData.isError).toBe(true);
    expect(viewData.site).toBeUndefined();
  });
});
```

---

## Success Criteria

After implementing a feature like this:

**Shared Package**:
- [ ] `pnpm --filter shared build` - Shared package builds

**API**:
- [ ] `pnpm --filter api typecheck` - No type errors
- [ ] `pnpm --filter api lint` - No lint errors
- [ ] `pnpm --filter api test` - Tests pass

**Web**:
- [ ] `pnpm --filter web typecheck` - No type errors
- [ ] `pnpm --filter web lint` - No lint errors
- [ ] `pnpm --filter web test` - Tests pass
