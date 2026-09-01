import type {
  AgriculturalOperationActivity,
  FricheActivity,
  GetSiteFeaturesResponseDto,
  NaturalAreaType,
  OwnerStructureType,
  SiteYearlyExpense,
  SiteYearlyExpensePurpose,
  SiteYearlyIncome,
  TenantStructureType,
} from "shared";
import {
  agriculturalOperationActivitySchema,
  naturalAreaTypeSchema,
  typedObjectKeys,
} from "shared";

import type {
  CustomStepsState,
  SiteCreationCustomStep,
} from "@/features/create-site/core/custom/customSteps";

// The saved site's owner/tenant `structureType` and yearly-expense `purpose`/income `source` are
// persisted as free-form strings on the read path (see getSiteFeatures.dto.ts) rather than typed
// as their narrower enums — the write path (createCustomSiteDtoSchema) is the one that actually
// constrains them, so a value read back always satisfies the narrower type in practice.
const asOwnerStructureType = (value: string): OwnerStructureType => value as OwnerStructureType;
const asTenantStructureType = (value: string): TenantStructureType => value as TenantStructureType;

/**
 * Pure hydration converter: a saved site's features -> the custom wizard-form engine's
 * per-step answers map, reconstructing the exact branch path `deriveSiteDataFromCustomSteps`
 * (its inverse) and `computeStepsSequence` need to walk the same sequence creation would have
 * produced for these answers. Mirrors `convertPhotovoltaicProjectDataToSteps` on the project
 * side: two branch conventions the persisted site record cannot tell us, resolved the same
 * deliberate way there.
 *
 * 1. `isFricheLeased` is never persisted — the DTO stores only the resulting `tenant`, never
 *    whether the user declared a lease. Hydration derives it as `Boolean(tenant)`, which is
 *    lossless for the round trip (the save DTO has no such field to begin with).
 * 2. `spacesDistributionKnowledge` (SPACES_KNOWLEDGE's `knowsSpaces` / SPACES_SURFACE_AREAS_
 *    DISTRIBUTION_KNOWLEDGE's `knowsSurfaceAreas`) is likewise never persisted — only the
 *    resulting `soilsDistribution` is. Hydration always reconstructs the explicit "I know my
 *    spaces/surfaces" branch. The only visible consequence: the soils summary's
 *    `wasSoilsDistributionAssignedByBenefriches` badge reads `false` after hydration, even for a
 *    site whose distribution Bénéfriches originally inferred.
 *
 * Single-soil special case: `SPACES_SELECTION.getNextStepId` jumps straight to
 * SOILS_CARBON_STORAGE when exactly one soil type is selected, skipping the two distribution
 * steps entirely — hydrating them in that case would leave orphan answers `computeStepsSequence`
 * never visits. This converter mirrors that: it only fills
 * SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE / SPACES_SURFACE_AREA_DISTRIBUTION when there is
 * more than one soil type.
 */
