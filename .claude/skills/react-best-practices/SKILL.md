---
name: react-best-practices
description: React best practices for Benefriches (Vite + Redux). Covers code quality, component patterns, state management, and performance. Use when writing, reviewing, or refactoring React components, debugging slow interactions, or implementing Redux patterns.
---

# React Best Practices for Benefriches

> **Guidelines for React 19+ SPA with Vite + Redux**
>
> **Philosophy**: Code quality and maintainability first, performance optimization when measured
>
> **Adapted for**: Client-side rendering with Redux + Clean Architecture

---

## When to Apply This Skill

Use these practices when:

- Writing new React components
- Designing component architecture
- Implementing Redux patterns (reducers, selectors, thunks)
- Reviewing code for quality or performance issues
- Refactoring existing React code
- Debugging slow interactions

---

## Categories by Priority

| Priority | Category                 | Focus Area                            |
| -------- | ------------------------ | ------------------------------------- |
| 🔴       | **Code Quality**         | Readability, maintainability, SRP     |
| 🟠       | **Component Patterns**   | Container/Presentational, composition |
| 🟡       | **State Management**     | Local-first, derived state, colocation|
| 🟢       | **Anti-Patterns**        | Common mistakes to avoid              |
| 🔵       | **Bundle Optimization**  | Lazy loading, dynamic imports         |
| 🟣       | **Async Patterns**       | Parallel fetching, Suspense           |
| 🟤       | **Form Handling**        | react-hook-form patterns, DSFR        |
| ⬜       | **Accessibility**        | Keyboard nav, ARIA, focus management  |
| ⬛       | **Error Boundaries**     | Catch errors, prevent app crashes     |
| ⚫       | **Performance (Measure!)**| Only when needed, after profiling    |
| ⚪       | **React 19 & Future**    | React Compiler, new APIs              |

---

## 🔴 CRITICAL: Code Quality & Readability

| Practice                     | Description                                      |
| ---------------------------- | ------------------------------------------------ |
| Single Responsibility        | Each component does ONE thing well               |
| Component Size               | Keep components focused (< 200 lines)            |
| Descriptive Naming           | Clear names for components, hooks, props         |
| Props Destructuring          | Improve readability at function signature        |
| Explicit over Implicit       | Avoid magic values, use named constants          |
| Extract Custom Hooks         | Share logic via hooks, not copy-paste            |

### Benefriches Examples

- ✅ **ViewData pattern**: Single selector per container
- ✅ **Container/Presentational**: Separation in `views/` folders
- ✅ **Clean Architecture**: Core has no framework dependencies

---

## 🟠 HIGH: Component Design Patterns

| Pattern                  | When to Use                                  |
| ------------------------ | -------------------------------------------- |
| Container/Presentational | Redux connection in `index.tsx`, pure render |
| Component Composition    | Prefer over deep prop drilling               |
| Children Pattern         | Flexible content injection                   |
| Custom Hooks             | Extract reusable stateful logic              |
| Render Props (rare)      | Dynamic child rendering needs                |

### Benefriches Already Follows

- ✅ Container components use single `selectViewData` selector
- ✅ Presentational components receive all data via props
- ✅ Gateway pattern for external services

---

## 🟡 HIGH: State Management Principles

| Principle             | Description                                        |
| --------------------- | -------------------------------------------------- |
| Local State First     | Don't lift state unless truly shared               |
| Derived State         | Compute in selectors/render, don't store           |
| Colocate State        | Keep state close to where it's used                |
| Single Source         | One authoritative location per piece of data       |
| Immutability          | Always use `toSorted()`, spread, not `sort()`      |

### Redux Specifics

- ✅ Derived values in selectors (not duplicated in state)
- ✅ Functional updates in reducers
- ✅ Single ViewData selector per container

---

## 🟢 HIGH: Anti-Patterns to Avoid

