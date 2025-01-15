import { useContext } from "react";

import { KeyImpactIndicatorData } from "@/features/projects/application/projectKeyImpactIndicators.selectors";

import { ImpactModalDescriptionContext } from "../impact-description-modals/ImpactModalDescriptionContext";
import ImpactSummaryAvoidedCo2eqEmissions from "./impacts/AvoidedCo2eqEmissions";
import ImpactSummaryAvoidedFricheCostsForLocalAuthority from "./impacts/AvoidedFricheCostsForLocalAuthority";
import ImpactSummaryFullTimeJobs from "./impacts/FullTimeJobs";
import ImpactSummaryHouseholdsPoweredByRenewableEnergy from "./impacts/HouseholdsPoweredByRenewableEnergy";
import ImpactSummaryLocalPropertyValueIncrease from "./impacts/LocalPropertyValueIncrease";
import ImpactSummaryNonContaminatedSurfaceArea from "./impacts/NonContaminatedSurfaceArea";
import ImpactSummaryPermeableSurfaceArea from "./impacts/PermeableSurfaceArea";
import ImpactSummaryProjectBalance from "./impacts/ProjectBalance";
import ImpactSummaryTaxesIncome from "./impacts/TaxesIncome";
import ImpactSummaryZanCompliance from "./impacts/ZanCompliance";

type Props = {
  keyImpactIndicatorsList: KeyImpactIndicatorData[];
};

const PRIORITY_ORDER = [
  "zanCompliance",
  "projectImpactBalance",
  "avoidedFricheCostsForLocalAuthority",
  "taxesIncomesImpact",
  "localPropertyValueIncrease",
  "fullTimeJobs",
  "householdsPoweredByRenewableEnergy",
  "avoidedCo2eqEmissions",
  "permeableSurfaceArea",
  "nonContaminatedSurfaceArea",
];

const ImpactSummaryView = ({ keyImpactIndicatorsList }: Props) => {
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  return (
    <div className="tw-grid tw-grid-rows-1 lg:tw-grid-cols-3 tw-gap-6 tw-mb-8">
      {keyImpactIndicatorsList
        .sort(
          ({ name: aName }, { name: bName }) =>
            PRIORITY_ORDER.indexOf(aName) - PRIORITY_ORDER.indexOf(bName),
        )
        .map(({ name, value, isSuccess }, index) => {
          switch (name) {
            case "zanCompliance":
              return (
                <ImpactSummaryZanCompliance
                  key={index}
                  {...value}
                  isSuccess={isSuccess}
                  noDescription
                  onClick={() => {
                    openImpactModalDescription({
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    });
                  }}
                />
              );
            case "projectImpactBalance":
              return (
                <ImpactSummaryProjectBalance
                  key={index}
                  isSuccess={isSuccess}
                  {...value}
                  noDescription
                  onClick={() => {
                    openImpactModalDescription({
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    });
                  }}
                />
              );

            case "avoidedFricheCostsForLocalAuthority":
              return (
                <ImpactSummaryAvoidedFricheCostsForLocalAuthority
                  key={index}
                  isSuccess={isSuccess}
                  {...value}
                  noDescription
                  onClick={() => {
                    openImpactModalDescription({
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    });
                  }}
                />
              );
            case "taxesIncomesImpact":
              return (
                <ImpactSummaryTaxesIncome
                  key={index}
                  isSuccess={isSuccess}
                  value={value}
                  noDescription
                  onClick={() => {
                    openImpactModalDescription({
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    });
                  }}
                />
              );
            case "fullTimeJobs":
              return (
                <ImpactSummaryFullTimeJobs
                  key={index}
                  isSuccess={isSuccess}
                  {...value}
                  noDescription
                  onClick={() => {
                    openImpactModalDescription({
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    });
                  }}
                />
              );
            case "avoidedCo2eqEmissions":
              return (
                <ImpactSummaryAvoidedCo2eqEmissions
                  key={index}
                  isSuccess={isSuccess}
                  value={value}
                  noDescription
                  onClick={() => {
                    openImpactModalDescription({
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    });
                  }}
                />
              );
            case "nonContaminatedSurfaceArea":
              return (
                <ImpactSummaryNonContaminatedSurfaceArea
                  key={index}
                  isSuccess={isSuccess}
                  {...value}
                  noDescription
                  onClick={() => {
                    openImpactModalDescription({
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    });
                  }}
                />
              );
            case "permeableSurfaceArea":
              return (
                <ImpactSummaryPermeableSurfaceArea
                  key={index}
                  isSuccess={isSuccess}
                  {...value}
                  noDescription
                  onClick={() => {
                    openImpactModalDescription({
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    });
                  }}
                />
              );
            case "householdsPoweredByRenewableEnergy":
              return (
                <ImpactSummaryHouseholdsPoweredByRenewableEnergy
                  key={index}
                  value={value}
                  noDescription
                  onClick={() => {
                    openImpactModalDescription({
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    });
                  }}
                />
              );
            case "localPropertyValueIncrease":
              return (
                <ImpactSummaryLocalPropertyValueIncrease
                  key={index}
                  value={value}
                  noDescription
                  onClick={() => {
                    openImpactModalDescription({
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    });
                  }}
                />
              );
          }
        })}
    </div>
  );
};

export default ImpactSummaryView;
