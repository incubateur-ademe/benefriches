# API Integration (Gateway Pattern)

> **Purpose**: Detailed patterns for integrating with external APIs using the Gateway (Ports & Adapters) pattern.

---

## 🌐 Gateway Pattern Overview

**Follow Ports & Adapters**: Define interface in core, implement HTTP + InMemory in infrastructure, inject via store.

This pattern ensures:
- **Testability**: InMemory implementations for unit tests
- **Flexibility**: Easy to swap implementations (HTTP → Mock)
- **Clean Architecture**: Core has no dependency on HTTP details

---

## 📐 Three-Step Pattern

### Step 1: Define Gateway Interface in Core

**File**: `core/gateways/FeatureGateway.ts`

```typescript
// Define what operations are needed
export interface FeatureGateway {
  save(data: Payload): Promise<void>;
  fetch(id: string): Promise<FeatureData>;
}
```

**Key principle**: Interface defines what the domain needs, not how to implement it.

### Step 2: Implement in Infrastructure

**HTTP Implementation**: `feature/infrastructure/feature-service/HttpFeatureApi.ts`

```typescript
export class HttpFeatureApi implements FeatureGateway {
  async save(data: Payload): Promise<void> {
    const response = await fetch(`/api${API_ROUTES.path}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Save failed");
  }

  async fetch(id: string): Promise<FeatureData> {
    const response = await fetch(`/api${API_ROUTES.path}/${id}`);
    if (!response.ok) throw new Error("Fetch failed");
    return response.json();
  }
}
```

**InMemory Implementation**: `feature/infrastructure/feature-service/InMemoryFeatureService.ts`

```typescript
export class InMemoryFeatureService implements FeatureGateway {
  private items: Map<string, FeatureData> = new Map();

  async save(data: Payload): Promise<void> {
    const id = generateId();
    this.items.set(id, { ...data, id });
  }

  async fetch(id: string): Promise<FeatureData> {
    const item = this.items.get(id);
    if (!item) throw new Error("Not found");
    return item;
  }
}
```

**Benefits of InMemory**:
- No network calls in unit tests
- Predictable, controlled behavior
- Fast test execution
- Easy to set up test data

### Step 3: Inject & Use in Redux

**Wire in store dependencies**:

```typescript
// src/shared/core/store-config/store.ts
export interface AppDependencies {
  featureService: FeatureGateway;
  // ... other services
}

export const createStore = (
  appDependencies: AppDependencies,
  preloadedState?: PreloadedStateFromReducer<typeof rootReducer>,
) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: appDependencies, // ✅ Inject dependencies
        },
      }).prepend(listener.middleware);
    },
    preloadedState,
  });
  return store;
};
```

**Use in async thunk**:

```typescript
export const dataSaved = createAppAsyncThunk(
  "feature/saved",
  async (payload: Payload, { extra }) => {
    // ✅ Access injected service
    await extra.featureService.save(payload);
    return { success: true };
  },
);
```

---

## 🏗️ Feature-Specific Service Structure

**Directory structure** for a feature's infrastructure:

```
feature/infrastructure/
└── feature-service/
    ├── HttpFeatureApi.ts              # HTTP implementation
    └── InMemoryFeatureService.ts      # Test mock

