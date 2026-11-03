import { fr } from "@codegouvfr/react-dsfr";
import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import { Dialog, DialogPanel } from "@headlessui/react";
import { lazy, Suspense, useContext, useLayoutEffect } from "react";
import type { KeyImpactIndicatorData } from "shared";

import classNames from "@/shared/views/clsx";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import {
  ImpactModalDescriptionContext,
  type ContentState,
} from "../../ImpactModalDescriptionContext";

const SummaryAvoidedCo2eqEmissionsDescription = lazy(() => import("./AvoidedCo2eqEmissions"));
const SummaryAvoidedFricheCostsForLocalAuthorityDescription = lazy(
  () => import("./AvoidedFricheCostsForLocalAuthority"),
);
const SummaryFullTimeJobsDescription = lazy(() => import("./FullTimeJobs"));
const SummaryHouseholdsPoweredByRenewableEnergyDescription = lazy(
  () => import("./HouseholdsPoweredByRenewableEnergy"),
);
const SummaryLocalPropertyValueIncreaseDescription = lazy(
  () => import("./LocalPropertyValueIncrease"),
);
const SummaryNonContaminatedSurfaceAreaDescription = lazy(
  () => import("./NonContaminatedSurfaceArea"),
);
const SummaryPermeableSurfaceAreaDescription = lazy(() => import("./PermeableSurfaceArea"));
const SummaryProjectBalanceDescription = lazy(() => import("./ProjectBalance"));
const SummaryTaxesIncomeDescription = lazy(() => import("./TaxesIncome"));
const SummaryZanComplianceDescription = lazy(() => import("./ZanCompliance"));

type Props = {
  impactsData: KeyImpactIndicatorData[];
  contentState: Extract<ContentState, { sectionName: "summary" }>;
  dialogId?: string;
};

function findImpactData<N extends KeyImpactIndicatorData["name"]>(
  impactsData: KeyImpactIndicatorData[],
  name: N,
): Extract<KeyImpactIndicatorData, { name: N }> {
  return impactsData.find(
    (item): item is Extract<KeyImpactIndicatorData, { name: N }> => item.name === name,
  )!;
}

const DIALOG_ID = "impact-modal-description";

const DIALOG_DSFR_CSS = [
  "fixed inset-0",
  "w-screen",
  "flex items-center justify-center",
  "z-[1750]",
  "bg-[var(--grey-50-1000)]/[0.64] dark:bg-[var(--grey-1000-100)]/[0.64]",
];

export function SummaryModalWizard({ impactsData, contentState, dialogId = DIALOG_ID }: Props) {
  const { onClose } = useContext(ImpactModalDescriptionContext);

  const { isDark } = useIsDark();

  const dialogTitleId = `${dialogId}-title`;

  useLayoutEffect(() => {
    const domModalBody = document.querySelector(`#${dialogId} .fr-modal__body`);

    if (domModalBody) {
      domModalBody.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentState.impactDetailsName]);

  return (
    <Dialog
      id={DIALOG_ID}
      open={Boolean(contentState.impactDetailsName)}
      onClose={onClose}
      aria-labelledby={dialogTitleId}
    >
      <div className={classNames(DIALOG_DSFR_CSS, isDark ? "highcharts-dark" : "highcharts-light")}>
        <DialogPanel>
          <div
            className={classNames(
              "px-6 md:px-10 pt-0 pb-10 mb-0 [&_.-mx-10]:mx-0 [&_.-mx-6]:mx-0",
              fr.cx("fr-modal__content"),
            )}
          >
            <Suspense fallback={<LoadingSpinner classes={{ text: "text-grey-light" }} />}>
              {(() => {
                switch (contentState.impactDetailsName) {
                  case "zanCompliance":
                    return (
                      <SummaryZanComplianceDescription
                        impactData={findImpactData(impactsData, "zanCompliance")}
                      />
                    );
                  case "projectImpactBalance":
                    return (
                      <SummaryProjectBalanceDescription
                        impactData={findImpactData(impactsData, "projectImpactBalance")}
                      />
                    );
                  case "avoidedFricheCostsForLocalAuthority":
                    return (
                      <SummaryAvoidedFricheCostsForLocalAuthorityDescription
                        impactData={findImpactData(
                          impactsData,
                          "avoidedFricheCostsForLocalAuthority",
                        )}
                      />
                    );
                  case "taxesIncomesImpact":
                    return (
                      <SummaryTaxesIncomeDescription
                        impactData={findImpactData(impactsData, "taxesIncomesImpact")}
                      />
                    );
                  case "fullTimeJobs":
                    return (
                      <SummaryFullTimeJobsDescription
                        impactData={findImpactData(impactsData, "fullTimeJobs")}
                      />
                    );
                  case "avoidedCo2eqEmissions":
                    return (
                      <SummaryAvoidedCo2eqEmissionsDescription
                        impactData={findImpactData(impactsData, "avoidedCo2eqEmissions")}
                      />
                    );
                  case "nonContaminatedSurfaceArea":
                    return (
                      <SummaryNonContaminatedSurfaceAreaDescription
                        impactData={findImpactData(impactsData, "nonContaminatedSurfaceArea")}
                      />
                    );
                  case "permeableSurfaceArea":
                    return (
                      <SummaryPermeableSurfaceAreaDescription
                        impactData={findImpactData(impactsData, "permeableSurfaceArea")}
                      />
                    );
                  case "householdsPoweredByRenewableEnergy":
                    return (
                      <SummaryHouseholdsPoweredByRenewableEnergyDescription
                        impactData={findImpactData(
                          impactsData,
                          "householdsPoweredByRenewableEnergy",
                        )}
                      />
                    );
                  case "localPropertyValueIncrease":
                    return (
                      <SummaryLocalPropertyValueIncreaseDescription
                        impactData={findImpactData(impactsData, "localPropertyValueIncrease")}
                      />
                    );
                }
              })()}
            </Suspense>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
