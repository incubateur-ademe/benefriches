import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { BreakEvenHorizon } from "shared";

import {
  buildProjectImpactsSummaryEmail,
  ProjectImpactsSummaryContent,
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
const impactsUrl =
  "http://localhost:3001/mes-projets/11111111-1111-4111-8111-111111111111/score-impacts";
const costBenefitUrl =
  "http://localhost:3001/mes-projets/11111111-1111-4111-8111-111111111111/analyse-cout-benefice";
const avoidedCostsUrl =
  "http://localhost:3001/mes-projets/11111111-1111-4111-8111-111111111111/analyse-couts-evites";

const favourableInput = {
  project,
  evaluationPeriodInYears: 50,
  developmentScore: {
    letterGrade: "A",
    letterGradeWithModifiers: "A-",
    environmentScore: "B",
    localPeopleQualityOfLifeScore: "B",
    fullTimeJobsScore: "A",
  },
  breakEvenHorizon: { status: "compensated", breakEvenYear: "2058", yearsToBreakEven: 26 },
  avoidedCostsAnalysisData: {
    localAuthorityMainIndirectEconomicImpact: {
      name: "fricheCosts",
      total: 1_087_355,
    },
    indirectEconomicImpactsTotal: 2_000_000,
  },
  webappUrl: "http://localhost:3001",
  unsubscribeUrl,
} satisfies BuildProjectImpactsSummaryEmailInput;

const unfavourableInput = {
  ...favourableInput,
  developmentScore: {
    letterGrade: "D",
    letterGradeWithModifiers: "D-",
    environmentScore: "D",
    fullTimeJobsScore: "E",
  },
  breakEvenHorizon: { status: "notCompensatedWithinPeriod", breakEvenYear: undefined },
  avoidedCostsAnalysisData: {
    localAuthorityMainIndirectEconomicImpact: {
      name: "taxesIncome",
      total: -45_000,
    },
    indirectEconomicImpactsTotal: 2_000,
  },
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
      "Les impacts socio-économiques de votre projet, comparés au maintien du site en l&#39;état.",
    );
  });

  it("renders the full plain-text alternative for a favourable evaluation", () => {
    const email = buildProjectImpactsSummaryEmail(favourableInput);

    assert.strictEqual(
      email.text,
      [
        "Voici les résultats de l'évaluation socio-économique du projet « Habitation, école et commerce » sur le site « Ancienne carrière d’argile de Blajan ».",
        "Évaluation réalisée le 15 juin 2026",
        [
          "A-",
          "Projet à impact très positif",
          "Notamment sur l'emploi, la qualité de vie des riverains et l'environnement.",
          `Voir le détail du score : ${impactsUrl}`,
        ].join("\n"),
        [
          "En 26 ans",
          "Coût de l'opération compensé",
          "Les impacts socio-économiques compenseront le coût de l'opération en 2058.",
          `Voir l'analyse coût-bénéfices : ${costBenefitUrl}`,
        ].join("\n"),
        [
          `+1${NNBSP}087${NNBSP}355${NBSP}€`,
          "Gains pour la collectivité",
          "grâce à la reconversion de la friche",
          `Voir l'analyse des coûts évités : ${avoidedCostsUrl}`,
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
        "Voici les résultats de l'évaluation socio-économique du projet « Habitation, école et commerce » sur le site « Ancienne carrière d’argile de Blajan ».",
        "Évaluation réalisée le 15 juin 2026",
        [
          "D-",
          "Projet à impact négatif",
          "Notamment sur l'emploi et l'environnement.",
          `Voir le détail du score : ${impactsUrl}`,
        ].join("\n"),
        [
          "Sur 50 ans",
          "Coût de l'opération non compensé",
          "Les impacts socio-économiques ne compenseront pas le coût de l'opération.",
          `Voir l'analyse coût-bénéfices : ${costBenefitUrl}`,
        ].join("\n"),
        [
          `-45${NNBSP}000${NBSP}€`,
          "Pertes pour la collectivité",
          "à cause d'une perte de recettes fiscales",
          `Voir l'analyse des coûts évités : ${avoidedCostsUrl}`,
        ].join("\n"),
        footer,
      ].join("\n\n"),
    );
  });

  describe("development score card", () => {
    const cases: {
      label: string;
      developmentScore: ProjectImpactsSummaryContent["developmentScore"];
      expected: string[];
    }[] = [
      {
        label: "an agricultural friche as unfavourable",
        developmentScore: {
          letterGrade: "D",
          letterGradeWithModifiers: "D-",
          environmentScore: "D",
          fullTimeJobsScore: "E",
        },
        expected: [
          "D-",
          "Projet à impact négatif",
          "Notamment sur l'emploi et l'environnement.",
          `Voir le détail du score : ${impactsUrl}`,
        ],
      },
      {
        label: "a non-friche site without permeability loss as unfavourable",
        developmentScore: {
          letterGrade: "E",
          letterGradeWithModifiers: "E-",
          environmentScore: "E",
          localAuthorityEconomicScore: "E",
        },
        expected: [
          "E-",
          "Projet à impact très négatif",
          "Notamment sur les finances publiques et l'environnement.",
          `Voir le détail du score : ${impactsUrl}`,
        ],
      },
    ];

    for (const { label, developmentScore, expected } of cases) {
      it(`shows ${label}`, () => {
        const email = buildProjectImpactsSummaryEmail({ ...favourableInput, developmentScore });

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
          "Bilan de l'opération positif",
          "La somme du bilan économique et des impacts socio-économiques est positive dès 2026.",
          `Voir l'analyse coût-bénéfices : ${costBenefitUrl}`,
        ],
      },
      {
        label: "a cost compensated after one year",
        evaluationPeriodInYears: 50,
        breakEvenHorizon: { status: "compensated", breakEvenYear: "2027", yearsToBreakEven: 1 },
        expected: [
          "En 1 an",
          "Coût de l'opération compensé",
          "Les impacts socio-économiques compenseront le coût de l'opération en 2027.",
          `Voir l'analyse coût-bénéfices : ${costBenefitUrl}`,
        ],
      },
      {
        label: "a break-even after a photovoltaic plant's 30 years",
        evaluationPeriodInYears: 30,
        breakEvenHorizon: { status: "notCompensatedWithinPeriod", breakEvenYear: "2061" },
        expected: [
          "Sur 30 ans",
          "Coût de l'opération non compensé",
          "Les impacts socio-économiques compenseront le coût de l'opération en 2061.",
          `Voir l'analyse coût-bénéfices : ${costBenefitUrl}`,
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

  describe("avoided costs analysis card", () => {
    const avoidedCostsLink = `Voir l'analyse des coûts évités : ${avoidedCostsUrl}`;
    const cases: {
      label: string;
      indicator: ProjectImpactsSummaryContent["avoidedCostsAnalysisData"];
      expected: string[];
    }[] = [
      {
        label: "the collectivité's gains from the avoided friche costs",
        indicator: {
          localAuthorityMainIndirectEconomicImpact: {
            name: "fricheCosts",
            total: 150_000,
          },
          indirectEconomicImpactsTotal: 1000000,
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
          localAuthorityMainIndirectEconomicImpact: {
            name: "fricheCosts",
            total: -20_000,
          },
          indirectEconomicImpactsTotal: 5000,
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
        indicator: {
          localAuthorityMainIndirectEconomicImpact: {
            name: "taxesIncome",
            total: 50_000,
          },
          indirectEconomicImpactsTotal: 100000,
        },
        expected: [
          `+50${NNBSP}000${NBSP}€`,
          "Gains pour la collectivité",
          "grâce aux recettes fiscales supplémentaires",
          avoidedCostsLink,
        ],
      },
      {
        label: "the collectivité's losses from lost tax income",
        indicator: {
          localAuthorityMainIndirectEconomicImpact: {
            name: "taxesIncome",
            total: -5000,
          },
          indirectEconomicImpactsTotal: 10000,
        },
        expected: [
          `-5${NNBSP}000${NBSP}€`,
          "Pertes pour la collectivité",
          "à cause d'une perte de recettes fiscales",
          avoidedCostsLink,
        ],
      },
      {
        label: "municipality avoideded expenses increases",
        indicator: {
          localAuthorityMainIndirectEconomicImpact: {
            name: "municipalityExpenses",
            total: 250_000,
          },
          indirectEconomicImpactsTotal: 10000,
        },
        expected: [
          `+250${NNBSP}000${NBSP}€`,
          "Gains pour la collectivité",
          "grâce aux économies de dépenses municipales réalisées",
          avoidedCostsLink,
        ],
      },
      {
        label: "municipality avoideded expenses decreases",
        indicator: {
          localAuthorityMainIndirectEconomicImpact: {
            name: "municipalityExpenses",
            total: -25_000,
          },
          indirectEconomicImpactsTotal: 10000,
        },
        expected: [
          `-25${NNBSP}000${NBSP}€`,
          "Pertes pour la collectivité",
          "à cause de dépenses municipales supplémentaires",
          avoidedCostsLink,
        ],
      },
      {
        label: "municipality operating balance is positive",
        indicator: {
          localAuthorityMainIndirectEconomicImpact: {
            name: "operatingEconomicBalance",
            total: 200_000,
          },
          indirectEconomicImpactsTotal: 10000,
        },
        expected: [
          `+200${NNBSP}000${NBSP}€`,
          "Gains pour la collectivité",
          "grâce aux recettes d'exploitation",
          avoidedCostsLink,
        ],
      },
      {
        label: "municipality operating balance is negative",
        indicator: {
          localAuthorityMainIndirectEconomicImpact: {
            name: "operatingEconomicBalance",
            total: -5_000,
          },
          indirectEconomicImpactsTotal: 10000,
        },
        expected: [
          `-5${NNBSP}000${NBSP}€`,
          "Pertes pour la collectivité",
          "à cause de dépenses d'exploitation",
          avoidedCostsLink,
        ],
      },
      {
        label: "municipality rent income is positive",
        indicator: {
          localAuthorityMainIndirectEconomicImpact: {
            name: "rentalIncome",
            total: 100_000,
          },
          indirectEconomicImpactsTotal: 10000,
        },
        expected: [
          `+100${NNBSP}000${NBSP}€`,
          "Gains pour la collectivité",
          "grâce aux revenus locatifs supplémentaires",
          avoidedCostsLink,
        ],
      },
      {
        label: "municipality rent decreases",
        indicator: {
          localAuthorityMainIndirectEconomicImpact: {
            name: "rentalIncome",
            total: -8_000,
          },
          indirectEconomicImpactsTotal: 10000,
        },
        expected: [
          `-8${NNBSP}000${NBSP}€`,
          "Pertes pour la collectivité",
          "à cause d'une perte de revenus locatifs",
          avoidedCostsLink,
        ],
      },
      {
        label: "no main indicator for local authority and total economic impacts > 0",
        indicator: {
          indirectEconomicImpactsTotal: 100_000_611,
          localAuthorityMainIndirectEconomicImpact: undefined,
        },
        expected: [
          `+100${NNBSP}000${NNBSP}611${NBSP}€`,
          "Total des impacts socio-économiques",
          "pour la collectivité, les riverains ou l'humanité",
          avoidedCostsLink,
        ],
      },
      {
        label: "no main indicator for local authority and total economic impacts < 0",
        indicator: {
          indirectEconomicImpactsTotal: -100_000,
          localAuthorityMainIndirectEconomicImpact: undefined,
        },
        expected: [
          `-100${NNBSP}000${NBSP}€`,
          "Total des impacts socio-économiques",
          "pour la collectivité, les riverains ou l'humanité",
          avoidedCostsLink,
        ],
      },
    ];

    for (const { label, indicator, expected } of cases) {
      it(`shows ${label}`, () => {
        const email = buildProjectImpactsSummaryEmail({
          ...favourableInput,
          avoidedCostsAnalysisData: indicator,
        });

        assert.strictEqual(email.text.split("\n\n")[4], expected.join("\n"));
      });
    }
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
      `Voici les résultats de l'évaluation socio-économique du projet « <b>Lot "A" & B</b> » sur le site « Friche <i> ».`,
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
