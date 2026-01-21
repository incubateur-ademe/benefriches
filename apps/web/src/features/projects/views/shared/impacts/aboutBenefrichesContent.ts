type LinkInfo = { label: string; url: string };

export type TextSegment = string | { text: string; link: LinkInfo };

export type ListItem = {
  segments: TextSegment[];
};

export type AboutSection = {
  id: string;
  title: string;
  content: (
    | {
        type: "list";
        listType: "ul" | "ol";
        items: ListItem[];
      }
    | { type: "paragraph"; texts: TextSegment[] }
  )[];
};

const EXTERNAL_LINKS = {
  dataGouv: "https://www.data.gouv.fr/fr/",
  observatoireTerritoires: "https://www.observatoire-des-territoires.gouv.fr/",
  evaluationSocioEconomique:
    "https://www.strategie.gouv.fr/levaluation-socioeconomique-investir-pour-la-collectivite",
  tauxActualisation: "https://www.strategie.gouv.fr/taux-dactualisation-un-beta-sensible",
  analyseMonetarisation:
    "https://www.ecologie.gouv.fr/sites/default/files/publications/Th%C3%A9ma%20-%20L%27analyse%20du%20cycle%20de%20vie%20%20-%20Enjeux%20autour%20de%20la%20mon%C3%A9tarisation.pdf",
  analyseCoutBenefices:
    "https://www.ecologie.gouv.fr/sites/default/files/AMC%20-%20Guide%20m%C3%A9thodologique%20ABC.pdf",
} as const;

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    id: "how-it-works",
    title: "⚙️ Comment fonctionne Bénéfriches ?",
    content: [
      {
        type: "paragraph",
        texts: [
          "Bénéfriches repose sur les principes de l'analyse coûts-bénéfices, qui a pour objet d'apprécier l'intérêt d'une opération (projet ou investissement), sur une période donnée. Elle est réalisée en analysant les impacts du projet sur les différents types d'acteurs directement ou indirectement concernés, que ces impacts soient positifs ou négatifs (ex : tonnes de CO2 évitées, surfaces désimperméabilisées).",
        ],
      },
      {
        type: "paragraph",
        texts: [
          "Puis en les comparant au bilan de l'opération (recettes vs. dépenses nécessaires à sa réalisation) qui est exprimé en €.",
        ],
      },
      {
        type: "paragraph",
        texts: [
          "Pour pouvoir effectuer cette comparaison il est nécessaire de convertir les valeurs d'impacts en valeurs monétaires. On parle alors de « monétarisation ».",
        ],
      },
    ],
  },
  {
    id: "calculated-impacts",
    title: "📊 Quels sont les impacts calculés par Bénéfriches ?",
    content: [
      {
        type: "paragraph",
        texts: [
          "Bénéfriches calcule tous les impacts de votre projet, regroupés au sein de 6 familles, sur la base d'un ou plusieurs indicateurs.",
        ],
      },
      {
        type: "paragraph",
        texts: ["4 familles d'impacts sont exprimées sous forme monétaire :"],
      },
      {
        type: "list",
        listType: "ul",
        items: [
          { segments: ["Impacts économiques directs (exemple d'indicateur : fiscalité)"] },
          {
            segments: [
              "Impacts économiques indirects (exemple d'indicateur : dépenses de sécurisation d'un site)",
            ],
          },
          {
            segments: [
              "Impacts sociaux monétarisés (exemple d'indicateur : temps passé en moins dans les transports)",
            ],
          },
          {
            segments: [
              "Impacts environnementaux monétarisés (exemple d'indicateur : valeur monétaire des services écosystémiques)",
            ],
          },
        ],
      },
      {
        type: "paragraph",
        texts: ["2 autres familles proposent des impacts non-monétarisés :"],
      },
      {
        type: "list",
        listType: "ul",
        items: [
          { segments: ["Impacts sociaux (exemple d'indicateur : emplois)"] },
          { segments: ["Impacts environnementaux (exemple d'indicateur : surface polluée)"] },
        ],
      },
      {
        type: "paragraph",
        texts: [
          "Ces 2 impacts non-monétarisés sont utilisés pour calculer les 2 impacts monétarisés (sociaux et environnementaux).",
        ],
      },
    ],
  },
  {
    id: "impact-calculation",
    title: "🧮 Comment sont calculés les indicateurs d'impacts ?",
    content: [
      {
        type: "paragraph",
        texts: [
          "Les indicateurs d'impacts sont généralement calculés simplement en multipliant une donnée du site ou du projet (ex : surface imperméabilisée) que vous avez renseignée, ou une différence entre ces 2 données, par une valeur d'impact (ex : stock de carbone dans les sols imperméabilisés par unité de surface).",
        ],
      },
      {
        type: "paragraph",
        texts: [
          "Des hypothèses sont parfois utilisées (ex : distance du site jusqu'à laquelle est considérée un impact).",
        ],
      },
    ],
  },
  {
    id: "data-sources",
    title: "🗂️ Quelles sont les données utilisées dans le calcul des impacts ?",
    content: [
      {
        type: "paragraph",
        texts: [
          "Les valeurs utilisées dans les calculs et qui ne sont pas saisies par l'utilisateur proviennent de données sourcées :",
        ],
      },
      {
        type: "list",
        listType: "ul",
        items: [
          {
            segments: [
              "les valeurs de référence sont compilées à partir de publications institutionnelles (INSEE, France Stratégie, AGRESTE, ADEME, etc.) ou de publications scientifiques, par exemple pour les valeurs monétaires (voir ci-dessous),",
            ],
          },
          {
            segments: [
              "les exploitations sont faites à partir de bases de données reconnues voire officielles, accessibles en ",
              { text: "opendata", link: { label: "opendata", url: EXTERNAL_LINKS.dataGouv } },
              " (ALDO, dvf, etc.)",
            ],
          },
          {
            segments: [
              "des hypothèses contextualisées (ex : temps de déplacement gagné par les habitants du fait de la création d'une nouvelle centralité à partir des données de l'",
              {
                text: "Observatoire des territoires",
                link: {
                  label: "Observatoire des territoires",
                  url: EXTERNAL_LINKS.observatoireTerritoires,
                },
              },
              ").",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "monetized-impact",
    title: "💰 Qu'est-ce qu'un impact monétarisé ?",
    content: [
      {
        type: "paragraph",
        texts: [
          "Bénéfriches calcule tous les impacts de votre projet : économiques directs (ex : fiscalité), retombées (ex : baisse des dépenses de sécurisation d'un site), mais aussi les \"gains en nature\" monétarisés. Il s'agit d'effets non marchands ou \"externalités\" (ex : baisse des émissions carbone) auxquels il est possible d'attribuer une valeur monétaire.",
        ],
      },
      {
        type: "paragraph",
        texts: [
          "Par exemple : Valeur monétaire de la décarbonation → En produisant des EnR ou en réduisant les déplacements en voiture, le projet participe à la décarbonation. Cette action en faveur du climat a une valeur monétaire que Bénéfriches utilise dans ses calculs.",
        ],
      },
    ],
  },
  {
    id: "french-society",
    title: '🇫🇷 Qui est la "société française" et comment mon projet l\'impacte-t-elle ?',
    content: [
      {
        type: "paragraph",
        texts: [
          "La société française regroupe l'état français, ses acteurs économiques et sa population. Ils peuvent être indirectement affectés par le projet (accidents de la route évités, dépenses de santé évitées...)",
        ],
      },
    ],
  },
  {
    id: "human-society",
    title: '🌎 Qui est la "société humaine" et comment mon projet l\'impacte-t-elle ?',
    content: [
      {
        type: "paragraph",
        texts: [
          "L'humanité représente l'ensemble des habitants de la planète. Ceux-ci bénéficient indirectement des impacts du projet sur l'environnement (réduction des émissions de gaz à effet de serre, maintien de la biodiversité...).",
        ],
      },
    ],
  },
  {
    id: "evaluation-period",
    title: "⏱️ Sur quelle durée les impacts sont-ils calculés ?",
    content: [
      {
        type: "paragraph",
        texts: [
          "Bénéfriches calcule les impacts d'un projet de reconversion sur une durée représentative de la durée de vie ou d'usage des différents types de projets. Cette durée est prise par défaut égale à 20 ans pour les projets photovoltaïques, et égale à 50 ans pour les projets d'aménagement ou de construction. Vous pouvez modifier cette durée via le sélecteur de durée situé en haut de la page.",
        ],
      },
    ],
  },
  {
    id: "actualization",
    title:
      "💶 L'euro de 2050 est-il le même que l'euro d'aujourd'hui dans le calcul des impacts monétaires ?",
    content: [
      {
        type: "paragraph",
        texts: [
          "Conformément aux principes de l'évaluation socio-économique, Bénéfriches « actualise » les coûts et bénéfices futurs du projet pour pouvoir les comparer. Actualiser signifie « ramener à une valeur d'aujourd'hui ». Pour cela, on utilise un coefficient (ou taux) d'actualisation.",
        ],
      },
      {
        type: "paragraph",
        texts: ["Pour les indicateurs concernés, les calculs prennent en compte :"],
      },
      {
        type: "list",
        listType: "ul",
        items: [
          { segments: ["l'évolution future estimée du PIB/habitants"] },
          { segments: ["l'évolution future estimée du CO2eq émis par les véhicules"] },
          {
            segments: [
              "l'évolution future estimée de la valeur monétaire associée aux émissions de CO2eq",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "differential",
    title: "💸 Les gains ou pertes liés à mon projet sont-ils un état final ou un différentiel ?",
    content: [
      {
        type: "paragraph",
        texts: [
          "Par principe, une analyse coût-bénéfices est une approche comparative. Il s'agit de comparer les effets du projet (positifs (bénéfices) ou négatifs (dommages)) à une option de référence. L'option de référence correspond à la situation la plus probable en l'absence de réalisation du projet.",
        ],
      },
      {
        type: "paragraph",
        texts: [
          "Par défaut, Bénéfriches va calculer la différence entre les impacts associés à la réalisation d'un projet sur le site vs. le site reste en l'état.",
        ],
      },
    ],
  },
];

export const COMPARISON_SECTION: AboutSection = {
  id: "comparison",
  title: "⚖️ Pourquoi comparer mon projet à un autre ?",
  content: [
    {
      type: "paragraph",
      texts: [
        "Grâce à la fonction « Comparer », il est possible d'obtenir des résultats enrichis en proposant :",
      ],
    },
    {
      type: "list",
      listType: "ol",
      items: [
        {
          segments: [
            "une décomposition du différentiel calculé en première approche avec affichage d'une part des impacts associés au site s'il n'est pas reconverti et d'autre part des impacts associés au projet. Cela permet d'apprécier une sorte de « coût de l'inaction ».",
          ],
        },
        {
          segments: [
            "une comparaison des impacts associés au projet qu'il soit réalisé sur le site ou en extension urbaine,",
          ],
        },
        {
          segments: [
            "une comparaison des impacts associés à la réalisation de 2 projets distincts (ex : projet urbain vs. renaturation) sur le même site",
          ],
        },
      ],
    },
  ],
};

export const MONETIZED_IMPACT_SECTION = ABOUT_SECTIONS.find(
  (section) => section.id === "monetized-impact",
) as AboutSection;

export const LEARN_MORE_SECTION: AboutSection = {
  id: "learn-more",
  title: "Pour en savoir plus :",
  content: [
    {
      type: "list",
      listType: "ul",
      items: [
        {
          segments: [
            {
              text: "Infographie sur l'évaluation socio-économique, France Stratégie",
              link: {
                label: "Infographie sur l'évaluation socio-économique, France Stratégie",
                url: EXTERNAL_LINKS.evaluationSocioEconomique,
              },
            },
          ],
        },
        {
          segments: [
            {
              text: "Infographie sur la notion d'actualisation, France Stratégie",
              link: {
                label: "Infographie sur la notion d'actualisation, France Stratégie",
                url: EXTERNAL_LINKS.tauxActualisation,
              },
            },
          ],
        },
        {
          segments: [
            {
              text: "Analyse du cycle de vie, enjeux autour de la monétarisation, Commissariat général au développement durable, Ministère de la transition écologique",
              link: {
                label:
                  "Analyse du cycle de vie, enjeux autour de la monétarisation, Commissariat général au développement durable, Ministère de la transition écologique",
                url: EXTERNAL_LINKS.analyseMonetarisation,
              },
            },
          ],
        },
        {
          segments: [
            {
              text: "Analyse coût bénéfices, Ministère de la transition écologique",
              link: {
                label: "Analyse coût bénéfices, Ministère de la transition écologique",
                url: EXTERNAL_LINKS.analyseCoutBenefices,
              },
            },
          ],
        },
      ],
    },
  ],
};
