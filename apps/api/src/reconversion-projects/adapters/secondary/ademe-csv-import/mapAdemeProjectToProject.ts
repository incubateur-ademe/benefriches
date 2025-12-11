import { addMonths, parse } from "date-fns";
import {
  BuildingsUseDistribution,
  computePropertyTransferDutiesFromSellingPrice,
  getSoilTypeForLivingAndActivitySpace,
  getSoilTypeForPublicSpace,
  getSoilTypeForUrbanGreenSpace,
  ReconversionProjectSaveDto,
  saveReconversionProjectPropsSchema,
  SurfaceAreaDistributionJson,
  typedObjectEntries,
  UrbanGreenSpace,
  UrbanLivingAndActivitySpace,
  UrbanPublicSpace,
} from "shared";
import { v4 as uuidv4 } from "uuid";
import z from "zod";

import { fail, success } from "src/shared-kernel/result";
import type { TResult } from "src/shared-kernel/result";

import { CsvStructureType, mapStructureType } from "./mapAdemeProjectToFriche";
import type { RawCsvProjectRow } from "./parseAdemeProjectsCsv";

export function mapAdemeProjectToProject(
  csvRow: RawCsvProjectRow,
  createdByUserId: string,
  relatedSiteId: string,
): TResult<ReconversionProjectSaveDto, "UNKNOWN_ERROR" | "MAPPING_FAILED", unknown> {
  const installationScheduledStartDate = parse(
    csvRow["Date de démarrage"],
    "dd/MM/yyyy",
    new Date(),
  );
  const installationScheduledEndDate = addMonths(
    installationScheduledStartDate,
    Number(csvRow["Durée estimée des travaux (en mois)"]),
  );

  const buildingsUsesDistribution: BuildingsUseDistribution = {
    RESIDENTIAL: Number(csvRow["dont logements (m² SDP)"] ?? 0),

    ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES:
      Number(
        csvRow["dont locaux d'artisanat ou commerciaux (hors pied d'immeuble) (m² SDP)"] ?? 0,
      ) + Number(csvRow["dont locaux industriels ou logistiques (m² SDP)"] ?? 0),

    LOCAL_SERVICES: Number(csvRow["dont services et équipements de proximité (m² SDP)"] ?? 0),

    LOCAL_STORE: Number(csvRow["dont commerce pied d'immeuble (m² SDP)"] ?? 0),

    OFFICES: Number(csvRow["dont bureaux (m² SDP)"] ?? 0),

    CULTURAL_PLACE: Number(csvRow["dont Lieux culturels (m² SDP)"] ?? 0),

    SPORTS_FACILITIES: Number(csvRow["dont Équipements sportifs (m² SDP)"] ?? 0),

    PUBLIC_FACILITIES: Number(csvRow["dont équipements publics (m² SDP)"] ?? 0),

    MULTI_STORY_PARKING: Number(csvRow["dont parking silo (m² SDP)"] ?? 0),
  };

  const livingAndActivitySpacesDistribution: SurfaceAreaDistributionJson<UrbanLivingAndActivitySpace> =
    {
      BUILDINGS: csvRow["Emprises au sol bâti = bâtiment (m²)"] ?? 0,
      PRIVATE_GREEN_SPACES: csvRow["Espaces verts privés (m²)"] ?? 0,
      PERMEABLE_SURFACE: csvRow["Espaces en revêtement perméable (m²)"] ?? 0,
      IMPERMEABLE_SURFACE: csvRow["Espaces en revêtement imperméable (m²)"] ?? 0,
    };

  const publicSpacesDistribution: SurfaceAreaDistributionJson<UrbanPublicSpace> = {
    GRASS_COVERED_SURFACE: csvRow["Espaces publics bandes végétalisées (m²)"] ?? 0,
    IMPERMEABLE_SURFACE: csvRow["Espaces publics en revêtement imperméable (m²)"] ?? 0,
    PERMEABLE_SURFACE: csvRow["Espaces publics en revêtement perméable (m²)"] ?? 0,
  };

  // column 'Espaces verts publics (m²)' includes 'Plan d'eau', so we need to compute the difference
  const urbanPondsSurfaceArea = csvRow["Plan d'eau"] ?? 0;
  const lawnsAndBushesSurfaceArea =
    (csvRow["Espaces verts publics (m²)"] ?? 0) - urbanPondsSurfaceArea;
  const greenSpacesDistribution: SurfaceAreaDistributionJson<UrbanGreenSpace> = {
    LAWNS_AND_BUSHES: lawnsAndBushesSurfaceArea,
    URBAN_POND_OR_LAKE: urbanPondsSurfaceArea,
  };

  const hasReinstatement = Boolean(csvRow["Montant global de remise en état (€ HT)"]);

  const soilsDistribution = [
    ...typedObjectEntries(publicSpacesDistribution ?? {})
      .filter(([_, surfaceArea]) => surfaceArea)
      .map(([soil, surfaceArea = 0]) => ({
        surfaceArea,
        soilType: getSoilTypeForPublicSpace(soil),
        spaceCategory: "PUBLIC_SPACE" as const,
      })),
    ...typedObjectEntries(livingAndActivitySpacesDistribution ?? {})
      .filter(([_, surfaceArea]) => surfaceArea)
      .map(([soil, surfaceArea = 0]) => ({
        surfaceArea,
        soilType: getSoilTypeForLivingAndActivitySpace(soil),
        spaceCategory: "LIVING_AND_ACTIVITY_SPACE" as const,
      })),
    ...typedObjectEntries(greenSpacesDistribution ?? {})
      .filter(([_, surfaceArea]) => surfaceArea)
      .map(([soil, surfaceArea = 0]) => ({
        surfaceArea,
        soilType: getSoilTypeForUrbanGreenSpace(soil),
        spaceCategory: "PUBLIC_GREEN_SPACE" as const,
      })),
  ];

  const developer =
    csvRow["Maître d'ouvrage du projet"] && csvRow["Type de maître d'ouvrage"]
      ? {
          name: csvRow["Maître d'ouvrage du projet"],
          structureType: mapStructureType(csvRow["Type de maître d'ouvrage"] as CsvStructureType),
        }
      : { name: "Maître d'ouvrage", structureType: "unknown" };

  // Cession du site
  const hasResale = Boolean(csvRow["Cession charges foncières"]);
  const futureSiteOwner = hasResale
    ? { name: "Futur propriétaire", structureType: "unknown" }
    : undefined;
  const siteResaleExpectedSellingPrice = hasResale
    ? csvRow["Cession charges foncières"]
    : undefined;
  const siteResaleExpectedPropertyTransferDuties = siteResaleExpectedSellingPrice
    ? computePropertyTransferDutiesFromSellingPrice(siteResaleExpectedSellingPrice)
    : undefined;

  const data: z.infer<typeof saveReconversionProjectPropsSchema> = {
    id: uuidv4(),
    relatedSiteId,
    createdBy: createdByUserId,
    name: csvRow["Nom du projet"],
    projectPhase: "inconnu",
    yearlyProjectedCosts: [],
    yearlyProjectedRevenues: [],
    operationsFirstYear: installationScheduledStartDate.getFullYear(),
    soilsDistribution,
    decontaminatedSoilSurface: csvRow["Surface dépolluée (cour des comptes)"],
    reinstatementCosts: [],
    reinstatementContractOwner: hasReinstatement ? developer : undefined,
    futureSiteOwner,
    siteResaleExpectedSellingPrice: csvRow["Total des recettes sur l’opération globale (€ HT)"], // we assign all the expected income here because there is no other way
    siteResaleExpectedPropertyTransferDuties,
    developmentPlan: {
      type: "URBAN_PROJECT",
      features: {
        buildingsFloorAreaDistribution: buildingsUsesDistribution,
      },
      costs: csvRow["Total des dépenses sur l’opération globale (€ HT)"]
        ? [
            {
              amount: Number(csvRow["Total des dépenses sur l’opération globale (€ HT)"]),
              purpose: "development_works",
            },
          ]
        : [],
      developer,
      installationSchedule: {
        startDate: installationScheduledStartDate,
        endDate: installationScheduledEndDate,
      },
    },
  };

  const validationResult = saveReconversionProjectPropsSchema.safeParse(data);

  if (!validationResult.success) {
    return fail("MAPPING_FAILED", validationResult.error);
  }

  return success({ ...validationResult.data, creationMode: "csv-import", createdAt: new Date() });
}
