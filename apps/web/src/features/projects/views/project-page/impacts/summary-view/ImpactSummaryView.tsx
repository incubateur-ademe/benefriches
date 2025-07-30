import React from "react";

import { KeyImpactIndicatorData } from "@/features/projects/domain/projectKeyImpactIndicators";

import { getSummaryIndicatorTitle, PRIORITY_ORDER } from "../../../shared/impacts/summary";
import ImpactModalDescription, {
  ModalDataProps,
} from "../impact-description-modals/ImpactModalDescription";
import { getDialogControlButtonProps } from "../list-view/dialogControlBtnProps";
import KeyImpactIndicatorCard from "./KeyImpactIndicatorCard";

type Props = {
  keyImpactIndicatorsList: KeyImpactIndicatorData[];
  modalData: ModalDataProps;
};

const ImpactSummaryView = ({ keyImpactIndicatorsList, modalData }: Props) => {
  return (
    <section className="tw-mt-10 tw-grid tw-grid-rows-1 lg:tw-grid-cols-3 tw-gap-6">
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
                  <KeyImpactIndicatorCard
                    title={getSummaryIndicatorTitle({ name, isSuccess })}
                    type={isSuccess ? "success" : "error"}
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
                  <KeyImpactIndicatorCard
                    type={isSuccess ? "success" : "error"}
                    title={getSummaryIndicatorTitle({ name, isSuccess })}
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
                  <KeyImpactIndicatorCard
                    type={isSuccess ? "success" : "error"}
                    title={getSummaryIndicatorTitle({ name, isSuccess })}
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
                  <KeyImpactIndicatorCard
                    type={isSuccess ? "success" : "error"}
                    title={getSummaryIndicatorTitle({ name, isSuccess })}
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
                  <KeyImpactIndicatorCard
                    type={isSuccess ? "success" : "error"}
                    title={getSummaryIndicatorTitle({ name, isSuccess })}
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
                  <KeyImpactIndicatorCard
                    type={isSuccess ? "success" : "error"}
                    title={getSummaryIndicatorTitle({ name, isSuccess })}
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
                  <KeyImpactIndicatorCard
                    type={isSuccess ? "success" : "error"}
                    title={getSummaryIndicatorTitle({ name, isSuccess })}
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
                  <KeyImpactIndicatorCard
                    type={isSuccess ? "success" : "error"}
                    title={getSummaryIndicatorTitle({ name, isSuccess })}
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
                  <KeyImpactIndicatorCard
                    title={getSummaryIndicatorTitle({ name, isSuccess })}
                    type="success"
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
                  <KeyImpactIndicatorCard
                    title={getSummaryIndicatorTitle({ name, isSuccess })}
                    type="success"
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
    </section>
  );
};

export default ImpactSummaryView;
