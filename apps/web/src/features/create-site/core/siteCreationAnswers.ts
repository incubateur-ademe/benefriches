import type { SiteCreationStep } from "./createSite.reducer";
import type { SiteCreationData } from "./siteFoncier.types";

/**
 * Per-step answers map for the legacy custom site-creation flow (friche, agricultural
 * operation, natural area, and the first two urban-zone hand-off steps).
 *
 * Each entry is the literal `Partial<SiteCreationData>` delta the step's handler applies to
 * `state.siteData` when that step is completed — not the raw action payload. This keeps
 * `deriveSiteDataFromAnswers` a trivial ordered merge that is provably equal to the existing
 * `siteData` accumulator, without re-deriving computed fields (auto-filled soils
 * distributions, splitEvenly fallback, operator -> tenant copy, ...) a second time.
 *
 * Only steps that mutate `siteData` get an entry — purely navigational steps (introductions,
 * summaries, ...) never appear here.
 */
export type SiteCreationAnswers = Partial<Record<SiteCreationStep, Partial<SiteCreationData>>>;

/**
 * Folds the per-step answers map back into a `SiteCreationData`, starting from the flow's
 * initial site data and applying each recorded delta in insertion order — mirroring how the
 * real `siteData` accumulator is built up by the handlers, one step at a time.
 */
export const deriveSiteDataFromAnswers = (
  initialSiteData: SiteCreationData,
  answers: SiteCreationAnswers,
): SiteCreationData =>
  Object.values(answers).reduce<SiteCreationData>(
    (acc, delta) => (delta ? { ...acc, ...delta } : acc),
    initialSiteData,
  );
