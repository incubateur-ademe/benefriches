import fs from "fs";
import path from "node:path";
import readline from "readline";

import { CityStats } from "../tableTypes";

export const readCityStatsCsvData = async () => {
  const dataPath = path.resolve(__dirname, "./../../../../../data/dvf/cityStats.csv");
  const HEADER =
    "cityCode;da_name;da_population;da_surface_ha;dvf_nbtrans_cod111;dvf_pxm2_median_cod111;dvf_nbtrans_cod121;dvf_pxm2_median_cod121;dvf_surface_median_cod111;dvf_surface_median_cod121";

  return new Promise<CityStats[]>((resolve, reject) => {
    const readStream = fs.createReadStream(dataPath, "utf-8");
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
      ];
      data.push({
        city_code,
        da_name,
        da_population: Number(da_population),
        da_surface_ha: Number(da_surface_ha),
        dvf_nbtrans: Number(dvf_nbtrans),
        dvf_pxm2_median: Number(dvf_pxm2_median),
        dvf_surface_median: Number(dvf_surface_median),
        dvf_nbtrans_cod111: Number(dvf_nbtrans_cod111),
        dvf_pxm2_median_cod111: Number(dvf_pxm2_median_cod111),
        dvf_nbtrans_cod121: Number(dvf_nbtrans_cod121),
        dvf_pxm2_median_cod121: Number(dvf_pxm2_median_cod121),
        dvf_surface_median_cod111: Number(dvf_surface_median_cod111),
        dvf_surface_median_cod121: Number(dvf_surface_median_cod121),
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
