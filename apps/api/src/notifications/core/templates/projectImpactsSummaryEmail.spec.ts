import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { BreakEvenHorizon, KeyImpactIndicatorData, ZanComplianceIndicator } from "shared";

import {
  buildProjectImpactsSummaryEmail,
  type BuildProjectImpactsSummaryEmailInput,
} from "./projectImpactsSummaryEmail";

const NBSP = " ";
const NNBSP = " ";

const project = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Habitation, école et commerce",
  siteName: "Ancienne carrière d’argile de Blajan",
  createdAt: new Date("2026-06-15T10:00:00.000Z"),
};
const unsubscribeUrl = "http://localhost:3001/emails/desinscription?token=t";
const impactsUrl = "http://localhost:3001/mes-projets/11111111-1111-4111-8111-111111111111/impacts";
const costBenefitUrl =
  "http://localhost:3001/mes-projets/11111111-1111-4111-8111-111111111111/analyse-cout-benefice";
const avoidedCostsUrl =
  "http://localhost:3001/mes-projets/11111111-1111-4111-8111-111111111111/analyse-couts-evites";

const favourableInput = {
  project,
  evaluationPeriodInYears: 50,
  zanCompliance: {
    name: "zanCompliance",
    isSuccess: true,
    value: { isAgriculturalFriche: false, artificializedSurfaceArea: 0 },
  },
  breakEvenHorizon: { status: "compensated", breakEvenYear: "2058", yearsToBreakEven: 26 },
  mainImpactIndicator: {
    name: "avoidedFricheCostsForLocalAuthority",
    isSuccess: true,
    value: {
      total: 1_087_355,
      details: [
        { impactName: "avoidedFricheMaintenanceAndSecuringCostsForOwner", amount: 1_087_355 },
      ],
    },
  },
  webappUrl: "http://localhost:3001",
  unsubscribeUrl,
} satisfies BuildProjectImpactsSummaryEmailInput;

const unfavourableInput = {
  ...favourableInput,
  zanCompliance: {
    name: "zanCompliance",
    isSuccess: false,
    value: {
      isAgriculturalFriche: false,
      permeableSurfaceAreaDifference: -1200,
      artificializedSurfaceArea: 1200,
    },
  },
  breakEvenHorizon: { status: "notCompensatedWithinPeriod", breakEvenYear: undefined },
  mainImpactIndicator: { name: "taxesIncomesImpact", isSuccess: false, value: -45_000 },
} satisfies BuildProjectImpactsSummaryEmailInput;

const footer = [
  "---",
  "Vous recevez cet e-mail car vous avez un compte Bénéfriches.",
  "Pour ne plus recevoir les e-mails d’accompagnement et de résultats d’impacts (votre compte reste actif) :",
  unsubscribeUrl,
].join("\n");

const hrefs = (html: string): (string | undefined)[] =>
  [...html.matchAll(/href="([^"]*)"/g)].map((match) => match[1]);

