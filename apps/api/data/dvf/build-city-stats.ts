// oxlint-disable no-console
/* oxlint-disable typescript/no-non-null-assertion */
/* oxlint-disable typescript/no-unsafe-assignment */
import { createReadStream, createWriteStream } from "node:fs";
import * as fs from "node:fs";
import * as https from "node:https";
import * as path from "node:path";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import * as zlib from "node:zlib";
import z from "zod";

promisify(pipeline);

// oxlint-disable-next-line typescript/no-unnecessary-condition
const SCRIPT_DIR = typeof __dirname !== "undefined" ? __dirname : path.dirname(process.argv[1]!);

const validResidentialTransactionSchema = z.object({
  annee: z.number(),
  id_mutation: z.string(),
  code_commune: z.string().min(1),
  type_local: z.string(),
  valeur_fonciere: z.number().positive(),
  surface_reelle_bati: z.number().min(10).max(500),
  prix_m2: z.number().min(500).max(25000),
});

const validTerrainTransactionSchema = z.object({
  annee: z.number(),
  id_mutation: z.string(),
  code_commune: z.string().min(1),
  valeur_fonciere: z.number().positive(),
  surface_terrain: z.number().positive(),
  prix_m2: z.number().positive().max(25000),
});

interface Commune {
  code: string;
  nom: string;
  population?: number;
  surface?: number;
}

interface DVFResidentialTransaction {
  annee: number | null;
  id_mutation: string;
  code_commune: string;
  type_local: string;
  valeur_fonciere: number;
  surface_reelle_bati: number;
  prix_m2: number;
}

interface DVFTerrainTransaction {
  annee: number | null;
  id_mutation: string;
  code_commune: string;
  valeur_fonciere: number;
  surface_terrain: number;
  prix_m2: number;
}

interface RawDVFRow {
  nature_mutation: string;
  valeur_fonciere: string;
  surface_reelle_bati: string;
  code_commune: string;
  type_local: string;
  date_mutation?: string;
  id_mutation: string;
  nature_culture: string;
  surface_terrain: string;
}

interface CommuneStats {
  city_code: string;
  da_name: string;
  da_population: number | null;
  da_surface_ha: number | null;
  dvf_surface_median_residential: number | null;
  dvf_pxm2_median_residential: number | null;
  dvf_nbtrans_residential: number;
  dvf_nbtrans_cod111: number;
  dvf_pxm2_median_cod111: number | null;
  dvf_nbtrans_cod121: number;
  dvf_pxm2_median_cod121: number | null;
  dvf_surface_median_cod111: number | null;
  dvf_surface_median_cod121: number | null;
  dvf_nbtrans_terrain: number;
  dvf_pxm2_median_terrain: number | null;
  dvf_surface_median_terrain: number | null;
}

interface TypeStats {
  nb_transactions: number;
  prix_median_m2: number | null;
  surface_mediane: number | null;
}

interface YearRange {
  min: number;
  max: number;
  years: number[];
}

interface DVFGroupedData {
  maisons: DVFResidentialTransaction[];
  appartements: DVFResidentialTransaction[];
  terrains: DVFTerrainTransaction[];
}

interface WeightedAverageResult {
  transactions: number;
  price: number | null;
  surface: number | null;
}

class DVFCommuneAnalyzer {
  private readonly dataPath: string;
  private communes: Commune[] | null = null;
  private residentialData: DVFResidentialTransaction[] | null = null;
  private terrainData: DVFTerrainTransaction[] | null = null;
  private stats: CommuneStats[] | null = null;
  private yearRange: YearRange | null = null;

  private readonly cityArrondissements: Record<string, string[]> = {
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
  };

  private readonly arrondissementCodes: string[];

  constructor(dataPath = path.join(SCRIPT_DIR, "downloaded_sources")) {
    this.dataPath = dataPath;
    this.ensureDataDirectory();
    this.arrondissementCodes = Object.values(this.cityArrondissements).flat();
  }

  async analyzeAll(): Promise<CommuneStats[] | null> {
    console.log("=== GÉNÉRATION DES STATISTIQUES COMMUNALES FRANÇAISES ===\n");

    try {
      // 1. Récupérer les communes
      this.communes = await this.fetchCommunes();
      console.log("\n");

      // 2. Télécharger les données DVF
      const filePaths = await this.downloadDVFData();
      if (!filePaths) return null;
      console.log("\n");

      // 3. Charger les données DVF
      const rawDvfResult = await this.loadDVFData(filePaths);
      if (!rawDvfResult) return null;
      console.log("\n");

      // 4. Nettoyer les données DVF
      this.residentialData = this.cleanResidentialData(rawDvfResult.residentialTransactions);
      this.terrainData = this.cleanTerrainData(rawDvfResult.terrainTransactions);

      // 5. Calculer les statistiques par commune
      this.stats = this.calculateCommuneStats(
        this.communes,
        this.residentialData,
        this.terrainData,
      );

      // 6. Exporter les résultats
      this.exportResults(this.stats);

      // 7. Générer la documentation
      this.generateAboutFile(this.stats);

      // 8. Afficher le résumé
      this.displaySummary();

      return this.stats;
    } catch (error) {
      console.error("❌ Erreur lors de l'analyse :", (error as Error).message);
      return null;
    }
  }

