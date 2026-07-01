import { lazy, Suspense } from "react";
import { ProjectDevelopmentEconomicBalanceItem } from "shared";

import {
  EconomicBalanceDetailsName,
  EconomicBalanceMainName,
} from "@/features/projects/domain/projectImpactsEconomicBalance";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import {
  getEconomicBalanceDetailsImpactLabel,
  getEconomicBalanceImpactLabel,
} from "../../getImpactLabel";
import { ModalDataProps } from "../ImpactModalDescription";
import { breadcrumbSection as economicBalanceBreadcrumbSection } from "./breadcrumbSection";

const ImpactInProgressDescriptionModal = lazy(
  () => import("@/features/projects/views/shared/impacts/modals/ImpactInProgressDescriptionModal"),
);
const EconomicBalanceDescription = lazy(() => import("./EconomicBalanceDescription"));
const RealEstateAcquisitionDescription = lazy(
  () => import("./real-estate-acquisition/RealEstateAcquisition"),
);
const SiteReinstatementDescription = lazy(
  () => import("./site-reinstatement/SiteReinstatementDescription"),
);

type Props = {
  impactName?: EconomicBalanceMainName;
  impactDetailsName?: EconomicBalanceDetailsName;
  impactsData: ModalDataProps["impactsData"];
  contextData: ModalDataProps["contextData"];
};

export function EconomicBalanceModalWizard({
  impactName,
  impactDetailsName,
  impactsData,
  contextData,
}: Props) {
  return (
    <Suspense fallback={<LoadingSpinner classes={{ text: "text-grey-light" }} />}>
      {(() => {
        if (!impactName) {
          return (
            <EconomicBalanceDescription
              impactsData={impactsData}
              projectType={contextData.projectDevelopmentPlan.type}
            />
          );
        }

        switch (impactDetailsName ?? impactName) {
          case "site_reinstatement":
            return (
              <SiteReinstatementDescription
                impactData={impactsData.projectEconomicBalance.details.filter(
                  (
                    item,
                  ): item is Extract<
                    ProjectDevelopmentEconomicBalanceItem,
                    { name: "siteReinstatement" }
                  > => item.name === "siteReinstatement",
                )}
                bearer={impactsData.stakeholders.project.reinstatementContractOwner.structureName}
              />
            );

          case "site_purchase":
            return (
              <RealEstateAcquisitionDescription
                impactData={
                  impactsData.projectEconomicBalance.details.find(
                    ({ name }) => name === "sitePurchase",
                  )?.total
                }
              />
            );

          default:
            return (
              <ImpactInProgressDescriptionModal
                title={
                  impactDetailsName
                    ? getEconomicBalanceDetailsImpactLabel(impactName, impactDetailsName)
                    : getEconomicBalanceImpactLabel(impactName)
                }
                breadcrumbProps={{
                  section: economicBalanceBreadcrumbSection,
                  segments: impactDetailsName && [
                    {
                      label: getEconomicBalanceImpactLabel(impactName),
                      contentState: { sectionName: "economic_balance", impactName },
                    },
                  ],
                }}
              />
            );
        }
      })()}
    </Suspense>
  );
}
