# Testing Strategy

> **Purpose**: Comprehensive testing patterns for web app reducers, selectors, and components.

---

## 🧪 Test Organization

```
feature/
├── core/
│   ├── __tests__/                   # Reducer/selector tests
│   │   └── featureName.spec.ts
│   └── featureName.reducer.ts
└── views/
    └── ComponentName.spec.tsx       # Component tests
```

---

## 🛠️ Testing Stack

- **Framework**: Vitest
- **React Testing**: `@testing-library/react` + `@testing-library/jest-dom`
- **Setup**: [test/setupTestEnv.ts](../../src/test/setupTestEnv.ts)

---

## 🏗️ Builder Pattern for Test Data (CRITICAL)

**IMPORTANT**: Use **Builder pattern** for test data - more readable and maintainable.

### Basic Builder

```typescript
// test/builders/StoreBuilder.ts
export class StoreBuilder {
  private stepsHistory: SiteCreationStep[] = ["INTRODUCTION"];
  private siteData: Partial<SiteCreationData> = {};
  private dependencies: AppDependencies = getTestAppDependencies();

  withStepsHistory(steps: SiteCreationStep[]): this {
    this.stepsHistory = steps;
    return this;
  }

  withSiteData(data: Partial<SiteCreationData>): this {
    this.siteData = data;
    return this;
  }

  withDependencies(dependencies: Partial<AppDependencies>): this {
    this.dependencies = { ...this.dependencies, ...dependencies };
    return this;
  }

  build() {
    return createStore(this.dependencies, {
      siteCreation: { stepsHistory: this.stepsHistory, siteData: this.siteData },
    });
  }
}
```

### Usage in Tests

```typescript
// Simple case
const store = new StoreBuilder().build();

// With configuration
const store = new StoreBuilder()
  .withStepsHistory(["INTRODUCTION", "IS_FRICHE"])
  .withSiteData({ isFriche: true })
  .build();

// With custom dependencies
const mockSitesService = new InMemorySitesService();
const store = new StoreBuilder()
  .withDependencies({ sitesService: mockSitesService })
  .build();
```

### Builder Benefits

- **Readable**: Clearly shows what state is being set up
- **Maintainable**: Adding new state properties only requires adding builder method
- **Flexible**: Can combine multiple configurations
- **Type-safe**: Builder methods return `this` for chaining

---

## 🧪 Test Utilities & Dependencies

### Test Dependencies

```typescript
// test/builders/testAppDependencies.ts
export const getTestAppDependencies = (overrides = {}) => ({
  sitesService: new InMemorySitesService(),
  projectsService: new InMemoryProjectsService(),
  analyticsService: new InMemoryAnalyticsService(),
  navigationService: new InMemoryNavigationService(),
  ...overrides, // ✅ Override specific services
});
```

### Using Partial Overrides

```typescript
it("should handle API errors", () => {
  const mockSitesService = new InMemorySitesService();
  mockSitesService.throwError = new Error("Network error");

  const store = new StoreBuilder()
    .withDependencies({ sitesService: mockSitesService })
    .build();

  // ... test error handling
});
```

---

## 📝 Reducer Tests

```typescript
describe("Site creation reducer", () => {
  it("should handle introductionStepCompleted", () => {
    const store = new StoreBuilder()
      .withStepsHistory(["INTRODUCTION"])
      .build();

    store.dispatch(introductionStepCompleted());

    expect(store.getState().siteCreation.stepsHistory).toEqual([
      "INTRODUCTION",
      "IS_FRICHE",
    ]);
  });

  it("should update site data when isFricheCompleted", () => {
    const store = new StoreBuilder()
      .withStepsHistory(["INTRODUCTION"])
      .build();

    store.dispatch(isFricheCompleted({ isFriche: true }));

    expect(store.getState().siteCreation.siteData.isFriche).toBe(true);
    expect(store.getState().siteCreation.stepsHistory).toContain(
      "CREATE_MODE_SELECTION",
    );
  });

  it("should handle loading states for async actions", async () => {
    const store = new StoreBuilder().build();

    // Pending state
    store.dispatch(fetchSiteData.pending());
    expect(store.getState().siteCreation.saveLoadingState).toBe("loading");

    // Fulfilled state
    store.dispatch(
      fetchSiteData.fulfilled({ id: "123", name: "Test Site" }, ""),
    );
    expect(store.getState().siteCreation.saveLoadingState).toBe("success");
    expect(store.getState().siteCreation.siteData.id).toBe("123");
  });
});
```

---

## 🔍 Selector Tests

```typescript
describe("Site creation selectors", () => {
  it("should select site address from state", () => {
    const store = new StoreBuilder()
      .withSiteData({ address: { street: "123 Main St", city: "Paris" } })
      .build();

    const address = selectSiteAddress(store.getState());

    expect(address).toEqual({ street: "123 Main St", city: "Paris" });
  });

  it("should select project by ID", () => {
    const projectId = "project-1";
    const project = { id: projectId, name: "Test Project" };

    const store = new StoreBuilder()
      .withSiteData({
        reconversionProjects: [{ siteId: "site-1", projects: [project] }],
      })
      .build();

    const selected = selectReconversionProjectById(
      store.getState(),
      projectId,
    );

    expect(selected).toEqual(project);
  });

  it("should return undefined for non-existent project", () => {
    const store = new StoreBuilder()
      .withSiteData({ reconversionProjects: [] })
      .build();

    const selected = selectReconversionProjectById(
      store.getState(),
      "non-existent",
    );

    expect(selected).toBeUndefined();
  });

  it("should compose ViewData correctly", () => {
    const store = new StoreBuilder()
      .withSiteData({
        nature: "FRICHE",
        tenant: { id: "tenant-1", name: "Tenant" },
      })
      .build();

    const viewData = selectSiteYearlyExpensesViewData(store.getState());

    expect(viewData).toEqual({
      siteNature: "FRICHE",
      hasTenant: true,
      // ... other properties
    });
  });
});
```

