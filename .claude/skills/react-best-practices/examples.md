# React Best Practices - Code Examples

> **Detailed code examples for patterns summarized in SKILL.md**
>
> This file is loaded on-demand when Claude needs specific code patterns.

---

## 1. Code Quality Examples

### Single Responsibility - Before/After

```typescript
// ❌ BAD - Multiple responsibilities
function UserDashboard() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  useEffect(() => { fetchUser() }, []);
  useEffect(() => { fetchNotifications() }, []);
  useEffect(() => { trackPageView() }, []);
  return (
    <div>
      <UserProfile user={user} />
      <NotificationList items={notifications} />
    </div>
  );
}

// ✅ GOOD - Composition
function UserDashboard() {
  return (
    <div>
      <UserProfileContainer />
      <NotificationsContainer />
    </div>
  );
}
```

### Extract Custom Hook

```typescript
// Extract form logic to hook
function useProjectForm(projectId: string) {
  const [formData, setFormData] = useState(initialState);
  const validate = () => { /* validation */ };
  const submit = async () => { /* API call */ };
  return { formData, setFormData, validate, submit };
}

// Component becomes simple
function ProjectForm({ projectId }) {
  const { formData, setFormData, validate, submit } = useProjectForm(projectId);
  return <form>...</form>;
}
```

---

## 2. Component Patterns Examples

### Container/Presentational (Benefriches Pattern)

```typescript
// Container: src/features/projects/views/project-summary/index.tsx
export default function ProjectSummaryContainer() {
  const dispatch = useAppDispatch();
  const viewData = useAppSelector(selectProjectSummaryViewData);
  return <ProjectSummary viewData={viewData} onEdit={(f) => dispatch(editFieldRequested({ field: f }))} />;
}

// Presentational: ProjectSummary.tsx
function ProjectSummary({ viewData, onEdit }: Props) {
  const { projectName, siteArea } = viewData;
  return <div><h1>{projectName}</h1><p>{siteArea} m²</p></div>;
}
```

### Children Pattern (Avoids Re-renders)

```typescript
// ✅ Static children don't re-render when parent updates
function ColorPicker({ children }) {
  const [color, setColor] = useState('red');
  return <div style={{ color }}>{children}</div>;
}

<ColorPicker>
  <ExpensiveTree />  {/* Never re-renders on color change */}
</ColorPicker>
```

---

## 3. State Management Examples

### Derived State in Selectors

```typescript
// ❌ BAD - Storing derived state
const [projects, setProjects] = useState([]);
const [activeCount, setActiveCount] = useState(0);
useEffect(() => {
  setActiveCount(projects.filter(p => p.status === 'active').length);
}, [projects]);

// ✅ GOOD - Derive in selector
export const selectProjectSummary = createSelector(
  [selectAllProjects],
  (projects) => ({
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
  })
);
```

### Immutability

```typescript
// ❌ BAD - Mutates (breaks Redux!)
const sorted = projects.sort((a, b) => a.name.localeCompare(b.name));

// ✅ GOOD - Creates new array
const sorted = projects.toSorted((a, b) => a.name.localeCompare(b.name));
```

---

## 4. Anti-Pattern Examples

### Effect for Derived State

```typescript
// ❌ BAD
const [filteredProjects, setFilteredProjects] = useState([]);
useEffect(() => {
  setFilteredProjects(projects.filter(p => p.status === filter));
}, [projects, filter]);

// ✅ GOOD - Compute during render
const filteredProjects = projects.filter(p => p.status === filter);
```

### Array Index as Key

```typescript
// ❌ BAD - Bugs with reordering
{projects.map((p, i) => <ProjectCard key={i} project={p} />)}

// ✅ GOOD
{projects.map((p) => <ProjectCard key={p.id} project={p} />)}
```

---

## 5. Bundle Optimization Examples

### Dynamic Import with Suspense

```typescript
const MapViewer = React.lazy(() => import('@/features/map/MapViewer'));

function ProjectPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <MapViewer />
    </Suspense>
  );
}
```

