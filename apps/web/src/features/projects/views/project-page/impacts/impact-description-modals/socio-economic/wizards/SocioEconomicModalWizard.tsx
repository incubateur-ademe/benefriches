import { lazy, Suspense } from "react";
import { AggregatedReconversionProjectOnSiteImpactItemView } from "shared";

import { groupIndirectEconomicImpactsByBearerAndCategory } from "@/features/projects/domain/groupIndirectImpactsByBearer";
import {
  SocioEconomicDetailsName,
  SocioEconomicMainImpactName,
} from "@/features/projects/domain/projectImpactsSocioEconomic";
import { SocioEconomicSubSectionName } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { ModalDataProps } from "../../ImpactModalDescription";
import { HumanityModalWizard } from "./HumanityModalWizard";
import { LocalAuthorityModalWizard } from "./LocalAuthorityWizard";
import { LocalPeopleOrCompanyModalWizard } from "./LocalPeopleOrCompanyWizard";

const SocioEconomicDescription = lazy(() => import("../SocioEconomicDescription"));

type Props = {
  impactName?: SocioEconomicMainImpactName;
  impactDetailsName?: SocioEconomicDetailsName;
  impactSubSectionName?: SocioEconomicSubSectionName;
  contextData: ModalDataProps["contextData"];
  impactsData: ModalDataProps["impactsData"];
};

export function SocioEconomicModalWizard(props: Props) {
  const { reconversionImpactsBreakdown, stakeholders, aggregatedReconversionImpacts } =
    props.impactsData;

  const indirectEconomicImpactsByBearer =
    groupIndirectEconomicImpactsByBearerAndCategory<AggregatedReconversionProjectOnSiteImpactItemView>(
      {
        indirectEconomicImpacts: aggregatedReconversionImpacts.indirectEconomicImpacts.details,
        indirectEconomicImpactsTotal: aggregatedReconversionImpacts.indirectEconomicImpacts.total,
        stakeholders,
      },
    );

  return (
    <Suspense fallback={<LoadingSpinner classes={{ text: "text-grey-light" }} />}>
      {(() => {
        switch (props.impactSubSectionName) {
          case "humanity":
            return (
              <HumanityModalWizard
                contextData={props.contextData}
                reconversionImpactsBreakdown={reconversionImpactsBreakdown}
                indirectEconomicImpactsByBearer={indirectEconomicImpactsByBearer}
                impactName={props.impactName}
                impactDetailsName={props.impactDetailsName}
              />
            );
          case "localAuthority":
            return (
              <LocalAuthorityModalWizard
                stakeholders={stakeholders}
                contextData={props.contextData}
                reconversionImpactsBreakdown={reconversionImpactsBreakdown}
                indirectEconomicImpactsByBearer={indirectEconomicImpactsByBearer}
                impactName={props.impactName}
                impactDetailsName={props.impactDetailsName}
              />
            );
          case "localPeopleOrCompany":
            return (
              <LocalPeopleOrCompanyModalWizard
                stakeholders={stakeholders}
                contextData={props.contextData}
                indirectEconomicImpactsByBearer={indirectEconomicImpactsByBearer}
                impactName={props.impactName}
                impactDetailsName={props.impactDetailsName}
              />
            );
          case undefined:
            return (
              <SocioEconomicDescription
                impactsData={{
                  byBearerAndCategory: indirectEconomicImpactsByBearer,
                  total: indirectEconomicImpactsByBearer.total,
                }}
              />
            );
        }
      })()}
    </Suspense>
  );
}