| Anti-Pattern              | Problem                    | Solution                         |
| ------------------------- | -------------------------- | -------------------------------- |
| Massive Components        | Hard to test/maintain      | Split into focused pieces        |
| Prop Drilling             | Coupling, maintenance      | Use composition or context       |
| Array Index as Key        | Bugs with reordering       | Use stable IDs                   |
| Mutating State            | React won't re-render      | Immutable updates (`toSorted()`) |
| Over-Engineering          | Complexity without benefit | YAGNI - only what's needed       |
| Premature Optimization    | Wasted effort              | Measure first, then optimize     |
| Effect for Derived State  | Sync issues, extra renders | Compute during render            |

---

## 🔵 MEDIUM: Bundle Optimization

| Practice                     | Impact                  | When to Apply                       |
| ---------------------------- | ----------------------- | ----------------------------------- |
| Avoid Barrel File Imports    | 200-800ms reduction     | Use direct `@/` path imports        |
| Dynamic Imports (`lazy`)     | Reduce initial bundle   | Maps, charts, modals, forms         |
| Defer Non-Critical Libraries | Faster initial load     | Analytics, error tracking           |
| Preload on User Intent       | Reduce perceived delay  | Hover/focus before heavy action     |

---

## 🟣 MEDIUM: Async Patterns

| Practice                   | Impact              | When to Apply                    |
| -------------------------- | ------------------- | -------------------------------- |
| `Promise.all()` Parallel   | 2-10x improvement   | Independent async operations     |
| Defer Await Until Needed   | Skip wasted work    | Conditional logic before fetch   |
| Strategic Suspense         | Progressive loading | Wrap data-dependent sections     |
| Conditional Module Loading | On-demand bundles   | Charts, PDFs, advanced features  |

---

## 🟤 MEDIUM: Form Handling

| Practice                     | Description                                      |
| ---------------------------- | ------------------------------------------------ |
| react-hook-form              | Preferred library for all forms                  |
| DSFR Components              | Use @codegouvfr/react-dsfr for inputs            |
| Validation in Schema         | Use react-hook-form validation rules             |
| Error State Display          | Map formState.errors to DSFR error states        |
| Controlled Inputs            | Prefer controlled via `register()`               |

### Benefriches Form Pattern

```typescript
// Standard form component pattern
import { useForm } from "react-hook-form";
import { Input } from "@codegouvfr/react-dsfr/Input";

type FormValues = { name: string; email: string };

function MyForm({ onSubmit }: { onSubmit: (data: FormValues) => void }) {
  const { register, handleSubmit, formState } = useForm<FormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        state={formState.errors.email ? "error" : "default"}
        stateRelatedMessage={formState.errors.email?.message}
        nativeInputProps={{
          ...register("email", {
            required: "Email requis",
            pattern: { value: /^[^@]+@[^@]+$/, message: "Email invalide" },
          }),
        }}
      />
    </form>
  );
}
```

### Reference Files

- `src/features/onboarding/views/pages/identity/CreateUserForm/CreateUserForm.tsx`
- `src/features/create-site/views/custom/naming/SiteNameAndDescription.tsx`

---

## ⬜ MEDIUM: Accessibility

| Practice               | Description                                       |
| ---------------------- | ------------------------------------------------- |
| Semantic HTML          | Use appropriate elements (button, nav, main)      |
| ARIA Labels            | Add when semantic HTML isn't sufficient           |
| Keyboard Navigation    | Support Tab, Enter, Escape for interactive UI     |
| Focus Management       | Manage focus for modals and dynamic content       |
| Icon Accessibility     | Use `aria-hidden="true"` for decorative icons     |

### Keyboard Navigation Example

```typescript
// Handle Escape key in modals/dropdowns
function Modal({ onClose, children }) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return <div role="dialog" aria-modal="true">{children}</div>;
}
```

### Icon Accessibility