### Preload on Hover

```typescript
function ProjectListItem({ project }) {
  const handleMouseEnter = () => import('./ProjectDetailsModal');
  return <div onMouseEnter={handleMouseEnter}>{project.name}</div>;
}
```

---

## 6. Async Pattern Examples

### Promise.all in Thunks

```typescript
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData",
  async (_, { extra }) => {
    const [sites, projects, stats] = await Promise.all([
      extra.siteService.getUserSites(),
      extra.projectService.getUserProjects(),
      extra.statsService.getProjectStats(),
    ]);
    return { sites, projects, stats };
  }
);
```

### Strategic Suspense

```typescript
function DashboardPage() {
  return (
    <div>
      <PageHeader />
      <Suspense fallback={<StatsSkeleton />}><QuickStats /></Suspense>
      <Suspense fallback={<TableSkeleton />}><ProjectsTable /></Suspense>
    </div>
  );
}
```

---

## 7. Memoization Examples (When Actually Needed)

### Better Alternatives First

**1. Move state down:**

```typescript
// ❌ BAD - Parent re-renders siblings on every keystroke
function Parent() {
  const [search, setSearch] = useState('');
  return (
    <>
      <SearchInput value={search} onChange={setSearch} />
      <ExpensiveList />
    </>
  );
}

// ✅ GOOD - State isolated
function Parent() {
  return (
    <>
      <SearchInputWithState onSubmit={handleSearch} />
      <ExpensiveList />
    </>
  );
}
```

**2. Derive booleans in selectors:**

```typescript
// ❌ BAD - Re-renders on every % change
const progress = useAppSelector(selectProjectProgress);
const isComplete = progress >= 100;

// ✅ GOOD - Only re-renders on boolean change
const isComplete = useAppSelector(selectIsProjectComplete);
// Selector: (progress) => progress >= 100
```

### When Memo Might Help

Only when measured slow AND props stable:

```typescript
// Parent must provide stable props
const SORT_CONFIG = { field: 'name', order: 'asc' };

const MemoizedHeavyList = React.memo(function HeavyList({ items, sortOrder }) {
  return items.map(item => <ComplexRow key={item.id} item={item} />);
});

<MemoizedHeavyList items={items} sortOrder={SORT_CONFIG} />
```

### When Memo Won't Help

```typescript
// ❌ USELESS - New objects every render
<MemoizedCard
  config={{ theme: 'light' }}     // New object!
  onClick={() => handleClick()}   // New function!
/>
```

---

## 8. Performance Tips (Hot Paths Only)

### O(1) Lookups

```typescript
// Selector builds index map
export const selectProjectsById = createSelector(
  [selectAllProjects],
  (projects) => new Map(projects.map(p => [p.id, p]))
);

// O(1) usage
const project = projectsById.get(projectId);
```

### content-visibility for Long Lists

```typescript
<div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 200px' }}>
  <ProjectCard project={project} />
</div>
```

---

## 9. Form Handling Examples (react-hook-form + DSFR)

### Standard Form Pattern

```typescript
// src/features/create-site/views/custom/naming/SiteNameAndDescription.tsx pattern
import { useForm } from "react-hook-form";
import { Input } from "@codegouvfr/react-dsfr/Input";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

type FormValues = {
  name: string;
  description?: string;
};

function SiteNameForm({ onSubmit, defaultValues }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Nom du site"
        state={formState.errors.name ? "error" : "default"}
        stateRelatedMessage={formState.errors.name?.message}
        nativeInputProps={{
          ...register("name", { required: "Le nom est obligatoire" }),
        }}
      />
      <Input
        label="Description"
        textArea
        nativeTextAreaProps={{ ...register("description") }}
      />
      <ButtonsGroup
        buttons={[{ children: "Valider", type: "submit" }]}
      />
    </form>
  );
}
```

### Email Validation Pattern