describe("buildProjectImpactsSummaryEmail", () => {
  it("names the site in the subject", () => {
    const email = buildProjectImpactsSummaryEmail(favourableInput);

    assert.strictEqual(
      email.subject,
      `Projet sur Ancienne carrière d’argile de Blajan${NBSP}: résultats de votre évaluation`,
    );
  });

  it("puts the site name on one line in the subject", () => {
    const email = buildProjectImpactsSummaryEmail({
      ...favourableInput,
      project: { ...project, siteName: "  Friche\n de   la gare " },
    });

    assert.strictEqual(
      email.subject,
      `Projet sur Friche de la gare${NBSP}: résultats de votre évaluation`,
    );
  });

  it("previews the comparison with keeping the site as is in the inbox", () => {
    const email = buildProjectImpactsSummaryEmail(favourableInput);

    const [, preheader] =
      /<div style="display:none;[^"]*">([^<]*?)(?:&zwnj;&nbsp;)*<\/div>/.exec(email.html) ?? [];
    assert.strictEqual(
      preheader,
      "Les impacts socio-économiques de votre projet, comparés au maintien du site en l’état.",
    );
  });

  it("renders the full plain-text alternative for a favourable evaluation", () => {
    const email = buildProjectImpactsSummaryEmail(favourableInput);

    assert.strictEqual(
      email.text,
      [
        "Voici les résultats de l’évaluation socio-économique du projet « Habitation, école et commerce » sur le site « Ancienne carrière d’argile de Blajan ».",
        "Évaluation réalisée le 15 juin 2026",
        [
          "Projet favorable au ZAN",
          "Le projet reconvertit un site en friche et limite la consommation d’espaces naturels, agricoles ou forestiers.",
          `Voir le détail des impacts : ${impactsUrl}`,
        ].join("\n"),
        [
          "En 26 ans",
          "Coût de l’opération compensé",
          "Les impacts socio-économiques compenseront le coût de l’opération en 2058.",
          `Voir l’analyse coût-bénéfice : ${costBenefitUrl}`,
        ].join("\n"),
        [
          `+1${NNBSP}087${NNBSP}355${NBSP}€`,
          "Gains pour la collectivité",
          "grâce à la reconversion de la friche",
          `Voir l’analyse des coûts évités : ${avoidedCostsUrl}`,
        ].join("\n"),
        footer,
      ].join("\n\n"),
    );
  });

  it("renders the full plain-text alternative for an unfavourable evaluation", () => {
    const email = buildProjectImpactsSummaryEmail(unfavourableInput);

    assert.strictEqual(
      email.text,
      [
        "Voici les résultats de l’évaluation socio-économique du projet « Habitation, école et commerce » sur le site « Ancienne carrière d’argile de Blajan ».",
        "Évaluation réalisée le 15 juin 2026",
        [
          "Projet défavorable au ZAN",
          "Le projet imperméabilise des sols.",
          `Voir le détail des impacts : ${impactsUrl}`,
        ].join("\n"),
        [
          "Sur 50 ans",
          "Coût de l’opération non compensé",
          "Les impacts socio-économiques ne compenseront pas le coût de l’opération.",
          `Voir l’analyse coût-bénéfice : ${costBenefitUrl}`,
        ].join("\n"),
        [
          `-45${NNBSP}000${NBSP}€`,
          "Pertes pour la collectivité",
          "à cause d’une perte de recettes fiscales",
          `Voir l’analyse des coûts évités : ${avoidedCostsUrl}`,
        ].join("\n"),
        footer,
      ].join("\n\n"),
    );
  });

  describe("ZAN card", () => {
    const cases: { label: string; zanCompliance: ZanComplianceIndicator; expected: string[] }[] = [
      {
        label: "an agricultural friche as unfavourable",
        zanCompliance: {
          name: "zanCompliance",
          isSuccess: false,
          value: {
            isAgriculturalFriche: true,
            permeableSurfaceAreaDifference: -500,
            artificializedSurfaceArea: 500,
          },
        },
        expected: [
          "Projet défavorable au ZAN",
          "Le projet imperméabilise des sols agricoles.",
          `Voir le détail des impacts : ${impactsUrl}`,
        ],
      },
      {
        label: "a non-friche site without permeability loss as unfavourable",
        zanCompliance: {
          name: "zanCompliance",
          isSuccess: false,
          value: { permeableSurfaceAreaDifference: undefined, artificializedSurfaceArea: 0 },
        },
        expected: [
          "Projet défavorable au ZAN",
          "Le projet consomme des espaces naturels, agricoles ou forestiers.",
          `Voir le détail des impacts : ${impactsUrl}`,
        ],
      },
    ];

    for (const { label, zanCompliance, expected } of cases) {
      it(`shows ${label}`, () => {
        const email = buildProjectImpactsSummaryEmail({ ...favourableInput, zanCompliance });

        assert.strictEqual(email.text.split("\n\n")[2], expected.join("\n"));
      });
    }
  });

  describe("break-even card", () => {
    const cases: {
      label: string;
      evaluationPeriodInYears: number;
      breakEvenHorizon: BreakEvenHorizon;
      expected: string[];
    }[] = [
      {
        label: "a balance positive from the first year",
        evaluationPeriodInYears: 50,
        breakEvenHorizon: { status: "positiveFromFirstYear", breakEvenYear: "2026" },
        expected: [
          "En 2026",
          "Bilan de l’opération positif",
          "La somme du bilan économique et des impacts socio-économiques est positive dès 2026.",
          `Voir l’analyse coût-bénéfice : ${costBenefitUrl}`,
        ],
      },
      {
        label: "a cost compensated after one year",
        evaluationPeriodInYears: 50,
        breakEvenHorizon: { status: "compensated", breakEvenYear: "2027", yearsToBreakEven: 1 },
        expected: [
          "En 1 an",
          "Coût de l’opération compensé",
          "Les impacts socio-économiques compenseront le coût de l’opération en 2027.",
          `Voir l’analyse coût-bénéfice : ${costBenefitUrl}`,
        ],
      },
      {
        label: "a break-even after a photovoltaic plant's 30 years",
        evaluationPeriodInYears: 30,
        breakEvenHorizon: { status: "notCompensatedWithinPeriod", breakEvenYear: "2061" },
        expected: [
          "Sur 30 ans",
          "Coût de l’opération non compensé",
          "Les impacts socio-économiques compenseront le coût de l’opération en 2061.",
          `Voir l’analyse coût-bénéfice : ${costBenefitUrl}`,
        ],
      },
    ];

    for (const { label, evaluationPeriodInYears, breakEvenHorizon, expected } of cases) {
      it(`shows ${label}`, () => {
        const email = buildProjectImpactsSummaryEmail({
          ...favourableInput,
          evaluationPeriodInYears,
          breakEvenHorizon,
        });

        assert.strictEqual(email.text.split("\n\n")[3], expected.join("\n"));
      });
    }
  });

  describe("main indicator card", () => {
    const avoidedCostsLink = `Voir l’analyse des coûts évités : ${avoidedCostsUrl}`;
    const cases: { label: string; indicator: KeyImpactIndicatorData; expected: string[] }[] = [
      {
        label: "the collectivité's gains from the avoided friche costs",
        indicator: {
          name: "avoidedFricheCostsForLocalAuthority",
          isSuccess: true,
          value: {
            total: 150_000,
            details: [
              { impactName: "avoidedFricheMaintenanceAndSecuringCostsForOwner", amount: 150_000 },
            ],
          },
        },
        expected: [
          `+150${NNBSP}000${NBSP}€`,
          "Gains pour la collectivité",
          "grâce à la reconversion de la friche",
          avoidedCostsLink,
        ],
      },
      {
        label: "the collectivité's losses from keeping the friche",
        indicator: {
          name: "avoidedFricheCostsForLocalAuthority",
          isSuccess: false,
          value: {
            total: -20_000,
            details: [
              { impactName: "avoidedFricheMaintenanceAndSecuringCostsForTenant", amount: -20_000 },
            ],
          },
        },
        expected: [
          `-20${NNBSP}000${NBSP}€`,
          "Pertes pour la collectivité",
          "à cause du maintien de la friche",
          avoidedCostsLink,
        ],
      },
      {
        label: "the collectivité's gains from additional tax income",
        indicator: { name: "taxesIncomesImpact", isSuccess: true, value: 50_000 },
        expected: [
          `+50${NNBSP}000${NBSP}€`,
          "Gains pour la collectivité",
          "grâce aux recettes fiscales supplémentaires",
          avoidedCostsLink,
        ],
      },
      {
        label: "the collectivité's losses from lost tax income",
        indicator: { name: "taxesIncomesImpact", isSuccess: false, value: -5_000 },
        expected: [
          `-5${NNBSP}000${NBSP}€`,
          "Pertes pour la collectivité",
          "à cause d’une perte de recettes fiscales",
          avoidedCostsLink,
        ],
      },
      {
        label: "the residents' potential gains from the property value increase",
        indicator: { name: "localPropertyValueIncrease", isSuccess: true, value: 250_000 },
        expected: [
          `+250${NNBSP}000${NBSP}€`,
          "Gains potentiels pour les riverains",
          "grâce à la hausse de valeur patrimoniale attendue par la reconversion de la friche",
          avoidedCostsLink,
        ],
      },
      {
        label: "full-time jobs going up",
        indicator: {
          name: "fullTimeJobs",
          isSuccess: true,
          value: { difference: 12, percentageEvolution: 25.4 },
        },
        expected: [
          "25%",
          "ETP en hausse",
          "12 emploi équivalent temps plein créé ou maintenu",
          avoidedCostsLink,
        ],
      },
      {
        label: "full-time jobs going down",
        indicator: {
          name: "fullTimeJobs",
          isSuccess: false,
          value: { difference: -3.5, percentageEvolution: -40.2 },
        },
        expected: [
          "-40%",
          "ETP en baisse",
          "-3,5 emploi équivalent temps plein perdu",
          avoidedCostsLink,
        ],
      },
      {
        label: "the households powered by renewable energy",
        indicator: { name: "householdsPoweredByRenewableEnergy", isSuccess: true, value: 1500 },
        expected: [
          `1${NNBSP}500`,
          "nouveaux foyers alimentés en EnR",
          "grâce à la production photovoltaïque annuelle",
          avoidedCostsLink,
        ],
      },
      {
        label: "avoided CO2eq emissions",
        indicator: { name: "avoidedCo2eqEmissions", isSuccess: true, value: 920 },
        expected: [
          `920${NBSP}t`,
          "Émissions de CO2eq évitées",
          "soit les émissions de 100 français pendant 1 an",
          avoidedCostsLink,
        ],
      },
      {
        label: "CO2eq emissions",
        indicator: { name: "avoidedCo2eqEmissions", isSuccess: false, value: -46 },
        expected: [
          `46${NBSP}t`,
          "Émissions de CO2eq",
          "soit les émissions de 5 français pendant 1 an",
          avoidedCostsLink,
        ],
      },
      {
        label: "more permeable soils",
        indicator: {
          name: "permeableSurfaceArea",
          isSuccess: true,
          value: { difference: 20_000, percentageEvolution: 82.4 },
        },
        expected: [
          `20${NNBSP}000 ㎡`,
          "Augmentation des sols perméables",
          "82% de sols désimperméabilisés",
          avoidedCostsLink,
        ],
      },
      {
        label: "fewer permeable soils",
        indicator: {
          name: "permeableSurfaceArea",
          isSuccess: false,
          value: { difference: -1200, percentageEvolution: -12.4 },
        },
        expected: [
          `-1${NNBSP}200 ㎡`,
          "Diminution des sols perméables",
          "-12% de sols imperméabilisés",
          avoidedCostsLink,
        ],
      },
      {
        label: "decontaminated soils",
        indicator: {
          name: "nonContaminatedSurfaceArea",
          isSuccess: true,
          value: {
            decontaminatedSurfaceArea: 3000,
            forecastContaminatedSurfaceArea: 1000,
            percentageEvolution: 30,
          },
        },
        expected: [
          `3${NNBSP}000 ㎡`,
          "de sols dépollués",
          `Les risques sanitaires seront réduits${NBSP}☢️`,
          avoidedCostsLink,
        ],
      },
      {
        label: "soils left contaminated",
        indicator: {
          name: "nonContaminatedSurfaceArea",
          isSuccess: false,
          value: {
            decontaminatedSurfaceArea: 0,
            forecastContaminatedSurfaceArea: 3000,
            percentageEvolution: 0,
          },
        },
        expected: [
          `3${NNBSP}000 ㎡`,
          "de sols non dépollués",
          `Les risques sanitaires seront encore présents${NBSP}☢️`,
          avoidedCostsLink,
        ],
      },
    ];

    for (const { label, indicator, expected } of cases) {
      it(`shows ${label}`, () => {
        const email = buildProjectImpactsSummaryEmail({
          ...favourableInput,
          mainImpactIndicator: indicator,
        });

        assert.strictEqual(email.text.split("\n\n")[4], expected.join("\n"));
      });
    }
  });

  it("omits the third card when no main indicator applies", () => {
    const email = buildProjectImpactsSummaryEmail({
      ...favourableInput,
      mainImpactIndicator: undefined,
    });

    assert.deepStrictEqual(email.text.split("\n\n"), [
      "Voici les résultats de l’évaluation socio-économique du projet « Habitation, école et commerce » sur le site « Ancienne carrière d’argile de Blajan ».",
      "Évaluation réalisée le 15 juin 2026",
      [
        "Projet favorable au ZAN",
        "Le projet reconvertit un site en friche et limite la consommation d’espaces naturels, agricoles ou forestiers.",
        `Voir le détail des impacts : ${impactsUrl}`,
      ].join("\n"),
      [
        "En 26 ans",
        "Coût de l’opération compensé",
        "Les impacts socio-économiques compenseront le coût de l’opération en 2058.",
        `Voir l’analyse coût-bénéfice : ${costBenefitUrl}`,
      ].join("\n"),
      footer,
    ]);
    assert.deepStrictEqual(hrefs(email.html), [impactsUrl, costBenefitUrl, unsubscribeUrl]);
  });

  describe("evaluation date", () => {
    const cases = [
      { createdAt: "2026-06-15T10:00:00.000Z", expected: "Évaluation réalisée le 15 juin 2026" },
      // 00:30 on 15 June in Paris (UTC+2).
      { createdAt: "2026-06-14T22:30:00.000Z", expected: "Évaluation réalisée le 15 juin 2026" },
      {
        createdAt: "2026-07-01T08:00:00.000Z",
        expected: "Évaluation réalisée le 1er juillet 2026",
      },
      // 00:30 on 1 January in Paris (UTC+1 in winter).
      {
        createdAt: "2025-12-31T23:30:00.000Z",
        expected: "Évaluation réalisée le 1er janvier 2026",
      },
    ];

    for (const { createdAt, expected } of cases) {
      it(`dates a project created at ${createdAt} in Paris time`, () => {
        const email = buildProjectImpactsSummaryEmail({
          ...favourableInput,
          project: { ...project, createdAt: new Date(createdAt) },
        });

        assert.strictEqual(email.text.split("\n\n")[1], expected);
      });
    }
  });

  it("links each card to its analysis and the footer to the unsubscribe page", () => {
    const email = buildProjectImpactsSummaryEmail(favourableInput);

    assert.deepStrictEqual(hrefs(email.html), [
      impactsUrl,
      costBenefitUrl,
      avoidedCostsUrl,
      unsubscribeUrl,
    ]);
  });

  it("builds the links from a webapp URL with a trailing slash", () => {
    const email = buildProjectImpactsSummaryEmail({
      ...favourableInput,
      webappUrl: "http://localhost:3001/",
    });

    assert.deepStrictEqual(hrefs(email.html), [
      impactsUrl,
      costBenefitUrl,
      avoidedCostsUrl,
      unsubscribeUrl,
    ]);
  });

  describe("contains no image", () => {
    for (const { label, input } of [
      { label: "favourable", input: favourableInput },
      { label: "unfavourable", input: unfavourableInput },
    ]) {
      it(`for a ${label} evaluation`, () => {
        const email = buildProjectImpactsSummaryEmail(input);

        assert.strictEqual(email.html.includes("<img"), false);
      });
    }
  });

  it("escapes the project and site names in the HTML", () => {
    const email = buildProjectImpactsSummaryEmail({
      ...favourableInput,
      project: { ...project, name: '<b>Lot "A" & B</b>', siteName: "Friche <i>" },
    });

    assert.ok(
      email.html.includes(
        "du projet « &lt;b&gt;Lot &quot;A&quot; &amp; B&lt;/b&gt; » sur le site « Friche &lt;i&gt; »",
      ),
    );
    assert.ok(!email.html.includes("<b>"));
    assert.strictEqual(
      email.text.split("\n\n")[0],
      'Voici les résultats de l’évaluation socio-économique du projet « <b>Lot "A" & B</b> » sur le site « Friche <i> ».',
    );
  });

  it("escapes the site name in the HTML title", () => {
    const email = buildProjectImpactsSummaryEmail({
      ...favourableInput,
      project: { ...project, siteName: "Friche <i>" },
    });

    assert.ok(
      email.html.includes(
        `<title>Projet sur Friche &lt;i&gt;${NBSP}: résultats de votre évaluation</title>`,
      ),
    );
  });
});
