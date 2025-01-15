import {
  EconomicBalanceDetailsName,
  EconomicBalanceMainName,
} from "@/features/projects/domain/projectImpactsEconomicBalance";

import {
  getEconomicBalanceDetailsImpactLabel,
  getEconomicBalanceImpactLabel,
} from "../../getImpactLabel";
import ImpactInProgressDescriptionModal from "../ImpactInProgressDescriptionModal";
import EconomicBalanceDescription from "./EconomicBalanceDescription";
import { breadcrumbSection as economicBalanceBreadcrumbSection } from "./breadcrumbSection";
import RealEstateAcquisitionDescription from "./real-estate-acquisition/RealEstateAcquisition";
import SiteReinstatementDescription from "./site-reinstatement/SiteReinstatementDescription";

type Props = {
  impactName?: EconomicBalanceMainName;
  impactDetailsName?: EconomicBalanceDetailsName;
};

export function EconomicBalanceModalWizard({ impactName, impactDetailsName }: Props) {
  if (!impactName) {
    return <EconomicBalanceDescription />;
  }

  switch (impactDetailsName ?? impactName) {
    case "site_reinstatement":
      return <SiteReinstatementDescription />;

    case "site_purchase":
      return <RealEstateAcquisitionDescription />;

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
}
