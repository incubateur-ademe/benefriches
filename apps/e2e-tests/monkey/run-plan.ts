/**
 * The run plan of a monkey agent run: a persona, a site, a project and a few quirks, drawn
 * from a seed. The same seed always draws the same plan, so a run can be replayed with
 * MONKEY_SEED. The plan is a nudge injected into the prompt, not a script.
 */

import { randomInt } from "node:crypto";

import { siteNatureSchema, type SiteNature } from "shared";

export const PERSONAS = [
  "novice",
  "expert",
  "saboteur",
  "returning-user",
  "keyboard-only",
  "mobile",
] as const;
export const PROJECT_TYPES = ["URBAN_PROJECT", "PHOTOVOLTAIC_POWER_PLANT"] as const;
export const CREATION_MODES = ["express", "custom"] as const;
export const QUIRKS = [
  "extreme-values",
  "double-submit",
  "duplicate-project",
  "edit-after-creation",
  "change-earlier-answer",
  "cross-page-figures",
  "url-tampering",
  "impacts-exploration",
  "input-formats",
  "invalid-dates",
  "address-search-edge-cases",
  "delete-cascades",
] as const;

export type Persona = (typeof PERSONAS)[number];
export type ProjectType = (typeof PROJECT_TYPES)[number];
export type CreationMode = (typeof CREATION_MODES)[number];
export type Quirk = (typeof QUIRKS)[number];

export type RunPlan = {
  seed: number;
  persona: Persona;
  siteNature: SiteNature;
  projectType: ProjectType;
  creationMode: CreationMode;
  quirks: Quirk[];
};

// Seeds are unsigned 32-bit integers: the state of the mulberry32 generator.
export const MAX_SEED = 2 ** 32 - 1;

export function createSeed(): number {
  return randomInt(0, MAX_SEED);
}

/** mulberry32: a small deterministic generator of floats in [0, 1). */
function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(random: () => number, values: readonly T[]): T {
  const value = values[Math.floor(random() * values.length)];
  if (value === undefined) throw new Error("Cannot pick from an empty list");
  return value;
}

/** 2 or 3 distinct quirks, in the order of QUIRKS. */
function pickQuirks(random: () => number): Quirk[] {
  const count = random() < 0.5 ? 2 : 3;
  const remaining: Quirk[] = [...QUIRKS];
  const picked = new Set<Quirk>();
  while (picked.size < count) {
    const index = Math.floor(random() * remaining.length);
    const [quirk] = remaining.splice(index, 1);
    if (quirk !== undefined) picked.add(quirk);
  }
  return QUIRKS.filter((quirk) => picked.has(quirk));
}

export function drawRunPlan(seed: number): RunPlan {
  const random = createRandom(seed);
  return {
    seed,
    persona: pick(random, PERSONAS),
    siteNature: pick(random, siteNatureSchema.options),
    projectType: pick(random, PROJECT_TYPES),
    creationMode: pick(random, CREATION_MODES),
    quirks: pickQuirks(random),
  };
}

const PERSONA_DESCRIPTIONS: Record<Persona, string> = {
  novice:
    "a first-time user who doesn't know the vocabulary: reads every help text, hesitates, picks \"Ne sait pas\" when it is offered and goes back to change answers. Opens every informational modal it meets and checks that each one opens, closes with its close button (X) and with Escape, shows non-empty French text, has links that stay on the app's domain, and gives the focus back to the element that opened it",
  expert:
    "an experienced land-development project manager in a hurry: fills in precise, realistic figures, skips help texts and moves fast",
  saboteur:
    'a user who tries to break the app: empty or huge values, special characters and very long names, unusual orders of actions. Also a mad clicker, going further than double-submit: clicks "Retour" and "Suivant" many times in a row, toggles radio buttons back and forth quickly, and presses buttons while a page is still loading, especially the impacts page',
  "returning-user":
    'a user who works in several sittings: leaves a site or project half-done or finished, goes elsewhere in the app, comes back to it from "Mes évaluations" to resume, edit or delete it, and checks that what was saved is what is shown',
  "keyboard-only":
    "a user who never touches the mouse: completes wizards and uses modals with Tab, Shift+Tab, Enter, Space and Escape only, no clicks, and checks that the focus order is logical and the focus is always visible",
  mobile:
    "a user on a phone: the browser is a narrow phone-sized window. Looks for layout and usability bugs: horizontal scrolling, overlapping or cut-off text, buttons out of reach, tables or charts that can't be used, menus that don't open",
};

