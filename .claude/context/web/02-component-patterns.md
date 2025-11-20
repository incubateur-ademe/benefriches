# Component Patterns

> **Purpose**: Detailed patterns for React components, containers, presentational components, and form handling.

---

## 🧩 Container/Presentational Pattern

**ALWAYS separate containers (smart) from presentational (dumb) components**.

### Container Component (connects to Redux)

- Location: `views/feature-name/index.tsx` (or `views/FeatureName.tsx`)
- Uses **single ViewData selector**: `select{FeatureName}ViewData`
- Uses `useAppDispatch` to dispatch actions
- Passes all state via props to presentational component

```typescript
// Container component
function FormContainer() {
  const dispatch = useAppDispatch();

  // ✅ CORRECT - Single composed selector
  const viewData = useAppSelector(selectFormViewData);

  return (
    <Form
      {...viewData}
      onSubmit={(data) => dispatch(stepCompleted(data))}
    />
  );
}
```

**Selector naming**: Use `select{FeatureName}ViewData`
- `selectReconversionCompatibilityViewData`
- `selectProjectDetailsViewData`
- `selectSiteFormViewData`

### Presentational Component (pure React)

- Location: `views/feature-name/ComponentName.tsx`
- No Redux dependencies, receives all data via props

```typescript
// Presentational
export function Form({ initialValues, onSubmit }: Props) {
  const { register, handleSubmit } = useForm({ defaultValues: initialValues });
  return <form onSubmit={handleSubmit(onSubmit)}>{/* ... */}</form>;
}
```

**Full example**: [create-site/views](../../src/features/create-site/views/)

---

## 🎯 Composed Type Props Pattern (CRITICAL)

When passing data to presentational components, **compose related domain types into a single prop** instead of scattering data across multiple props. This creates clearer component contracts and improves type safety.

### CORRECT - Composed Domain Type

```typescript
type Props = {
  siteView?: SiteView;  // Includes features + projects together
  loadingState: LoadingState;
};

function SiteFeaturesPage({ siteView, loadingState }: Props) {
  return (
    <>
      <SiteFeaturesList {...siteView.features} />
      <ProjectsList projects={siteView.reconversionProjects} />
    </>
  );
}
```

### AVOID - Scattered Related Data

```typescript
// ❌ Multiple props for related data
type Props = {
  siteData?: SiteFeatures;
  projects: ReconversionProject[];
  loadingState: LoadingState;
};
```

### Benefits

- Clearer component contract showing what data belongs together
- Single type reference in props makes the API obvious
- Easier maintenance: adding related fields only requires updating the domain type
- Type-safe access to related nested data

---

## 🪝 Typed Redux Hooks

**ALWAYS use typed hooks** from [shared/views/hooks/store.hooks.ts](../../src/shared/views/hooks/store.hooks.ts):

```typescript
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

// ✅ CORRECT - Fully typed
const dispatch = useAppDispatch();
const siteData = useAppSelector((state) => state.siteCreation.siteData);

// ❌ WRONG - Untyped
import { useDispatch, useSelector } from "react-redux";
const dispatch = useDispatch(); // Not typed with AppDispatch
```

---

## 📋 Form Handling

**Library**: `react-hook-form` with DSFR `Input` components

### Basic Form Pattern

```typescript
function MyForm({ initialValues, onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Nom"
        state={formState.errors.name ? "error" : "default"}
        stateRelatedMessage={formState.errors.name?.message}
        nativeInputProps={register("name", { required: "Ce champ est requis" })}
      />
      <Button type="submit">Valider</Button>
    </form>
  );
}
```

### With Validation

```typescript
function RegistrationForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    mode: "onBlur", // Validate on blur
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        state={formState.errors.email ? "error" : "default"}
        stateRelatedMessage={formState.errors.email?.message}
        nativeInputProps={register("email", {
          required: "Email requis",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Email invalide",
          },
        })}
      />
      <Button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? "Envoi..." : "Envoyer"}
      </Button>
    </form>
  );
}
```

### Handling Loading State

```typescript
function SaveButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button type="submit" disabled={isLoading}>
      {isLoading ? "Enregistrement..." : "Enregistrer"}
    </Button>
  );
}
```

---

## 🎨 Component File Structure

For feature components, organize by responsibility:

```
views/
├── FeaturePage.tsx        # Main container component
├── FeatureForm.tsx        # Presentational form
├── components/
│   ├── Step1.tsx          # Feature-specific components
│   ├── Step2.tsx
│   └── Summary.tsx
└── hooks/                 # Feature-specific hooks (optional)
    └── useFeatureLogic.ts
```

---

## 🔗 Related Patterns

- **Redux State Management** → [01-redux-architecture.md](./01-redux-architecture.md)
- **API Integration** → [03-api-integration.md](./03-api-integration.md)
- **Testing Components** → [04-testing-strategy.md](./04-testing-strategy.md)

---

**Next**: See [03-api-integration.md](./03-api-integration.md) for gateway pattern and API integration.
