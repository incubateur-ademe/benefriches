import React from "react";

import { KeyImpactIndicatorData } from "@/features/projects/domain/projectKeyImpactIndicators";

import ImpactModalDescription, {
  ModalDataProps,
} from "../impact-description-modals/ImpactModalDescription";
import { getDialogControlButtonProps } from "../list-view/dialogControlBtnProps";
import KeyImpactIndicatorCard from "./KeyImpactIndicatorCard";

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

const getSummaryIndicatorTitle = ({
  name,
  isSuccess,
}: {
  name: KeyImpactIndicatorData["name"];
  isSuccess: boolean;
}) => {
  switch (name) {
    case "avoidedCo2eqEmissions":
      return isSuccess ? "- d’émissions de CO2\u00a0☁️" : "+ d’émissions de CO2\u00a0☁️";
    case "taxesIncomesImpact":
      return isSuccess ? "+ de recettes fiscales\u00a0💰" : "- de recettes fiscales\u00a0💸";
    case "localPropertyValueIncrease":
      return "Un cadre de vie amélioré\u00a0🏡";
    case "householdsPoweredByRenewableEnergy":
      return "+ d’énergies renouvelables\u00a0⚡";
    case "nonContaminatedSurfaceArea":
      return isSuccess
        ? "Des risques sanitaires réduits\u00a0☢️"
        : "des sols encore pollués\u00a0☢️";
    case "fullTimeJobs":
      return isSuccess ? "+ d’emplois\u00a0👷" : "- d’emplois\u00a0👷";
    case "permeableSurfaceArea":
      return isSuccess ? "+ de sols perméables\u00a0☔️" : "- de sols perméables\u00a0☔️";
    case "avoidedFricheCostsForLocalAuthority":
      return isSuccess
        ? "- de dépenses de sécurisation\u00a0💰"
        : "Des dépenses de sécurisation demeurent\u00a0💸";
    case "projectImpactBalance":
      return isSuccess
        ? "Les impacts compensent le déficit de l'opération\u00a0💰"
        : "Les impacts ne compensent pas le déficit de l'opération\u00a0💸";
    case "zanCompliance":
      return isSuccess ? `Projet favorable au ZAN\u00a0🌾` : `Projet defavorable au ZAN\u00a0🌾`;
  }
};

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
    </div>
  );
};

export default ImpactSummaryView;
