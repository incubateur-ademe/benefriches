// oxlint-disable no-console
/* oxlint-disable typescript/no-non-null-assertion */
/* oxlint-disable typescript/no-unsafe-assignment */
/* oxlint-disable no-control-regex */
import * as fs from "node:fs";
import * as https from "node:https";
import * as path from "node:path";
import { pipeline } from "node:stream";
import { promisify } from "node:util";

import { readLines } from "../cities/build-cities-csv";
import { DVFCommuneAnalyzer } from "./dvf-analyser";

promisify(pipeline);

// Strips ASCII control characters from external values before logging to prevent log injection
const stripControlChars = (s: string) => s.replace(/[\x00-\x1F\x7F]/g, " ");

export type CommuneStats = {
  city_code: string;
  da_name: string;
  da_population: number | null;
  da_surface_ha: number | null;
  dvf_surface_median: number | null;
  dvf_pxm2_median: number | null;
  dvf_nbtrans: number;
  dvf_nbtrans_cod111: number;
  dvf_pxm2_median_cod111: number | null;
  dvf_nbtrans_cod121: number;
  dvf_pxm2_median_cod121: number | null;
  dvf_surface_median_cod111: number | null;
  dvf_surface_median_cod121: number | null;
  dvf_surface_median_terrain: number | null;
  dvf_pxm2_median_terrain: number | null;
  dvf_nbtrans_terrain: number;
  anct_part_actifs_transports_en_commun_2022?: number;
  anct_taux_annuel_evol_population_2016_2022?: number;
};

export type Commune = {
  code: string;
  nom: string;
  population?: number;
  surface?: number;
};

export const CITY_ARRONDISSEMENTS: Record<string, string[]> = {
  // Lyon
  "69123": ["69381", "69382", "69383", "69384", "69385", "69386", "69387", "69388", "69389"],
  // Paris
  "75056": [
    "75101",
    "75102",
    "75103",
    "75104",
    "75105",
    "75106",
    "75107",
    "75108",
    "75109",
    "75110",
    "75111",
    "75112",
    "75113",
    "75114",
    "75115",
    "75116",
    "75117",
    "75118",
    "75119",
    "75120",
  ],
  // Marseille
  "13055": [
    "13201",
    "13202",
    "13203",
    "13204",
    "13205",
    "13206",
    "13207",
    "13208",
    "13209",
    "13210",
    "13211",
    "13212",
    "13213",
    "13214",
    "13215",
    "13216",
  ],
} as const;

export const ARRONDISSEMENTS_CITY_CODES = new Set(Object.values(CITY_ARRONDISSEMENTS).flat());

const exportResults = (stats: CommuneStats[], filename = "cityStats.csv"): string => {
  const outputPath = path.join(import.meta.dirname, filename);

  // Créer le contenu CSV
  const headers = [
    "city_code",
    "da_name",
    "da_population",
    "da_surface_ha",
    "dvf_nbtrans",
    "dvf_pxm2_median",
    "dvf_surface_median",
    "dvf_nbtrans_cod111",
    "dvf_pxm2_median_cod111",
    "dvf_nbtrans_cod121",
    "dvf_pxm2_median_cod121",
    "dvf_surface_median_cod111",
    "dvf_surface_median_cod121",
    "dvf_nbtrans_terrain",
    "dvf_pxm2_median_terrain",
    "dvf_surface_median_terrain",
    "anct_part_actifs_transports_en_commun_2022",
    "anct_taux_annuel_evol_population_2016_2022",
  ] as const;

  const csvContent = [
    headers.join(";"),
    ...stats.map((row) => headers.map((header) => row[header]).join(";")),
  ].join("\n");

  fs.writeFileSync(outputPath, csvContent, "utf-8");
  console.log(` 💾 Résultats exportés vers : ${outputPath}`);

  return outputPath;
};

