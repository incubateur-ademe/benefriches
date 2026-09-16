import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

import { CityStats } from "../tableTypes";

const currentFileDir = import.meta.dirname;
const apiRootDir =
  currentFileDir.split(`${path.sep}apps${path.sep}api${path.sep}`)[0] +
  `${path.sep}apps${path.sep}api`;
const CSV_PATH = path.resolve(apiRootDir, "data/city-stats/cityStats.csv");

export const readCityStatsCsvData = () => {
  const HEADER =
    "city_code;da_name;da_population;da_surface_ha;dvf_nbtrans;dvf_pxm2_median;dvf_surface_median;dvf_nbtrans_cod111;dvf_pxm2_median_cod111;dvf_nbtrans_cod121;dvf_pxm2_median_cod121;dvf_surface_median_cod111;dvf_surface_median_cod121;dvf_nbtrans_terrain;dvf_pxm2_median_terrain;dvf_surface_median_terrain";

  return new Promise<CityStats[]>((resolve, reject) => {
    const readStream = fs.createReadStream(CSV_PATH, "utf-8");
    const rl = readline.createInterface({ input: readStream });
    const data: CityStats[] = [];

    rl.on("line", (line) => {
      if (line === HEADER) {
        return;
      }
      const [
        city_code,
        da_name,
        da_population,
        da_surface_ha,
        dvf_nbtrans,
        dvf_pxm2_median,
        dvf_surface_median,
        dvf_nbtrans_cod111,
        dvf_pxm2_median_cod111,
        dvf_surface_median_cod111,
        dvf_nbtrans_cod121,
        dvf_pxm2_median_cod121,
        dvf_surface_median_cod121,
        dvf_nbtrans_terrain,
        dvf_pxm2_median_terrain,
        dvf_surface_median_terrain,
        anct_part_actifs_transports_en_commun_2022,
        anct_taux_annuel_evol_population_2016_2022,
      ] = line.split(";") as [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
      ];
      data.push({
        city_code,
        da_name,
        da_population: Number(da_population),
        da_surface_ha: Number(da_surface_ha),
        dvf_nbtrans: Number(dvf_nbtrans),
        dvf_pxm2_median: dvf_pxm2_median ? Number(dvf_pxm2_median) : undefined,
        dvf_surface_median: dvf_surface_median ? Number(dvf_surface_median) : undefined,
        dvf_nbtrans_cod111: Number(dvf_nbtrans_cod111),
        dvf_pxm2_median_cod111: dvf_pxm2_median_cod111 ? Number(dvf_pxm2_median_cod111) : undefined,
        dvf_nbtrans_cod121: Number(dvf_nbtrans_cod121),
        dvf_pxm2_median_cod121: dvf_pxm2_median_cod121 ? Number(dvf_pxm2_median_cod121) : undefined,
        dvf_surface_median_cod111: dvf_surface_median_cod111
          ? Number(dvf_surface_median_cod111)
          : undefined,
        dvf_surface_median_cod121: dvf_surface_median_cod121
          ? Number(dvf_surface_median_cod121)
          : undefined,
        dvf_nbtrans_terrain: Number(dvf_nbtrans_terrain),
        dvf_pxm2_median_terrain: dvf_pxm2_median_terrain
          ? Number(dvf_pxm2_median_terrain)
          : undefined,
        dvf_surface_median_terrain: dvf_surface_median_terrain
          ? Number(dvf_surface_median_terrain)
          : undefined,
        anct_part_actifs_transports_en_commun_2022: anct_part_actifs_transports_en_commun_2022
          ? Number(anct_part_actifs_transports_en_commun_2022)
          : undefined,
        anct_taux_annuel_evol_population_2016_2022: anct_taux_annuel_evol_population_2016_2022
          ? Number(anct_taux_annuel_evol_population_2016_2022)
          : undefined,
        updated_at: new Date(),
      });
    });
    rl.on("error", (error: Error) => {
      reject(error);
    });
    rl.on("close", () => {
      console.log(`\n📊 Récupération des données CSV: ${data.length} communes trouvées`);
      resolve(data);
    });
  });
};
