/**
 * The run plan of a monkey agent run: a persona, a site, a project and a few quirks, drawn
 * from a seed. The same seed always draws the same plan, so a run can be replayed with
 * MONKEY_SEED. The plan is a nudge injected into the prompt, not a script.
 */

import { randomInt } from "node:crypto";

import { siteNatureSchema, type SiteNature } from "shared";

export const PERSONAS = ["novice", "expert", "saboteur", "returning-user"] as const;
export const PROJECT_TYPES = ["URBAN_PROJECT", "PHOTOVOLTAIC_POWER_PLANT"] as const;
export const CREATION_MODES = ["express", "custom"] as const;
export const QUIRKS = [
  "back-button-mid-wizard",
  "refresh-mid-wizard",
  "extreme-values",
  "double-submit",
  "duplicate-project",
  "edit-after-creation",
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
    'a first-time user who doesn\'t know the vocabulary: reads every help text, hesitates, picks "Je ne sais pas" when it is offered and goes back to change answers',
  expert:
    "an experienced land-development project manager in a hurry: fills in precise, realistic figures, skips help texts and moves fast",
  saboteur:
    "a user who tries to break the app: empty or huge values, special characters and very long names, unusual orders of actions",
  "returning-user":
    'a user coming back to existing work: before creating anything, looks at what is already in "Mes évaluations", then resumes, edits or deletes it, and checks that what was saved is what is shown',
};

const SITE_NATURE_LABELS: Record<SiteNature, string> = {
  FRICHE: 'a friche (answer "Oui" to "Le site est-il une friche ?")',
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
  "back-button-mid-wizard":
    'in the middle of a wizard, use the browser back button (not the "Retour" button), then go forward again and check your answers are still there',
  "refresh-mid-wizard":
    "in the middle of a wizard, reload the page and check what is kept and what is lost",
  "extreme-values":
    "enter extreme values: 0, negative numbers, decimals, huge surfaces (1 000 000 000 m²), more than the site surface, very long texts",
  "double-submit":
    "click a submit or validate button twice in a row, quickly, and check nothing is created or saved twice",
  "duplicate-project":
    'duplicate a project you created ("Évaluer une variante du projet") and compare the copy with the original',
  "edit-after-creation":
    'after creating a site or a project, edit it ("Modifier les caractéristiques…") and check the new values are saved and shown everywhere, impacts included',
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
