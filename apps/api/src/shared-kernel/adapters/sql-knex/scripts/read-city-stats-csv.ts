import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

import { CityStats } from "../tableTypes";

export const readCityStatsCsvData = () => {
  const dataPath = path.resolve(__dirname, "./../../../../../data/dvf/cityStats.csv");
  const HEADER =
    "city_code;da_name;da_population;da_surface_ha;dvf_nbtrans_residential;dvf_pxm2_median_residential;dvf_surface_median_residential;dvf_nbtrans_cod111;dvf_pxm2_median_cod111;dvf_nbtrans_cod121;dvf_pxm2_median_cod121;dvf_surface_median_cod111;dvf_surface_median_cod121;dvf_nbtrans_terrain;dvf_pxm2_median_terrain;dvf_surface_median_terrain";

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
        dvf_nbtrans_residential,
        dvf_pxm2_median_residential,
        dvf_surface_median_residential,
        dvf_nbtrans_cod111,
        dvf_pxm2_median_cod111,
        dvf_nbtrans_cod121,
        dvf_pxm2_median_cod121,
        dvf_surface_median_cod111,
        dvf_surface_median_cod121,
        dvf_nbtrans_terrain,
        dvf_pxm2_median_terrain,
        dvf_surface_median_terrain,
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
      ];
      data.push({
        city_code,
        da_name,
        da_population: Number(da_population),
        da_surface_ha: Number(da_surface_ha),
        dvf_nbtrans_residential: Number(dvf_nbtrans_residential),
        dvf_pxm2_median_residential: dvf_pxm2_median_residential
          ? Number(dvf_pxm2_median_residential)
          : undefined,
        dvf_surface_median_residential: dvf_surface_median_residential
          ? Number(dvf_surface_median_residential)
          : undefined,
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
        dvf_nbtrans_terrain: dvf_nbtrans_terrain ? Number(dvf_nbtrans_terrain) : undefined,
        dvf_pxm2_median_terrain: dvf_pxm2_median_terrain
          ? Number(dvf_pxm2_median_terrain)
          : undefined,
        dvf_surface_median_terrain: dvf_surface_median_terrain
          ? Number(dvf_surface_median_terrain)
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
