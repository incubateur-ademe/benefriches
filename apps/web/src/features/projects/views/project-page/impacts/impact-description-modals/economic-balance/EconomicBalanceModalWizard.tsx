import { lazy, Suspense } from "react";

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

const ImpactInProgressDescriptionModal = lazy(() => import("../ImpactInProgressDescriptionModal"));
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
  projectData: ModalDataProps["projectData"];
};

export function EconomicBalanceModalWizard({
  impactName,
  impactDetailsName,
  impactsData,
  projectData,
}: Props) {
  return (
    <Suspense fallback={<LoadingSpinner classes={{ text: "tw-text-grey-light" }} />}>
      {(() => {
        if (!impactName) {
          return <EconomicBalanceDescription impactsData={impactsData} projectData={projectData} />;
        }

        switch (impactDetailsName ?? impactName) {
          case "site_reinstatement":
            return (
              <SiteReinstatementDescription
                impactData={impactsData.economicBalance.costs.siteReinstatement}
                bearer={impactsData.economicBalance.bearer}
              />
            );

          case "site_purchase":
            return (
              <RealEstateAcquisitionDescription
                impactData={impactsData.economicBalance.costs.sitePurchase}
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
                      openState: { sectionName: "economic_balance", impactName },
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
