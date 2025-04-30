import { KeyImpactIndicatorData } from "@/features/projects/application/projectKeyImpactIndicators.selectors";

import ImpactModalDescriptionProviderContainer from "../impact-description-modals";
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
                <ImpactModalDescriptionProviderContainer dialogId="zan-compliance_summary">
                  <ImpactModalDescriptionContext.Consumer>
                    {({ getControlButtonProps }) => (
                      <ImpactSummaryZanCompliance
                        key={index}
                        {...value}
                        isSuccess={isSuccess}
                        noDescription
                        buttonProps={getControlButtonProps({
                          sectionName: "summary",
                          impactData: { value, isSuccess, name },
                        })}
                      />
                    )}
                  </ImpactModalDescriptionContext.Consumer>
                </ImpactModalDescriptionProviderContainer>
              );
            case "projectImpactBalance":
              return (
                <ImpactModalDescriptionProviderContainer dialogId="project-balance_summary">
                  <ImpactModalDescriptionContext.Consumer>
                    {({ getControlButtonProps }) => (
                      <ImpactSummaryProjectBalance
                        key={index}
                        isSuccess={isSuccess}
                        {...value}
                        noDescription
                        buttonProps={getControlButtonProps({
                          sectionName: "summary",
                          impactData: { value, isSuccess, name },
                        })}
                      />
                    )}
                  </ImpactModalDescriptionContext.Consumer>
                </ImpactModalDescriptionProviderContainer>
              );

            case "avoidedFricheCostsForLocalAuthority":
              return (
                <ImpactModalDescriptionProviderContainer dialogId="avoided-friche-costs-local-authority_summary">
                  <ImpactModalDescriptionContext.Consumer>
                    {({ getControlButtonProps }) => (
                      <ImpactSummaryAvoidedFricheCostsForLocalAuthority
                        key={index}
                        isSuccess={isSuccess}
                        {...value}
                        noDescription
                        buttonProps={getControlButtonProps({
                          sectionName: "summary",
                          impactData: { value, isSuccess, name },
                        })}
                      />
                    )}
                  </ImpactModalDescriptionContext.Consumer>
                </ImpactModalDescriptionProviderContainer>
              );
            case "taxesIncomesImpact":
              return (
                <ImpactModalDescriptionProviderContainer dialogId="taxes-income_summary">
                  <ImpactModalDescriptionContext.Consumer>
                    {({ getControlButtonProps }) => (
                      <ImpactSummaryTaxesIncome
                        key={index}
                        isSuccess={isSuccess}
                        value={value}
                        noDescription
                        buttonProps={getControlButtonProps({
                          sectionName: "summary",
                          impactData: { value, isSuccess, name },
                        })}
                      />
                    )}
                  </ImpactModalDescriptionContext.Consumer>
                </ImpactModalDescriptionProviderContainer>
              );
            case "fullTimeJobs":
              return (
                <ImpactModalDescriptionProviderContainer dialogId="full-time-jobs_summary">
                  <ImpactModalDescriptionContext.Consumer>
                    {({ getControlButtonProps }) => (
                      <ImpactSummaryFullTimeJobs
                        key={index}
                        isSuccess={isSuccess}
                        {...value}
                        noDescription
                        buttonProps={getControlButtonProps({
                          sectionName: "summary",
                          impactData: { value, isSuccess, name },
                        })}
                      />
                    )}
                  </ImpactModalDescriptionContext.Consumer>
                </ImpactModalDescriptionProviderContainer>
              );
            case "avoidedCo2eqEmissions":
              return (
                <ImpactModalDescriptionProviderContainer dialogId="avoided-co2-eq_summary">
                  <ImpactModalDescriptionContext.Consumer>
                    {({ getControlButtonProps }) => (
                      <ImpactSummaryAvoidedCo2eqEmissions
                        key={index}
                        isSuccess={isSuccess}
                        value={value}
                        noDescription
                        buttonProps={getControlButtonProps({
                          sectionName: "summary",
                          impactData: { value, isSuccess, name },
                        })}
                      />
                    )}
                  </ImpactModalDescriptionContext.Consumer>
                </ImpactModalDescriptionProviderContainer>
              );
            case "nonContaminatedSurfaceArea":
              return (
                <ImpactModalDescriptionProviderContainer dialogId="non-contaminated-surface_summary">
                  <ImpactModalDescriptionContext.Consumer>
                    {({ getControlButtonProps }) => (
                      <ImpactSummaryNonContaminatedSurfaceArea
                        key={index}
                        isSuccess={isSuccess}
                        {...value}
                        noDescription
                        buttonProps={getControlButtonProps({
                          sectionName: "summary",
                          impactData: { value, isSuccess, name },
                        })}
                      />
                    )}
                  </ImpactModalDescriptionContext.Consumer>
                </ImpactModalDescriptionProviderContainer>
              );
            case "permeableSurfaceArea":
              return (
                <ImpactModalDescriptionProviderContainer dialogId="permeable-surface_summary">
                  <ImpactModalDescriptionContext.Consumer>
                    {({ getControlButtonProps }) => (
                      <ImpactSummaryPermeableSurfaceArea
                        key={index}
                        isSuccess={isSuccess}
                        {...value}
                        noDescription
                        buttonProps={getControlButtonProps({
                          sectionName: "summary",
                          impactData: { value, isSuccess, name },
                        })}
                      />
                    )}
                  </ImpactModalDescriptionContext.Consumer>
                </ImpactModalDescriptionProviderContainer>
              );
            case "householdsPoweredByRenewableEnergy":
              return (
                <ImpactModalDescriptionProviderContainer dialogId="households-enr_summary">
                  <ImpactModalDescriptionContext.Consumer>
                    {({ getControlButtonProps }) => (
                      <ImpactSummaryHouseholdsPoweredByRenewableEnergy
                        key={index}
                        value={value}
                        noDescription
                        buttonProps={getControlButtonProps({
                          sectionName: "summary",
                          impactData: { value, isSuccess, name },
                        })}
                      />
                    )}
                  </ImpactModalDescriptionContext.Consumer>
                </ImpactModalDescriptionProviderContainer>
              );
            case "localPropertyValueIncrease":
              return (
                <ImpactModalDescriptionProviderContainer dialogId="property-value-increase_summary">
                  <ImpactModalDescriptionContext.Consumer>
                    {({ getControlButtonProps }) => (
                      <ImpactSummaryLocalPropertyValueIncrease
                        key={index}
                        value={value}
                        noDescription
                        buttonProps={getControlButtonProps({
                          sectionName: "summary",
                          impactData: { value, isSuccess, name },
                        })}
                      />
                    )}
                  </ImpactModalDescriptionContext.Consumer>
                </ImpactModalDescriptionProviderContainer>
              );
          }
        })}
    </div>
  );
};

export default ImpactSummaryView;
