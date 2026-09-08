export type Testimony = {
  projectLocation: string;
  imgSrc: string;
  fileUrl?: string;
  projectType: string;
  testimony: string;
  author: string;
};

export const testimonies: Testimony[] = [
  {
    projectLocation: "Coop Habitat Bourgogne",
    projectType: "🏡 Projet urbain",
    imgSrc: "/img/testimonies/coop-habitat-bourgogne.svg",
    testimony:
      "L'outil Bénéfriches m'a permis d'objectiver l'impact de nos opérations sur le foncier, je l'utilise comme un outil de construction de mon projet. J'intègre les données Bénéfriches dans mes PPT de présentation aux élus : recettes fiscales, améliorations du cadre de vie, impacts sociaux, émissions de CO2-eq évitées, kilomètres évités... ce sont des données qui marquent les élus.",
    author: "Cyril Lagarde, Directeur général",
  },
  {
    projectLocation: "Grand Paris Sud Est Avenir",
    imgSrc: "/img/testimonies/grand-paris-sudest.svg",
    projectType: "🏢 Zone d'activité économique",
    testimony:
      "L'utilisation de l'outil Bénéfriches a permis à Grand Paris Sud Est Avenir de développer une approche plus large de la reconquête de la friche France Telecom de Noiseau, en développant une analyse coûts-avantage globale, qui dépasse la seule conception financière de l'opération.",
    author: "Alice Sapir, Responsable d'opérations",
    fileUrl:
      "https://librairie.ademe.fr/ged/3687/benefriches-fiche-presentation-resultats-gpsea.pdf",
  },
  {
    projectLocation: "Balaruc-les-Bains",
    imgSrc: "/img/testimonies/balaruc.svg",
    projectType: "🏡 Projet urbain",
    testimony:
      "L'outil Bénéfriches nous a permis de mieux apprécier les impacts et les bénéfices de l'opération. Nous avons également apprécié les temps d'échanges avec les autres porteurs de projet qui ne travaillaient pas sur les mêmes thématiques que nous.",
    author: "Julie Bastide et Yan Renaut, Chargés d'opérations",
    fileUrl:
      "https://librairie.ademe.fr/ged/3687/benefriches-fiche-presentation-resultats-balaruc.pdf",
  },
  {
    projectLocation: "Melun Val de Seine",
    imgSrc: "/img/testimonies/melun-val-de-seine.svg",
    projectType: "🏢 Zone d'activité économique",
    testimony:
      "L'outil nous a permis d'aborder les bénéfices socio-économiques d'un projet de développement économique. Il nous a permis d'en tirer des enseignements applicables sur d'autres fonciers de zones d'activité économiques. Il deviendra un outil au service d'une stratégie de requalification des ZAE de l'agglomération.",
    author: "Typhaine Paris, Chargée de mission Aménagement",
    fileUrl:
      "https://librairie.ademe.fr/ged/3687/benefriches-fiche-presentation-resultats-camvs-site-a.pdf",
  },
];
