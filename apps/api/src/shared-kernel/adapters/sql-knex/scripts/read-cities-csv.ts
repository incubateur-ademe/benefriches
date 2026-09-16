import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

import { SqlCity } from "../tableTypes";

const currentFileDir = import.meta.dirname;
const apiRootDir =
  currentFileDir.split(`${path.sep}apps${path.sep}api${path.sep}`)[0] +
  `${path.sep}apps${path.sep}api`;
const CITIES_CSV_PATH = path.resolve(apiRootDir, "data/cities/sqlCities.csv");

const HEADER = [
  "city_code",
  "name",
  "department",
  "region",
  "epci",
  "aldo_zpc",
  "aldo_code_greco",
  "aldo_code_groupeser",
  "aldo_code_ser",
  "aldo_code_bassin_populicole",
  "mte_zonage_abc",
].join(";");

const readLines = (filePath: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const lines: string[] = [];
    const rl = readline.createInterface({ input: fs.createReadStream(filePath, "utf-8") });
    rl.on("line", (line) => lines.push(line));
    rl.on("error", reject);
    rl.on("close", () => {
      resolve(lines);
    });
  });
};

const splitList = (value: string | undefined): string[] => {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v !== "");
};

export const readCitiesCsvData = async (): Promise<Omit<SqlCity, "id">[]> => {
  if (!fs.existsSync(CITIES_CSV_PATH)) {
    throw new Error(`Fichier introuvable : ${CITIES_CSV_PATH}`);
  }

  const lines = await readLines(CITIES_CSV_PATH);
  const rows: Omit<SqlCity, "id">[] = [];

  for (const line of lines) {
    if (line.trim() === "" || line === HEADER) continue;

    const [
      cityCode,
      name,
      department,
      region,
      epci,
      aldoZpc,
      aldoCodeGreco,
      aldoCodeGroupeser,
      aldoCodeSer,
      aldoCodeBassinPopulicole,
      mteZonageAbc,
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
    ];

    rows.push({
      city_code: cityCode,
      name,
      department,
      region,
      epci,
      aldo_zpc: aldoZpc ?? undefined,
      aldo_code_greco: splitList(aldoCodeGreco),
      aldo_code_groupeser: splitList(aldoCodeGroupeser),
      aldo_code_ser: splitList(aldoCodeSer),
      aldo_code_bassin_populicole: aldoCodeBassinPopulicole || undefined,
      mte_zonage_abc: mteZonageAbc ?? undefined,
    });
  }

  console.log(`📊 sqlCities.csv : ${rows.length} communes lues`);
  return rows;
};
