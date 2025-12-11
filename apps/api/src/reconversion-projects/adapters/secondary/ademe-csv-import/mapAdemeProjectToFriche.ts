// oxlint-disable no-console
import type { Address, Friche, SoilType } from "shared";
import { createFriche, SurfaceAreaDistribution } from "shared";
import type { FricheActivity } from "shared";
import { v4 as uuidv4 } from "uuid";

import { fail, success } from "src/shared-kernel/result";
import type { TResult } from "src/shared-kernel/result";

import type { RawCsvProjectRow } from "./parseAdemeProjectsCsv";

export type SearchAddressOptions = {
  type?: "municipality" | "street" | "housenumber" | "locality";
};
export interface AddressSearchGateway {
  search(
    searchText: string,
    options?: SearchAddressOptions,
  ): Promise<TResult<Address[], "ServiceError" | "NoAddressFound">>;
}

// Map CSV activity names to FricheActivity enum
const mapActivityToFricheActivity = (csvActivity: string | undefined): FricheActivity => {
  if (!csvActivity) {
    return "OTHER";
  }
  const activityMap: Record<string, FricheActivity> = {
    ["Militaire"]: "MILITARY",
    ["Ferroviaire"]: "RAILWAY",
    ["Port"]: "PORT",
    ["Carrière, décharge"]: "TIP_OR_RECYCLING_SITE",
    ["Tri et transit de déchets"]: "TIP_OR_RECYCLING_SITE",
    ["Industrie mécanique"]: "INDUSTRY",
    ["Mines"]: "INDUSTRY",
    ["Chimie"]: "INDUSTRY",
    ["chimie"]: "INDUSTRY",
    ["Textile"]: "INDUSTRY",
    ["Fabrication lampes"]: "INDUSTRY",
    ["Fonderie"]: "INDUSTRY",
    ["Industrie verrière"]: "INDUSTRY",
    ["Peinture"]: "INDUSTRY",
    ["Produits de construction"]: "INDUSTRY",
    ["Traitement, travail du bois"]: "INDUSTRY",
    ["Travail des métaux ou pièces métalliques"]: "INDUSTRY",
    ["Usine à gaz ou charbonnage"]: "INDUSTRY",
    ["Logistique"]: "INDUSTRY",
    ["Garage, station-service"]: "BUILDING",
    ["Agriculture"]: "AGRICULTURE",
    ["Bâtiment"]: "BUILDING",
    ["Autres"]: "OTHER",
    ["autres"]: "OTHER",
  };

  return activityMap[csvActivity] ?? "OTHER";
};

export type CsvStructureType =
  | "Collectivité locale"
  | "Entreprise"
  | "Bailleur social"
  | "Aménageur privé"
  | "Aménageur public"
  | "EPF"
  | "Promoteur"
  | "Autre";

export const mapStructureType = (csvType: CsvStructureType): string => {
  switch (csvType) {
    case "Collectivité locale":
      return "local_or_regional_authority";
    case "Bailleur social":
    case "Aménageur public":
    case "EPF":
    case "Promoteur":
    case "Entreprise":
    case "Aménageur privé":
      return "company";
    default:
      return "unknown";
  }
};

type NewFricheEntryProps = Friche & {
  createdBy: string;
  createdAt: Date;
  creationMode: "csv-import";
};

export async function mapAdemeProjectToFriche(
  csvRow: RawCsvProjectRow,
  createdByUserId: string,
  addressSearchGateway: AddressSearchGateway,
): Promise<
  TResult<NewFricheEntryProps, "INVALID_ACTIVITY" | "ADDRESS_NOT_FOUND" | "ADDRESS_SERVICE_ERROR">
> {
  // Map activity
  const fricheActivity = mapActivityToFricheActivity(csvRow["Activités antérieures simplifiées"]);

  // Create soils distribution
  const soilsDistribution = new SurfaceAreaDistribution<SoilType>();
  soilsDistribution.addSurface("BUILDINGS", csvRow["Surface au sol bâtie"]);
  soilsDistribution.addSurface("IMPERMEABLE_SOILS", csvRow["Autres surfaces imperméabilisées"]);
  soilsDistribution.addSurface("MINERAL_SOIL", csvRow["surfaces minérales autres"]);
  soilsDistribution.addSurface("ARTIFICIAL_GRASS_OR_BUSHES_FILLED", csvRow["Surfaces enherbées"]);
  soilsDistribution.addSurface("ARTIFICIAL_TREE_FILLED", csvRow["Surfaces arborées"]);

  const contaminatedSoilSurface = csvRow["Surface polluée (indicateur LISA) m²"];

  // Create address with Base Adresse Nationale API
  const addressSearchResult = await addressSearchGateway.search(csvRow["Commune"], {
    type: "municipality",
  });

  if (addressSearchResult.isFailure()) {
    return fail("ADDRESS_SERVICE_ERROR");
  }
  // oxlint-disable-next-line no-non-null-assertion
  const addresses = addressSearchResult.getData();
  const foundAddress =
    addresses.find((addr) => addr.cityCode === csvRow["Commune (code INSEE)"]) ?? undefined;

  if (!foundAddress) {
    console.log(
      `Address not found for city code: ${csvRow["Commune (code INSEE)"]} and name: ${csvRow["Commune"]}`,
    );
    return fail("ADDRESS_NOT_FOUND");
  }

  const owner =
    csvRow["Maître d'ouvrage du projet"] && csvRow["Type de maître d'ouvrage"]
      ? {
          name: csvRow["Maître d'ouvrage du projet"],
          structureType: mapStructureType(csvRow["Type de maître d'ouvrage"] as CsvStructureType),
        }
      : { name: "Maître d'ouvrage", structureType: "unknown" };

  const fricheResult = createFriche({
    id: uuidv4(),
    name: csvRow["Nom usuel de la friche"].slice(0, 255) ?? "Friche sans nom",
    address: foundAddress,
    soilsDistribution,
    owner,
    yearlyExpenses: [],
    fricheActivity,
    contaminatedSoilSurface: contaminatedSoilSurface > 0 ? contaminatedSoilSurface : undefined,
  });

  if (!fricheResult.success) {
    return fail("INVALID_ACTIVITY");
  }

  return success({
    ...fricheResult.site,
    createdBy: createdByUserId,
    createdAt: new Date(),
    creationMode: "csv-import",
  });
}
