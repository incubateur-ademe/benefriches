// oxlint-disable no-console
/* oxlint-disable typescript/no-non-null-assertion */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const ALDO_CITIES_PATH = path.resolve(import.meta.dirname, "./aldo/cities.csv");

const ADEME_COMMUNES__DIRECT_URL = `https://data-interne.ademe.fr/data-fair/api/v1/datasets/geo-communes/data-files/GEO06_COMMUNES.csv`;

const ZONAGE_ABC_RESOURCE_ID = "13f7282b-8a25-43ab-9713-8bb4e476df55";
const ZONAGE_ABC_TABULAR_API_URL = `https://tabular-api.data.gouv.fr/api/resources/${ZONAGE_ABC_RESOURCE_ID}/data/csv/`;

// Arrondissements municipaux de Paris / Lyon / Marseille
// Absents de ZONAGE_ABC_TABULAR_API_URL
const PARIS_LYON_MARSEILLE_ARRONDISSEMENTS: { mainCode: string; arrondissementCodes: string[] }[] =
  [
    {
      mainCode: "75056", // Paris
      arrondissementCodes: Array.from(
        { length: 20 },
        (_, i) => `751${String(i + 1).padStart(2, "0")}`,
      ),
    },
    {
      mainCode: "69123", // Lyon
      arrondissementCodes: Array.from({ length: 9 }, (_, i) => `6938${i + 1}`),
    },
    {
      mainCode: "13055", // Marseille
      arrondissementCodes: Array.from(
        { length: 16 },
        (_, i) => `132${String(i + 1).padStart(2, "0")}`,
      ),
    },
  ];

const OUTPUT_PATH = path.resolve(import.meta.dirname, "./sqlCities.csv");

type AldoRawRow = {
  originalCode: string;
  name: string;
  department: string;
  region: string;
  epci: string;
  zpc: string;
  code_greco: string[];
  code_groupeser: string[];
  code_ser: string[];
  code_bassin_populicole: string;
};

type CommuneRecord = {
  name: string;
  department: string; // code département, ex. "01"
  region: string; // code région, ex. "84"
  epci: string; // code EPCI (SIREN), ex. "200069193"
};

type ZonageAbcRecord = {
  name: string;
  zonage_abc: string;
};

type MergedRecord = {
  city_code: string;
  name: string;
  department: string;
  region: string;
  epci: string;
  aldo_zpc: string;
  aldo_code_greco: string[];
  aldo_code_groupeser: string[];
  aldo_code_ser: string[];
  aldo_code_bassin_populicole: string;
  mte_zonage_abc: string;
};

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

const splitCommaList = (value: string | undefined): string[] => {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v !== "");
};

const stripBom = (text: string): string => (text.charCodeAt(0) === 0xfeff ? text.slice(1) : text);

const splitLines = (text: string): string[] => text.split(/\r\n|\n|\r/).filter((l) => l.length > 0);

const detectDelimiter = (headerLine: string): "," | ";" => {
  const commaCount = (headerLine.match(/,/g) ?? []).length;
  const semicolonCount = (headerLine.match(/;/g) ?? []).length;
  return semicolonCount > commaCount ? ";" : ",";
};

const parseCsvLine = (line: string, delimiter: string): string[] => {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i]!;
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
};

const fetchCsvText = async (url: string, label: string): Promise<string> => {
  console.log(`🌐 Téléchargement ${label} depuis ${url} ...`);
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return stripBom(await response.text());
};

const fetchCsv = async (url: string, label: string): Promise<string> => {
  try {
    return await fetchCsvText(url, label);
  } catch (err) {
    console.warn(`⚠️  ${label} : échec via ${url} (${(err as Error).message ?? err})...`);
    throw err instanceof Error ? err : new Error(`Impossible de récupérer ${label}`);
  }
};

const ALDO_HEADER =
  "city_code;name;department;region;epci;zpc;code_greco;code_groupeser;code_ser;code_bassin_populicole";

const readAldoRawRows = async (): Promise<AldoRawRow[]> => {
  const lines = await readLines(ALDO_CITIES_PATH);
  const rows: AldoRawRow[] = [];

  for (const line of lines) {
    if (line === ALDO_HEADER || line.trim() === "") continue;

    const [
      cityCode,
      name,
      department,
      region,
      epci,
      zpc,
      codeGreco,
      codeGroupeser,
      codeSer,
      codeBassinPopulicole,
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
    ];

    rows.push({
      originalCode: cityCode,
      name,
      department,
      region,
      epci,
      zpc,
      code_greco: splitCommaList(codeGreco),
      code_groupeser: splitCommaList(codeGroupeser),
      code_ser: splitCommaList(codeSer),
      code_bassin_populicole: codeBassinPopulicole ?? "",
    });
  }

  console.log(
    `--- Aldo cities.csv : ${rows.length} communes trouvées (référentiel 2018, sans DOM TOM)`,
  );
  return rows;
};