---

## 🎨 Component Tests

### Testing Presentational Components

```typescript
describe("MyForm", () => {
  it("should render form with initial values", () => {
    render(
      <MyForm
        initialValues={{ name: "Test" }}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByDisplayValue("Test")).toBeInTheDocument();
  });

  it("should call onSubmit with form data", async () => {
    const onSubmit = vi.fn();
    render(
      <MyForm
        initialValues={{ name: "" }}
        onSubmit={onSubmit}
      />,
    );

    const input = screen.getByLabelText(/nom/i);
    fireEvent.change(input, { target: { value: "Test Value" } });
    fireEvent.click(screen.getByRole("button", { name: /valider/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ name: "Test Value" });
    });
  });

  it("should display validation errors", () => {
    const onSubmit = vi.fn();
    render(
      <MyForm
        initialValues={{ name: "" }}
        onSubmit={onSubmit}
      />,
    );

    // Trigger validation (e.g., blur on required field)
    const input = screen.getByLabelText(/nom/i);
    fireEvent.blur(input);

    expect(screen.getByText(/ce champ est requis/i)).toBeInTheDocument();
  });
});
```

### Testing Container Components

```typescript
describe("FormContainer", () => {
  it("should connect to Redux and dispatch action on submit", async () => {
    const store = new StoreBuilder().build();

    render(
      <Provider store={store}>
        <FormContainer />
      </Provider>,
    );

    const input = screen.getByLabelText(/nom/i);
    fireEvent.change(input, { target: { value: "Test" } });
    fireEvent.click(screen.getByRole("button", { name: /valider/i }));

    await waitFor(() => {
      expect(store.getState().siteCreation.siteData.name).toBe("Test");
    });
  });

  it("should display loading state during submission", async () => {
    const store = new StoreBuilder().build();

    render(
      <Provider store={store}>
        <FormContainer />
      </Provider>,
    );

    // Dispatch loading action
    store.dispatch(saveSite.pending());

    expect(screen.getByText(/enregistrement.../i)).toBeInTheDocument();
  });
});
```

---

## 🔌 Testing with InMemory Services

```typescript
describe("Site creation with API", () => {
  it("should create site and update state", async () => {
    const mockSitesService = new InMemorySitesService();
    const store = new StoreBuilder()
      .withDependencies({ sitesService: mockSitesService })
      .build();

    // Dispatch async action
    const resultAction = await store.dispatch(
      createSite({ name: "Test Site" }),
    );

    expect(resultAction.payload).toHaveProperty("siteId");
    expect(store.getState().siteCreation.saveLoadingState).toBe("success");
  });

  it("should handle API errors gracefully", async () => {
    const mockSitesService = new InMemorySitesService();
    mockSitesService.throwOnCreate = true; // Simulate error

    const store = new StoreBuilder()
      .withDependencies({ sitesService: mockSitesService })
      .build();

    await store.dispatch(createSite({ name: "Test" }));

    expect(store.getState().siteCreation.saveLoadingState).toBe("error");
  });
});
```

---

## 📊 Test Organization Tips

### Organize by Feature

```
src/features/create-site/
├── core/
│   ├── __tests__/
│   │   ├── createSite.reducer.spec.ts
│   │   ├── createSite.selectors.spec.ts
│   │   └── createSite.listener.spec.ts
│   └── ...
└── views/
    └── __tests__/
        ├── SiteCreation.spec.tsx
        └── components/
            └── StepForm.spec.tsx
```

### Test File Naming

- Reducer tests: `featureName.reducer.spec.ts` or `__tests__/featureName.spec.ts`
- Selector tests: `featureName.selectors.spec.ts` or within reducer test file
- Component tests: `ComponentName.spec.tsx`

### Test Isolation

```typescript
describe("Feature", () => {
  let store: ReturnType<typeof StoreBuilder["prototype"]["build"]>;

  beforeEach(() => {
    store = new StoreBuilder().build();
  });

  // Each test gets fresh store
  it("test 1", () => {
    // Use store
  });

  it("test 2", () => {
    // Use fresh store (not affected by test 1)
  });
});
```

---

## 🚀 Running Tests

```bash
# Test all
pnpm --filter web test

# Test specific file
pnpm --filter web test path/to/file.spec.ts

# Watch mode
pnpm --filter web test -- --watch

# Coverage
pnpm --filter web test -- --coverage
```

---

## ✅ Testing Best Practices

1. **Use Builder Pattern**: Makes test setup clear and maintainable
2. **Test behavior, not implementation**: Focus on what the reducer/component does
3. **Test with InMemory services**: Avoid HTTP calls in unit tests
4. **Isolate tests**: Each test should be independent
5. **Use meaningful test names**: Describe what behavior is being tested
6. **Test edge cases**: Error states, empty data, etc.
7. **Keep tests focused**: One behavior per test (or closely related scenarios)

---

## 🔗 Related Patterns

- **Redux Architecture** → [01-redux-architecture.md](./01-redux-architecture.md)
- **Component Patterns** → [02-component-patterns.md](./02-component-patterns.md)
- **API Integration** → [03-api-integration.md](./03-api-integration.md)

---

**Next**: See [05-routing-styling.md](./05-routing-styling.md) for routing and styling patterns.
