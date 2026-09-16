// oxlint-disable no-console
/* oxlint-disable typescript/no-non-null-assertion */
/* oxlint-disable typescript/no-unsafe-assignment */
/* oxlint-disable no-control-regex */
import { createReadStream, createWriteStream } from "node:fs";
import * as fs from "node:fs";
import * as https from "node:https";
import * as path from "node:path";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import * as zlib from "node:zlib";

import {
  ARRONDISSEMENTS_CITY_CODES,
  CITY_ARRONDISSEMENTS,
  Commune,
  CommuneStats,
} from "./build-city-stats-csv";

promisify(pipeline);

// Strips ASCII control characters from external values before logging to prevent log injection
const stripControlChars = (s: string) => s.replace(/[\x00-\x1F\x7F]/g, " ");

interface DVFTransaction {
  annee: number | null;
  id_mutation: string;
  code_commune: string;
  type_local: string;
  valeur_fonciere: number;
  surface_reelle_bati: number;
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
  id_parcelle?: string;
  surface_terrain?: string;
}

interface DVFTerrainTransaction {
  annee: number | null;
  id_mutation: string;
  code_commune: string;
  valeur_fonciere: number;
  surface_terrain: number;
  prix_m2: number;
}

interface TerrainMutationAcc {
  id_mutation: string;
  code_commune: string;
  annee: number | null;
  valeur_fonciere: number;
  // Clé = id_parcelle (ou clé synthétique si absent), valeur = surface_terrain
  // de cette parcelle. Une même parcelle peut apparaître sur plusieurs lignes
  // (une par nature de culture) avec la même surface_terrain répétée : on ne
  // veut la compter qu'une seule fois par parcelle distincte.
  parcelles: Map<string, number>;
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
  maisons: DVFTransaction[];
  appartements: DVFTransaction[];
}

interface WeightedAverageResult {
  transactions: number;
  price: number | null;
  surface: number | null;
}

export class DVFCommuneAnalyzer {
  private readonly dataPath: string;
  private dvfData: DVFTransaction[] | null = null;
  private dvfTerrainData: DVFTerrainTransaction[] | null = null;
  private stats: CommuneStats[] | null = null;
  private yearRange: YearRange | null = null;

  private readonly TERRAIN_SURFACE_MIN = 10; // m²
  private readonly TERRAIN_SURFACE_MAX = 10000; // m² (1 ha)
  private readonly TERRAIN_PRIX_M2_MIN = 1; // €/m²
  private readonly TERRAIN_PRIX_M2_MAX = 3000; // €/m²

  constructor(dataPath = path.resolve(import.meta.dirname, "./downloaded_sources")) {
    this.dataPath = dataPath;
    this.ensureDataDirectory();
  }

  async analyzeAll(communes: Commune[]): Promise<CommuneStats[]> {
    console.log("=== Analyse des mutations DVF communales françaises ===\n");

    // Télécharger les données DVF
    const filePaths = await this.downloadDVFData();
    if (!filePaths) throw new Error("no filePaths returned by downloadDVFData");
    console.log("\n");

    // Charger les données DVF
    const rawDvfData = await this.loadDVFData(filePaths);
    if (!rawDvfData) throw new Error("no rawDvfData returned by loadDVFData");
    console.log("\n");

    // Nettoyer les données DVF
    this.dvfData = this.cleanData(rawDvfData);

    // Calculer les statistiques par commune
    this.stats = this.calculateCommuneStats(communes, this.dvfData, this.dvfTerrainData ?? []);

    return this.stats;
  }