```typescript
// Pattern from CreateUserForm.tsx
<Input
  label="Email"
  state={formState.errors.email ? "error" : "default"}
  stateRelatedMessage={formState.errors.email?.message}
  nativeInputProps={{
    placeholder: "utilisateur@example.fr",
    ...register("email", {
      required: "Vous devez renseigner votre e-mail.",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Veuillez entrer une adresse email valide.",
      },
    }),
  }}
/>
```

### Checkbox with Validation

```typescript
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";

<Checkbox
  state={formState.errors.consent ? "error" : "default"}
  stateRelatedMessage={formState.errors.consent?.message}
  options={[
    {
      label: "J'accepte les conditions",
      nativeInputProps: {
        value: "agreed",
        ...register("consent", { required: "Vous devez accepter." }),
      },
    },
  ]}
/>
```

### Custom Numeric Input (RowNumericInput)

For numeric inputs with labels and units, use the custom `RowNumericInput` component:

```typescript
// Usage with react-hook-form
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";

<RowNumericInput
  label="Surface"
  hintText="en mètres carrés"
  addonText="m²"
  state={formState.errors.surface ? "error" : "default"}
  stateRelatedMessage={formState.errors.surface?.message}
  nativeInputProps={{
    ...register("surface", { required: "La surface est obligatoire" }),
  }}
/>
```

Key features of RowNumericInput:
- **Accessible by default**: `aria-describedby` links error messages, proper `htmlFor`/`id` association
- **Numeric keyboard**: `inputMode="numeric"` shows number pad on mobile
- **Unit addon**: `addonText` displays unit (m², €, kWh) visually attached to input
- **State handling**: Supports `default`, `error`, `success`, `warning` states
- **Optional image**: `imgSrc` for visual context (e.g., soil type icons)

```typescript
// With image and hint text
<RowNumericInput
  label="Bâtiments"
  imgSrc="/icons/buildings.svg"
  hintText="Surface au sol occupée par les bâtiments"
  hintInputText="Laisser vide si inconnu"
  addonText="m²"
  nativeInputProps={{ ...register("buildingSurface") }}
/>
```

Reference: `src/shared/views/components/form/NumericInput/RowNumericInput.tsx`

---

## 10. Accessibility Examples

### Decorative vs Informative Icons

```typescript
// ✅ Decorative icon - hidden from screen readers
<span className="inline-flex items-center gap-2">
  <i className="fr-icon-check-line" aria-hidden="true" />
  Validé
</span>

// ✅ Icon-only button needs aria-label
<button aria-label="Supprimer" onClick={onDelete}>
  <i className="fr-icon-delete-line" aria-hidden="true" />
</button>

// ❌ BAD - Icon with no accessible name
<button onClick={onDelete}>
  <i className="fr-icon-delete-line" />
</button>
```

### Tab Navigation with Active State

```typescript
// Pattern from TabItem.tsx
function TabItem({ isActive, label, linkProps, iconId }: TabItemProps) {
  return (
    <li role="presentation">
      <a
        role="tab"
        aria-selected={isActive}
        {...linkProps}
      >
        <i className={iconId} aria-hidden="true" />
        {label}
      </a>
    </li>
  );
}
```

### Modal Focus Management

```typescript
// DSFR modals handle focus automatically via createModal()
import { createModal } from "@codegouvfr/react-dsfr/Modal";

const modal = createModal({
  id: "confirmation-modal",
  isOpenedByDefault: false,
});

// Usage - focus is managed automatically
<button onClick={() => modal.open()}>Ouvrir</button>
<modal.Component title="Confirmation" buttons={[...]}>
  <p>Êtes-vous sûr ?</p>
</modal.Component>
```

### Keyboard Event Handling

```typescript
// Handle keyboard interaction in custom components
function DropdownItem({ onSelect, children }: Props) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="option"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
```

---

## References

- [React.dev - memo](https://react.dev/reference/react/memo)
- [React Compiler](https://react.dev/learn/react-compiler)
- [TkDodo - Memoization](https://tkdodo.eu/blog/the-uphill-battle-of-memoization)
- [DSFR Documentation](https://components.react-dsfr.codegouv.studio/)
- [react-hook-form](https://react-hook-form.com/)
