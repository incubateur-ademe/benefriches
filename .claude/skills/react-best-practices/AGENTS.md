# React Best Practices - Detailed Guide

> **Complete reference for React and Redux performance optimization in Benefriches**
>
> **Architecture**: React 19+ SPA with Vite + Redux + Clean Architecture
>
> **Source**: Adapted from [Vercel React Best Practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)

---

## Table of Contents

1. [Critical: Bundle Size Optimization](#1-critical-bundle-size-optimization)
2. [High: Async/Waterfall Optimization](#2-high-asyncwaterfall-optimization)
3. [Medium-High: Array/Data Optimization](#3-medium-high-arraydata-optimization)
4. [Medium: Re-render Optimization](#4-medium-re-render-optimization)
5. [Medium: Bundle Optimization (Continued)](#5-medium-bundle-optimization-continued)
6. [Medium: Client Data Patterns](#6-medium-client-data-patterns)
7. [Low-Medium: Rendering Performance](#7-low-medium-rendering-performance)
8. [Low-Medium: JavaScript Performance](#8-low-medium-javascript-performance)
9. [Low: Advanced Patterns](#9-low-advanced-patterns)
10. [Excluded Practices](#10-excluded-practices)

---

## 1. Critical: Bundle Size Optimization

### 1.1 Avoid Barrel File Imports

**Impact**: 200-800ms import cost reduction, 15-70% faster dev boot

**Problem**: Importing from barrel files loads entire modules even if you only need one export.

**Current relevance**: Check if we're importing from barrel files across the codebase.

**Example**:

```typescript
// ❌ BAD - Loads entire features barrel (hundreds of exports)
import { createSite } from "@/features";

// ✅ GOOD - Direct import (only loads what's needed)
import { createSite } from "@/features/create-site/core/createSite.reducer";
```

**Action items**:

1. Audit imports for barrel file usage (e.g., `from '@/features'`, `from '@/shared'`)
2. Replace with direct imports using `@/` path alias
3. Consider removing barrel files entirely or making them explicit re-exports

**Detection pattern**:

```bash
# Find potential barrel imports
pnpm --filter web grep -r "from '@/features'" src/
pnpm --filter web grep -r "from '@/shared'" src/
```

---

### 1.2 Dynamic Imports for Heavy Components

**Impact**: Reduce initial bundle size for rarely-used features

**Current relevance**: Large features like project creation forms, map components, chart libraries

**Pattern**:

```typescript
// ✅ Lazy load heavy map component
import React, { Suspense } from 'react';

const MapViewer = React.lazy(() => import('@/features/map/MapViewer'));

function ProjectPage() {
  return (
    <Suspense fallback={<div>Loading map...</div>}>
      <MapViewer />
    </Suspense>
  );
}
```

**Benefriches-specific candidates**:

- Map components (Leaflet, heavy GeoJSON rendering)
- Project creation forms (multi-step wizards)
- Chart/visualization libraries
- PDF generation modules
- Advanced calculators

**Best practices**:

- Always wrap with `<Suspense>` for loading states
- Use descriptive fallback UI (not just spinners)
- Consider preloading on route navigation or user intent

---

### 1.3 Promise.all() for Independent Operations

**Impact**: 2-10× improvement by parallelizing async operations

**Current relevance**: Redux thunks fetching multiple independent resources

**Pattern**:

```typescript
// ❌ BAD - Sequential awaits (400ms total: 200ms + 200ms)
const sites = await extra.siteService.getSites();
const projects = await extra.projectService.getProjects();
const users = await extra.userService.getUsers();

// ✅ GOOD - Parallel fetches (200ms total: max of all requests)
const [sites, projects, users] = await Promise.all([
  extra.siteService.getSites(),
  extra.projectService.getProjects(),
  extra.userService.getUsers(),
]);
```

**Real-world example from Benefriches**:

```typescript
// src/features/dashboard/core/fetchDashboardData.action.ts
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData",
  async (_, { extra }) => {
    // ✅ Fetch all independent data in parallel
    const [sites, projects, stats] = await Promise.all([
      extra.siteService.getUserSites(),
      extra.projectService.getUserProjects(),
      extra.statsService.getProjectStats(),
    ]);

    return { sites, projects, stats };
  },
);
```

**When NOT to use**:

```typescript
// ❌ DON'T parallelize when second depends on first
const user = await extra.userService.getCurrentUser();
const permissions = await extra.permissionService.getPermissions(user.id);
```

---

### 1.4 Dependency-Based Parallelization

**Impact**: Start async operations at earliest possible moment

**Current relevance**: Complex Redux thunks with multiple data dependencies

**Pattern**:

```typescript
// ❌ BAD - Sequential execution even though siteData fetch doesn't need user
const user = await extra.userService.getCurrentUser();
const siteData = await extra.siteService.getSite(siteId);
const permissions = await extra.permissionService.getPermissions(user.id);

// ✅ GOOD - Start independent operations immediately
const userPromise = extra.userService.getCurrentUser();
const siteDataPromise = extra.siteService.getSite(siteId);

const [user, siteData] = await Promise.all([userPromise, siteDataPromise]);

// Now wait for dependent operation
const permissions = await extra.permissionService.getPermissions(user.id);
```

**Advanced pattern with better-all library**:

```typescript
import { all } from "better-all";

// Automatically parallelizes independent operations
const result = await all({
  user: async () => extra.userService.getCurrentUser(),
  site: async () => extra.siteService.getSite(siteId),
  permissions: async ({ user }) =>
    extra.permissionService.getPermissions(user.id),
});

// `permissions` waits for `user`, but `site` fetches in parallel
```

**Action items**:

1. Review complex async thunks for sequential awaits
2. Identify independent operations that can start immediately
3. Consider `better-all` for complex dependency graphs

---

## 2. High: Async/Waterfall Optimization

### 2.1 Defer Await Until Needed

**Impact**: Avoid blocking code paths that don't need the result

**Current relevance**: Redux thunks with conditional logic

**Pattern**:

```typescript
// ❌ BAD - Fetches data even if user doesn't have permission
export const loadProjectDetails = createAsyncThunk(
  "project/loadDetails",
  async ({ projectId, user }, { extra }) => {
    const projectData = await extra.projectService.getProject(projectId);

    if (!user.canViewProjects) {
      throw new Error("Unauthorized");
    }

    return projectData;
  },
);

// ✅ GOOD - Check permission first
export const loadProjectDetails = createAsyncThunk(
  "project/loadDetails",
  async ({ projectId, user }, { extra }) => {
    if (!user.canViewProjects) {
      throw new Error("Unauthorized");
    }

    const projectData = await extra.projectService.getProject(projectId);
    return projectData;
  },
);
```

**Real-world example**:

```typescript
// ❌ BAD - Validates after expensive API call
const data = await extra.siteService.getSiteFullData(siteId);

if (!validateSiteData(data)) {
  throw new Error("Invalid data");
}

// ✅ GOOD - Validate before expensive call
if (!isSiteIdValid(siteId)) {
  throw new Error("Invalid site ID");
}

const data = await extra.siteService.getSiteFullData(siteId);
```

---

### 2.2 Strategic Suspense Boundaries

**Impact**: Show wrapper UI immediately while data loads

**Current relevance**: Feature pages with async data requirements

**Pattern**:

```typescript
// ✅ GOOD - Suspense boundary around data-dependent section
import { Suspense } from 'react';

function ProjectPage() {
  return (
    <div>
      <PageHeader /> {/* Shows immediately */}
      <Suspense fallback={<DataLoadingSpinner />}>
        <ProjectDataTable /> {/* Suspended until data loads */}
      </Suspense>
      <PageFooter /> {/* Shows immediately */}
    </div>
  );
}
```

**Multiple boundaries for progressive loading**:

```typescript
function DashboardPage() {
  return (
    <div>
      <Suspense fallback={<Skeleton />}>
        <QuickStats /> {/* Fast query */}
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <ProjectsTable /> {/* Slow query */}
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <AnalyticsChart /> {/* Heavy computation */}
      </Suspense>
    </div>
  );
}
```

**Best practices**:

- Use specific skeleton/loading UI (not generic spinners)
- Match fallback size to actual content (avoid layout shift)
- Don't wrap entire page in one Suspense (granular is better)

---

### 2.3 Conditional Module Loading

**Impact**: Load large libraries only when feature is activated

**Current relevance**: Chart libraries, PDF generation, advanced map features

**Pattern**:

```typescript
// ✅ Load chart library only when user opens analytics
function AnalyticsPanel({ data, isVisible }: Props) {
  const [ChartComponent, setChartComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (isVisible && !ChartComponent) {
      import('chart.js').then(({ Chart }) => {
        setChartComponent(() => Chart);
      });
    }
  }, [isVisible, ChartComponent]);

  if (!ChartComponent) return <Skeleton />;

  return <ChartComponent data={data} />;
}
```

**Benefriches-specific candidates**:

```typescript
// PDF generation - load only when user clicks "Export"
const handleExportPDF = async () => {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF();
  // ... generate PDF
};

// Advanced map features - load only when user enables layer
const handleEnableHeatmap = async () => {
  const { HeatmapLayer } = await import("leaflet.heat");
  map.addLayer(new HeatmapLayer(data));
};

// Complex calculations - load only when needed
const handleCalculateComplexMetrics = async () => {
  const { calculateProjectROI } =
    await import("@/features/calculations/advanced");
  const roi = calculateProjectROI(projectData);
  dispatch(roiCalculated(roi));
};
```

---

### 2.4 CSS content-visibility for Long Lists

**Impact**: ~10× faster initial render for long lists

**Current relevance**: Site lists, project lists, soil type tables

**Pattern**:

```css
/* Add to list item containers */
.site-list-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 200px; /* estimated height - adjust to actual */
}
```

**React component example**:

```typescript
// src/features/sites/views/SiteList.tsx
function SiteListItem({ site }: Props) {
  return (
    <div
      className="site-list-item"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '0 200px',
      }}
    >
      <h3>{site.name}</h3>
      <p>{site.description}</p>
      {/* ... rest of content */}
    </div>
  );
}
```

**When to use**:

- Lists with 50+ items
- Items with complex rendering (images, charts, nested data)
- Scrollable containers with offscreen content

**Browser support**: Modern browsers (Chrome 85+, Safari 16+, Firefox not yet)

---

## 3. Medium-High: Array/Data Optimization

### 3.1 Early Length Check for Array Comparisons

**Impact**: Fast-fail for expensive operations

**Current relevance**: Redux selectors comparing arrays, form validation

**Pattern**:

```typescript
// ✅ Check length first before deep comparison
function areProjectsEqual(arr1: Project[], arr2: Project[]): boolean {
  if (arr1.length !== arr2.length) return false;

  return arr1.every((item, i) => item.id === arr2[i].id);
}
```

**Redux selector example**:

```typescript
// src/features/sites/core/sites.selectors.ts
export const selectFilteredSites = createSelector(
  [selectAllSites, selectActiveFilters],
  (sites, filters) => {
    // ✅ Early return if no filters
    if (filters.length === 0) return sites;

    return sites.filter((site) => matchesFilters(site, filters));
  },
);
```

---

### 3.2 Use toSorted() Instead of sort()

**Impact**: Immutability for React rendering (CRITICAL for Redux!)

**Current relevance**: ALL sorting in Redux reducers or selectors

**Pattern**:

```typescript
// ❌ BAD - Mutates original array (breaks Redux immutability!)
const sorted = sites.sort((a, b) => a.name.localeCompare(b.name));

// ✅ GOOD - Creates new array (safe for Redux)
const sorted = sites.toSorted((a, b) => a.name.localeCompare(b.name));
```

**Real-world Redux selector**:

```typescript
// src/features/projects/core/projects.selectors.ts
export const selectProjectsSortedByDate = createSelector(
  [selectAllProjects],
  (projects) => {
    // ✅ Use toSorted() for immutability
    return projects.toSorted(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },
);
```

**Action items**:

1. Search codebase for all `.sort()` calls
2. Replace with `.toSorted()` in reducers and selectors
3. Add ESLint rule to prevent `.sort()` in Redux code

**Browser support**: Modern browsers (Chrome 110+, Safari 16+, Firefox 115+)

**Polyfill** (if needed):

```typescript
if (!Array.prototype.toSorted) {
  Array.prototype.toSorted = function <T>(
    compareFn?: (a: T, b: T) => number,
  ): T[] {
    return [...this].sort(compareFn);
  };
}
```

---

## 4. Medium: Re-render Optimization

### 4.1 Calculate Derived State During Rendering

**Impact**: Avoid redundant state + effects

**Current relevance**: Redux selectors should compute derived values

**Pattern**:

```typescript
// ❌ BAD - Derived state stored separately
const [projects, setProjects] = useState<Project[]>([]);
const [activeCount, setActiveCount] = useState(0);

useEffect(() => {
  setActiveCount(projects.filter((p) => p.status === "active").length);
}, [projects]);

// ✅ GOOD - Compute during render
const [projects, setProjects] = useState<Project[]>([]);
const activeCount = projects.filter((p) => p.status === "active").length;
```

**Redux selector example (PREFERRED for Benefriches)**:

```typescript
// src/features/projects/core/projects.selectors.ts
export const selectProjectSummary = createSelector(
  [selectAllProjects],
  (projects) => ({
    total: projects.length,
    active: projects.filter((p) => p.status === "active").length,
    completed: projects.filter((p) => p.status === "completed").length,
  }),
);
```

---

### 4.2 Extract to Memoized Components

**Impact**: Enable early returns before expensive computation

**Current relevance**: Heavy presentational components with lots of potential re-render in `views/`

**Pattern**:

```typescript
// ✅ Memoize expensive table component
export const ProjectTable = React.memo(({ projects, onSort }: Props) => {
  // Expensive rendering logic
  const rows = projects.map(project => (
    <ProjectRow key={project.id} project={project} />
  ));

  return <table>{rows}</table>;
});

// Custom comparison for advanced memoization
export const ProjectTable = React.memo(
  ({ projects, onSort }: Props) => { /* ... */ },
  (prevProps, nextProps) => {
    // Only re-render if project IDs changed
    return (
      prevProps.projects.length === nextProps.projects.length &&
      prevProps.projects.every((p, i) => p.id === nextProps.projects[i].id)
    );
  }
);
```

**When to use**:

- Component renders frequently but props rarely change
- Expensive rendering (long lists, complex calculations)
- Parent re-renders don't affect component's output

**When NOT to use**:

- Props change on every render
- Component is already fast
- Over-optimization (measure first!)

---

### 4.3 Use Functional setState Updates

**Impact**: Prevents stale closures, stable callbacks

**Current relevance**: Redux reducers already use this pattern

**Pattern**:

```typescript
// ❌ BAD - Closure captures old state
const handleIncrement = () => {
  setCount(count + 1); // What if count is stale?
};

// ✅ GOOD - Functional update uses latest state
const handleIncrement = () => {
  setCount((prevCount) => prevCount + 1);
};
```

**Note**: Benefriches already follows this pattern via Redux reducers. This is more relevant for local component state.

---

### 4.4 Use Lazy State Initialization

**Impact**: Expensive initial values computed once

**Current relevance**: Local component state with complex initialization

**Pattern**:

```typescript
// ❌ BAD - Runs on every render (even though value only used once)
const [state, setState] = useState(computeExpensiveInitialValue());

// ✅ GOOD - Function runs only once on mount
const [state, setState] = useState(() => computeExpensiveInitialValue());
```

**Example**:

```typescript
// ✅ Lazy initialization for local storage
const [preferences, setPreferences] = useState(() => {
  const stored = localStorage.getItem("userPreferences");
  return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
});
```

---

### 4.5 Use Transitions for Non-Urgent Updates

**Impact**: Maintain UI responsiveness during heavy updates

**Current relevance**: Search/filter inputs, real-time calculations

**Pattern**:

```typescript
import { useTransition } from 'react';

function SearchBar() {
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (query: string) => {
    // Mark Redux update as non-urgent
    startTransition(() => {
      dispatch(searchQueryUpdated(query));
    });
  };

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <Spinner />}
    </div>
  );
}
```

**When to use**:

- Search/filter inputs that trigger heavy re-renders
- Real-time calculations that can be deferred
- UI updates that shouldn't block user input

---

### 4.6 Use useRef for Transient Values

**Impact**: Avoid re-renders for frequently-changing values

**Current relevance**: Animation values, scroll positions, timers

**Pattern**:

```typescript
// ❌ BAD - Causes re-render on every scroll
const [scrollY, setScrollY] = useState(0);

useEffect(() => {
  const handleScroll = () => setScrollY(window.scrollY);
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

// ✅ GOOD - No re-renders
const scrollY = useRef(0);

useEffect(() => {
  const handleScroll = () => {
    scrollY.current = window.scrollY;
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

**When to use**:

- Values that change frequently but don't affect rendering
- Animation frame values
- Timer IDs
- Previous prop values

---

### 4.7 Narrow Effect Dependencies

**Impact**: Reduce unnecessary effect re-runs

**Current relevance**: useEffect hooks extracting specific values from objects

**Pattern**:

```typescript
// ❌ BAD - Runs on any user prop change
useEffect(() => {
  trackEvent(user.id);
}, [user]);

// ✅ GOOD - Only runs when ID changes
useEffect(() => {
  trackEvent(user.id);
}, [user.id]);
```

**Example with Redux**:

```typescript
// ❌ BAD - Runs whenever any project data changes
const project = useAppSelector(selectCurrentProject);

useEffect(() => {
  trackPageView(project.id);
}, [project]);

// ✅ GOOD - Only runs when project ID changes
const projectId = useAppSelector((state) => selectCurrentProject(state)?.id);

useEffect(() => {
  if (projectId) trackPageView(projectId);
}, [projectId]);
```

---

### 4.8 Put Interaction Logic in Event Handlers

**Impact**: Avoid modeling actions as state + effect

**Current relevance**: Forms, user interactions

**Pattern**:

```typescript
// ❌ BAD - State change triggers effect
const [shouldSubmit, setShouldSubmit] = useState(false);

useEffect(() => {
  if (shouldSubmit) {
    dispatch(formSubmitted(data));
    setShouldSubmit(false);
  }
}, [shouldSubmit, data, dispatch]);

const handleClick = () => setShouldSubmit(true);

// ✅ GOOD - Direct handler
const handleClick = () => {
  dispatch(formSubmitted(data));
};
```

---

### 4.9 Subscribe to Derived State

**Impact**: Subscribe to boolean derived from continuous values

**Current relevance**: Redux selectors for UI state

**Pattern**:

```typescript
// ❌ BAD - Component re-renders on every completion rate change
const completionRate = useAppSelector(selectProjectCompletionRate);
const isValid = completionRate > 0.8;

// ✅ GOOD - Selector derives boolean (fewer re-renders)
export const selectIsProjectValid = createSelector(
  [selectProjectCompletionRate],
  (rate) => rate > 0.8,
);

const isValid = useAppSelector(selectIsProjectValid);
```

---

### 4.10 Defer State Reads to Usage Point

**Impact**: Read dynamic state inside callbacks, not via subscriptions

**Pattern**:

```typescript
// ❌ BAD - Subscribes to state that only matters in callback
const currentTheme = useAppSelector(selectTheme);

const handleExport = () => {
  exportWithTheme(currentTheme);
};

// ✅ GOOD - Read state in callback (no subscription)
const handleExport = () => {
  const theme = store.getState().theme.current;
  exportWithTheme(theme);
};
```

---

### 4.11 Don't Wrap Simple Expressions in useMemo

**Impact**: Avoid over-optimization

**Pattern**:

```typescript
// ❌ BAD - Unnecessary memoization
const total = useMemo(() => a + b, [a, b]);

// ✅ GOOD - Simple calculation during render
const total = a + b;
```

**When to use useMemo**:

- Expensive computations (loops, recursion)
- Object/array creation for memoized components
- Referential equality matters for dependencies

**When NOT to use**:

- Simple arithmetic
- String concatenation
- Object property access

---

### 4.12 Extract Default Non-primitive Parameter from Memoized Component

**Impact**: Preserve memoization effectiveness

**Pattern**:

```typescript
// ❌ BAD - New object on every render breaks memo
function ParentComponent() {
  return <MemoizedComponent config={{ theme: 'light' }} />;
}

// ✅ GOOD - Extract to constant
const DEFAULT_CONFIG = { theme: 'light' };

function ParentComponent() {
  return <MemoizedComponent config={DEFAULT_CONFIG} />;
}
```

---

## 5. Medium: Bundle Optimization (Continued)

### 5.1 Defer Non-Critical Third-Party Libraries

**Impact**: Load analytics, logging after app initialization

**Current relevance**: Matomo analytics, error tracking

**Pattern**:

```typescript
// src/App.tsx
function App() {
  useEffect(() => {
    // ✅ Load analytics after initial render
    import('./analytics').then(({ init }) => init());
  }, []);

  return <AppRoutes />;
}
```

**Benefriches example**:

```typescript
// Load Matomo analytics asynchronously
useEffect(() => {
  if (import.meta.env.PROD) {
    import("./infrastructure/analytics/matomo").then(({ initMatomo }) => {
      initMatomo();
    });
  }
}, []);
```

---

### 5.2 Preload Based on User Intent

**Impact**: Reduce perceived latency by preloading on hover/focus

**Current relevance**: Heavy modals, project creation forms

**Pattern**:

```typescript
// ✅ Preload on hover
function ProjectListItem({ project }: Props) {
  const [DetailsModal, setDetailsModal] = useState<React.ComponentType | null>(null);

  const handleMouseEnter = () => {
    if (!DetailsModal) {
      import('./ProjectDetailsModal').then(module => {
        setDetailsModal(() => module.default);
      });
    }
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      <h3>{project.name}</h3>
      {/* Modal opens instantly when clicked because it's preloaded */}
    </div>
  );
}
```

---

## 6. Medium: Client Data Patterns

### 6.1 Use Passive Event Listeners for Scrolling

**Impact**: Eliminates scroll delay

**Current relevance**: Infinite scroll, scroll-triggered animations

**Pattern**:

```typescript
// ✅ Add passive flag
useEffect(() => {
  const handleScroll = () => {
    // Handle scroll
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);
```

**For wheel events**:

```typescript
element.addEventListener("wheel", handler, { passive: true });
```

---

### 6.2 Version and Minimize localStorage Data

**Impact**: Prevent breaking changes, reduce storage size

**Current relevance**: Persisting Redux state, user preferences

**Pattern**:

```typescript
// ✅ Version localStorage keys
const STORAGE_VERSION = 2;
const STORAGE_KEY = `benefriches_v${STORAGE_VERSION}_userPrefs`;

// Store only essential data
const minimalState = {
  theme: state.theme,
  language: state.language,
};

localStorage.setItem(STORAGE_KEY, JSON.stringify(minimalState));
```

**Migration pattern**:

```typescript
function loadPreferences(): Preferences {
  // Try current version
  const v2 = localStorage.getItem("benefriches_v2_userPrefs");
  if (v2) return JSON.parse(v2);

  // Migrate from v1
  const v1 = localStorage.getItem("benefriches_v1_userPrefs");
  if (v1) {
    const migrated = migrateV1ToV2(JSON.parse(v1));
    localStorage.setItem("benefriches_v2_userPrefs", JSON.stringify(migrated));
    localStorage.removeItem("benefriches_v1_userPrefs");
    return migrated;
  }

  return DEFAULT_PREFERENCES;
}
```

---

## 7. Low-Medium: Rendering Performance

### 7.1 Hoist Static JSX Elements

**Impact**: Avoid re-creation on every render

**Pattern**:

```typescript
// ❌ BAD - Creates new element on every render
function ProjectList({ projects }: Props) {
  if (projects.length === 0) {
    return <div>No projects found</div>;
  }
  // ...
}

// ✅ GOOD - Extract static JSX outside component
const EMPTY_STATE = <div>No projects found</div>;

function ProjectList({ projects }: Props) {
  if (projects.length === 0) return EMPTY_STATE;
  // ...
}
```

---

### 7.2 Use Activity Component for Show/Hide

**Impact**: Preserve state/DOM for expensive components

**Current relevance**: Toggling visibility of complex forms/maps

**Pattern**:

```typescript
// ❌ BAD - Unmounts/remounts expensive component
{isVisible && <ExpensiveMapComponent />}

// ✅ GOOD - Use CSS visibility instead
<div style={{ display: isVisible ? 'block' : 'none' }}>
  <ExpensiveMapComponent />
</div>
```

**When to use**:

- Component has expensive initialization (maps, charts)
- State should be preserved when hidden
- Frequent toggling

---

### 7.3 Explicit Conditional Rendering

**Impact**: Prevent rendering falsy values like 0

**Pattern**:

```typescript
// ❌ BAD - Renders "0" if count is 0
{count && <div>{count} projects</div>}

// ✅ GOOD - Explicit boolean
{count > 0 && <div>{count} projects</div>}
```

---

### 7.4 Use useTransition Over Manual Loading States

**Pattern**:

```typescript
// ❌ BAD - Manual loading state
const [isLoading, setIsLoading] = useState(false);

const handleUpdate = async () => {
  setIsLoading(true);
  await updateData();
  setIsLoading(false);
};

// ✅ GOOD - Use useTransition
const [isPending, startTransition] = useTransition();

const handleUpdate = () => {
  startTransition(async () => {
    await updateData();
  });
};
```

---

### 7.5 Optimize SVG Precision

**Impact**: Reduce file size

**Action**: Run SVGO on SVG assets

```bash
npx svgo --multipass --precision=2 src/assets/**/*.svg
```

---

### 7.6 Animate SVG Wrapper Instead of SVG Element

**Impact**: Hardware acceleration

**Pattern**:

```typescript
// ❌ BAD - Animate SVG directly
<svg className="animate-spin">...</svg>

// ✅ GOOD - Animate wrapper div
<div className="animate-spin">
  <svg>...</svg>
</div>
```

---

## 8. Low-Medium: JavaScript Performance

### 8.1 Cache Repeated Function Calls

**Impact**: Module-level Maps for expensive computations

**Current relevance**: Area calculations, data transformations

**Pattern**:

```typescript
// ✅ Cache expensive calculations
const areaCache = new Map<string, number>();

export function calculatePolygonArea(polygon: Polygon): number {
  const key = polygon.id;

  if (areaCache.has(key)) {
    return areaCache.get(key)!;
  }

  const area = expensiveAreaCalculation(polygon);
  areaCache.set(key, area);
  return area;
}
```

**With size limit**:

```typescript
const MAX_CACHE_SIZE = 100;
const cache = new Map<string, number>();

function cacheResult(key: string, value: number) {
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, value);
}
```

---

### 8.2 Build Index Maps for Repeated Lookups

**Impact**: O(1) instead of O(n) for array lookups

**Current relevance**: Redux selectors looking up entities by ID

**Pattern**:

```typescript
// ✅ Create index map in selector
export const selectProjectsById = createSelector(
  [selectAllProjects],
  (projects) => new Map(projects.map((p) => [p.id, p])),
);

// Usage in component
const projectsById = useAppSelector(selectProjectsById);
const project = projectsById.get(projectId); // O(1) lookup
```

---

### 8.3 Use Set/Map for O(1) Lookups

**Impact**: Membership checks, uniqueness filtering

**Pattern**:

```typescript
// ❌ BAD - O(n) for each check
const selectedIds = ["id1", "id2", "id3"];
const isSelected = selectedIds.includes(itemId);

// ✅ GOOD - O(1) lookup
const selectedSet = new Set(["id1", "id2", "id3"]);
const isSelected = selectedSet.has(itemId);
```

---

### 8.4 Avoid Layout Thrashing

**Impact**: Batch DOM reads/writes

**Pattern**:

```typescript
// ❌ BAD - Interleaved reads/writes (thrashing)
elements.forEach((el) => {
  const height = el.offsetHeight; // Read
  el.style.height = height * 2 + "px"; // Write
});

// ✅ GOOD - Batch reads, then batch writes
const heights = elements.map((el) => el.offsetHeight); // Batch reads
elements.forEach((el, i) => {
  el.style.height = heights[i] * 2 + "px"; // Batch writes
});
```

---

### 8.5 Cache Property Access in Loops

**Pattern**:

```typescript
// ❌ BAD - Repeated property access
for (let i = 0; i < projects.length; i++) {
  // projects.length accessed on every iteration
}

// ✅ GOOD - Cache length
const len = projects.length;
for (let i = 0; i < len; i++) {
  // ...
}
```

---

### 8.6 Cache Storage API Calls

**Pattern**:

```typescript
// ✅ Cache localStorage value
let cachedTheme: string | null = null;

export function getTheme(): string {
  if (cachedTheme === null) {
    cachedTheme = localStorage.getItem("theme") ?? "light";
  }
  return cachedTheme;
}

export function setTheme(theme: string): void {
  cachedTheme = theme;
  localStorage.setItem("theme", theme);
}
```

---

### 8.7 Combine Multiple Array Iterations

**Pattern**:

```typescript
// ❌ BAD - Two passes
const active = projects.filter((p) => p.status === "active");
const names = active.map((p) => p.name);

// ✅ GOOD - Single pass with reduce
const names = projects.reduce((acc, p) => {
  if (p.status === "active") {
    acc.push(p.name);
  }
  return acc;
}, [] as string[]);
```

---

### 8.8 Early Return from Functions

**Pattern**:

```typescript
// ✅ Early return
function validateProject(project: Project): boolean {
  if (!project.name) return false;
  if (!project.type) return false;
  if (!project.siteId) return false;

  // Complex validation only if basics passed
  return validateComplexRules(project);
}
```

---

### 8.9 Hoist RegExp Creation

**Pattern**:

```typescript
// ❌ BAD - Creates RegExp on every call
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ✅ GOOD - Create once at module level
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}
```

---

### 8.10 Use Loop for Min/Max Instead of Sort

**Pattern**:

```typescript
// ❌ BAD - O(n log n)
const maxArea = projects.toSorted((a, b) => b.area - a.area)[0];

// ✅ GOOD - O(n)
const maxArea = projects.reduce((max, p) => (p.area > max.area ? p : max));
```

---

### 8.11 Deduplicate Global Event Listeners

**Pattern**:

```typescript
// Shared resize listener hook
let resizeListeners: Set<() => void> = new Set();
let resizeObserver: ResizeObserver | null = null;

export function useWindowResize(callback: () => void) {
  useEffect(() => {
    resizeListeners.add(callback);

    if (!resizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        resizeListeners.forEach((cb) => cb());
      });
      resizeObserver.observe(document.body);
    }

    return () => {
      resizeListeners.delete(callback);
      if (resizeListeners.size === 0 && resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
    };
  }, [callback]);
}
```

---

## 9. Low: Advanced Patterns

### 9.1 Initialize App Once, Not Per Mount

**Pattern**:

```typescript
// ✅ Module-level initialization guard
let analyticsInitialized = false;

export function initAnalytics() {
  if (analyticsInitialized) return;

  analyticsInitialized = true;
  // ... setup analytics
}
```

---

### 9.2 Store Event Handlers in Refs

**Pattern**:

```typescript
// ✅ Store callback in ref for stable subscription
function useStableEventBus(event: string, handler: () => void) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const stableHandler = () => handlerRef.current();
    eventBus.on(event, stableHandler);

    return () => eventBus.off(event, stableHandler);
  }, [event]); // Only re-subscribe if event name changes
}
```

---

## 10. Excluded Practices

The following practices from Vercel's guide are **NOT applicable** to Benefriches (client-side SPA):

### Server-Side Performance (7 rules)

1. ❌ **Authenticate Server Actions** - No Server Actions in SPA
2. ❌ **Avoid Duplicate Serialization in RSC Props** - No React Server Components
3. ❌ **Cross-Request LRU Caching** - No server-side rendering
4. ❌ **Minimize Serialization at RSC Boundaries** - No RSC
5. ❌ **Parallel Data Fetching with Component Composition** - RSC pattern only
6. ❌ **Per-Request Deduplication with React.cache()** - Server-only API
7. ❌ **Use after() for Non-Blocking Operations** - Server-only API

### Hydration-Specific (2 rules)

8. ❌ **Prevent Hydration Mismatch Without Flickering** - No SSR/hydration
9. ❌ **Suppress Expected Hydration Mismatches** - No SSR/hydration

### NextJS-Specific Features

10. ❌ **next/dynamic** - Use `React.lazy()` instead for code splitting

---

## References

- [Vercel React Best Practices Repository](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)
- [React 19 Documentation](https://react.dev)
- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [Redux Performance Patterns](https://redux.js.org/usage/performance)
- [Web.dev Performance](https://web.dev/performance/)

---

**END OF DETAILED GUIDE**
