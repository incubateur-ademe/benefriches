import type {
  GetSiteFeaturesResponseDto,
  SiteYearlyExpensePurpose,
  UrbanZoneLandParcel,
} from "shared";
import { typedObjectKeys } from "shared";

import { getParcelStepIds } from "@/features/create-site/core/urban-zone/steps/per-parcel-soils/parcelStepMapping";
import type { UrbanZoneStepsState } from "@/features/create-site/core/urban-zone/urbanZoneSteps";

type UrbanZoneSiteFeatures = Extract<GetSiteFeaturesResponseDto, { nature: "URBAN_ZONE" }>;

const OWNER_PURPOSES_SHARED_BY_VACANT_AND_ZONE_MANAGEMENT: ReadonlySet<SiteYearlyExpensePurpose> =
  new Set(["maintenance", "security", "illegalDumpingCost", "otherManagementCosts"]);

/**
 * Pure hydration converter: a saved URBAN_ZONE site's features -> the urban-zone sub-flow's
 * per-step answers map (`state.urbanZone.steps`), reconstructing the exact generated per-parcel
 * step sequence creation would have produced from these parcels (ADR-0008's static
 * per-parcel-type step ids, see `parcelStepMapping.ts`), so `computeStepsSequence` walks the
 * same path and every hydrated answer lands on a step actually in that walk — no orphan
 * answers, no missing steps (see the ticket's "quiet failure" warning).
 *
 * The two per-parcel steps (soils distribution, buildings floor area) are hydrated with both
 * `payload` AND `defaultValues` set to the same answers — mirroring
 * `MutateStateHelper.recomputeStep`'s convention. Their own selectors
 * (`parcelSoilsDistribution.selectors.ts`, `parcelBuildingsFloorArea.selectors.ts`) pre-fill the
 * form from `defaultValues`, not `payload`, and that field is otherwise only populated lazily by
 * `navigateToAndLoadStep` calling the step handler's self-referential `getDefaultAnswers` (which
 * reads the step's own, not-yet-set `defaultValues` and so is a no-op on first hydration) —
 * setting `payload` alone would leave the step marked completed but rendering blank.
 *
 * Deliberate, documented lossy conventions (the persisted site record cannot tell us these):
 *
 * 1. **Local authority type**: `manager.structureType === "local_authority"` only persists a
 *    free-form `name`, never which of the 4 `LocalAuthority` enum values (municipality / epci /
 *    department / region) the user picked (URBAN_ZONE_MANAGER's schema requires it). Hydration
 *    always defaults to `"municipality"` — the most common case — and stores the saved name
 *    verbatim in `localAuthorityName`. This does not affect the save round-trip (only the name
 *    is persisted back), only which radio option appears pre-selected if the user reopens the
 *    MANAGER step.
 *
 * 2. **Expense/income re-split**: `getExpensesAndIncomeSummaryViewData` (creation's own reader)
 *    flattens THREE distinct steps (VACANT_PREMISES_EXPENSES owner* fields,
 *    ZONE_MANAGEMENT_EXPENSES, LOCAL_AUTHORITY_EXPENSES) onto the same owner-borne
 *    `SiteYearlyExpense` purposes, so a saved `yearlyExpenses` list cannot be uniquely split
 *    back onto the step that originally produced each entry — only `propertyTaxes` (only
 *    reachable from VACANT_PREMISES_EXPENSES) and the tenant-borne purposes (only reachable from
 *    VACANT_PREMISES_EXPENSES' tenant* fields) are unambiguous. For the rest
 *    (maintenance/security/illegalDumpingCost/otherManagementCosts, all owner-borne), hydration
 *    picks the step that is actually reachable in the reconstructed sequence: LOCAL_AUTHORITY_
 *    EXPENSES for a local-authority site; otherwise ZONE_MANAGEMENT_EXPENSES when the site has
 *    activity beyond the vacant footprint (`footprint !== surfaceArea`), else VACANT_PREMISES_
 *    EXPENSES' owner* fields. This is lossy on *which step* an amount came from, but round-trips
 *    the *totals* `buildUrbanZoneSitePayload.ts` reads back out — the property this converter is
 *    unit-tested against.
 */
