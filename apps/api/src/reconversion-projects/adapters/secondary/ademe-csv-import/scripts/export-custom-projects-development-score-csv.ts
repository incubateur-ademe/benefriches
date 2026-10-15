// oxlint-disable no-console
import { HttpService } from "@nestjs/axios";
import { create as axiosCreate } from "axios";
import { configDotenv } from "dotenv";
import knex from "knex";
import fs from "node:fs";
import path from "node:path";
import { lastValueFrom } from "rxjs";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { CapitalExpendituresResult } from "src/territory/core/gateways/MunicipalityCapitalExpendituresProvider";

import { buildScriptComputeDevelopmentScoreUseCase } from "../ademeScriptDeps";
import { escapeCsvValue } from "../export/ademeImpactsCsvRow";
import {
  buildDevelopmentScoreProjectsCsvRow,
  DEVELOPMENT_SCORE_PROJECTS_CSV_HEADERS,
} from "../export/developmentScoreProjectsCsvRow";

const dotEnvPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(dotEnvPath)) {
  // quiet: dotenv's startup banner would otherwise go to stdout and corrupt the CSV
  configDotenv({ path: dotEnvPath, quiet: true });
}

function logProgress(message: string): void {
  process.stderr.write(`${message}\n`);
}
const httpService = new HttpService(axiosCreate({ timeout: 10_000 }));

// observatoire des finances et de la gestion publique locales
const OFGL_URL = `https://data.ofgl.fr/api/explore/v2.1/catalog/datasets/ofgl-base-communes-consolidee/records`;
interface ApiRecord {
  montant: number;
  annee_join: string;
  insee: string;
}

interface ApiResult {
  total_count: number;
  results: ApiRecord[];
}

const PAGE_SIZE = 100;

async function fetchAllCapitalExpenditures(
  httpService: HttpService,
  cityCodes: string[],
): Promise<ApiRecord[]> {
  const records: ApiRecord[] = [];
  let totalCount = Number.POSITIVE_INFINITY;

  while (records.length < totalCount) {
    const { data } = await lastValueFrom(
      httpService.get<ApiResult>(OFGL_URL, {
        timeout: 10_000,
        params: {
          select: "montant,annee_join,insee",
          where: `(${cityCodes.map((code) => `com_code="${code}"`).join(" or ")}) and annee_join="2025"`,
          refine: `agregat:"Dépenses d'équipement"`,
          order_by: "insee", // tri déterministe, indispensable pour que la pagination soit cohérente
          limit: PAGE_SIZE,
          offset: records.length,
        },
      }),
    );

    totalCount = data.total_count;

    if (data.results.length === 0) break;

    records.push(...data.results);
  }

  return records;
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

// oxlint-disable-next-line typescript/no-floating-promises
(async () => {
  logProgress("Connecting to database...");
  const db = knex(knexConfig);

  try {
    const projects = await db("reconversion_projects")
      .select(
        "reconversion_projects.id",
        "reconversion_projects.name",
        "reconversion_projects.created_by",
        "reconversion_projects.created_at",
        "reconversion_projects.updated_at",
        "sites.created_at as s_created_at",
        "sites.updated_at as s_updated_at",
        "addresses.city_code",
      )
      .innerJoin("sites", "sites.id", "=", "reconversion_projects.related_site_id")
      .innerJoin("addresses", "addresses.site_id", "=", "sites.id")
      .where("reconversion_projects.creation_mode", "custom")
      .andWhere("reconversion_projects.status", "active")
      .orderBy("reconversion_projects.created_at");

    logProgress(`Found ${projects.length} custom, active reconversion projects`);

    const cityCodes = Array.from(
      new Set(
        projects.map((p) => p.city_code as string | null).filter((c): c is string => Boolean(c)),
      ),
    );
    const records = (
      await Promise.all(
        chunk(cityCodes, 25).map((codes) => fetchAllCapitalExpenditures(httpService, codes)),
      )
    ).flat();

    const municipalityCapitalExpendituresMap = records.reduce<
      Map<string, CapitalExpendituresResult>
    >(
      (map, element) =>
        map.set(element.insee, {
          referenceYear: element.annee_join,
          amount: element.montant,
        }),
      new Map(),
    );

    const computeDevelopmentScoreUseCase = buildScriptComputeDevelopmentScoreUseCase(
      db,
      municipalityCapitalExpendituresMap,
    );

    process.stdout.write(
      `${DEVELOPMENT_SCORE_PROJECTS_CSV_HEADERS.map(escapeCsvValue).join(";")}\n`,
    );

    let successCount = 0;
    let errorCount = 0;

    for (const project of projects) {
      const projectId = project.id as string;
      const projectName = project.name as string;
      const createdBy = project.created_by as string;
      const createdAt = project.created_at as Date;
      const updatedAt = project.updated_at as Date | undefined;
      const cityCode = project.city_code as string;

      const siteCreatedAt = project.s_created_at as Date;
      const siteUpdatedAt = project.s_updated_at as Date | undefined;

      try {
        const result = await computeDevelopmentScoreUseCase.execute({
          reconversionProjectId: projectId,
        });

        if (!result.isSuccess()) {
          logProgress(`❌ ${projectId} (${projectName}): ${result.getError()}`);
          errorCount++;
          continue;
        }

        const data = result.getData();

        const row = buildDevelopmentScoreProjectsCsvRow({
          ...data,

          createdBy,
          createdAt,
          siteCreatedAt,
          siteUpdatedAt,
          updatedAt,
          cityCode,
        });

        if (row.length !== DEVELOPMENT_SCORE_PROJECTS_CSV_HEADERS.length) {
          throw new Error(
            `Column mismatch: ${row.length} values for ${DEVELOPMENT_SCORE_PROJECTS_CSV_HEADERS.length} headers`,
          );
        }
        process.stdout.write(`${row.map(escapeCsvValue).join(";")}\n`);
        successCount++;
        logProgress(`✅ ${projectId} (${projectName})`);
      } catch (error) {
        logProgress(
          `❌ ${projectId} (${projectName}): ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        errorCount++;
      }
    }

    logProgress(`\n📊 ${successCount} projects exported, ${errorCount} errors`);
  } catch (error) {
    process.exitCode = 1;
    logProgress(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    await db.destroy();
  }
})();