const indexAldoRows = (rawRows: AldoRawRow[]): Map<string, AldoRawRow> => {
  const map = new Map<string, AldoRawRow>();

  for (const row of rawRows) {
    map.set(row.originalCode, row);
  }

  return map;
};

// Lecture du référentiel "Ref - Liste des communes" de https://data-interne.ademe.fr/datasets/geo-communes
const COMMUNES_FALLBACK_COLUMN_INDEXES = {
  dcoe_c_code: 0,
  dcoe_l_lib: 6,
  dreg_c_code: 1,
  ddep_c_code: 2,
  epci_code: 3,
  dcoe_c_actual: 8, // 1 - Commune actuelle 3 - Commune périmée 5 - Arrondissement municipal 6 - Commune déléguée
  dceo_c_code_pole: 10,
};

const readCommunesVilles = async (): Promise<{
  communesOuArrondissementActifsMap: Map<string, CommuneRecord>;
  communesDeleguesOrInactivesRefMap: Map<string, { name: string; cityCode: string }[]>;
}> => {
  const rawText = await fetchCsv(
    ADEME_COMMUNES__DIRECT_URL,
    "Ref - Liste des communes (data-interne.ademe.fr)",
  );
  const lines = splitLines(rawText);
  if (lines.length === 0)
    throw new Error("Référentiel communes et arrondissements de France : fichier vide");

  const delimiter = detectDelimiter(lines[0]!);
  const header = parseCsvLine(lines[0]!, delimiter).map((h) => h.trim().toLowerCase());

  const columnIndex = (name: keyof typeof COMMUNES_FALLBACK_COLUMN_INDEXES): number => {
    const foundIndex = header.indexOf(name);
    return foundIndex >= 0 ? foundIndex : COMMUNES_FALLBACK_COLUMN_INDEXES[name];
  };

  const col = {
    code_insee: columnIndex("dcoe_c_code"),
    nom_standard: columnIndex("dcoe_l_lib"),
    reg_code: columnIndex("dreg_c_code"),
    dep_code: columnIndex("ddep_c_code"),
    epci_code: columnIndex("epci_code"),
    dcoe_c_actual: columnIndex("dcoe_c_actual"),
    dceo_c_code_pole: columnIndex("dceo_c_code_pole"),
  };

  const communesOuArrondissementActifsMap = new Map<string, CommuneRecord>();
  const communesDeleguesOrInactivesRefMap = new Map<string, { name: string; cityCode: string }[]>();

  for (const line of lines.slice(1)) {
    const fields = parseCsvLine(line, delimiter);
    const codeInsee = fields[col.code_insee]?.trim();
    if (!codeInsee || codeInsee === "NR") continue;

    const actualCode = fields[col.dcoe_c_actual];

    if (actualCode === "6" || actualCode === "3") {
      const cityCodeRef = fields[col.dceo_c_code_pole]?.trim();

      if (cityCodeRef) {
        const existing = communesDeleguesOrInactivesRefMap.get(cityCodeRef) ?? [];
        communesDeleguesOrInactivesRefMap.set(
          cityCodeRef,
          existing.concat({
            name: fields[col.nom_standard]?.trim() ?? "",
            cityCode: codeInsee,
          }),
        );
      }
    } else {
      communesOuArrondissementActifsMap.set(codeInsee, {
        name: fields[col.nom_standard]?.trim() ?? "",
        department: fields[col.dep_code]?.trim() ?? "",
        region: fields[col.reg_code]?.trim() ?? "",
        epci: fields[col.epci_code]?.trim() ?? "",
      });
    }
  }

  console.log(
    `--- Communes et arrondissements de France (ademe, avec DOM TOM) : ${communesOuArrondissementActifsMap.size} communes actives trouvées et ${communesDeleguesOrInactivesRefMap.size} communes avec communes déléguées ou inactives`,
  );
  return { communesOuArrondissementActifsMap, communesDeleguesOrInactivesRefMap };
};

const ZONAGE_ABC_FALLBACK_COLUMN_INDEXES = { codgeo: 0, libgeo: 2, zonage: 3 };

