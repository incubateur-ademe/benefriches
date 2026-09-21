# Onboarding flows

> **Purpose**: Explain how a newly signed-up user is introduced to Bénéfriches: the shared
> signup hand-off, the new step-shell flow, the legacy compatibility-evaluation flow, their
> variants and exits, and the automated coverage that protects them. Read this before changing
> `apps/web/src/features/onboarding/views/pages/`, onboarding entry-point CTAs, or the
> `onBoarding*` routes in `apps/web/src/app/router.ts`.

## Overview

There are currently **two live onboarding flows** after signup:

- The **new step-shell flow** is used by the generic homepage/header entry points and the
  impacts-evaluation entry point. It contains **welcome → methodology → testimonials**.
- The **legacy flow** is still used by the compatibility-evaluation (`evaluation-mutabilite`)
  entry point. It contains **when to use → when not to use → how it works**.

Both flows are protected by `RequireAuthenticatedUser`. An unauthenticated visitor who follows
an onboarding CTA is first sent to `/acceder-a-benefriches`, then to the identity/signup form.
The originally requested onboarding URL is carried in `redirectTo`, so successful signup returns
the user to the correct flow with its `fonctionnalite` query parameter intact.

The project-creation introduction at `/creer-projet/introduction` is a separate screen and is not
part of either signup onboarding flow. See
[Project creation after a compatibility evaluation](#project-creation-after-a-compatibility-evaluation).

## Routes

All signup onboarding routes live under `/premiers-pas` and are defined in
`apps/web/src/app/router.ts`.

| Route name                  | Path                                              | Purpose                                                       |
| --------------------------- | ------------------------------------------------- | ------------------------------------------------------------- |
| `onBoardingIdentity`        | `/premiers-pas/identite`                          | Public identity/signup form; accepts an optional `redirectTo` |
| `onBoardingWelcome`         | `/premiers-pas/bienvenue`                         | New flow, step 1                                              |
| `onBoardingMethodology`     | `/premiers-pas/methodologie`                      | New flow, step 2                                              |
| `onBoardingTestimonials`    | `/premiers-pas/temoignages`                       | New flow, step 3                                              |
| `onBoardingWhenToUse`       | `/premiers-pas/quand-utiliser-benefriches`        | Legacy flow, step 1                                           |
| `onBoardingWhenNotToUse`    | `/premiers-pas/quand-ne-pas-utiliser-benefriches` | Legacy flow, step 2                                           |
| `onBoardingIntroductionHow` | `/premiers-pas/comment-ca-marche`                 | Legacy flow, step 3                                           |

The six flow routes accept an optional `fonctionnalite` query parameter. The identity route does
not interpret that parameter directly; it receives the complete post-signup destination through
`redirectTo`.

The protected routes are rendered by `apps/web/src/features/FeaturesApp.tsx`. The identity form,
access page, and authentication callback are public routes rendered by
`apps/web/src/features/public-pages/PublicApp.tsx`.

## Variants

The supported values are defined once by `onboardingVariantSchema` in
`views/pages/step-shell/onboardingVariant.ts`:

```ts
export const onboardingVariantSchema = z.enum([
  "evaluation-mutabilite",
  "evaluation-impacts",
]);
```

`apps/web/src/app/router.ts` builds the `fonctionnalite` serializer from this schema. Both flow
implementations pass the value to their next and previous routes.

The variant has different effects in each flow:

- In the **new flow**, the page content is shared. The variant is preserved between steps and
  determines the final destination.
- In the **legacy flow**, the variant selects some content and the final destination. The current
  application entry point for this flow always supplies `evaluation-mutabilite`, although the
  components retain behavior for `evaluation-impacts` and for no variant.

## Entry points and signup hand-off

### Generic homepage hero

`HomeHeroSection` links to `onBoardingWelcome()` without a variant. For an unauthenticated user:

1. `RequireAuthenticatedUser` redirects to `/acceder-a-benefriches?redirectTo=<welcome URL>`.
2. “Créer un compte” opens `/premiers-pas/identite` with that same `redirectTo`.
3. Successful signup assigns `window.location.href` to the requested welcome URL.
4. The new flow exits to `/mes-evaluations` because no variant is present.

### Header “Accéder à Bénéfriches”

The public header links directly to `/acceder-a-benefriches` without a `redirectTo`. The access
page gives signup its own default destination, `onBoardingWelcome()` without a variant, so this
entry point also uses the new flow and exits to `/mes-evaluations`.

Login has a different default: an existing user is sent directly to `/mes-evaluations` and does
not enter onboarding unless the access page received an explicit `redirectTo`.

### Impacts-evaluation CTA

`AccessBenefrichesButton` links to
`onBoardingWelcome({ fonctionnalite: "evaluation-impacts" })`. The protected-route redirect and
signup hand-off preserve that complete URL. The user completes the new flow, then “Commencer”
opens the site-creation form with `evaluationMode=impacts`.

### Compatibility-evaluation CTA

`AccessMutafrichesButton` links to
`onBoardingWhenToUse({ fonctionnalite: "evaluation-mutabilite" })`. After the same authentication
and signup hand-off, the user completes the legacy flow, then “C'est parti” opens
`/evaluer-compatibilite-friche`.

### Direct identity/signup route

`OnBoardingIdentityPage` follows an explicit `redirectTo` when one is present. If the identity
route is opened directly with no redirect, successful signup falls back to the new welcome step
with `fonctionnalite=evaluation-impacts`; the new flow therefore exits to the impacts site form.

## New step-shell flow

The pages are:

- `welcome/OnboardingWelcomePage.tsx`
- `methodology/OnboardingMethodologyPage.tsx`
- `testimonials/OnboardingTestimonialsPage.tsx`

Each page passes its step key and current variant to `OnboardingStepShell`. The shell composes:

- `OnboardingStepProgress`, exposed as a three-step `progressbar`;
- `OnboardingSpeechBubble`, which contains the step-specific content and Mintsa avatar;
- an optional area below the bubble (used for `TestimoniesCarousel`);
- the sticky `OnboardingPageLayout` bottom bar with “Retour” and “Suivant”/“Commencer”.

The welcome heading uses `selectCurrentUserFullName`, so a signed-up user sees their actual first
and last name. When Crisp is enabled, its “Contacter Mintsa” button dispatches
`onboardingWelcomeHelpRequested` to open the support chat.

The methodology step's “cette notice” button opens the same **Questions fréquentes** DSFR modal
as the site header. It does this through the shared dialog id
`fr-dialog-about-impacts-header`; the header must be mounted for that modal to be available.

The testimonials step reuses the shared `TestimoniesCarousel`, positioned below the speech
bubble.

### Navigation source of truth

`views/pages/step-shell/onboardingSteps.ts` owns the ordered step definition:

```ts
const onboardingSteps = [
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

`getOnboardingStepInfo(stepKey, variant)` derives the step number, total, previous link, forward
label, and forward link. It preserves `fonctionnalite` between steps. On the final step,
`getFlowExitLink` resolves the destination:

| Variant                 | Destination                                        |
| ----------------------- | -------------------------------------------------- |
| `evaluation-impacts`    | `routes.createSite({ evaluationMode: "impacts" })` |
| `evaluation-mutabilite` | `routes.evaluateReconversionCompatibility()`       |
| No variant              | `routes.myEvaluations()`                           |

To add or reorder a new-flow step, update `onboardingSteps`, add or update its page component,
and extend the navigation unit tests and E2E page object.

## Legacy compatibility-evaluation flow

The legacy pages remain intentionally active:

- `when-to-use/OnboardingWhenToUsePage.tsx`
- `when-not-to-use/OnboardingWhenNotToUsePage.tsx`
- `how-it-works/HowItWorksPage.tsx` and `HowItWorksStep.tsx`

Unlike the new flow, these pages define their navigation locally rather than through a shared
step registry. The first two pages offer “Passer l'intro”; the final page offers “C'est parti”.
For `evaluation-mutabilite`, both actions exit to `evaluateReconversionCompatibility`.

The pages use `OnboardingPageLayout` and import `UseCaseList` and `UseItem` from
`features/create-project/views/onboarding-from-compatibility-evaluation/`. Those components are
also used by the separate project-creation introduction described below.

The legacy files and routes must not be removed while `AccessMutafrichesButton` targets
`onBoardingWhenToUse`.

## Project creation after a compatibility evaluation

`ProjectCreationFromCompatibilityEvaluationOnboarding.tsx` is served at
`/creer-projet/introduction`. It introduces project creation for an already identified site and
continues to `/creer-projet`; it does not use either signup onboarding flow or
`OnboardingStepShell`.

It shares `UseCaseList` and `UseItem` with the legacy flow. That shared usage is why those
components live under `features/create-project/views/onboarding-from-compatibility-evaluation/`.

## Automated coverage

### Web unit/component tests

- `step-shell/onboardingSteps.spec.ts` verifies all new-flow previous/forward links, progress
  metadata, variant propagation, and final destinations.
- `welcome/OnboardingWelcomePage.spec.tsx` verifies the real user's name in the heading and the
  support-chat action when Crisp is enabled.
- `methodology/OnboardingMethodologyPage.spec.tsx` mounts `AppHeader` with the page and verifies
  that “cette notice” targets the **Questions fréquentes** dialog.

### End-to-end tests

`apps/e2e-tests/tests/onboarding/onboarding.spec.ts` covers three real signup journeys through
the **new flow**:

- homepage “Commencer” → new flow → `/mes-evaluations`;
- header “Accéder à Bénéfriches” → new flow, including back navigation → `/mes-evaluations`;
- impacts CTA → new flow, including a reload that proves the variant survives → impacts site
  creation.

`apps/e2e-tests/tests/onboarding/onboarding-compatibility-legacy-flow.spec.ts` separately covers
the compatibility CTA → signup → **legacy flow** → compatibility analysis.

The shared fixtures are in `apps/e2e-tests/tests/onboarding/fixtures.ts`:

- `OnboardingStepPage` drives and asserts the new welcome/methodology/testimonials flow with
  per-step helpers (`completeWelcomeStep`, `completeMethodologyStep`, and
  `completeTestimonialsStep`).
- `OnboardingLegacyFlowPage` drives and asserts the three legacy pages and their variant.
- `SignupPage`, `HomePage`, and `AccessBenefrichesPage` cover the real public entry and signup
  hand-off; the tests do not seed the user through the API.

When changing onboarding behavior, keep the flows in separate E2E specs so it remains explicit
which entry point uses which implementation.