  private ensureDataDirectory(): void {
    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath, { recursive: true });
    }
  }

  private fetchCommunes(): Promise<Commune[]> {
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
              this.addArrondissements(communes)
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
  }

  private async addArrondissements(communes: Commune[]): Promise<Commune[]> {
    console.log(" 🏙️ Récupération des arrondissements de Paris, Marseille et Lyon...");

    const arrondissements: Commune[] = [];
    let addedCount = 0;

    for (const codeInsee of this.arrondissementCodes) {
      try {
        console.log(`        - arrondissement ${codeInsee}...`);
        const arrondissement = await this.fetchArrondissement(codeInsee);
        arrondissements.push(arrondissement);
        addedCount++;
        // Petit délai pour éviter de surcharger l'API
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.warn(
          `      ❌ Impossible de récupérer l'arrondissement ${codeInsee} : ${(error as Error).message}`,
        );
      }
    }

    console.log(`      ✅ ${addedCount} arrondissements ajoutés\n`);

    const result = [...communes, ...arrondissements];
    console.log(` Total : ${result.length} communes et arrondissements`);

    return result;
  }

  private fetchArrondissement(codeInsee: string): Promise<Commune> {
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
  }

  private async downloadDVFData(
    startYear: number = new Date().getFullYear(),
    maxYears = 8,
  ): Promise<string[] | null> {
    console.log(
      ` 📊 Téléchargement des données DVF (${maxYears} années max, à partir de ${startYear})...\n`,
    );

    const downloadedFiles: string[] = [];

    // Essayer de télécharger les fichiers full.csv.gz en priorité
    for (let i = 0; i < maxYears; i++) {
      const year = startYear - i;
      if (year < 2020) break; // Les données DVF commencent en 2020

      const url = `https://files.data.gouv.fr/geo-dvf/latest/csv/${year}/full.csv.gz`;
      const filePath = path.join(this.dataPath, `dvf_${year}.csv.gz`);

      try {
        // Vérifier si le fichier existe déjà
        if (fs.existsSync(filePath)) {
          console.log(`      ✅ Fichier ${year} déjà présent : ${filePath}`);
          downloadedFiles.push(filePath);
          continue;
        }

        console.log(`      ⏳ Téléchargement de l'année ${year}...`);
        await this.downloadFile(url, filePath);
        console.log(`         ✅ Données ${year} téléchargées : ${filePath}`);
        downloadedFiles.push(filePath);
      } catch (error) {
        console.warn(`         ❌ Impossible de télécharger ${year} : ${(error as Error).message}`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        // on continue avec les autres années
      }
    }

    if (downloadedFiles.length === 0) {
      console.log("  Aucun fichier téléchargé. Vous pouvez télécharger manuellement depuis :");
      console.log(
        "  https://www.data.gouv.fr/datasets/demandes-de-valeurs-foncieres-geolocalisees/",
      );
      return null;
    }

    console.log(`\n 📃 ${downloadedFiles.length} fichier(s) disponible(s)`);
    return downloadedFiles;
  }

  private downloadFile(url: string, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = createWriteStream(filePath);
      const request = https.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }
        file.on("finish", () => {
          file.close();
          resolve();
        });
        response.pipe(file);
      });

      request.on("error", (err) => {
        console.log("❌ Request error", err);
        file.close();
        reject(err);
      });
      file.on("error", (err) => {
        console.log("❌ File error", err);
        file.close();
        reject(err);
      });
    });
  }

  private async loadDVFData(filePaths: string[]): Promise<{
    residentialTransactions: DVFResidentialTransaction[];
    terrainTransactions: DVFTerrainTransaction[];
  } | null> {
    console.log(` ⏳ Chargement des données DVF depuis ${filePaths.length} fichier(s)...`);

    try {
      let allResidentialData: DVFResidentialTransaction[] = [];
      let allTerrainData: DVFTerrainTransaction[] = [];
      const years: number[] = [];

      for (const filePath of filePaths) {
        const year = parseInt(/dvf_(\d{4})/.exec(path.basename(filePath))?.[1] ?? "0");
        if (year) years.push(year);

        console.log(`      📂 Traitement de ${path.basename(filePath)}...`);
        const { residentialTransactions, terrainTransactions } = await this.parseCSV(filePath);
        console.log(
          `         → ${residentialTransactions.length} transactions résidentielles + ${terrainTransactions.length} transactions terrain chargées`,
        );
        allResidentialData = allResidentialData.concat(residentialTransactions);
        allTerrainData = allTerrainData.concat(terrainTransactions);
      }

      this.yearRange = {
        min: Math.min(...years),
        max: Math.max(...years),
        years: years.toSorted((a, b) => b - a),
      };

      console.log(
        ` ✅ Total données chargées : ${allResidentialData.length} transactions résidentielles + ${allTerrainData.length} transactions terrain (${this.yearRange.min}-${this.yearRange.max})`,
      );
      return { residentialTransactions: allResidentialData, terrainTransactions: allTerrainData };
    } catch (error) {
      console.error(` ❌ Erreur lors du chargement : ${(error as Error).message}`);
      return null;
    }
  }

  private parseCSV(filePath: string): Promise<{
    residentialTransactions: DVFResidentialTransaction[];
    terrainTransactions: DVFTerrainTransaction[];
  }> {
    return new Promise((resolve, reject) => {
      const residentialData: DVFResidentialTransaction[] = [];
      const terrainData: DVFTerrainTransaction[] = [];
      let headers: (keyof RawDVFRow)[] = [];
      let isFirstRow = true;
      let buffer = "";

      const stream = filePath.endsWith(".gz")
        ? createReadStream(filePath).pipe(zlib.createGunzip())
        : createReadStream(filePath);

      const processLine = (line: string) => {
        if (line.trim() === "") return;

        if (isFirstRow) {
          headers = this.parseCSVLine(line) as (keyof RawDVFRow)[];
          isFirstRow = false;
          return;
        }

        const values = this.parseCSVLine(line);
        if (values.length === headers.length) {
          const row: Partial<RawDVFRow> = {};
          headers.forEach((header, index) => {
            row[header] = values[index];
          });

          if (this.isRelevantResidentialRow(row)) {
            residentialData.push(this.processResidentialRow(row as RawDVFRow));
          }
          if (this.isRelevantTerrainRow(row)) {
            terrainData.push(this.processTerrainRow(row as RawDVFRow));
          }
        }
      };

      stream.on("data", (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        lines.forEach(processLine);
      });

      stream.on("end", () => {
        if (buffer.trim()) {
          processLine(buffer);
        }
        resolve({ residentialTransactions: residentialData, terrainTransactions: terrainData });
      });

      stream.on("error", reject);
    });
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  private isRelevantResidentialRow(row: Partial<RawDVFRow>): boolean {
    return (
      row.nature_mutation === "Vente" &&
      !!row.valeur_fonciere &&
      !!row.surface_reelle_bati &&
      !!row.code_commune &&
      (row.type_local === "Appartement" || row.type_local === "Maison")
    );
  }

  private isRelevantTerrainRow(row: Partial<RawDVFRow>): boolean {
    return (
      row.nature_mutation === "Vente" &&
      row.nature_culture === "terrains a bâtir" &&
      !!row.valeur_fonciere &&
      parseFloat(row.valeur_fonciere) > 0 &&
      !!row.surface_terrain &&
      parseFloat(row.surface_terrain) > 0 &&
      !!row.code_commune
    );
  }

  private processResidentialRow(row: RawDVFRow): DVFResidentialTransaction {
    const prixM2 = parseFloat(row.valeur_fonciere) / parseFloat(row.surface_reelle_bati);
    const annee = row.date_mutation ? new Date(row.date_mutation).getFullYear() : null;

    return {
      annee,
      id_mutation: row.id_mutation,
      code_commune: row.code_commune,
      type_local: row.type_local,
      valeur_fonciere: parseFloat(row.valeur_fonciere),
      surface_reelle_bati: parseFloat(row.surface_reelle_bati),
      prix_m2: prixM2,
    };
  }

  private processTerrainRow(row: RawDVFRow): DVFTerrainTransaction {
    const surfaceTerrain = parseFloat(row.surface_terrain);
    const valeurFonciere = parseFloat(row.valeur_fonciere);
    const prixM2 = valeurFonciere / surfaceTerrain;
    const annee = row.date_mutation ? new Date(row.date_mutation).getFullYear() : null;

    return {
      annee,
      id_mutation: row.id_mutation,
      code_commune: row.code_commune,
      valeur_fonciere: valeurFonciere,
      surface_terrain: surfaceTerrain,
      prix_m2: prixM2,
    };
  }

  private cleanResidentialData(data: DVFResidentialTransaction[]): DVFResidentialTransaction[] {
    console.log(" 🧹 Nettoyage des données DVF résidentielles...");

    const initialCount = data.length;

    const cleanedData = data.filter(
      (row) => validResidentialTransactionSchema.safeParse(row).success,
    );

    const seen: Record<string, boolean> = {};
    const deduplicatedMutations = cleanedData.filter((item) => {
      return seen[item.id_mutation] ? false : (seen[item.id_mutation] = true);
    });

    const finalCount = deduplicatedMutations.length;
    console.log(
      `     → Données nettoyées : ${initialCount} → ${finalCount} transactions (${((finalCount / initialCount) * 100).toFixed(1)}%)\n`,
    );

    return deduplicatedMutations;
  }

  private cleanTerrainData(data: DVFTerrainTransaction[]): DVFTerrainTransaction[] {
    console.log(" 🧹 Nettoyage des données DVF terrains à bâtir...");

    const initialCount = data.length;

    const cleanedData = data.filter((row) => validTerrainTransactionSchema.safeParse(row).success);

    const seen: Record<string, boolean> = {};
    const deduplicatedMutations = cleanedData.filter((item) => {
      return seen[item.id_mutation] ? false : (seen[item.id_mutation] = true);
    });

    const finalCount = deduplicatedMutations.length;
    console.log(
      `     → Données nettoyées : ${initialCount} → ${finalCount} transactions (${((finalCount / initialCount) * 100).toFixed(1)}%)\n`,
    );

    return deduplicatedMutations;
  }

  private calculateCommuneStats(
    communes: Commune[],
    residentialData: DVFResidentialTransaction[],
    terrainData: DVFTerrainTransaction[],
  ): CommuneStats[] {
    console.log(" 📉 Calcul des statistiques par commune...");

    // Créer un index des communes par code
    const communeIndex: Record<string, Commune> = {};
    communes.forEach((commune) => {
      communeIndex[commune.code] = commune;
    });

    // Grouper les données DVF par commune et type
    const dvfGrouped: Record<string, DVFGroupedData> = {};
    residentialData.forEach((row) => {
      const key = row.code_commune;

      dvfGrouped[key] ??= {
        maisons: [],
        appartements: [],
        terrains: [],
      };

      if (row.type_local === "Maison") {
        dvfGrouped[key].maisons.push(row);
      } else if (row.type_local === "Appartement") {
        dvfGrouped[key].appartements.push(row);
      }
    });

    // Grouper les données terrain par commune
    terrainData.forEach((row) => {
      const key = row.code_commune;
      dvfGrouped[key] ??= {
        maisons: [],
        appartements: [],
        terrains: [],
      };
      dvfGrouped[key].terrains.push(row);
    });

    // Calculer les statistiques pour chaque commune
    const stats: CommuneStats[] = [];

    communes.forEach((commune) => {
      const dvfCommune = dvfGrouped[commune.code] ?? {
        maisons: [],
        appartements: [],
        terrains: [],
      };

      // Statistiques maisons
      const maisons = this.calculateResidentialTypeStats(dvfCommune.maisons);

      // Statistiques appartements
      const appartements = this.calculateResidentialTypeStats(dvfCommune.appartements);

      const residential = this.calculateResidentialTypeStats(
        dvfCommune.maisons.concat(dvfCommune.appartements),
      );

      // Statistiques terrains à bâtir
      const terrains = this.calculateTerrainStats(dvfCommune.terrains);

      stats.push({
        city_code: commune.code,
        da_name: commune.nom,
        da_population: commune.population ?? null,
        da_surface_ha: commune.surface ?? null,
        dvf_surface_median_residential: residential.surface_mediane,
        dvf_pxm2_median_residential: residential.prix_median_m2,
        dvf_nbtrans_residential: residential.nb_transactions,
        dvf_nbtrans_cod111: maisons.nb_transactions,
        dvf_pxm2_median_cod111: maisons.prix_median_m2,
        dvf_nbtrans_cod121: appartements.nb_transactions,
        dvf_pxm2_median_cod121: appartements.prix_median_m2,
        dvf_surface_median_cod111: maisons.surface_mediane,
        dvf_surface_median_cod121: appartements.surface_mediane,
        dvf_nbtrans_terrain: terrains.nb_transactions,
        dvf_pxm2_median_terrain: terrains.prix_median_m2,
        dvf_surface_median_terrain: terrains.surface_mediane,
      });
    });

    // Ajouter les données agrégées pour Lyon, Paris et Marseille
    this.addAggregatedCityWithArrondissementsStats(stats);

    console.log(`     → Statistiques calculées pour ${stats.length} codes commune\n`);

    return stats;
  }

  private calculateResidentialTypeStats(transactions: DVFResidentialTransaction[]): TypeStats {
    if (transactions.length === 0) {
      return {
        nb_transactions: 0,
        prix_median_m2: null,
        surface_mediane: null,
      };
    }

    // Trier par année décroissante, puis essayer les 3 années les plus récentes
    transactions.sort((a, b) => (b.annee ?? 0) - (a.annee ?? 0));

    let selectedTransactions: DVFResidentialTransaction[] = [];
    const recentYears = new Set(
      [...new Set(transactions.map((t) => t.annee).filter(Boolean))].slice(0, 3),
    );

    // Prendre les transactions des 3 années les plus récentes
    selectedTransactions = transactions.filter((t) => t.annee && recentYears.has(t.annee));

    // Si pas assez de transactions (moins de 5), prendre plus d'années
    if (selectedTransactions.length < 5 && transactions.length >= 5) {
      const allYears = [...new Set(transactions.map((t) => t.annee).filter(Boolean))];
      let yearIndex = 3;
      while (selectedTransactions.length < 5 && yearIndex < allYears.length) {
        const additionalTransactions = transactions.filter((t) => t.annee === allYears[yearIndex]);
        selectedTransactions.push(...additionalTransactions);
        yearIndex++;
      }
    }

    // Si encore pas assez, prendre toutes les transactions disponibles
    if (selectedTransactions.length < 5) {
      selectedTransactions = transactions;
    }

    // Calculer les médianes
    const prixM2Sorted = selectedTransactions.map((t) => t.prix_m2).toSorted((a, b) => a - b);
    const surfacesSorted = selectedTransactions
      .map((t) => t.surface_reelle_bati)
      .toSorted((a, b) => a - b);

    return {
      nb_transactions: selectedTransactions.length,
      prix_median_m2: Math.round(this.median(prixM2Sorted)),
      surface_mediane: Math.round(this.median(surfacesSorted)),
    };
  }

  private calculateTerrainStats(transactions: DVFTerrainTransaction[]): TypeStats {
    if (transactions.length === 0) {
      return {
        nb_transactions: 0,
        prix_median_m2: null,
        surface_mediane: null,
      };
    }

    // Trier par année décroissante, puis essayer les 3 années les plus récentes
    transactions.sort((a, b) => (b.annee ?? 0) - (a.annee ?? 0));

    let selectedTransactions: DVFTerrainTransaction[] = [];
    const recentYears = new Set(
      [...new Set(transactions.map((t) => t.annee).filter(Boolean))].slice(0, 3),
    );

    selectedTransactions = transactions.filter((t) => t.annee && recentYears.has(t.annee));

    if (selectedTransactions.length < 5 && transactions.length >= 5) {
      const allYears = [...new Set(transactions.map((t) => t.annee).filter(Boolean))];
      let yearIndex = 3;
      while (selectedTransactions.length < 5 && yearIndex < allYears.length) {
        const additionalTransactions = transactions.filter((t) => t.annee === allYears[yearIndex]);
        selectedTransactions.push(...additionalTransactions);
        yearIndex++;
      }
    }

    if (selectedTransactions.length < 5) {
      selectedTransactions = transactions;
    }

    const prixM2Sorted = selectedTransactions.map((t) => t.prix_m2).toSorted((a, b) => a - b);
    const surfacesSorted = selectedTransactions
      .map((t) => t.surface_terrain)
      .toSorted((a, b) => a - b);

    return {
      nb_transactions: selectedTransactions.length,
      prix_median_m2: Math.round(this.median(prixM2Sorted)),
      surface_mediane: Math.round(this.median(surfacesSorted)),
    };
  }

  private addAggregatedCityWithArrondissementsStats(stats: CommuneStats[]): void {
    Object.entries(this.cityArrondissements).forEach(([cityCode, arrondissements]) => {
      // Trouver les stats des arrondissements
      const arrondissementStats = stats.filter((stat) => arrondissements.includes(stat.city_code));

      if (arrondissementStats.length === 0) return;

      // Calculer les moyennes pondérées
      const aggregatedStats = this.calculateWeightedAverages(arrondissementStats);

      // Trouver la commune principale dans la liste (si elle existe déjà)
      const existingCityIndex = stats.findIndex((stat) => stat.city_code === cityCode);

      if (stats[existingCityIndex]) {
        // Remplacer l'entrée existante
        stats[existingCityIndex] = Object.assign(stats[existingCityIndex], aggregatedStats);
      }
    });
  }

  private calculateWeightedAverages(arrondissementStats: CommuneStats[]): Partial<CommuneStats> {
    // Filtrer les arrondissements avec des données valides
    const validMaisons = arrondissementStats.filter(
      (stat) => stat.dvf_nbtrans_cod111 > 0 && stat.dvf_pxm2_median_cod111 !== null,
    );
    const validAppartements = arrondissementStats.filter(
      (stat) => stat.dvf_nbtrans_cod121 > 0 && stat.dvf_pxm2_median_cod121 !== null,
    );
    const validTerrains = arrondissementStats.filter(
      (stat) => stat.dvf_nbtrans_terrain > 0 && stat.dvf_pxm2_median_terrain !== null,
    );

    // Calculer les moyennes pondérées par le nombre de transactions
    const calculateWeightedAverage = (
      validStats: CommuneStats[],
      transField: keyof CommuneStats,
      priceField: keyof CommuneStats,
      surfaceField: keyof CommuneStats,
    ): WeightedAverageResult => {
      if (validStats.length === 0) {
        return {
          transactions: 0,
          price: null,
          surface: null,
        };
      }

      const totalTransactions = validStats.reduce(
        (sum, stat) => sum + (stat[transField] as number),
        0,
      );

      const weightedPrice = validStats.reduce((sum, stat) => {
        const weight = (stat[transField] as number) / totalTransactions;
        return sum + (stat[priceField] as number) * weight;
      }, 0);

      const weightedSurface = validStats.reduce((sum, stat) => {
        const weight = (stat[transField] as number) / totalTransactions;
        return sum + (stat[surfaceField] as number) * weight;
      }, 0);

      return {
        transactions: totalTransactions,
        price: Math.round(weightedPrice),
        surface: Math.round(weightedSurface),
      };
    };

    const maisonsAvg = calculateWeightedAverage(
      validMaisons,
      "dvf_nbtrans_cod111",
      "dvf_pxm2_median_cod111",
      "dvf_surface_median_cod111",
    );

    const appartementsAvg = calculateWeightedAverage(
      validAppartements,
      "dvf_nbtrans_cod121",
      "dvf_pxm2_median_cod121",
      "dvf_surface_median_cod121",
    );

    const totalAvg = calculateWeightedAverage(
      arrondissementStats,
      "dvf_nbtrans_residential",
      "dvf_pxm2_median_residential",
      "dvf_surface_median_residential",
    );

    const terrainsAvg = calculateWeightedAverage(
      validTerrains,
      "dvf_nbtrans_terrain",
      "dvf_pxm2_median_terrain",
      "dvf_surface_median_terrain",
    );

    return {
      dvf_nbtrans_cod111: maisonsAvg.transactions,
      dvf_pxm2_median_cod111: maisonsAvg.price,
      dvf_surface_median_cod111: maisonsAvg.surface,
      dvf_nbtrans_cod121: appartementsAvg.transactions,
      dvf_pxm2_median_cod121: appartementsAvg.price,
      dvf_surface_median_cod121: appartementsAvg.surface,
      dvf_nbtrans_residential: totalAvg.transactions,
      dvf_pxm2_median_residential: totalAvg.price,
      dvf_surface_median_residential: totalAvg.surface,
      dvf_nbtrans_terrain: terrainsAvg.transactions,
      dvf_pxm2_median_terrain: terrainsAvg.price,
      dvf_surface_median_terrain: terrainsAvg.surface,
    };
  }

  private median(sortedArr: number[]): number {
    const mid = Math.floor(sortedArr.length / 2);
    return sortedArr.length % 2 !== 0
      ? sortedArr[mid]!
      : (sortedArr[mid - 1]! + sortedArr[mid]!) / 2;
  }

  private weightedMedian(values: { value: number; weight: number }[]) {
    if (values.length === 0) return 0;

    // Créer des paires valeur-poids et trier par valeur
    const sorted = values
      .filter(({ value, weight }) => !isNaN(value) && weight > 0)
      .toSorted((a, b) => a.value - b.value);

    if (sorted.length === 0) return 0;

    const totalWeight = sorted.reduce((sum, p) => sum + p.weight, 0);
    const seuil = totalWeight / 2;

    let cumul = 0;
    for (const element of sorted) {
      cumul += element.weight;
      if (cumul >= seuil) {
        return element.value;
      }
    }

    return sorted[sorted.length - 1]?.value ?? values[0]?.value ?? 0;
  }

  private identifyMissingDVFCommunes(data?: CommuneStats[]): CommuneStats[] {
    if (!data || data.length === 0) {
      return [];
    }

    // Filtrer les communes sans données DVF
    const communesSansDVF = data.filter((commune) => {
      // Une commune n'a pas de données DVF si :
      // 1. Aucune transaction pour les deux codes (cod111 et cod121)
      // 2. ET aucun prix médian disponible
      // 3. ET aucune surface médiane disponible

      const noTransactions = commune.dvf_nbtrans_cod111 === 0 && commune.dvf_nbtrans_cod121 === 0;

      const noPrices = !commune.dvf_pxm2_median_cod111 && !commune.dvf_pxm2_median_cod121;

      const noSurfaces = !commune.dvf_surface_median_cod111 && !commune.dvf_surface_median_cod121;

      return noTransactions && noPrices && noSurfaces;
    });

    return communesSansDVF;
  }

  private analyzeMissingCommunes(
    missingCommunes: CommuneStats[],
    allCommunes: CommuneStats[],
  ): void {
    const totalCommunes = allCommunes.length;
    const missingCount = missingCommunes.length;
    console.log("\n 🔴 COMMUNES SANS DONNÉES DVF\n");

    console.log(
      `   🔴 Nombre de communes sans données DVF: ${missingCount.toLocaleString("fr-FR")}`,
    );
    console.log(
      `   📈 Pourcentage sans données: ${((missingCount / totalCommunes) * 100).toFixed(1)}%`,
    );

    if (missingCount > 0) {
      // Analyse des communes manquantes
      const deptCounts: Record<string, number> = {};
      missingCommunes.forEach((commune) => {
        // Extraire le département du city_code (2 premiers chiffres)
        const cityCode = commune.city_code || "";
        const dept = cityCode.slice(0, 2);
        const deptKey = dept ? dept : "Non défini";
        deptCounts[deptKey] = (deptCounts[deptKey] ?? 0) + 1;
      });

      console.log("\n   🔍 DÉPARTEMENTS CONNUS ABSENTS DES DONNÉES DVF :\n");
      console.log(`      • Département Bas-rhin 67: ${deptCounts["67"] ?? 0} commune(s)`);
      console.log(`      • Département Haut-rhin 68: ${deptCounts["68"] ?? 0} commune(s)`);
      console.log(`      • Département Moselle 57: ${deptCounts["57"] ?? 0} commune(s)`);
      console.log(`      • Départements Outre-mer: ${deptCounts["97"] ?? 0} commune(s)`);

      const otherNotKnowMissingCommunes = missingCommunes.reduce<CommuneStats[]>(
        (result, commune) => {
          // Extraire le département du city_code (2 premiers chiffres)
          const cityCode = commune.city_code;
          const dept = cityCode.slice(0, 2);
          if (["57", "68", "67", "97", "98"].includes(dept)) {
            return result;
          }
          return [...result, commune];
        },
        [],
      );

      console.log(
        `\n   ❌ AUTRES COMMUNES SANS DONNÉES DVF : ${otherNotKnowMissingCommunes.length.toLocaleString("fr-FR")}\n`,
      );

      const groupedByPopulation = otherNotKnowMissingCommunes.reduce(
        (result, commune) => {
          if ((commune.da_population ?? 0) < 201) {
            return {
              others: result.others,
              verySmallCity: [...result.verySmallCity, commune],
            };
          }
          return {
            others: [...result.others, commune],
            verySmallCity: result.verySmallCity,
          };
        },
        { verySmallCity: [] as CommuneStats[], others: [] as CommuneStats[] },
      );

      console.log(
        `      • 🔍 Communes de moins de 200 habitants: ${groupedByPopulation.verySmallCity.length} commune(s)`,
      );

      console.log(
        `      • 🔴 Communes restantes de plus de 200 habitants sans données : ${groupedByPopulation.others.length}`,
      );

      // Trier par population de commune
      const sortedCommunes = [...groupedByPopulation.others];
      sortedCommunes.sort((a, b) => {
        const nameA = a.da_population ?? 0;
        const nameB = b.da_population ?? 0;
        return nameA - nameB;
      });

      // Afficher les communes (limiter à 20 pour éviter une sortie trop longue)
      const displayLimit = Math.min(20, sortedCommunes.length);
      if (sortedCommunes.length > 0) {
        console.log(`        | ${["city_code", "da_name", "da_population"].join(" | ")} |`);
        console.log(`        | ${["_________", "________", "_____________"].join(" | ")} |`);
      }
      sortedCommunes.slice(0, displayLimit + 1).forEach((commune) => {
        console.log(
          `        | ${[`${commune.city_code}    `, commune.da_name, commune.da_population].join(" | ")} |`,
        );
      });

      if (sortedCommunes.length > 20) {
        console.log(`        ... et ${sortedCommunes.length - 20} autres communes`);
      }
    }
  }

  private getMissingCommunesAnalysis(missingCommunes: CommuneStats[]): string {
    const totalCommunes = this.stats?.length ?? 0;
    const missingCount = missingCommunes.length;

    let analysis = `- **Total des communes analysées**: ${totalCommunes.toLocaleString("fr-FR")}\n`;
    analysis += `- **Communes sans données DVF**: ${missingCount.toLocaleString("fr-FR")}\n`;
    analysis += `- **Pourcentage sans données**: ${((missingCount / totalCommunes) * 100).toFixed(1)}%\n\n`;

    if (missingCount > 0) {
      // Analyse par département
      const deptCounts: Record<string, number> = {};
      missingCommunes.forEach((commune) => {
        const cityCode = commune.city_code;
        const dept = cityCode.slice(0, 2);
        const deptKey = dept ? dept : "Non défini";
        deptCounts[deptKey] = (deptCounts[deptKey] ?? 0) + 1;
      });

      analysis += `#### Départements connus absents des données DVF\n\n`;
      analysis += `- **Département Bas-Rhin (67)**: ${deptCounts["67"] ?? 0} commune(s)\n`;
      analysis += `- **Département Haut-Rhin (68)**: ${deptCounts["68"] ?? 0} commune(s)\n`;
      analysis += `- **Département Moselle (57)**: ${deptCounts["57"] ?? 0} commune(s)\n`;
      analysis += `- **Départements Outre-mer**: ${deptCounts["97"] ?? 0} commune(s)\n\n`;

      // Communes restantes
      const otherMissingCommunes = missingCommunes.filter((commune) => {
        const cityCode = commune.city_code;
        const dept = cityCode.slice(0, 2);
        return !["57", "68", "67", "97", "98"].includes(dept);
      });

      const groupedByPopulation = otherMissingCommunes.reduce(
        (result, commune) => {
          if ((commune.da_population ?? 0) < 201) {
            return {
              others: result.others,
              verySmallCity: [...result.verySmallCity, commune],
            };
          }
          return {
            others: [...result.others, commune],
            verySmallCity: result.verySmallCity,
          };
        },
        { verySmallCity: [] as CommuneStats[], others: [] as CommuneStats[] },
      );

      analysis += `#### Communes restantes sans données DVF: ${otherMissingCommunes.length.toLocaleString("fr-FR")}\n\n`;
      analysis += `- **Communes de moins de 200 habitants**: ${groupedByPopulation.verySmallCity.length} commune(s)\n`;
      analysis += `- **Communes de plus de 200 habitants sans données**: ${groupedByPopulation.others.length} commune(s)\n\n`;

      if (groupedByPopulation.others.length > 0) {
        analysis += `#### Communes de plus de 200 habitants sans données DVF\n\n`;

        const sortedCommunes = [...groupedByPopulation.others].toSorted(
          (a, b) => (b.da_population ?? 0) - (a.da_population ?? 0),
        );
        const displayLimit = Math.min(10, sortedCommunes.length);

        for (let i = 0; i < displayLimit; i++) {
          const commune = sortedCommunes[i];
          analysis += `- **${commune?.da_name}** (${commune?.city_code}) - ${commune?.da_population} habitants\n`;
        }

        if (sortedCommunes.length > 10) {
          analysis += `... et ${sortedCommunes.length - 10} autres communes\n`;
        }
      }
    }

    return analysis;
  }

  private exportResults(stats: CommuneStats[], filename = "cityStats.csv"): string {
    const outputPath = path.join(SCRIPT_DIR, filename);

    // Créer le contenu CSV
    const headers = [
      "city_code",
      "da_name",
      "da_population",
      "da_surface_ha",
      "dvf_nbtrans_residential",
      "dvf_pxm2_median_residential",
      "dvf_surface_median_residential",
      "dvf_nbtrans_cod111",
      "dvf_pxm2_median_cod111",
      "dvf_nbtrans_cod121",
      "dvf_pxm2_median_cod121",
      "dvf_surface_median_cod111",
      "dvf_surface_median_cod121",
      "dvf_nbtrans_terrain",
      "dvf_pxm2_median_terrain",
      "dvf_surface_median_terrain",
    ] as const;

    const csvContent = [
      headers.join(";"),
      ...stats.map((row) => headers.map((header) => row[header]).join(";")),
    ].join("\n");

    fs.writeFileSync(outputPath, csvContent, "utf-8");
    console.log(` 💾 Résultats exportés vers : ${outputPath}`);

    return outputPath;
  }

  private getNationalStats(stats: CommuneStats[]) {
    const statsForNationalComputation = stats.filter(
      ({ city_code }) => !Object.keys(this.cityArrondissements).includes(city_code),
    );

    // Calculer les statistiques nationales
    const statsAvecMaisons = statsForNationalComputation.filter(
      (s) => s.dvf_pxm2_median_cod111 !== null,
    );
    const statsAvecAppartements = statsForNationalComputation.filter(
      (s) => s.dvf_pxm2_median_cod121 !== null,
    );

    const medianMaisons =
      statsAvecMaisons.length > 0
        ? Math.round(
            this.weightedMedian(
              statsAvecMaisons.map((s) => ({
                weight: s.dvf_nbtrans_cod111,
                value: s.dvf_pxm2_median_cod111!,
              })),
            ),
          )
        : "Non disponible";

    const medianAppartements =
      statsAvecAppartements.length > 0
        ? Math.round(
            this.weightedMedian(
              statsAvecAppartements.map((s) => ({
                weight: s.dvf_nbtrans_cod121,
                value: s.dvf_pxm2_median_cod121!,
              })),
            ),
          )
        : "Non disponible";

    const medianTotal = Math.round(
      this.weightedMedian(
        statsForNationalComputation.map((s) => ({
          weight: s.dvf_nbtrans_residential,
          value: s.dvf_pxm2_median_residential!,
        })),
      ),
    );

    const totalTransactions = statsForNationalComputation.reduce(
      (sum, s) => sum + s.dvf_nbtrans_residential,
      0,
    );
    const totalTransactionsMaisons = statsForNationalComputation.reduce(
      (sum, s) => sum + s.dvf_nbtrans_cod111,
      0,
    );
    const totalTransactionsAppartements = statsForNationalComputation.reduce(
      (sum, s) => sum + s.dvf_nbtrans_cod121,
      0,
    );

    const statsAvecTerrains = statsForNationalComputation.filter(
      (s) => s.dvf_pxm2_median_terrain !== null,
    );
    const medianTerrains =
      statsAvecTerrains.length > 0
        ? Math.round(
            this.weightedMedian(
              statsAvecTerrains.map((s) => ({
                weight: s.dvf_nbtrans_terrain,
                value: s.dvf_pxm2_median_terrain!,
              })),
            ),
          )
        : "Non disponible";
    const totalTransactionsTerrains = statsForNationalComputation.reduce(
      (sum, s) => sum + s.dvf_nbtrans_terrain,
      0,
    );

    return {
      total: {
        pxm2_median: medianTotal,
        transactions: totalTransactions,
      },
      maisons: {
        pxm2_median: medianMaisons,
        transactions: totalTransactionsMaisons,
      },
      appartements: {
        pxm2_median: medianAppartements,
        transactions: totalTransactionsAppartements,
      },
      terrains: {
        pxm2_median: medianTerrains,
        transactions: totalTransactionsTerrains,
      },
      byPopulation: {
        ["0-500"]: Math.round(
          this.weightedMedian(
            statsForNationalComputation
              .filter(({ da_population }) => da_population && da_population < 501)
              .map((s) => ({
                weight: s.dvf_nbtrans_residential,
                value: s.dvf_pxm2_median_residential!,
              })),
          ),
        ),
        ["501-1500"]: Math.round(
          this.weightedMedian(
            statsForNationalComputation
              .filter(
                ({ da_population }) => da_population && da_population > 500 && da_population < 1501,
              )
              .map((s) => ({
                weight: s.dvf_nbtrans_residential,
                value: s.dvf_pxm2_median_residential!,
              })),
          ),
        ),
        ["1501-3000"]: Math.round(
          this.weightedMedian(
            statsForNationalComputation
              .filter(
                ({ da_population }) =>
                  da_population && da_population > 1500 && da_population < 3001,
              )
              .map((s) => ({
                weight: s.dvf_nbtrans_residential,
                value: s.dvf_pxm2_median_residential!,
              })),
          ),
        ),
        ["3001-10000"]: Math.round(
          this.weightedMedian(
            statsForNationalComputation
              .filter(
                ({ da_population }) =>
                  da_population && da_population > 3000 && da_population < 10001,
              )
              .map((s) => ({
                weight: s.dvf_nbtrans_residential,
                value: s.dvf_pxm2_median_residential!,
              })),
          ),
        ),
        ["10001-50000"]: Math.round(
          this.weightedMedian(
            statsForNationalComputation
              .filter(
                ({ da_population }) =>
                  da_population && da_population > 10000 && da_population < 50001,
              )
              .map((s) => ({
                weight: s.dvf_nbtrans_residential,
                value: s.dvf_pxm2_median_residential!,
              })),
          ),
        ),
        ["50001-100000"]: Math.round(
          this.weightedMedian(
            statsForNationalComputation
              .filter(
                ({ da_population }) =>
                  da_population && da_population > 50000 && da_population < 100001,
              )
              .map((s) => ({
                weight: s.dvf_nbtrans_residential,
                value: s.dvf_pxm2_median_residential!,
              })),
          ),
        ),
        ["+100001"]: Math.round(
          this.weightedMedian(
            statsForNationalComputation
              .filter(({ da_population }) => da_population && da_population > 100000)
              .map((s) => ({
                weight: s.dvf_nbtrans_residential,
                value: s.dvf_pxm2_median_residential!,
              })),
          ),
        ),
      },
    };
  }

  private generateAboutFile(stats: CommuneStats[]): string {
    const readmePath = path.join(SCRIPT_DIR, "README.md");

    // Compter les arrondissements
    const arrondissements = stats.filter((s) => this.arrondissementCodes.includes(s.city_code));

    // Identifier les communes sans données DVF pour le README
    const communesSansDVF = this.identifyMissingDVFCommunes(stats);
    const missingAnalysis = this.getMissingCommunesAnalysis(communesSansDVF);

    const nationalStats = this.getNationalStats(stats);

    const readmeContent = `# Génération des statistiques communales françaises

## Utilisation

\`\`\`sh
node build-city-stats.ts
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
   - Types de biens : Maisons (cod111), Appartements (cod121) et Terrains à bâtir
   - Surface et prix de vente

### Couverture géographique

- **Communes françaises** : ${(stats.length - arrondissements.length).toLocaleString()}
- **Arrondissements** : ${arrondissements.length} (Paris, Marseille, Lyon)
- **Total** : ${stats.length.toLocaleString()} entités géographiques

### Période d'analyse

- **Année la plus récente** : ${this.yearRange?.max ?? "N/A"}
- **Année la plus ancienne** : ${this.yearRange?.min ?? "N/A"}
- **Années disponibles** : ${this.yearRange?.years.join(", ") ?? "N/A"}

### Méthode de calcul

Pour chaque commune et type de bien :

1. **Priorité aux données récentes** : Les prix médians sont calculés prioritairement sur les 3 années les plus récentes
2. **Seuil de fiabilité** : Si moins de 5 transactions sont trouvées sur 3 ans, l'analyse remonte plus loin dans le temps
3. **Filtrage des données résidentielles** :
   - Surfaces entre 10 et 500 m²
   - Prix au m² entre 500 et 25 000 €/m²
   - Ventes uniquement (pas de donations, etc.)
4. **Filtrage des terrains à bâtir** :
   - Surface positive
   - Prix au m² positif et inférieur à 25 000 €/m²
   - Nature de culture : "terrains a bâtir"

### Statistiques nationales

- **Prix médian national** : ${nationalStats.total.pxm2_median} €/m²
  - **Prix médian national (maisons)** : ${nationalStats.maisons.pxm2_median} €/m²
  - **Prix médian national (appartements)** : ${nationalStats.appartements.pxm2_median} €/m²
  - **Prix médian national (terrains à bâtir)** : ${nationalStats.terrains.pxm2_median} €/m²
- **Total transactions analysées** : ${nationalStats.total.transactions.toLocaleString()}
  - **Total transactions maisons analysées** : ${nationalStats.maisons.transactions.toLocaleString()}
  - **Total transactions appartements analysées** : ${nationalStats.appartements.transactions.toLocaleString()}
  - **Total transactions terrains à bâtir analysées** : ${nationalStats.terrains.transactions.toLocaleString()}
- **Prix médian par tailles de communes** :
  - **Communes de moins de 500 habitants** : ${nationalStats.byPopulation["0-500"]} €/m²
  - **Communes de moins de 501 à 1500 habitants** : ${nationalStats.byPopulation["501-1500"]} €/m²
  - **Communes de moins de 1501 à 3000 habitants** : ${nationalStats.byPopulation["1501-3000"]} €/m²
  - **Communes de moins de 3001 à 10000 habitants** : ${nationalStats.byPopulation["3001-10000"]} €/m²
  - **Communes de moins de 10001 à 50000 habitants** : ${nationalStats.byPopulation["10001-50000"]} €/m²
  - **Communes de moins de 50001 à 100000 habitants** : ${nationalStats.byPopulation["50001-100000"]} €/m²
  - **Communes de moins de plus de 100000 habitants** : ${nationalStats.byPopulation["+100001"]} €/m²
- **Communes avec données** : ${stats.length.toLocaleString()}

### Structure du fichier cityStats.csv

| Colonne                     | Description                                |
| --------------------------- | ------------------------------------------ |
| \`city_code\`                 | Code INSEE de la commune ou arrondissement |
| \`da_name\`                   | Nom de la commune ou arrondissement        |
| \`da_population\`             | Population de la commune                   |
| \`da_surface_ha\`             | Surface de la commune en hectares          |
| \`dvf_nbtrans_residential\`    | Nombre de transactions résidentielles      |
| \`dvf_pxm2_median_residential\` | Prix médian au m² résidentiel (€/m²)     |
| \`dvf_surface_median_residential\` | Surface médiane résidentielle (m²)         |
| \`dvf_nbtrans_cod111\`        | Nombre de transactions de maisons          |
| \`dvf_pxm2_median_cod111\`    | Prix médian au m² des maisons (€/m²)       |
| \`dvf_nbtrans_cod121\`        | Nombre de transactions d'appartements      |
| \`dvf_pxm2_median_cod121\`    | Prix médian au m² des appartements (€/m²)  |
| \`dvf_surface_median_cod111\` | Surface médiane des maisons (m²)           |
| \`dvf_surface_median_cod121\` | Surface médiane des appartements (m²)      |
| \`dvf_nbtrans_terrain\`       | Nombre de transactions de terrains à bâtir |
| \`dvf_pxm2_median_terrain\`   | Prix médian au m² des terrains à bâtir     |
| \`dvf_surface_median_terrain\` | Surface médiane des terrains à bâtir (m²) |

### Limites

- Les données DVF ne couvrent pas toutes les transactions (notamment les ventes de logements sociaux)
- Certaines communes peuvent avoir peu ou pas de transactions selon les années
- Les prix peuvent varier significativement au sein d'une même commune selon les quartiers

### Analyse des données manquantes

${missingAnalysis}
---

- _Fichiers générés le ${new Date().toLocaleDateString("fr-FR")}_
`;

    fs.writeFileSync(readmePath, readmeContent, "utf-8");
    console.log(` ✓ Documentation générée : ${readmePath}`);

    return readmePath;
  }

  private displaySummary(): void {
    if (!this.stats || !this.yearRange) return;

    console.log("\n=== RÉSUMÉ DE L'EXTRACTION ===\n");
    console.log(` 📅 Période des données DVF : ${this.yearRange.min} - ${this.yearRange.max}`);

    const arrondissements = this.stats.filter((s) =>
      this.arrondissementCodes.includes(s.city_code),
    );
    const communes = this.stats.length - arrondissements.length;

    console.log(` 🏘️️ Communes analysées : ${communes.toLocaleString()}`);
    console.log(` 🏙️ Arrondissements analysés : ${arrondissements.length}`);
    console.log(` 💯 Total entités : ${this.stats.length.toLocaleString()}`);

    const communesAvecMaisons = this.stats.filter((s) => s.dvf_nbtrans_cod111 > 0).length;
    const communesAvecAppartements = this.stats.filter((s) => s.dvf_nbtrans_cod121 > 0).length;

    console.log(
      ` → Communes ou arrondissements avec données maisons : ${communesAvecMaisons.toLocaleString()}`,
    );
    console.log(
      ` → Communes ou arrondissements avec données appartements : ${communesAvecAppartements.toLocaleString()}`,
    );

    const totalTransactions = this.stats.reduce(
      (sum, s) => sum + s.dvf_nbtrans_cod111 + s.dvf_nbtrans_cod121,
      0,
    );

    console.log(` → Total transactions analysées : ${totalTransactions.toLocaleString()}`);

    const communesSansDVF = this.identifyMissingDVFCommunes(this.stats);
    this.analyzeMissingCommunes(communesSansDVF, this.stats);

    console.log("\n=== 🔎 PRIX MÉDIANS NATIONAUX ===\n");
    console.log(
      " Pour comparaison : https://explore.data.gouv.fr/fr/immobilier?onglet=carte&filtre=tous",
    );

    const nationalStats = this.getNationalStats(this.stats);

    console.log(` 💰 Prix médian toute transactions : ${nationalStats.total.pxm2_median} €/m²`);
    console.log(`     🏡 Maisons : ${nationalStats.maisons.pxm2_median} €/m²`);
    console.log(`     🏘️️ Appartements : ${nationalStats.appartements.pxm2_median} €/m²`);
    console.log(`     🏗️ Terrains à bâtir : ${nationalStats.terrains.pxm2_median} €/m²`);

    console.log("\n=== 💾 FICHIERS GÉNÉRÉS ===\n");
    console.log(" - cityStats.csv");
    console.log(" - README.md");
  }
}

// Utilisation directe
const analyzer = new DVFCommuneAnalyzer();

analyzer
  .analyzeAll()
  .then(() => {
    // oxlint-disable-next-line no-console
    console.log("\n✅ Extraction terminée avec succès !");
  })
  .catch(() => {
    // oxlint-disable-next-line no-console
    console.log("\n❌ Erreur lors de l'extraction");
  });
