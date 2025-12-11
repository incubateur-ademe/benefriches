// oxlint-disable no-console
import * as path from "node:path";
import { setTimeout } from "node:timers/promises";
import { ReconversionProjectSaveDto, sumListWithKey } from "shared";

import { ReconversionProjectRepository } from "src/reconversion-projects/core/gateways/ReconversionProjectRepository";
import { ComputeReconversionProjectImpactsUseCase } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import { fail, success } from "src/shared-kernel/result";
import type { TResult } from "src/shared-kernel/result";
import type { SitesRepository } from "src/sites/core/gateways/SitesRepository";
import type { SiteEntity } from "src/sites/core/models/siteEntity";

import { mapAdemeProjectToFriche } from "./mapAdemeProjectToFriche";
import type { AddressSearchGateway } from "./mapAdemeProjectToFriche";
import { mapAdemeProjectToProject } from "./mapAdemeProjectToProject";
import { parseAdemeProjectsCsv } from "./parseAdemeProjectsCsv";

const getElapsedTime = (startTime: number): string => {
  return ((Date.now() - startTime) / 1000).toFixed(2);
};

type ImportAdemeProjectsError = "CSV_PARSING_FAILED" | "MAPPING_FAILED" | "PERSISTENCE_FAILED";
type ImportResult = TResult<
  {
    successCount: number;
  },
  ImportAdemeProjectsError,
  unknown
>;

type Input = {
  csvFilePath: string;
  createdByUserId: string;
  addressSearchApi: AddressSearchGateway;
  sitesRepository: SitesRepository;
  reconversionProjectRepository: ReconversionProjectRepository;
  computeImpactsUseCase: ComputeReconversionProjectImpactsUseCase;
  includeDepartments?: string[];
};