```typescript
// Decorative icons should be hidden from screen readers
<i className="fr-icon-check-line" aria-hidden="true" />

// Informative icons need labels
<button aria-label="Fermer">
  <i className="fr-icon-close-line" aria-hidden="true" />
</button>
```

### DSFR Provides Accessibility

DSFR components handle most accessibility concerns. Rely on:
- Built-in ARIA attributes in DSFR components
- Proper focus management in modals via `createModal()`
- Keyboard support in form controls

---

## ⬛ CONSIDER: Error Boundaries

Error boundaries catch JavaScript errors in component trees and display fallback UI.

| When to Use               | Example                                  |
| ------------------------- | ---------------------------------------- |
| Async data sections       | Wrap data-fetching components            |
| Third-party components    | Isolate potentially failing libraries    |
| Feature boundaries        | Prevent one feature from crashing app    |

### Basic Pattern

```typescript
import { Component, ErrorInfo, ReactNode } from "react";

type Props = { children: ReactNode; fallback: ReactNode };
type State = { hasError: boolean };

class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Error boundary caught:", error, info);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<p>Une erreur est survenue</p>}>
  <RiskyComponent />
</ErrorBoundary>
```

**Note**: Not yet implemented in Benefriches. Consider adding for critical sections.

---

## ⚫ LOW: Performance Optimization (Measure First!)

**CRITICAL**: Only apply these when you've **measured** a performance problem.

### Memoization: Usually NOT Needed

**Default stance**: Don't memoize. It adds complexity without benefit in most cases.

| When NOT to Memoize                | Why                                   |
| ---------------------------------- | ------------------------------------- |
| Props change every render          | Memoization is wasted                 |
| Component is already fast          | No perceptible benefit                |
| Simple components                  | Overhead may exceed savings           |
| Object/array literals as props     | Creates new reference each render     |

| When to Consider Memoization       | Requirements                          |
| ---------------------------------- | ------------------------------------- |
| Measured lag during re-renders     | Profile first!                        |
| Expensive rendering (long lists)   | And props rarely change               |
| Heavy computations in render       | And dependencies stable               |

### Better Alternatives to Memoization

1. **Move state down**: Keep state in component that needs it
2. **Lift content up**: Use children pattern for static content
3. **Component composition**: Split into smaller, focused pieces
4. **Selector optimization**: Derive booleans in selectors

### React Compiler (Coming Soon)

React Compiler will auto-memoize, making manual `useMemo`, `useCallback`, and `React.memo` largely redundant. Avoid adding new memoization unless solving a measured problem.

---

## ⚪ React 19 & Future

| Feature              | Impact                                        |
| -------------------- | --------------------------------------------- |
| React Compiler       | Auto-memoization (manual memo becomes legacy) |
| `useTransition`      | Non-blocking UI updates for heavy operations  |
| `use()` hook         | Simplified async data fetching                |

---

## Benefriches-Specific Integration

### Redux Patterns

**Already following best practices:**

- ✅ Derived state in selectors (not duplicated)
- ✅ Single ViewData selector per container
- ✅ Functional updates in reducers
- ✅ `toSorted()` for immutability

**Keep doing:**

- 🟡 **Single selector per container** returning composed ViewData
- 🔴 **Parallel async in thunks** with `Promise.all()`
- 🟢 **Passive action names** (events: `stepCompleted`, not commands)

### Clean Architecture

- **Core layer**: Pure functions, no framework deps
- **Infrastructure layer**: Gateways with InMemory mocks for tests
- **Views layer**: Container/Presentational separation

### Path Aliases

- 🔴 **Use `@/` for imports** - avoid barrel files
- Example: `import { X } from '@/features/create-site/core/createSite.reducer'`

---

## See Also

- **Code examples**: [examples.md](examples.md) in this skill directory
- **Web app guide**: `apps/web/CLAUDE.md`
- **Monorepo guide**: Root `CLAUDE.md`

---

**END OF QUICK REFERENCE** - For code examples and detailed patterns, see [examples.md](examples.md).