const fetchArrondissement = (codeInsee: string): Promise<Commune> => {
  const url = `https://geo.api.gouv.fr/communes/${codeInsee}?fields=nom,code,population,surface&format=json`;

  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode} pour ${codeInsee}`));
          return;
        }

        let data = "";
        response.on("data", (chunk: string) => (data += chunk));
        response.on("end", () => {
          try {
            const arrondissement = JSON.parse(data) as Commune;
            resolve(arrondissement);
          } catch (error: unknown) {
            reject(error as Error);
          }
        });
      })
      .on("error", reject);
  });
};

const addArrondissements = async (communes: Commune[]): Promise<Commune[]> => {
  console.log(" 🏙️ Récupération des arrondissements de Paris, Marseille et Lyon...");

  const arrondissements: Commune[] = [];
  let addedCount = 0;

  for (const codeInsee of ARRONDISSEMENTS_CITY_CODES) {
    try {
      console.log(`        - arrondissement ${codeInsee}...`);
      const arrondissement = await fetchArrondissement(codeInsee);
      arrondissements.push(arrondissement);
      addedCount++;
      // Petit délai pour éviter de surcharger l'API
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.warn(
        `      ❌ Impossible de récupérer l'arrondissement ${codeInsee} : ${stripControlChars((error as Error).message)}`,
      );
    }
  }

  console.log(`      ✅ ${addedCount} arrondissements ajoutés\n`);

  const result = [...communes, ...arrondissements];
  console.log(` Total : ${result.length} communes et arrondissements`);

  return result;
};
const fetchCommunes = (): Promise<Commune[]> => {
  console.log(" 📍 Récupération de la liste des communes depuis l'API Géo...");

  const url = "https://geo.api.gouv.fr/communes?fields=nom,code,population,surface&format=json";

  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }

        let data = "";
        response.on("data", (chunk: string) => (data += chunk));
        response.on("end", () => {
          try {
            const communes: Commune[] = JSON.parse(data) as Commune[];
            console.log(`      ✅ ${communes.length} communes récupérées\n`);

            // Ajouter les arrondissements
            addArrondissements(communes)
              .then((communesAvecArrondissements) => {
                // Retirer les territoires outre mer
                const communesFiltered = communesAvecArrondissements.filter(
                  (commune) => !commune.code.startsWith("98"),
                );

                resolve(communesFiltered);
              })
              .catch((error: unknown) => {
                reject(error as Error);
              });
          } catch (error: unknown) {
            reject(error as Error);
          }
        });
      })
      .on("error", reject);
  });
};

const generateAboutFile = (
  stats: CommuneStats[],
  dvfContent: string,
  anctContent: string,
): string => {
  const readmePath = path.join(import.meta.dirname, "README.md");

  // Compter les arrondissements
  const arrondissements = stats.filter((s) => ARRONDISSEMENTS_CITY_CODES.has(s.city_code));

  const readmeContent = `# Génération des statistiques communales françaises

## Utilisation

\`\`\`sh
npx ts-node build-city-stats.ts
\`\`\`

## Méthodologie

Le script combine les données de **Demandes de Valeurs Foncières (DVF)** avec les données géographiques des communes françaises pour produire des statistiques de prix au m² par commune.

### Sources de données

1. **[API Géo](https://geo.api.gouv.fr/communes)**
   - Nom des communes
   - Population
   - Surface en hectares

2. **[DVF - data.gouv.fr](https://www.data.gouv.fr/datasets/demandes-de-valeurs-foncieres-geolocalisees/)**
   - Transactions immobilières (ventes uniquement)
   - Types de biens : Maisons (cod111) et Appartements (cod121)
   - Surface et prix de vente
   - Mutations de terrain sans bâti (parcelles, surface_terrain)

3. **[ANCT - Observatoire des territoires](https://www.observatoire-des-territoires.gouv.fr/outils/cartographie-interactive/#view=map76&c=indicator)**
   - DÉMOGRAPHIE > Population et évolutions > Taux d'évolution annuel de la population (%)2016-2022▼
   - MOBILITÉS > Mobilités quotidiennes > Part d'actifs selon le mode de transport principalement utilisé pour aller travailler (%) 2022 > Transport en commun

### Couverture géographique

- **Communes françaises** : ${(stats.length - arrondissements.length).toLocaleString()}
- **Arrondissements** : ${arrondissements.length} (Paris, Marseille, Lyon)
- **Total** : ${stats.length.toLocaleString()} entités géographiques

${dvfContent}

${anctContent}

### Structure du fichier sqlCityStats.csv

| Colonne                     | Description                                |
| --------------------------- | ------------------------------------------ |
| \`city_code\`                 | Code INSEE de la commune ou arrondissement |
| \`da_name\`                   | Nom de la commune ou arrondissement        |
| \`da_population\`             | Population de la commune                   |
| \`da_surface_ha\`             | Surface de la commune en hectares          |
| \`dvf_nbtrans\`               | Nombre de transactions total               |
| \`dvf_pxm2_median\`           | Prix médian au m² (€/m²)                   |
| \`dvf_surface_median\`        | Surface médiane (m²)                       |
| \`dvf_nbtrans_cod111\`        | Nombre de transactions de maisons          |
| \`dvf_pxm2_median_cod111\`    | Prix médian au m² des maisons (€/m²)       |
| \`dvf_nbtrans_cod121\`        | Nombre de transactions d'appartements      |
| \`dvf_pxm2_median_cod121\`    | Prix médian au m² des appartements (€/m²)  |
| \`dvf_surface_median_cod111\` | Surface médiane des maisons (m²)           |
| \`dvf_surface_median_cod121\` | Surface médiane des appartements (m²)      |
| \`dvf_nbtrans_terrain\`       | Nombre de mutations de terrain sans bâti utilisées |
| \`dvf_pxm2_median_terrain\`   | Prix médian au m² du terrain seul (€/m²)   |
| \`dvf_surface_median_terrain\`| Surface médiane des terrains vendus seuls (m²) |
| \`anct_part_actifs_transports_en_commun_2022\`| Part d'actifs utilisant principalement les transports en commun pour aller travailler 2022 |
| \`anct_taux_annuel_evol_population_2016_2022\`| Taux d'évolution annuel de la population 2016-2022 |
---

- _Fichiers générés le ${new Date().toLocaleDateString("fr-FR")}_
`;

  fs.writeFileSync(readmePath, readmeContent, "utf-8");
  console.log(` ✓ Documentation générée : ${readmePath}`);

  return readmePath;
};