  private ensureDataDirectory(): void {
    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath, { recursive: true });
    }
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

  private downloadFile(url: string, filePath: string, maxRedirects = 5): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = createWriteStream(filePath);

      const doRequest = (currentUrl: string, redirectsLeft: number) => {
        https
          .get(currentUrl, (response) => {
            if (
              response.statusCode &&
              new Set([301, 302, 303, 307, 308]).has(response.statusCode)
            ) {
              response.resume(); // vide le flux pour libérer la socket
              if (redirectsLeft <= 0) {
                reject(new Error("Trop de redirections"));
                return;
              }

              if (response.headers.location) {
                const nextUrl = new URL(response.headers.location, currentUrl).toString();
                doRequest(nextUrl, redirectsLeft - 1);
                return;
              }
            }

            if (response.statusCode !== 200) {
              reject(new Error(`HTTP ${response.statusCode}`));
              return;
            }

            response.pipe(file);
            file.on("finish", () => {
              file.close();
              resolve();
            });
          })
          .on("error", (err) => {
            console.log("❌ Request error", err);
            file.close();
            reject(err);
          });
      };

      file.on("error", (err) => {
        console.log("❌ File error", err);
        file.close();
        reject(err);
      });

      doRequest(url, maxRedirects);
    });
  }

  private async loadDVFData(filePaths: string[]): Promise<DVFTransaction[] | null> {
    console.log(` ⏳ Chargement des données DVF depuis ${filePaths.length} fichier(s)...`);

    try {
      let allData: DVFTransaction[] = [];
      let allTerrainData: DVFTerrainTransaction[] = [];
      const years: number[] = [];

      for (const filePath of filePaths) {
        const year = parseInt(/dvf_(\d{4})/.exec(path.basename(filePath))?.[1] ?? "0");
        if (year) years.push(year);

        console.log(`      📂 Traitement de ${path.basename(filePath)}...`);
        const { data, terrainData } = await this.parseCSV(filePath);
        console.log(
          `         → ${data.length} transactions bâti, ${terrainData.length} transactions terrain sans bâti`,
        );
        allData = allData.concat(data);
        allTerrainData = allTerrainData.concat(terrainData);
      }

      this.dvfTerrainData = allTerrainData;

      this.yearRange = {
        min: Math.min(...years),
        max: Math.max(...years),
        years: years.toSorted((a, b) => b - a),
      };

      console.log(
        ` ✅ Total données chargées : ${allData.length} transactions bâti, ${allTerrainData.length} transactions terrain sans bâti (${this.yearRange.min}-${this.yearRange.max})`,
      );
      return allData;
    } catch (error) {
      console.error(` ❌ Erreur lors du chargement : ${(error as Error).message}`);
      return null;
    }
  }

  private streamCSVRows(filePath: string, onRow: (row: Partial<RawDVFRow>) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      let headers: (keyof RawDVFRow)[] = [];
      let isFirstRow = true;
      let buffer = "";

      const stream = filePath.endsWith(".gz")
        ? createReadStream(filePath).pipe(zlib.createGunzip())
        : createReadStream(filePath);

      const processLine = (line: string): void => {
        if (line.trim() === "") return;

        if (isFirstRow) {
          headers = this.parseCSVLine(line) as (keyof RawDVFRow)[];
          isFirstRow = false;
          return;
        }

        const values = this.parseCSVLine(line);
        if (values.length !== headers.length) return;

        const row: Partial<RawDVFRow> = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });

        onRow(row);
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
        resolve();
      });

      stream.on("error", reject);
    });
  }

  // Parse un fichier DVF en deux passages
  //  - 1: construit les transactions "bâti" et stocke dans un Set<string>
  //    l'id_mutation de toute mutation contenant au moins une ligne avec un
  //    type_local non vide
  //  - 2: repasse le fichier et construit le tableau de mutations sans bâti
  private async parseCSV(
    filePath: string,
  ): Promise<{ data: DVFTransaction[]; terrainData: DVFTerrainTransaction[] }> {
    const data: DVFTransaction[] = [];
    const mutationsWithBati = new Set<string>();

    await this.streamCSVRows(filePath, (row) => {
      if (this.isRelevantRow(row)) {
        data.push(this.processRow(row as RawDVFRow));
      }
      if (row.nature_mutation === "Vente" && row.type_local && row.id_mutation) {
        mutationsWithBati.add(row.id_mutation);
      }
    });

    const terrainAcc = new Map<string, TerrainMutationAcc>();

    await this.streamCSVRows(filePath, (row) => {
      if (
        row.nature_mutation !== "Vente" ||
        !row.valeur_fonciere ||
        !row.code_commune ||
        !row.id_mutation ||
        row.type_local ||
        mutationsWithBati.has(row.id_mutation)
      ) {
        return;
      }
      this.accumulateTerrainRow(terrainAcc, row as RawDVFRow);
    });

    const terrainData = this.buildTerrainData(terrainAcc);

    return { data, terrainData };
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

  private isRelevantRow(row: Partial<RawDVFRow>): boolean {
    return (
      row.nature_mutation === "Vente" &&
      !!row.valeur_fonciere &&
      !!row.surface_reelle_bati &&
      !!row.code_commune &&
      (row.type_local === "Appartement" || row.type_local === "Maison")
    );
  }

  private processRow(row: RawDVFRow): DVFTransaction {
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

  private accumulateTerrainRow(acc: Map<string, TerrainMutationAcc>, row: RawDVFRow): void {
    const valeurFonciere = parseFloat(row.valeur_fonciere);
    if (!valeurFonciere || valeurFonciere <= 0) return;

    let mutationAcc = acc.get(row.id_mutation);
    if (!mutationAcc) {
      mutationAcc = {
        id_mutation: row.id_mutation,
        code_commune: row.code_commune,
        annee: row.date_mutation ? new Date(row.date_mutation).getFullYear() : null,
        valeur_fonciere: valeurFonciere,
        parcelles: new Map(),
      };
      acc.set(row.id_mutation, mutationAcc);
    }

    const surfaceTerrain = row.surface_terrain ? parseFloat(row.surface_terrain) : 0;
    if (!surfaceTerrain || surfaceTerrain <= 0) return;

    if (row.id_parcelle) {
      // On écrase volontairement une valeur précédente pour la même parcelle :
      // les lignes en double (une par nature de culture) portent la même
      // surface_terrain totale de la parcelle, ce n'est pas une somme à faire.
      mutationAcc.parcelles.set(row.id_parcelle, surfaceTerrain);
    } else {
      // Pas d'id_parcelle exploitable sur cette ligne : on garde quand même la
      // surface plutôt que de perdre l'information, avec une clé synthétique.
      mutationAcc.parcelles.set(`__noid_${mutationAcc.parcelles.size}`, surfaceTerrain);
    }
  }

  // Reconstitue les transactions "terrain sans bâti" : on divise la
  // valeur_fonciere totale de la mutation par la somme des surfaces des
  // parcelles distinctes qui la composent.
  private buildTerrainData(acc: Map<string, TerrainMutationAcc>): DVFTerrainTransaction[] {
    const result: DVFTerrainTransaction[] = [];

    acc.forEach((mutationAcc) => {
      if (mutationAcc.parcelles.size === 0) return;
      if (!mutationAcc.annee || !mutationAcc.code_commune) return;

      const surfaceTerrainTotale = Array.from(mutationAcc.parcelles.values()).reduce(
        (sum, s) => sum + s,
        0,
      );

      if (
        surfaceTerrainTotale < this.TERRAIN_SURFACE_MIN ||
        surfaceTerrainTotale > this.TERRAIN_SURFACE_MAX
      ) {
        return;
      }

      const prixM2 = mutationAcc.valeur_fonciere / surfaceTerrainTotale;
      if (prixM2 < this.TERRAIN_PRIX_M2_MIN || prixM2 > this.TERRAIN_PRIX_M2_MAX) {
        return;
      }

      result.push({
        annee: mutationAcc.annee,
        id_mutation: mutationAcc.id_mutation,
        code_commune: mutationAcc.code_commune,
        valeur_fonciere: mutationAcc.valeur_fonciere,
        surface_terrain: surfaceTerrainTotale,
        prix_m2: prixM2,
      });
    });

    return result;
  }

  private cleanData(data: DVFTransaction[]): DVFTransaction[] {
    console.log(" 🧹 Nettoyage des données DVF...");

    const initialCount = data.length;

    const cleanedData = data.filter((row) => {
      // Supprimer les valeurs invalides
      if (!row.valeur_fonciere || !row.surface_reelle_bati || !row.code_commune || !row.annee) {
        return false;
      }

      // Filtrer les surfaces réalistes (entre 10 et 500 m²)
      if (row.surface_reelle_bati < 10 || row.surface_reelle_bati > 500) {
        return false;
      }

      // Filtrer les prix au m² réalistes (entre 500 et 25000 €/m²)
      if (row.prix_m2 < 500 || row.prix_m2 > 25000) {
        return false;
      }

      return true;
    });

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
    dvfData: DVFTransaction[],
    dvfTerrainData: DVFTerrainTransaction[],
  ): CommuneStats[] {
    console.log(" 📉 Calcul des statistiques par commune...");

    // Grouper les données DVF par commune et type
    const dvfGrouped: Record<string, DVFGroupedData> = {};
    dvfData.forEach((row) => {
      const key = row.code_commune;

      dvfGrouped[key] ??= {
        maisons: [],
        appartements: [],
      };

      if (row.type_local === "Maison") {
        dvfGrouped[key].maisons.push(row);
      } else if (row.type_local === "Appartement") {
        dvfGrouped[key].appartements.push(row);
      }
    });

    const dvfTerrainGrouped: Record<string, DVFTerrainTransaction[]> = {};
    dvfTerrainData.forEach((row) => {
      (dvfTerrainGrouped[row.code_commune] ??= []).push(row);
    });

    const stats: CommuneStats[] = [];

    communes.forEach((commune) => {
      const dvfCommune = dvfGrouped[commune.code] ?? { maisons: [], appartements: [] };

      // Statistiques maisons
      const maisons = this.calculateTypeStats(dvfCommune.maisons);

      // Statistiques appartements
      const appartements = this.calculateTypeStats(dvfCommune.appartements);

      const total = this.calculateTypeStats(dvfCommune.maisons.concat(dvfCommune.appartements));

      const terrains = this.calculateTerrainStats(dvfTerrainGrouped[commune.code] ?? []);

      stats.push({
        city_code: commune.code,
        da_name: commune.nom,
        da_population: commune.population ?? null,
        da_surface_ha: commune.surface ?? null,
        dvf_surface_median: total.surface_mediane,
        dvf_pxm2_median: total.prix_median_m2,
        dvf_nbtrans: total.nb_transactions,
        dvf_nbtrans_cod111: maisons.nb_transactions,
        dvf_pxm2_median_cod111: maisons.prix_median_m2,
        dvf_nbtrans_cod121: appartements.nb_transactions,
        dvf_pxm2_median_cod121: appartements.prix_median_m2,
        dvf_surface_median_cod111: maisons.surface_mediane,
        dvf_surface_median_cod121: appartements.surface_mediane,
        dvf_surface_median_terrain: terrains.surface_mediane,
        dvf_pxm2_median_terrain: terrains.prix_median_m2,
        dvf_nbtrans_terrain: terrains.nb_transactions,
      });
    });

    // Ajouter les données agrégées pour Lyon, Paris et Marseille
    this.addAggregatedCityWithArrondissementsStats(stats);

    console.log(`     → Statistiques calculées pour ${stats.length} codes commune\n`);

    return stats;
  }

  private calculateTypeStats(transactions: DVFTransaction[]): TypeStats {
    return this.calculateStatsGeneric(transactions, (t) => t.surface_reelle_bati);
  }

  private calculateTerrainStats(transactions: DVFTerrainTransaction[]): TypeStats {
    return this.calculateStatsGeneric(transactions, (t) => t.surface_terrain);
  }

  private calculateStatsGeneric<T extends { annee: number | null; prix_m2: number }>(
    transactions: T[],
    getSurface: (t: T) => number,
  ): TypeStats {
    if (transactions.length === 0) {
      return {
        nb_transactions: 0,
        prix_median_m2: null,
        surface_mediane: null,
      };
    }

    // Trier par année décroissante, puis essayer les 3 années les plus récentes
    transactions.sort((a, b) => (b.annee ?? 0) - (a.annee ?? 0));

    const recentYears = new Set(
      [...new Set(transactions.map((t) => t.annee).filter(Boolean))].slice(0, 3),
    );

    // Prendre les transactions des 3 années les plus récentes
    let selectedTransactions: T[] = transactions.filter((t) => t.annee && recentYears.has(t.annee));

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
    const surfacesSorted = selectedTransactions.map(getSurface).toSorted((a, b) => a - b);

    return {
      nb_transactions: selectedTransactions.length,
      prix_median_m2: Math.round(this.median(prixM2Sorted)),
      surface_mediane: Math.round(this.median(surfacesSorted)),
    };
  }

  private addAggregatedCityWithArrondissementsStats(stats: CommuneStats[]): void {
    Object.entries(CITY_ARRONDISSEMENTS).forEach(([cityCode, arrondissements]) => {
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
      "dvf_nbtrans",
      "dvf_pxm2_median",
      "dvf_surface_median",
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
      dvf_nbtrans: totalAvg.transactions,
      dvf_pxm2_median: totalAvg.price,
      dvf_surface_median: totalAvg.surface,
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
          `        | ${[
            `${commune.city_code}    `,
            stripControlChars(commune.da_name),
            commune.da_population,
          ].join(" | ")} |`,
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

  private getNationalStats(stats: CommuneStats[]) {
    const statsForNationalComputation = stats.filter(
      ({ city_code }) => !ARRONDISSEMENTS_CITY_CODES.has(city_code),
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
          weight: s.dvf_nbtrans,
          value: s.dvf_pxm2_median!,
        })),
      ),
    );

    const totalTransactions = statsForNationalComputation.reduce(
      (sum, s) => sum + s.dvf_nbtrans,
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
      byPopulation: {
        ["0-500"]: Math.round(
          this.weightedMedian(
            statsForNationalComputation
              .filter(({ da_population }) => da_population && da_population < 501)
              .map((s) => ({
                weight: s.dvf_nbtrans,
                value: s.dvf_pxm2_median!,
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
                weight: s.dvf_nbtrans,
                value: s.dvf_pxm2_median!,
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
                weight: s.dvf_nbtrans,
                value: s.dvf_pxm2_median!,
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
                weight: s.dvf_nbtrans,
                value: s.dvf_pxm2_median!,
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
                weight: s.dvf_nbtrans,
                value: s.dvf_pxm2_median!,
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
                weight: s.dvf_nbtrans,
                value: s.dvf_pxm2_median!,
              })),
          ),
        ),
        ["+100001"]: Math.round(
          this.weightedMedian(
            statsForNationalComputation
              .filter(({ da_population }) => da_population && da_population > 100000)
              .map((s) => ({
                weight: s.dvf_nbtrans,
                value: s.dvf_pxm2_median!,
              })),
          ),
        ),
      },
    };
  }

  public generateAboutFileContent(stats: CommuneStats[]): string {
    const communesSansDVF = this.identifyMissingDVFCommunes(stats);
    const missingAnalysis = this.getMissingCommunesAnalysis(communesSansDVF);

    const nationalStats = this.getNationalStats(stats);

    const readmeContent = `# Génération des statistiques communales françaises

### DVF

#### Période d'analyse

- **Année la plus récente** : ${this.yearRange?.max ?? "N/A"}
- **Année la plus ancienne** : ${this.yearRange?.min ?? "N/A"}
- **Années disponibles** : ${this.yearRange?.years.join(", ") ?? "N/A"}

#### Méthode de calcul

Pour chaque commune et type de bien :

1. **Priorité aux données récentes** : Les prix médians sont calculés prioritairement sur les 3 années les plus récentes
2. **Seuil de fiabilité** : Si moins de 5 transactions sont trouvées sur 3 ans, l'analyse remonte plus loin dans le temps
3. **Filtrage des données** :
   - Surfaces entre 10 et 500 m²
   - Prix au m² entre 500 et 25 000 €/m²
   - Ventes uniquement (pas de donations, etc.)

#### Méthode de calcul du prix foncier sans bâti (terrain)

Le fichier DVF ne détaille jamais le prix de chaque parcelle d'une mutation :
seule la \`valeur_fonciere\` totale de la mutation est connue. Il est donc
impossible d'isoler le prix d'un terrain vendu avec une maison. Le prix du
terrain (\`dvf_pxm2_median_terrain\`) n'est donc calculé **que sur les
mutations ne contenant aucun bâti** (aucune ligne Maison, Appartement,
Dépendance, local commercial...) :

1. Une mutation est écartée dès qu'une de ses lignes porte un \`type_local\`
2. Pour les mutations restantes, les parcelles distinctes (\`id_parcelle\`) sont
   dédupliquées (une même parcelle peut apparaître sur plusieurs lignes selon
   sa nature de culture) et leurs surfaces (\`surface_terrain\`) sont additionnées
3. Le prix au m² est \`valeur_fonciere / surface_terrain_totale\`
4. **Filtrage des données** :
   - Surface totale entre ${this.TERRAIN_SURFACE_MIN} et ${this.TERRAIN_SURFACE_MAX} m²
   - Prix au m² entre ${this.TERRAIN_PRIX_M2_MIN} et ${this.TERRAIN_PRIX_M2_MAX} €/m²

Cette méthode **sous-estime le nombre de communes couvertes** : elle exclut
volontairement toute mutation mixte (terrain vendu avec une maison), qui
reste largement majoritaire dans le foncier résidentiel.

#### Statistiques nationales

- **Prix médian national** : ${nationalStats.total.pxm2_median} €/m²
  - **Prix médian national (maisons)** : ${nationalStats.maisons.pxm2_median} €/m²
  - **Prix médian national (appartements)** : ${nationalStats.appartements.pxm2_median} €/m²
- **Total transactions analysées** : ${nationalStats.total.transactions.toLocaleString()}
  - **Total transactions maisons analysées** : ${nationalStats.maisons.transactions.toLocaleString()}
  - **Total transactions appartements analysées** : ${nationalStats.appartements.transactions.toLocaleString()}
- **Prix médian par tailles de communes** :
  - **Communes de moins de 500 habitants** : ${nationalStats.byPopulation["0-500"]} €/m²
  - **Communes de moins de 501 à 1500 habitants** : ${nationalStats.byPopulation["501-1500"]} €/m²
  - **Communes de moins de 1501 à 3000 habitants** : ${nationalStats.byPopulation["1501-3000"]} €/m²
  - **Communes de moins de 3001 à 10000 habitants** : ${nationalStats.byPopulation["3001-10000"]} €/m²
  - **Communes de moins de 10001 à 50000 habitants** : ${nationalStats.byPopulation["10001-50000"]} €/m²
  - **Communes de moins de 50001 à 100000 habitants** : ${nationalStats.byPopulation["50001-100000"]} €/m²
  - **Communes de moins de plus de 100000 habitants** : ${nationalStats.byPopulation["+100001"]} €/m²
- **Communes avec données** : ${stats.length.toLocaleString()}

#### Limites

- Les données DVF ne couvrent pas toutes les transactions (notamment les ventes de logements sociaux)
- Certaines communes peuvent avoir peu ou pas de transactions selon les années
- Les prix peuvent varier significativement au sein d'une même commune selon les quartiers
- Le prix foncier sans bâti (\`dvf_pxm2_median_terrain\`) repose uniquement sur les mutations 100% terrain (sans aucune construction) ; c'est une minorité des ventes, donc beaucoup de communes n'auront aucune valeur pour ces colonnes malgré une activité immobilière normale

#### Analyse des données manquantes

${missingAnalysis}

`;
    return readmeContent;
  }

  public displaySummary(): void {
    if (!this.stats || !this.yearRange) return;

    console.log("\n=== RÉSUMÉ DE L'EXTRACTION ===\n");
    console.log(` 📅 Période des données DVF : ${this.yearRange.min} - ${this.yearRange.max}`);

    console.log(` 🏘️️ Communes analysées : ${this.stats.length.toLocaleString()}`);

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
  }
}
