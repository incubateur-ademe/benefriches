# Onboarding Flow

> **Purpose**: Explain how a newly-signed-up user is walked through Bénéfriches' "premiers pas"
> (first steps) flow — the routes, the step-shell architecture that drives it, the per-CTA
> variants, and how it's tested. Read this before touching anything under
> `apps/web/src/features/onboarding/views/pages/` or `apps/web/src/app/router.ts`'s
> `onBoarding*` routes.

## What this covers

After a user signs up, they land on a 3-step guided introduction before reaching the tool
itself: **welcome → methodology → testimonials**. This is the only onboarding flow reachable
from signup. An older 3-page flow (when-to-use / when-not-to-use / how-it-works) existed
alongside it and has been fully retired — its routes, pages and CSS are deleted, and every
signup entry point now points at the new flow.

A separate, unrelated "introduction" screen exists for a different flow — see
[Not to be confused with](#not-to-be-confused-with-the-project-creation-introduction-screen)
below.

## Routes

All onboarding step routes live under `/premiers-pas` and are defined in `apps/web/src/app/router.ts`:

| Route name               | Path                         | Page component                                                             |
| ------------------------ | ---------------------------- | -------------------------------------------------------------------------- |
| `onBoardingIdentity`     | `/premiers-pas/identite`     | `onboarding/views/pages/identity/OnBoardingIdentityPage.tsx` (signup form) |
| `onBoardingWelcome`      | `/premiers-pas/bienvenue`    | `onboarding/views/pages/welcome/OnboardingWelcomePage.tsx`                 |
| `onBoardingMethodology`  | `/premiers-pas/methodologie` | `onboarding/views/pages/methodology/OnboardingMethodologyPage.tsx`         |
| `onBoardingTestimonials` | `/premiers-pas/temoignages`  | `onboarding/views/pages/testimonials/OnboardingTestimonialsPage.tsx`       |

Each of the three step routes accepts an optional `fonctionnalite` query param (serialized from
`OnboardingVariant`, see below) that is threaded through the whole flow.

The old routes/paths (`/premiers-pas/quand-utiliser-benefriches`,
`/premiers-pas/quand-ne-pas-utiliser-benefriches`, `/premiers-pas/comment-ca-marche`) and their
route names (`onBoardingWhenToUse`, `onBoardingWhenNotToUse`, `onBoardingIntroductionHow`) no
longer exist.

## The variant system (`evaluation-impacts` vs `evaluation-mutabilite`)

Bénéfriches has two "products" reachable from onboarding: evaluating the **impacts** of a
project, or evaluating the **mutability/compatibility** of a friche. Which one the user is
heading towards is captured by `OnboardingVariant`, defined in
`apps/web/src/features/onboarding/views/pages/step-shell/onboardingVariant.ts`:

```ts
export const onboardingVariantSchema = z.enum([
  "evaluation-mutabilite",
  "evaluation-impacts",
]);
export type OnboardingVariant = z.infer<typeof onboardingVariantSchema>;
```

This value travels as the `fonctionnalite` query param on every onboarding URL. It's optional —
a user can land on `/premiers-pas/bienvenue` with no variant at all (e.g. the generic
"Commencer" CTA on the homepage hero), in which case the flow falls back to a neutral ending
(`/mes-evaluations`).

The variant currently affects only **where the flow exits to** after the last step (see next
section) — the step content itself (welcome/methodology/testimonials copy) does not change per
variant.

## Step-shell architecture

The three step pages don't each hard-code their own navigation. Instead they all render
`OnboardingStepShell` (`step-shell/OnboardingStepShell.tsx`), passing a `step` key and the
current `variant`:

```tsx
<OnboardingStepShell
  step="welcome"
  variant={variant}
  htmlTitle="Bienvenue - Premiers pas"
>
  {/* step-specific content */}
</OnboardingStepShell>
```

`OnboardingStepShell` is purely presentational glue: it calls
`getOnboardingStepInfo(step, variant)` (in `step-shell/onboardingSteps.ts`) to get everything it
needs to render, then composes:

- `OnboardingStepProgress` — a `role="progressbar"` bar showing `stepNumber` / `totalSteps`.
- `OnboardingSpeechBubble` — the layout wrapper (placeholder avatar + bubble) around the page's
  `children`.
- `belowBubbleContent` — optional extra content rendered below the bubble (used by the
  testimonials step for the `TestimoniesCarousel`).
- A sticky bottom bar (`OnboardingPageLayout`) with a "Retour" button (only if there's a
  previous step) and a forward button labeled "Suivant" or "Commencer".

### `onboardingSteps.ts`: the single source of truth for step order and navigation

```ts
const onboardingSteps: OnboardingStepDefinition[] = [
  { key: "welcome", route: routes.onBoardingWelcome, forwardLabel: "Suivant" },
  {
    key: "methodology",
    route: routes.onBoardingMethodology,
    forwardLabel: "Suivant",
  },
  {
    key: "testimonials",
    route: routes.onBoardingTestimonials,
    forwardLabel: "Commencer",
  },
];
```

`getOnboardingStepInfo(stepKey, variant)` looks up the current step's index in this array and
derives:

- `stepNumber` / `totalSteps` — for the progress bar.
- `previousLinkProps` — a `type-route` `Link` to the previous step (carrying `fonctionnalite`
  forward), or `undefined` on the first step (welcome has no "Retour" button).
- `forwardLabel` — `"Suivant"` for welcome/methodology, `"Commencer"` for testimonials.
- `forwardLinkProps` — a `Link` to the next step (carrying `fonctionnalite` forward), or, on the
  last step, the **flow-exit destination** computed by `getFlowExitLink(variant)`:
  - `"evaluation-impacts"` → `routes.createSite({ evaluationMode: "impacts" })`
  - `"evaluation-mutabilite"` → `routes.evaluateReconversionCompatibility()`
  - no variant → `routes.myEvaluations()`

Adding a fourth step means adding one entry to the `onboardingSteps` array (order matters — it
drives both progress numbering and prev/next links) and creating a page component that renders
`OnboardingStepShell` with the new `step` key. Changing what a variant leads to at the end of the
flow means editing `getFlowExitLink`.

`onboardingSteps.spec.ts` unit-tests `getOnboardingStepInfo` for all three steps, with and
without a variant, asserting `previousLinkProps`/`forwardLinkProps` hrefs by comparing against
`routes.*(...).link.href`.

## Entry points into the flow

All roads into onboarding pass through `onBoardingIdentity` (the signup form) first, then land
on `onBoardingWelcome` with a variant baked in:

- **Homepage hero** (`public-pages/landings/.../HomeHeroSection.tsx`) — generic "Commencer" CTA,
  links straight to `routes.onBoardingWelcome()` with **no variant**.
- **`AccessBenefrichesButton`** (impacts CTA, e.g. "Évaluer les impacts de mon projet") — links to
  `routes.onBoardingWelcome({ fonctionnalite: "evaluation-impacts" })`.
- **`AccessMutafrichesButton`** (mutability CTA, e.g. "Analyser la compatibilité de ma friche") —
  links to `routes.onBoardingWelcome({ fonctionnalite: "evaluation-mutabilite" })`.
- **After signup** — `OnBoardingIdentityPage`'s `CreateUserForm` `onSuccess` callback pushes to
  `routes.onBoardingWelcome({ fonctionnalite: "evaluation-impacts" })` (unless the identity route
  carried a `redirectTo`, e.g. from a Mutafriches-driven signup, in which case it hard-redirects
  there instead and never enters the step-shell flow).

So in practice, the `fonctionnalite` variant a user started with (via the landing CTA) needs to
survive through signup (`onBoardingIdentity` → `redirectTo`/query params) to reach
`onBoardingWelcome` with the right value; the identity page itself always defaults to
`"evaluation-impacts"` when pushing onward without an explicit `redirectTo`.

## What was retired

This ticket deleted the old pre-step-shell 3-page flow entirely:

- `onboarding/views/pages/when-to-use/OnboardingWhenToUsePage.tsx` (deleted)
- `onboarding/views/pages/when-not-to-use/OnboardingWhenNotToUsePage.tsx` (deleted)
- `onboarding/views/pages/how-it-works/HowItWorksPage.tsx` + `HowItWorksStep.tsx` (deleted)
- Their CSS custom properties in `apps/web/src/main.css`
  (`--color-how-it-works-impacts-step-*` / `--color-how-it-works-mutabilite-step-*`) (deleted)
- The `OnboardingVariant` type used to live on `OnboardingWhenToUsePage.tsx`; it now lives on
  `step-shell/onboardingVariant.ts` as `onboardingVariantSchema`/`OnboardingVariant`, and the
  router's `onBoardingFeatureSerializer` is built from `onboardingVariantSchema.options` instead
  of a hand-maintained literal array.

Two small presentational components from the old `when-to-use/` page,
`UseCaseList` and `UseItem`, were **not** deleted — they were relocated (not part of onboarding
anymore) to
`apps/web/src/features/create-project/views/onboarding-from-compatibility-evaluation/`, since
that's their only remaining consumer.

## Not to be confused with: the project-creation introduction screen

`ProjectCreationFromCompatibilityEvaluationOnboarding.tsx`
(route `projectCreationOnboarding`, path `/creer-projet/introduction`) renders a single
"introduction" screen using those relocated `UseCaseList`/`UseItem` components. Despite the name
and the reused components, this is **not** part of the `/premiers-pas` signup flow described in
this document — it's a one-off intro shown when creating a project from a compatibility
evaluation result, and it doesn't use `OnboardingStepShell`.

## Testing

### Unit

`step-shell/onboardingSteps.spec.ts` covers `getOnboardingStepInfo` navigation/link logic
(previous/forward links, forward label, variant propagation, flow-exit resolution per variant) —
see [`onboardingSteps.ts`](#onboardingstepsts-the-single-source-of-truth-for-step-order-and-navigation)
above. There's also a component test for the welcome page
(`welcome/OnboardingWelcomePage.spec.tsx`).

### E2E

`apps/e2e-tests/tests/onboarding/onboarding.spec.ts` covers three full signup→onboarding flows
(main impacts CTA, mutability CTA from the homepage, mutability CTA from a compatibility
evaluation), each walking through all three steps and asserting the final landing page.

Navigation through the steps is driven by a dedicated page object,
`apps/e2e-tests/pages/OnboardingStepPage.ts`, wired into
`apps/e2e-tests/tests/onboarding/onboarding.fixtures.ts` as the `onboardingStepPage` fixture:

- `goto(step)` — navigates directly to a step (`"bienvenue" | "methodologie" | "temoignages"`).
- `expectCurrentStep(step)` — asserts the URL pathname matches `/premiers-pas/<step>`.
- `expectShellVisible()` / `expectHeadingVisible(name)` / `expectTextVisible(text)` — content
  assertions.
- `expectNoBackButton()` / `expectBackButtonVisible()` — asserts presence of "Retour".
- `clickForward(label)` / `clickBack()` — drives navigation via the "Suivant"/"Commencer" or
  "Retour" link.

Tests assert step transitions by step slug and heading text rather than by hard-coded old paths,
so they no longer encode the retired routes.