const readZonageAbc = async (): Promise<Map<string, ZonageAbcRecord>> => {
  const rawText = await fetchCsv(ZONAGE_ABC_TABULAR_API_URL, "zonage ABC (data.gouv.fr)");
  const lines = splitLines(rawText);
  if (lines.length === 0) throw new Error("Zonage ABC : fichier vide");

  const delimiter = detectDelimiter(lines[0]!);
  const header = parseCsvLine(lines[0]!, delimiter).map((h) => h.trim());

  const codgeoIndex = header.findIndex((h) => h.toLowerCase() === "codgeo");
  const libgeoIndex = header.findIndex((h) => h.toLowerCase() === "libgeo");
  const zonageIndex = header.findIndex((h) => h.toLowerCase().startsWith("zonage"));

  const col = {
    codgeo: codgeoIndex >= 0 ? codgeoIndex : ZONAGE_ABC_FALLBACK_COLUMN_INDEXES.codgeo,
    libgeo: libgeoIndex >= 0 ? libgeoIndex : ZONAGE_ABC_FALLBACK_COLUMN_INDEXES.libgeo,
    zonage: zonageIndex >= 0 ? zonageIndex : ZONAGE_ABC_FALLBACK_COLUMN_INDEXES.zonage,
  };

  const map = new Map<string, ZonageAbcRecord>();
  for (const line of lines.slice(1)) {
    const fields = parseCsvLine(line, delimiter);
    const codgeo = fields[col.codgeo]?.trim();
    if (!codgeo) continue;

    map.set(codgeo, {
      name: fields[col.libgeo]?.trim() ?? "",
      zonage_abc: fields[col.zonage]?.trim() ?? "",
    });
  }

  console.log(`--- Zonage ABC (data.gouv.fr) : ${map.size} communes trouvées`);

  propagateZonageAbcToArrondissements(map);

  return map;
};

const propagateZonageAbcToArrondissements = (zonageMap: Map<string, ZonageAbcRecord>): void => {
  let propagatedCount = 0;

  for (const { mainCode, arrondissementCodes } of PARIS_LYON_MARSEILLE_ARRONDISSEMENTS) {
    const mainZonage = zonageMap.get(mainCode);
    if (!mainZonage || mainZonage.zonage_abc === "") continue;

    for (const code of arrondissementCodes) {
      if (zonageMap.has(code)) continue;

      zonageMap.set(code, { name: mainZonage.name, zonage_abc: mainZonage.zonage_abc });
      propagatedCount += 1;
    }
  }

  if (propagatedCount > 0) {
    console.log(
      `    ... valeur de la ville principale propagée à ${propagatedCount} arrondissement(s) ` +
        `Paris/Lyon/Marseille`,
    );
  }
};

const concatAndClean = (array1: string[], array2: string[]) =>
  Array.from(new Set(array1.concat(array2))).filter((code) => code !== "null");

const mergeAldoRecords = (records: (AldoRawRow | undefined)[]) =>
  records.reduce<AldoRawRow | undefined>((value, match) => {
    if (match && value) {
      const isEqual =
        match.zpc === value.zpc && match.code_bassin_populicole === value.code_bassin_populicole;
      if (isEqual) {
        return {
          ...value,
          code_greco: concatAndClean(value.code_greco, match.code_greco),
          code_groupeser: concatAndClean(value.code_groupeser, match.code_groupeser),
          code_ser: concatAndClean(value.code_ser, match.code_ser),
        };
      } else {
        return undefined;
      }
    } else if (match) {
      return match;
    }
    return value;
  }, undefined);

// Principalement des communes nouvelles qui ont été annulées depuis 2018 ou
// dont certaines communes sont sorties
const ALDO_EXCEPTIONS = new Map([
  ["15031", "15141"],
  ["15035", "15141"],
  ["15047", "15141"],
  ["15171", "15141"],
  ["85165", "85084"],
  ["85212", "85084"],
  ["60694", "60054"],
  ["49126", "49069"],
  ["14666", "14712"],
  ["14581", "14011"],
  ["12218", "12076"],
  ["69114", "69159"],
]);