export async function importAdemeProjects(input: Input): Promise<ImportResult> {
  const csvFilePath = path.resolve(input.csvFilePath);
  const createdByUserId = input.createdByUserId;

  console.log("\n=== ADEME CSV Import ===\n");
  console.log(`CSV File: ${csvFilePath}`);
  console.log(`User ID: ${createdByUserId}`);
  if (input.includeDepartments) {
    console.log(`Will only include départements: ${input.includeDepartments.join(", ")}`);
  }
  console.log("\n----------------------------------------\n");

  const startTime = Date.now();

  const parseResult = await parseAdemeProjectsCsv(csvFilePath);
  if (parseResult.isFailure()) {
    const issues = parseResult.getIssues() as unknown[];
    console.log(issues.length, "errors found during CSV parsing");
    issues.forEach((issue) => {
      console.log(" - ", issue);
    });

    return fail("CSV_PARSING_FAILED", {
      msg: parseResult.getError(),
      issues,
    });
  }
  const csvRows = parseResult.getData();
  console.log("✅ CSV parsed successfully with", csvRows.length, "rows");

  const projectsToCreateCount = input.includeDepartments
    ? // oxlint-disable-next-line no-non-null-assertion
      csvRows.filter((row) => input.includeDepartments!.includes(row["Département"])).length
    : csvRows.length;
  console.log(
    "🔧 Will now create",
    projectsToCreateCount,
    "projects",
    input.includeDepartments
      ? `(including only départements: ${input.includeDepartments.join(", ")})`
      : "",
  );

  const mappingErrors: { rowId: string; reason: string; details?: unknown }[] = [];
  const sitesToSave: SiteEntity[] = [];
  const projectsToSave: ReconversionProjectSaveDto[] = [];

  for (const csvRow of csvRows) {
    const rowId = csvRow["ID"];

    if (input.includeDepartments && !input.includeDepartments.includes(csvRow["Département"])) {
      continue;
    }

    try {
      // delay to avoid hitting rate limit on address API
      await setTimeout(200);
      const fricheMappingResult = await mapAdemeProjectToFriche(
        csvRow,
        createdByUserId,
        input.addressSearchApi,
      );

      if (fricheMappingResult.isFailure()) {
        mappingErrors.push({ rowId, reason: fricheMappingResult.getError() });
        continue;
      }

      const fricheData = fricheMappingResult.getData();
      const fricheEntity: SiteEntity = {
        ...fricheData,
        createdAt: new Date(),
        createdBy: createdByUserId,
        creationMode: "csv-import",
      };
      sitesToSave.push(fricheEntity);

      const projectMappingResult = mapAdemeProjectToProject(
        csvRow,
        createdByUserId,
        fricheEntity.id,
      );
      if (!projectMappingResult.isSuccess()) {
        mappingErrors.push({
          rowId,
          reason: projectMappingResult.getError(),
          details: projectMappingResult.getIssues(),
        });
        continue;
      }

      projectsToSave.push(projectMappingResult.getData());

      const projectSoilsSurfaceArea = projectMappingResult
        .getData()
        .soilsDistribution.reduce((acc, curr) => acc + curr.surfaceArea, 0);
      if (
        fricheData.surfaceArea !== projectSoilsSurfaceArea &&
        Math.abs(fricheData.surfaceArea - projectSoilsSurfaceArea) > 1
      ) {
        console.warn(
          `* ID ${rowId}: surface friche = ${fricheData.surfaceArea} vs surface projet = ${projectSoilsSurfaceArea}`,
        );
      }
    } catch (error) {
      mappingErrors.push({
        rowId,
        reason: `Mapping error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  }

  if (mappingErrors.length > 0) {
    console.log(`❌ Project creation failed in ${getElapsedTime(startTime)}s\n`);
    console.log(`Failures: ${mappingErrors.length} rows`);
    console.log(`Failure details:`);
    mappingErrors.forEach((failure, index) => {
      console.log(
        // oxlint-disable-next-line typescript/no-base-to-string typescript/restrict-template-expressions
        `  [${index + 1}] Row ID ${failure.rowId}: ${failure.reason} ${failure.details ?? ""}`,
      );
    });
    return fail("MAPPING_FAILED", { errors: mappingErrors });
  }

  const successCount = sitesToSave.length;
  console.log(
    `✅ ${successCount} rows successfully mapped to site and project data, will now persist to database...`,
  );

  try {
    for (const siteEntity of sitesToSave) {
      await input.sitesRepository.save(siteEntity);
    }
    for (const projectDto of projectsToSave) {
      await input.reconversionProjectRepository.save(projectDto);
    }
  } catch (error) {
    console.log(error);
    const dbError = error instanceof Error ? error.message : "Unknown error";
    console.log(`❌ Import failed in ${getElapsedTime(startTime)}s\n`);
    console.log(`Failure details: database persistence failed: ${dbError}`);
    return fail("PERSISTENCE_FAILED", {
      reason: dbError,
    });
  }

  console.log(
    `✅ ${successCount} reconversion projects persisted in database, will now compute impacts...`,
  );

  const totalImpactsResult: {
    totalCarbonStorageDifferenceInTon: number;
    totalAvoidedCo2EqEmissionsInTon: number;
    totalExpenses: number;
    totalRevenues: number;
    totalEconomicBalance: number;
    totalSocioEconomicBalance: number;
    totalSocioEconomicBalanceForCommunity: number;
  } = {
    totalCarbonStorageDifferenceInTon: 0,
    totalAvoidedCo2EqEmissionsInTon: 0,
    totalExpenses: 0,
    totalRevenues: 0,
    totalEconomicBalance: 0,
    totalSocioEconomicBalance: 0,
    totalSocioEconomicBalanceForCommunity: 0,
  };

  for (const project of [...projectsToSave, { id: "e7458257-91e1-4bae-8ad0-41a614f81800" }]) {
    const computeImpactsResult = await input.computeImpactsUseCase.execute({
      reconversionProjectId: project.id,
      evaluationPeriodInYears: 50,
    });

    if (!computeImpactsResult.isSuccess()) {
      console.error("BIG ERROR DANS CALCUL IMPACTS", computeImpactsResult.getError());
      process.exit(1);
    }

    const resultData = computeImpactsResult.getData();
    const { impacts } = resultData;

    console.log("Stockage de carbone pour", resultData.name);
    console.log("Avant:", impacts.environmental.soilsCarbonStorage?.base ?? 0);
    console.log("Après:", impacts.environmental.soilsCarbonStorage?.forecast ?? 0);
    console.log("Différence", impacts.environmental.soilsCarbonStorage?.difference ?? 0);
    console.log("---");

    totalImpactsResult.totalCarbonStorageDifferenceInTon +=
      impacts.environmental.soilsCarbonStorage?.difference ?? 0;
    totalImpactsResult.totalAvoidedCo2EqEmissionsInTon +=
      (impacts.environmental.avoidedCo2eqEmissions?.withAirConditioningDiminution ?? 0) +
      (impacts.environmental.avoidedCo2eqEmissions?.withCarTrafficDiminution ?? 0) +
      (impacts.environmental.avoidedCo2eqEmissions?.withRenewableEnergyProduction ?? 0);
    totalImpactsResult.totalExpenses += impacts.economicBalance.costs.total;
    totalImpactsResult.totalRevenues += impacts.economicBalance.revenues.total;
    totalImpactsResult.totalEconomicBalance += impacts.economicBalance.total;
    totalImpactsResult.totalSocioEconomicBalance += impacts.socioeconomic.total;
    totalImpactsResult.totalSocioEconomicBalanceForCommunity += sumListWithKey(
      impacts.socioeconomic.impacts.filter(({ actor }) => actor === "community"),
      "amount",
    );
  }

  console.log(`Résultats:`);
  console.log(
    `- Stockage carbone dans les sols : ${Intl.NumberFormat("fr-FR").format(totalImpactsResult.totalCarbonStorageDifferenceInTon)} t`,
  );
  console.log(
    `- Émissions de CO2eq évitées : ${Intl.NumberFormat("fr-FR").format(totalImpactsResult.totalAvoidedCo2EqEmissionsInTon)} t`,
  );
  console.log(
    `- Dépenses totales : ${Intl.NumberFormat("fr-FR").format(totalImpactsResult.totalExpenses)} €`,
  );
  console.log(
    `- Recettes totales : ${Intl.NumberFormat("fr-FR").format(totalImpactsResult.totalRevenues)} €`,
  );
  console.log(
    `- Bilan économique total : ${Intl.NumberFormat("fr-FR").format(totalImpactsResult.totalEconomicBalance)} €`,
  );
  console.log(
    `- Bilan socio-économique total : ${Intl.NumberFormat("fr-FR").format(totalImpactsResult.totalSocioEconomicBalance)} €`,
  );
  console.log(
    `- Bilan socio-économique pour la collectivité : ${Intl.NumberFormat("fr-FR").format(totalImpactsResult.totalSocioEconomicBalanceForCommunity)} €`,
  );
  console.log(`✅ Done in ${getElapsedTime(startTime)}s\n`);
  return success({
    successCount,
  });
}