export const convertSiteToCustomSteps = (
  features: GetSiteFeaturesResponseDto,
): CustomStepsState => {
  const soils = typedObjectKeys(features.soilsDistribution);
  const isMultiSoil = soils.length > 1;

  const yearlyExpenses: SiteYearlyExpense[] = features.yearlyExpenses.map((expense) => ({
    amount: expense.amount,
    purpose: expense.purpose as SiteYearlyExpensePurpose,
    bearer: expense.bearer,
  }));
  const yearlyIncomes: SiteYearlyIncome[] = features.yearlyIncomes.map((income) => ({
    amount: income.amount,
    source: income.source as SiteYearlyIncome["source"],
  }));

  const steps: CustomStepsState = {
    ADDRESS: { completed: true, payload: { address: features.address } },
    SURFACE_AREA: { completed: true, payload: { surfaceArea: features.surfaceArea } },
    SPACES_KNOWLEDGE: { completed: true, payload: { knowsSpaces: true } },
    SPACES_SELECTION: {
      completed: true,
      payload: { soils, soilsDistribution: features.soilsDistribution },
    },
    ...(isMultiSoil && {
      SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE: {
        completed: true,
        payload: { knowsSurfaceAreas: true, soilsDistribution: features.soilsDistribution },
      },
      SPACES_SURFACE_AREA_DISTRIBUTION: {
        completed: true,
        payload: { distribution: features.soilsDistribution },
      },
    }),
    OWNER: {
      completed: true,
      payload: {
        owner: {
          structureType: asOwnerStructureType(features.owner.structureType),
          name: features.owner.name ?? "",
        },
      },
    },
    NAMING: {
      completed: true,
      payload: { name: features.name, description: features.description },
    },
  };

  switch (features.nature) {
    case "FRICHE": {
      const isLeased = Boolean(features.tenant);
      steps.FRICHE_ACTIVITY = {
        completed: true,
        payload: (features.fricheActivity as FricheActivity | undefined) ?? "OTHER",
      };
      steps.SOILS_CONTAMINATION = {
        completed: true,
        payload: {
          hasContaminatedSoils:
            features.hasContaminatedSoils ?? Boolean(features.contaminatedSoilSurface),
          ...(features.contaminatedSoilSurface !== undefined && {
            contaminatedSoilSurface: features.contaminatedSoilSurface,
          }),
        },
      };
      const hasRecentAccidents = Boolean(
        features.accidentsMinorInjuries ||
        features.accidentsSevereInjuries ||
        features.accidentsDeaths,
      );
      steps.FRICHE_ACCIDENTS = hasRecentAccidents
        ? {
            completed: true,
            payload: {
              hasRecentAccidents: true,
              accidentsMinorInjuries: features.accidentsMinorInjuries ?? 0,
              accidentsSevereInjuries: features.accidentsSevereInjuries ?? 0,
              accidentsDeaths: features.accidentsDeaths ?? 0,
            },
          }
        : { completed: true, payload: { hasRecentAccidents: false } };
      steps.IS_FRICHE_LEASED = { completed: true, payload: { isFricheLeased: isLeased } };
      if (isLeased) {
        steps.TENANT = {
          completed: true,
          payload: {
            tenant: features.tenant
              ? {
                  structureType: asTenantStructureType(features.tenant.structureType ?? "company"),
                  name: features.tenant.name ?? "",
                }
              : undefined,
          },
        };
      }
      steps.YEARLY_EXPENSES = { completed: true, payload: yearlyExpenses };
      break;
    }
    case "AGRICULTURAL_OPERATION": {
      const isOperated =
        features.isSiteOperated ?? (Boolean(features.tenant) || features.yearlyIncomes.length > 0);
      steps.AGRICULTURAL_OPERATION_ACTIVITY = {
        completed: true,
        payload: {
          activity:
            (features.agriculturalOperationActivity as AgriculturalOperationActivity | undefined) ??
            agriculturalOperationActivitySchema.options[0]!,
        },
      };
      steps.IS_SITE_OPERATED = { completed: true, payload: { isSiteOperated: isOperated } };
      if (isOperated) {
        steps.OPERATOR = {
          completed: true,
          payload: {
            tenant: features.tenant
              ? {
                  structureType: asTenantStructureType(features.tenant.structureType ?? "company"),
                  name: features.tenant.name ?? "",
                }
              : undefined,
          },
        };
      }
      steps.YEARLY_EXPENSES = { completed: true, payload: yearlyExpenses };
      if (isOperated) {
        steps.YEARLY_INCOME = { completed: true, payload: yearlyIncomes };
      }
      break;
    }
    case "NATURAL_AREA": {
      steps.NATURAL_AREA_TYPE = {
        completed: true,
        payload: {
          naturalAreaType:
            (features.naturalAreaType as NaturalAreaType | undefined) ??
            naturalAreaTypeSchema.options[0]!,
        },
      };
      break;
    }
    case "URBAN_ZONE":
      // Out of scope for this ticket (ticket 11); UpdateSitePage refuses to reach the wizard
      // for urban-zone sites before this converter is ever called.
      break;
  }

  return steps;
};

export const getFirstCustomStepForNature = (
  nature: GetSiteFeaturesResponseDto["nature"],
): SiteCreationCustomStep => {
  switch (nature) {
    case "FRICHE":
      return "FRICHE_ACTIVITY";
    case "AGRICULTURAL_OPERATION":
      return "AGRICULTURAL_OPERATION_ACTIVITY";
    case "NATURAL_AREA":
      return "NATURAL_AREA_TYPE";
    case "URBAN_ZONE":
      return "URBAN_ZONE_TYPE";
  }
};