const displaySummary = (): void => {
  console.log("\n=== 💾 FICHIERS GÉNÉRÉS ===\n");
  console.log(" - cityStats.csv");
  console.log(" - README.md");
};

type AnctRawRow = {
  anct_part_actifs_transports_en_commun_2022?: number;
  anct_taux_annuel_evol_population_2016_2022?: number;
};

const stringToNumber = (value: string) => {
  const output = parseFloat(value);
  return isNaN(output) ? undefined : output;
};

const readAnctRawRows = async (): Promise<Map<string, AnctRawRow>> => {
  console.log(`--- ANCT stats : read CSV file`);
  const lines = await readLines(
    path.resolve(import.meta.dirname, "./anct/observatoire-territoire.csv"),
  );
  const map = new Map<string, AnctRawRow>();

  for (const line of lines) {
    const [
      cityCode,
      _,
      anct_part_actifs_transports_en_commun_2022,
      anct_taux_annuel_evol_population_2016_2022,
    ] = line.split(";") as [string, string, string, string];

    map.set(cityCode, {
      anct_part_actifs_transports_en_commun_2022: stringToNumber(
        anct_part_actifs_transports_en_commun_2022,
      ),
      anct_taux_annuel_evol_population_2016_2022: stringToNumber(
        anct_taux_annuel_evol_population_2016_2022,
      ),
    });
  }

  console.log(`--- ANCT stats : ${map.size} communes trouvées`);
  return map;
};

const main = async () => {
  console.log("=== GÉNÉRATION DES STATISTIQUES COMMUNALES FRANÇAISES ===\n");

  try {
    const communes = await fetchCommunes();
    console.log("\n");

    const dvfAnalyzer = new DVFCommuneAnalyzer();

    const dvfStats = await dvfAnalyzer.analyzeAll(communes);

    const anctStats = await readAnctRawRows();

    const stats = dvfStats.map((item) => Object.assign(item, anctStats.get(item.city_code)));

    const missingAnctPopulation = stats.filter(
      (item) => item.anct_taux_annuel_evol_population_2016_2022 === undefined,
    ).length;
    const missingAnctTransports = stats.filter(
      (item) => item.anct_part_actifs_transports_en_commun_2022 === undefined,
    ).length;
    console.log(
      `--- ANCT -> évolution population manquante pour : ${missingAnctPopulation} communes`,
    );
    console.log(
      `--- ANCT -> part actif transport en commun manquante pour : ${missingAnctTransports} communes`,
    );
    console.log("\n✅ Extraction terminée avec succès !");

    exportResults(stats);

    generateAboutFile(
      stats,
      dvfAnalyzer.generateAboutFileContent(stats),
      `
### ANCT: Observatoire des territoires

#### Analyse des données manquantes
  -> évolution population manquante pour : ${missingAnctPopulation} communes
  -> part actif transport en commun manquante pour : ${missingAnctTransports} communes
      `,
    );

    displaySummary();
  } catch (error) {
    console.error("❌ Erreur lors de l'analyse :", (error as Error).message);
    return null;
  }
};

void main();