const buildRecords = (
  communesOuArrondissementActifsMap: Map<string, CommuneRecord>,
  communesDeleguesOrInactivesRefMap: Map<string, { name: string; cityCode: string }[]>,
  aldoMap: Map<string, AldoRawRow>,
  zonageMap: Map<string, ZonageAbcRecord>,
): MergedRecord[] => {
  const activeRecords: MergedRecord[] = [];
  const formerRecords: {
    cityCode: string;
    aldoMatch: AldoRawRow;
    otherMatch: AldoRawRow | undefined;
    othersMatches: AldoRawRow[];
  }[] = [];

  let mergedAldo: string[] = [];
  let exceptionHandled: string[] = [];

  for (const [cityCode, commune] of communesOuArrondissementActifsMap) {
    const communesDeleguesOrInactives = communesDeleguesOrInactivesRefMap.get(cityCode) ?? [];

    let aldoMatch = aldoMap.get(cityCode);

    if (!aldoMatch) {
      const exception = ALDO_EXCEPTIONS.get(cityCode);
      if (exception) aldoMatch = aldoMap.get(exception);
      if (aldoMatch) exceptionHandled.push(cityCode);
    }

    const otherCityCodes = Array.from(
      new Set(communesDeleguesOrInactives.map((other) => other.cityCode)),
    );

    if (otherCityCodes.length > 0) {
      const othersMatches = otherCityCodes
        .map((code) => aldoMap.get(code))
        .filter((item) => item) as AldoRawRow[];
      const otherMatch = mergeAldoRecords(othersMatches);
      if (
        aldoMatch &&
        othersMatches.length > 0 &&
        (aldoMatch.zpc !== otherMatch?.zpc ||
          aldoMatch?.code_bassin_populicole !== otherMatch?.code_bassin_populicole)
      ) {
        formerRecords.push({
          cityCode,
          aldoMatch,
          otherMatch,
          othersMatches: othersMatches,
        });
      } else if (aldoMatch && othersMatches.length > 0) {
        mergedAldo.push(...othersMatches.map((i) => i.originalCode).filter((i) => i !== cityCode));
      } else if (!aldoMatch) {
        aldoMatch = otherMatch;
        mergedAldo.push(...othersMatches.map((i) => i.originalCode).filter((i) => i !== cityCode));
      }
    }

    let zonageMatch = zonageMap.get(cityCode);

    activeRecords.push({
      city_code: cityCode,
      name: commune.name,
      department: commune.department,
      region: commune.region,
      epci: commune.epci,
      aldo_zpc: aldoMatch?.zpc ?? "",
      aldo_code_greco: aldoMatch?.code_greco ?? [],
      aldo_code_groupeser: aldoMatch?.code_groupeser ?? [],
      aldo_code_ser: aldoMatch?.code_ser ?? [],
      aldo_code_bassin_populicole: aldoMatch?.code_bassin_populicole ?? "",
      mte_zonage_abc: zonageMatch?.zonage_abc ?? "",
    });
  }

  const aldoDeletion = formerRecords.flatMap((element) =>
    element.othersMatches.map((match) => match.originalCode),
  );

  console.log(
    `\n⚙️  Fusion -> Communes actives : ${activeRecords.length} lignes,
          - ${mergedAldo.length} lignes aldo mergées (communes nouvelles),  
          - ${aldoDeletion.length} lignes aldo supprimées,
          - ${exceptionHandled.length} exceptions gérées manuellement.`,
  );

  return activeRecords;
};

const writeCsv = (records: MergedRecord[]): void => {
  const header = [
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

  const sorted = [...records].toSorted((a, b) => a.city_code.localeCompare(b.city_code));

  const rows = sorted.map((r) =>
    [
      r.city_code,
      r.name,
      r.department,
      r.region,
      r.epci,
      r.aldo_zpc,
      r.aldo_code_greco.join(","),
      r.aldo_code_groupeser.join(","),
      r.aldo_code_ser.join(","),
      r.aldo_code_bassin_populicole,
      r.mte_zonage_abc,
    ].join(";"),
  );

  fs.writeFileSync(OUTPUT_PATH, [header, ...rows].join("\n") + "\n", "utf-8");
};

const printSummary = (activeRecords: MergedRecord[]): void => {
  const missingAldo = activeRecords.filter((r) => r.aldo_zpc === "").length;
  const missingZonage = activeRecords.filter((r) => r.mte_zonage_abc === "").length;

  console.log("\n📈 Récapitulatif de la fusion :");
  console.log(
    `   - Communes actives                                             : ${activeRecords.length}`,
  );
  console.log(`   - aldo manquant (zpc vide)                                     : ${missingAldo}`);
  console.log(
    `   - mte_zonage_abc manquant                                      : ${missingZonage}`,
  );
};

async function main() {
  console.log("--> Fusion des sources CSV pour la table `cities`...\n");

  const [communesMaps, aldoRawRows, zonageMap] = await Promise.all([
    readCommunesVilles(),
    readAldoRawRows(),
    readZonageAbc(),
  ]);

  const aldoMap = indexAldoRows(aldoRawRows);

  const activeRecords = buildRecords(
    communesMaps.communesOuArrondissementActifsMap,
    communesMaps.communesDeleguesOrInactivesRefMap,
    aldoMap,
    zonageMap,
  );

  writeCsv(activeRecords);
  printSummary(activeRecords);

  console.log(`\n✅ Fichier généré : ${OUTPUT_PATH}`);
}

void main();