export const convertSiteToUrbanZoneSteps = (
  features: UrbanZoneSiteFeatures,
): UrbanZoneStepsState => {
  const steps: UrbanZoneStepsState = {};

  const landParcelTypes = features.landParcels.map((parcel) => parcel.type);
  const surfaceAreas: Partial<Record<UrbanZoneLandParcel["type"], number>> = {};
  for (const parcel of features.landParcels) {
    surfaceAreas[parcel.type] = parcel.surfaceArea;
  }

  steps.URBAN_ZONE_LAND_PARCELS_SELECTION = {
    completed: true,
    payload: { landParcelTypes },
  };
  steps.URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION = {
    completed: true,
    payload: { surfaceAreas },
  };

  for (const parcel of features.landParcels) {
    const stepIds = getParcelStepIds(parcel.type);
    // Per-parcel steps' own selectors (parcelSoilsDistribution.selectors.ts,
    // parcelBuildingsFloorArea.selectors.ts) read the form's pre-fill values off `defaultValues`,
    // not `payload` — mirroring `MutateStateHelper.recomputeStep`'s convention, both fields must
    // be hydrated to the same answers, or `navigateToAndLoadStep` finds no `defaultValues`, its
    // handler's self-referential `getDefaultAnswers` also finds none, and the step renders blank
    // despite `payload` (and thus `completed`) being correctly set.
    steps[stepIds.soilsDistribution] = {
      completed: true,
      payload: { soilsDistribution: parcel.soilsDistribution },
      defaultValues: { soilsDistribution: parcel.soilsDistribution },
    };
    // Only hydrate the floor-area step when the parcel actually has a BUILDINGS soil — that
    // step is only reachable (per `parcelSoilsHandlerFactory.getNextStepId`) when the parcel's
    // soils distribution contains BUILDINGS; hydrating it otherwise would leave an orphan
    // answer `computeStepsSequence` never visits.
    if (
      typedObjectKeys(parcel.soilsDistribution).includes("BUILDINGS") &&
      parcel.buildingsFloorSurfaceArea !== undefined
    ) {
      steps[stepIds.buildingsFloorArea] = {
        completed: true,
        payload: { buildingsFloorSurfaceArea: parcel.buildingsFloorSurfaceArea },
        defaultValues: { buildingsFloorSurfaceArea: parcel.buildingsFloorSurfaceArea },
      };
    }
  }

  steps.URBAN_ZONE_SOILS_CONTAMINATION = {
    completed: true,
    payload: {
      hasContaminatedSoils:
        features.hasContaminatedSoils ?? Boolean(features.contaminatedSoilSurface),
      ...(features.contaminatedSoilSurface !== undefined && {
        contaminatedSoilSurface: features.contaminatedSoilSurface,
      }),
    },
  };

  const managerStructureType = features.manager?.structureType;
  const isLocalAuthorityManager = managerStructureType === "local_authority";
  const isActivityParkManager = managerStructureType === "activity_park_manager";

  if (isLocalAuthorityManager) {
    steps.URBAN_ZONE_MANAGER = {
      completed: true,
      payload: {
        structureType: "local_authority",
        // See docblock point 1: the local-authority enum value is never persisted.
        localAuthority: "municipality",
        localAuthorityName: features.manager?.name ?? "",
      },
    };
  } else if (isActivityParkManager) {
    steps.URBAN_ZONE_MANAGER = {
      completed: true,
      payload: { structureType: "activity_park_manager" },
    };
  }

  const surfaceArea = features.surfaceArea;
  const footprint = features.vacantCommercialPremisesFootprint ?? 0;
  const hasVacantPremises = footprint > 0;
  const hasActivity = footprint < (surfaceArea ?? Infinity);

  // The footprint step is always in the sequence (VacantCommercialPremisesFootprintHandler is
  // the unconditional entry point from URBAN_ZONE_MANAGER).
  steps.URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT = {
    completed: true,
    payload: { surfaceArea: footprint },
  };
  // The floor-area step is only reachable when footprint !== 0.
  if (hasVacantPremises && features.vacantCommercialPremisesFloorArea !== undefined) {
    steps.URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA = {
      completed: true,
      payload: { surfaceArea: features.vacantCommercialPremisesFloorArea },
    };
  }
  // The ETP step is skipped only when the footprint covers the entire site (fully vacant, no
  // remaining activity) — see VacantCommercialPremisesFloorAreaHandler.getNextStepId.
  const etpReachable = !(hasVacantPremises && footprint === surfaceArea);
  if (etpReachable && features.fullTimeJobsEquivalent !== undefined) {
    steps.URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT = {
      completed: true,
      payload: { fullTimeJobs: features.fullTimeJobsEquivalent },
    };
  }

  // See docblock point 2 for the expense/income re-split convention.
  const ownerExpensesByPurpose = new Map<SiteYearlyExpensePurpose, number>();
  const tenantExpensesByPurpose = new Map<SiteYearlyExpensePurpose, number>();
  for (const expense of features.yearlyExpenses) {
    const purpose = expense.purpose as SiteYearlyExpensePurpose;
    const target = expense.bearer === "tenant" ? tenantExpensesByPurpose : ownerExpensesByPurpose;
    target.set(purpose, (target.get(purpose) ?? 0) + expense.amount);
  }
  const incomeByPurpose = new Map<string, number>();
  for (const income of features.yearlyIncomes) {
    incomeByPurpose.set(income.source, (incomeByPurpose.get(income.source) ?? 0) + income.amount);
  }
  const sharedOwnerExpenses = Object.fromEntries(
    [...ownerExpensesByPurpose.entries()].filter(([purpose]) =>
      OWNER_PURPOSES_SHARED_BY_VACANT_AND_ZONE_MANAGEMENT.has(purpose),
    ),
  ) as Partial<Record<SiteYearlyExpensePurpose, number>>;

  if (isLocalAuthorityManager) {
    steps.URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES = {
      completed: true,
      payload: {
        maintenance: sharedOwnerExpenses.maintenance,
        otherManagementCosts: sharedOwnerExpenses.otherManagementCosts,
      },
    };
  } else if (isActivityParkManager) {
    if (hasVacantPremises) {
      steps.URBAN_ZONE_VACANT_PREMISES_EXPENSES = {
        completed: true,
        payload: {
          ownerPropertyTaxes: ownerExpensesByPurpose.get("propertyTaxes"),
          tenantRent: tenantExpensesByPurpose.get("rent"),
          tenantOperationsTaxes: tenantExpensesByPurpose.get("operationsTaxes"),
          tenantOtherOperationsCosts: tenantExpensesByPurpose.get("otherOperationsCosts"),
          // Owner-borne maintenance/security/illegalDumpingCost/otherManagementCosts land here
          // only when there is no separate activity (zone management doesn't apply).
          ...(!hasActivity && {
            ownerMaintenance: sharedOwnerExpenses.maintenance,
            ownerSecurity: sharedOwnerExpenses.security,
            ownerIllegalDumpingCost: sharedOwnerExpenses.illegalDumpingCost,
            ownerOtherManagementCosts: sharedOwnerExpenses.otherManagementCosts,
          }),
        },
      };
      if (hasActivity) {
        steps.URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES = {
          completed: true,
          payload: sharedOwnerExpenses,
        };
        steps.URBAN_ZONE_ZONE_MANAGEMENT_INCOME = {
          completed: true,
          payload: {
            rent: incomeByPurpose.get("rent"),
            subsidies: incomeByPurpose.get("subsidies"),
            otherIncome: incomeByPurpose.get("other"),
          },
        };
      }
    } else if (hasActivity) {
      steps.URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES = {
        completed: true,
        payload: sharedOwnerExpenses,
      };
      steps.URBAN_ZONE_ZONE_MANAGEMENT_INCOME = {
        completed: true,
        payload: {
          rent: incomeByPurpose.get("rent"),
          subsidies: incomeByPurpose.get("subsidies"),
          otherIncome: incomeByPurpose.get("other"),
        },
      };
    }
  }

  steps.URBAN_ZONE_NAMING = {
    completed: true,
    payload: { name: features.name, description: features.description },
  };

  return steps;
};
