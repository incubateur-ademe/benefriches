import React from "react";

import { KeyImpactIndicatorData } from "@/features/projects/application/projectKeyImpactIndicators.selectors";

import ImpactModalDescription, {
  ModalDataProps,
} from "../impact-description-modals/ImpactModalDescription";
import { getDialogControlButtonProps } from "../list-view/dialogControlBtnProps";
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
  modalData: ModalDataProps;
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

const ImpactSummaryView = ({ keyImpactIndicatorsList, modalData }: Props) => {
  return (
    <div className="tw-grid tw-grid-rows-1 lg:tw-grid-cols-3 tw-gap-6 tw-mb-8">
      {keyImpactIndicatorsList
        .sort(
          ({ name: aName }, { name: bName }) =>
            PRIORITY_ORDER.indexOf(aName) - PRIORITY_ORDER.indexOf(bName),
        )
        .map(({ name, value, isSuccess }) => {
          switch (name) {
            case "zanCompliance":
              return (
                <React.Fragment key={name}>
                  <ImpactSummaryZanCompliance
                    {...value}
                    isSuccess={isSuccess}
                    noDescription
                    buttonProps={getDialogControlButtonProps(`fr-modal-impacts_${name}-Summary`)}
                  />
                  <ImpactModalDescription
                    dialogId={`fr-modal-impacts_${name}-Summary`}
                    initialState={{
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    }}
                    {...modalData}
                  />
                </React.Fragment>
              );

            case "projectImpactBalance":
              return (
                <React.Fragment key={name}>
                  <ImpactSummaryProjectBalance
                    isSuccess={isSuccess}
                    {...value}
                    noDescription
                    buttonProps={getDialogControlButtonProps(`fr-modal-impacts_${name}-Summary`)}
                  />
                  <ImpactModalDescription
                    dialogId={`fr-modal-impacts_${name}-Summary`}
                    initialState={{
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    }}
                    {...modalData}
                  />
                </React.Fragment>
              );

            case "avoidedFricheCostsForLocalAuthority":
              return (
                <React.Fragment key={name}>
                  <ImpactSummaryAvoidedFricheCostsForLocalAuthority
                    isSuccess={isSuccess}
                    {...value}
                    noDescription
                    buttonProps={getDialogControlButtonProps(`fr-modal-impacts_${name}-Summary`)}
                  />
                  <ImpactModalDescription
                    dialogId={`fr-modal-impacts_${name}-Summary`}
                    initialState={{
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    }}
                    {...modalData}
                  />
                </React.Fragment>
              );
            case "taxesIncomesImpact":
              return (
                <React.Fragment key={name}>
                  <ImpactSummaryTaxesIncome
                    isSuccess={isSuccess}
                    value={value}
                    noDescription
                    buttonProps={getDialogControlButtonProps(`fr-modal-impacts_${name}-Summary`)}
                  />
                  <ImpactModalDescription
                    dialogId={`fr-modal-impacts_${name}-Summary`}
                    initialState={{
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    }}
                    {...modalData}
                  />
                </React.Fragment>
              );
            case "fullTimeJobs":
              return (
                <React.Fragment key={name}>
                  <ImpactSummaryFullTimeJobs
                    isSuccess={isSuccess}
                    {...value}
                    noDescription
                    buttonProps={getDialogControlButtonProps(`fr-modal-impacts_${name}-Summary`)}
                  />
                  <ImpactModalDescription
                    dialogId={`fr-modal-impacts_${name}-Summary`}
                    initialState={{
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    }}
                    {...modalData}
                  />
                </React.Fragment>
              );
            case "avoidedCo2eqEmissions":
              return (
                <React.Fragment key={name}>
                  <ImpactSummaryAvoidedCo2eqEmissions
                    isSuccess={isSuccess}
                    value={value}
                    noDescription
                    buttonProps={getDialogControlButtonProps(`fr-modal-impacts_${name}-Summary`)}
                  />
                  <ImpactModalDescription
                    dialogId={`fr-modal-impacts_${name}-Summary`}
                    initialState={{
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    }}
                    {...modalData}
                  />
                </React.Fragment>
              );
            case "nonContaminatedSurfaceArea":
              return (
                <React.Fragment key={name}>
                  <ImpactSummaryNonContaminatedSurfaceArea
                    isSuccess={isSuccess}
                    {...value}
                    noDescription
                    buttonProps={getDialogControlButtonProps(`fr-modal-impacts_${name}-Summary`)}
                  />
                  <ImpactModalDescription
                    dialogId={`fr-modal-impacts_${name}-Summary`}
                    initialState={{
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    }}
                    {...modalData}
                  />
                </React.Fragment>
              );
            case "permeableSurfaceArea":
              return (
                <React.Fragment key={name}>
                  <ImpactSummaryPermeableSurfaceArea
                    isSuccess={isSuccess}
                    {...value}
                    noDescription
                    buttonProps={getDialogControlButtonProps(`fr-modal-impacts_${name}-Summary`)}
                  />
                  <ImpactModalDescription
                    dialogId={`fr-modal-impacts_${name}-Summary`}
                    initialState={{
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    }}
                    {...modalData}
                  />
                </React.Fragment>
              );
            case "householdsPoweredByRenewableEnergy":
              return (
                <React.Fragment key={name}>
                  <ImpactSummaryHouseholdsPoweredByRenewableEnergy
                    value={value}
                    noDescription
                    buttonProps={getDialogControlButtonProps(`fr-modal-impacts_${name}-Summary`)}
                  />
                  <ImpactModalDescription
                    dialogId={`fr-modal-impacts_${name}-Summary`}
                    initialState={{
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    }}
                    {...modalData}
                  />
                </React.Fragment>
              );
            case "localPropertyValueIncrease":
              return (
                <React.Fragment key={name}>
                  <ImpactSummaryLocalPropertyValueIncrease
                    value={value}
                    noDescription
                    buttonProps={getDialogControlButtonProps(`fr-modal-impacts_${name}-Summary`)}
                  />
                  <ImpactModalDescription
                    dialogId={`fr-modal-impacts_${name}-Summary`}
                    initialState={{
                      sectionName: "summary",
                      impactData: { value, isSuccess, name },
                    }}
                    {...modalData}
                  />
                </React.Fragment>
              );
          }
        })}
    </div>
  );
};

export default ImpactSummaryView;
