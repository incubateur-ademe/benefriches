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
        .map(({ name, value, isSuccess }, index) => {
          switch (name) {
            case "zanCompliance":
              return (
                <>
                  <ImpactSummaryZanCompliance
                    key={index}
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
                </>
              );

            case "projectImpactBalance":
              return (
                <>
                  <ImpactSummaryProjectBalance
                    key={index}
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
                </>
              );

            case "avoidedFricheCostsForLocalAuthority":
              return (
                <>
                  <ImpactSummaryAvoidedFricheCostsForLocalAuthority
                    key={index}
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
                </>
              );
            case "taxesIncomesImpact":
              return (
                <>
                  <ImpactSummaryTaxesIncome
                    key={index}
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
                </>
              );
            case "fullTimeJobs":
              return (
                <>
                  <ImpactSummaryFullTimeJobs
                    key={index}
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
                </>
              );
            case "avoidedCo2eqEmissions":
              return (
                <>
                  <ImpactSummaryAvoidedCo2eqEmissions
                    key={index}
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
                </>
              );
            case "nonContaminatedSurfaceArea":
              return (
                <>
                  <ImpactSummaryNonContaminatedSurfaceArea
                    key={index}
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
                </>
              );
            case "permeableSurfaceArea":
              return (
                <>
                  <ImpactSummaryPermeableSurfaceArea
                    key={index}
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
                </>
              );
            case "householdsPoweredByRenewableEnergy":
              return (
                <>
                  <ImpactSummaryHouseholdsPoweredByRenewableEnergy
                    key={index}
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
                </>
              );
            case "localPropertyValueIncrease":
              return (
                <>
                  <ImpactSummaryLocalPropertyValueIncrease
                    key={index}
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
                </>
              );
          }
        })}
    </div>
  );
};

export default ImpactSummaryView;