const SITE_NATURE_LABELS: Record<SiteNature, string> = {
  FRICHE: 'a friche (answer "Oui" to "Votre site est-il une friche ?")',
  AGRICULTURAL_OPERATION: 'an agricultural operation ("Exploitation agricole")',
  NATURAL_AREA: 'a natural area ("Espace naturel")',
  URBAN_ZONE: 'an urban zone ("Zone urbaine")',
};

const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  URBAN_PROJECT: 'an urban project ("Autre projet d\'aménagement")',
  PHOTOVOLTAIC_POWER_PLANT:
    'a photovoltaic power plant ("Centrale d\'énergie renouvelable", then photovoltaic)',
};

const CREATION_MODE_LABELS: Record<CreationMode, string> = {
  express: 'express: few or no data ("J\'ai pas ou peu de données"), Bénéfriches fills in the rest',
  custom: 'custom: precise data ("J\'ai des données précises"), every step of the wizard',
};

const QUIRK_DESCRIPTIONS: Record<Quirk, string> = {
  "extreme-values":
    "enter extreme values: 0, negative numbers, decimals, huge surfaces (1 000 000 000 m²), more than the site surface, very long texts",
  "double-submit":
    "click a submit or validate button twice in a row, quickly, and check nothing is created or saved twice",
  "duplicate-project":
    'duplicate a project you created ("Évaluer une variante du projet") and compare the copy with the original',
  "edit-after-creation":
    'after creating a site or a project, edit it ("Modifier le site" or "Modifier les caractéristiques du projet" in the page menu) and check the new values are saved and shown everywhere, impacts included',
  "change-earlier-answer":
    'late in a wizard, go back several steps with "Retour", change an earlier answer (the site surface, the soils, the project type or the buildings), then go forward again and check the later steps and the summary reflect the change: no stale value, no total that no longer adds up',
  "cross-page-figures":
    "check that the same figure (site surface, soils, costs, revenues, buildings) is the same on every page that shows it: the wizard summary, the site page, the project page, the impacts page and the exports or comparisons",
  "url-tampering":
    'from "Mes évaluations", open a site (/sites/<id>/caracteristiques) and a project (/mes-projets/<id>/...), then edit the URL: a malformed id, an unknown id, a later wizard step opened directly (/creer-site-foncier/... or /creer-projet with a later "etape"), and the URL of a site or project you deleted. Expect a clean "not found" page, never a crash or a server error',
  "impacts-exploration":
    "on the impacts page, open every tab, section, chart and detail modal, switch every option the page offers (views, time period), and check every figure is shown, consistent from one view to the other and explained",
  "input-formats":
    'type numbers in different formats: "1 000", "1000,5", "1000.5", "1e3", leading zeros, pasted text with spaces, then check what is saved and shown, and that soils still add up to the site surface',
  "invalid-dates":
    "in the project schedule (MM/YYYY), enter invalid or odd dates: month 00 or 13, an end before the start, a date far in the past or the future, a partial date, and check the wizard refuses them or handles them sensibly",
  "address-search-edge-cases":
    "in the site address search, try an address with accents, a postcode only, a town that exists in several departments, a typo, an overseas address, an empty search and a very long text, and check the chosen address is the one saved",
  "delete-cascades":
    'delete a site that has projects ("Supprimer le site") and a project ("Supprimer le projet"), then check "Mes évaluations", the site page and the old URLs: nothing deleted is still shown or reachable, and nothing else is gone',
};

/** The plan as a Markdown section of the prompt. */
export function formatRunPlan(plan: RunPlan): string {
  return [
    `Seed: ${plan.seed}`,
    "",
    `- Persona: **${plan.persona}**, ${PERSONA_DESCRIPTIONS[plan.persona]}.`,
    `- Site: ${SITE_NATURE_LABELS[plan.siteNature]}.`,
    `- Project: ${PROJECT_TYPE_LABELS[plan.projectType]}.`,
    `- Creation mode: ${CREATION_MODE_LABELS[plan.creationMode]}.`,
    "- Quirks to try along the way:",
    ...plan.quirks.map((quirk) => `  - ${quirk}: ${QUIRK_DESCRIPTIONS[quirk]}.`),
  ].join("\n");
}
