# Routing & Styling

> **Purpose**: Type-safe routing patterns and styling approach using Tailwind CSS and DSFR components.

---

## 🚦 Type-Safe Routing with type-route

**Library**: `type-route` - Provides fully type-safe routing with parameter validation.

**Location**: [shared/views/router.ts](../../src/shared/views/router.ts)

### Basic Router Setup

```typescript
import { createRouter, defineRoute, param } from "type-route";

const { RouteProvider, useRoute, routes } = createRouter({
  home: defineRoute("/"),
  projectImpacts: defineRoute(
    { projectId: param.path.string },
    (params) => `/mes-projets/${params.projectId}/impacts`,
  ),
  userProfile: defineRoute(
    { userId: param.path.string },
    (params) => `/profile/${params.userId}`,
  ),
});
```

### Using Routes in App

```typescript
function App() {
  const route = useRoute();

  return (
    <RouteProvider>
      {route.name === routes.home.name && <HomePage />}
      {route.name === routes.projectImpacts.name && (
        <ProjectImpactsPage projectId={route.params.projectId} />
      )}
      {route.name === routes.userProfile.name && (
        <UserProfilePage userId={route.params.userId} />
      )}
    </RouteProvider>
  );
}
```

### Lazy Loading Pages

```typescript
import { Suspense, lazy } from "react";

const HomePage = lazy(() => import("@/features/home/views/HomePage"));
const ProjectPage = lazy(() => import("@/features/projects/views/ProjectPage"));

function App() {
  const route = useRoute();

  return (
    <RouteProvider>
      <Suspense fallback={<LoadingSpinner />}>
        {route.name === routes.home.name && <HomePage />}
        {route.name === routes.projectImpacts.name && <ProjectPage />}
      </Suspense>
    </RouteProvider>
  );
}
```

---

## 🔗 Component Navigation with Routes Helper

Use the `routes` helper directly in components for **type-safe navigation**. This keeps routing logic centralized and provides compile-time validation:

### Basic Navigation

```typescript
import { Button } from "@codegouvfr/react-dsfr/Button";
import { routes } from "@/shared/views/router";

type Props = {
  projectId: string;
};

export function ProjectCard({ projectId }: Props) {
  return (
    <Button
      size="small"
      linkProps={routes.projectImpacts({ projectId }).link}
    >
      View impacts
    </Button>
  );
}
```

### Navigation Links

```typescript
import { routes } from "@/shared/views/router";

export function Navigation() {
  return (
    <nav>
      <a href={routes.home().pathname}>Home</a>
      <a href={routes.projectImpacts({ projectId: "123" }).pathname}>
        Projects
      </a>
    </nav>
  );
}
```

### Programmatic Navigation

```typescript
import { useRoute } from "@/shared/views/router";

export function SubmitButton() {
  const route = useRoute();

  const handleSubmit = async (data: FormData) => {
    await saveData(data);
    // Navigate to success page
    window.location.href = routes.home().pathname;
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

### Benefits

- **Type-safe**: Route parameters are validated at compile time
- **Centralized**: All route definitions in one place
- **Easy refactoring**: Changing a route updates everywhere it's used
- **Works naturally**: With DSFR Button's `linkProps` and standard HTML links

---

## 🎨 Styling Architecture

### Styling Stack

- **Tailwind CSS** (v4+): Utility classes in JSX - `className="flex flex-col gap-4"`
- **DSFR** (`@codegouvfr/react-dsfr`): French Government Design System components

### Tailwind CSS Usage

Use utility classes directly in JSX for styling:

```typescript
export function Card({ title, children }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-bold text-gray-900">{title}</h2>
      <div className="text-sm text-gray-600">{children}</div>
    </div>
  );
}
```

### DSFR Components

Use DSFR components for French Government-compliant UI:

```typescript
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Alert } from "@codegouvfr/react-dsfr/Alert";

export function LoginForm() {
  return (
    <>
      <Alert title="Welcome" description="Please log in to continue" />
      <Input
        label="Email"
        nativeInputProps={{ type: "email", required: true }}
      />
      <Button>Sign In</Button>
    </>
  );
}
```

### Combining Tailwind + DSFR

Mix Tailwind utilities with DSFR components for flexible layouts:

```typescript
import { Button } from "@codegouvfr/react-dsfr/Button";

export function FormSection({ title, children }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="border-b border-gray-200 pb-3 text-xl font-bold">
        {title}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
      <div className="flex justify-between pt-4">
        <Button priority="secondary">Back</Button>
        <Button>Next</Button>
      </div>
    </div>
  );
}
```

---

## 🎯 Common Styling Patterns

### Responsive Layouts

```typescript
// Mobile-first responsive design
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>

<div className="flex flex-col gap-4 md:flex-row lg:gap-8">
  {/* Responsive flex */}
</div>

<div className="hidden md:block">
  {/* Show only on medium+ screens */}
</div>

<div className="md:hidden">
  {/* Hide on medium+ screens */}
</div>
```

### Spacing & Layout

```typescript
// Consistent spacing with Tailwind
<div className="space-y-4">
  {/* Children have 1rem gap between them */}
</div>

<div className="flex gap-2">
  {/* Flex children with 0.5rem gap */}
</div>

<div className="p-6">
  {/* Padding: 1.5rem on all sides */}
</div>

<div className="px-4 py-2">
  {/* Padding: 1rem horizontal, 0.5rem vertical */}
</div>
```

### Colors & Contrast

```typescript
// Text colors
<p className="text-gray-900">Dark text</p>
<p className="text-gray-600">Medium text</p>
<p className="text-gray-500">Light text</p>

// Background colors
<div className="bg-white">White background</div>
<div className="bg-gray-50">Light gray background</div>
<div className="bg-blue-600">Primary color</div>

// Borders
<div className="border border-gray-200">Light border</div>
<div className="border-b-2 border-blue-600">Bottom border</div>
```

---

## 📱 Mobile-First Design Approach

Always design **mobile first**, then add responsive modifiers:

```typescript
// ✅ CORRECT - Mobile first
<div className="text-sm md:text-base lg:text-lg">
  Responsive text size
</div>

// ❌ AVOID - Desktop first
<div className="text-lg md:text-base sm:text-sm">
  Wrong order (confusing)
</div>
```

### Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## 🎨 Consistency with Design System

When using DSFR components:

1. **Respect component variants**: Use `priority`, `size`, `state` props provided
2. **Don't override DSFR styles**: Use DSFR styling props instead of custom classes
3. **Combine thoughtfully**: Mix DSFR + Tailwind for layout control

```typescript
// ✅ CORRECT
<Button
  priority="primary" // Use component prop
  size="large"
  linkProps={routes.home().link}
>
  Go Home
</Button>

// ❌ AVOID
<Button className="px-8 py-4 text-xl">
  {/* Don't try to override DSFR sizing */}
</Button>
```

---

## 🔗 Related Patterns

- **Component Patterns** → [02-component-patterns.md](./02-component-patterns.md)
- **Architecture Overview** → [00-overview.md](./00-overview.md)

---

**Done**: All pattern files are complete. See [00-overview.md](./00-overview.md) for architecture overview.