feature/core/
└── feature.gateway.ts                 # Gateway interface (NOT in infrastructure)
```

All gateways must have both HTTP and InMemory implementations.

---

## 🔗 Complete Example

### 1. Gateway Interface

```typescript
// core/gateways/SitesGateway.ts
export interface SitesGateway {
  createSite(data: CreateSitePayload): Promise<{ siteId: string }>;
  getSite(siteId: string): Promise<SiteData>;
  updateSite(siteId: string, data: Partial<SiteData>): Promise<void>;
}
```

### 2. HTTP Implementation

```typescript
// sites/infrastructure/sites-service/HttpSitesApi.ts
export class HttpSitesApi implements SitesGateway {
  async createSite(data: CreateSitePayload): Promise<{ siteId: string }> {
    const response = await fetch("/api/sites", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to create site");
    return response.json();
  }

  async getSite(siteId: string): Promise<SiteData> {
    const response = await fetch(`/api/sites/${siteId}`);
    if (!response.ok) throw new Error("Failed to fetch site");
    return response.json();
  }

  async updateSite(siteId: string, data: Partial<SiteData>): Promise<void> {
    const response = await fetch(`/api/sites/${siteId}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to update site");
  }
}
```

### 3. InMemory Mock

```typescript
// sites/infrastructure/sites-service/InMemorySitesService.ts
export class InMemorySitesService implements SitesGateway {
  private sites: Map<string, SiteData> = new Map();

  async createSite(data: CreateSitePayload): Promise<{ siteId: string }> {
    const siteId = generateUUID();
    this.sites.set(siteId, {
      ...data,
      siteId,
      createdAt: new Date(),
    });
    return { siteId };
  }

  async getSite(siteId: string): Promise<SiteData> {
    const site = this.sites.get(siteId);
    if (!site) throw new Error("Site not found");
    return site;
  }

  async updateSite(siteId: string, data: Partial<SiteData>): Promise<void> {
    const site = this.sites.get(siteId);
    if (!site) throw new Error("Site not found");
    Object.assign(site, data);
  }
}
```

### 4. Wire in Store

```typescript
// src/shared/core/store-config/appDependencies.ts
export const getAppDependencies = (): AppDependencies => ({
  sitesService: new HttpSitesApi(),
  // ... other services
});

// src/main.tsx
const store = createStore(getAppDependencies());
```

### 5. Use in Redux

```typescript
// feature/core/actions/sites.actions.ts
export const createSite = createAppAsyncThunk<
  { siteId: string },
  CreateSitePayload
>("sites/create", async (payload, { extra }) => {
  return await extra.sitesService.createSite(payload);
});

// In reducer
.addCase(createSite.fulfilled, (state, action) => {
  state.createdSiteId = action.payload.siteId;
  state.saveLoadingState = "success";
})
```

---

## 🧪 Testing with InMemory Services

**In tests, provide InMemory implementations**:

```typescript
// test/builders/StoreBuilder.ts
export class StoreBuilder {
  private dependencies: AppDependencies = {
    sitesService: new InMemorySitesService(),
    // ... other services
  };

  build() {
    return createStore(this.dependencies);
  }
}

// Usage in test
const store = new StoreBuilder().build();
store.dispatch(createSite({ name: "Test Site" }));
expect(store.getState().sites.createdSiteId).toBeDefined();
```

---

## 📝 API Routes Structure

**Centralize all API endpoints** in a shared location:

```typescript
// packages/shared/src/api-routes.ts
export const API_ROUTES = {
  SITES: "/api/v1/sites",
  PROJECTS: "/api/v1/projects",
  USERS: "/api/v1/users",
} as const;

// Usage in HttpApi
export class HttpSitesApi implements SitesGateway {
  async createSite(data: CreateSitePayload): Promise<{ siteId: string }> {
    const response = await fetch(API_ROUTES.SITES, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    // ...
  }
}
```

---

## ✅ Critical Rules

- ✅ Define gateway **interfaces** in `core/`, not classes
- ✅ Implement HTTP in `infrastructure/*/HttpXxxApi.ts`
- ✅ Implement InMemory in `infrastructure/*/InMemoryXxxService.ts`
- ✅ Inject via `AppDependencies` in store config
- ✅ Access injected services via `extra` in async thunks
- ✅ Use InMemory implementations in unit tests

**Example**: [create-site/infrastructure/create-site-service](../../src/features/create-site/infrastructure/create-site-service/)

---

## 🔗 Related Patterns

- **Redux Architecture** → [01-redux-architecture.md](./01-redux-architecture.md)
- **Component Patterns** → [02-component-patterns.md](./02-component-patterns.md)
- **Testing Strategy** → [04-testing-strategy.md](./04-testing-strategy.md)

---

**Next**: See [04-testing-strategy.md](./04-testing-strategy.md) for comprehensive testing patterns.
