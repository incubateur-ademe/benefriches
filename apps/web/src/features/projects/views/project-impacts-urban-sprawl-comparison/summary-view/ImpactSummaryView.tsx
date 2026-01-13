import React from "react";
import { SiteNature } from "shared";

import { KeyImpactIndicatorData } from "@/features/projects/domain/projectKeyImpactIndicators";
import classNames from "@/shared/views/clsx";
import { getPictogramUrlForSiteNature } from "@/shared/views/siteNature";

import { getDialogControlButtonProps } from "../../project-page/impacts/list-view/dialogControlBtnProps";
import KeyImpactIndicatorCard from "../../project-page/impacts/summary-view/KeyImpactIndicatorCard";
import { getSummaryIndicatorTitle, PRIORITY_ORDER } from "../../shared/impacts/summary";
import ImpactComparisonModalDescription, {
  ModalDataProps,
} from "../description-modals/ImpactComparisonModalDescription";

type Props = {
  baseCase: {
    indicators: KeyImpactIndicatorData[];
    siteNature: SiteNature;
  };
  comparisonCase: {
    indicators: KeyImpactIndicatorData[];
    siteNature: SiteNature;
  };
  modalData: ModalDataProps;
};

const getTextForSiteNature = (siteNature: SiteNature) => {
  switch (siteNature) {
    case "FRICHE":
      return "la friche";
    case "AGRICULTURAL_OPERATION":
      return "l'exploitation agricole";
    case "NATURAL_AREA":
      return "l'espace de nature";
  }
};

const ImpactSummaryView = ({ baseCase, comparisonCase, modalData }: Props) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {[baseCase, comparisonCase].map(({ siteNature, indicators }, index) => {
        const isBaseCase = index === 0;
        const modalPrefix = isBaseCase ? "base" : "comparison";
        const statuQuoSiteNature = isBaseCase ? comparisonCase.siteNature : baseCase.siteNature;
        return (
          <div
            key={siteNature}
            className="flex flex-col gap-6 p-6 border border-solid border-border-grey rounded-2xl"
          >
            <div className="flex gap-4">
              <img
                src={getPictogramUrlForSiteNature(siteNature)}
                aria-hidden={true}
                alt=""
                width="56"
                height="56"
              />
              <h4 className={classNames("text-2xl", "flex flex-col", "mb-0")}>
                Projet sur {getTextForSiteNature(siteNature)}
                <span className="text-sm">
                  et statu quo sur {getTextForSiteNature(statuQuoSiteNature)}
                </span>
              </h4>
            </div>

            {indicators
              .toSorted(
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
                          buttonProps={getDialogControlButtonProps(
                            `fr-modal-${modalPrefix}-impacts_${name}-Summary`,
                          )}
                        />
                        <ImpactComparisonModalDescription
                          dialogId={`fr-modal-${modalPrefix}-impacts_${name}-Summary`}
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
                          buttonProps={getDialogControlButtonProps(
                            `fr-modal-${modalPrefix}-impacts_${name}-Summary`,
                          )}
                        />
                        <ImpactComparisonModalDescription
                          dialogId={`fr-modal-${modalPrefix}-impacts_${name}-Summary`}
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
                          buttonProps={getDialogControlButtonProps(
                            `fr-modal-${modalPrefix}-impacts_${name}-Summary`,
                          )}
                        />
                        <ImpactComparisonModalDescription
                          dialogId={`fr-modal-${modalPrefix}-impacts_${name}-Summary`}
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
                          buttonProps={getDialogControlButtonProps(
                            `fr-modal-${modalPrefix}-impacts_${name}-Summary`,
                          )}
                        />
                        <ImpactComparisonModalDescription
                          dialogId={`fr-modal-${modalPrefix}-impacts_${name}-Summary`}
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
                          buttonProps={getDialogControlButtonProps(
                            `fr-modal-${modalPrefix}-impacts_${name}-Summary`,
                          )}
                        />
                        <ImpactComparisonModalDescription
                          dialogId={`fr-modal-${modalPrefix}-impacts_${name}-Summary`}
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
                          buttonProps={getDialogControlButtonProps(
                            `fr-modal-${modalPrefix}-impacts_${name}-Summary`,
                          )}
                        />
                        <ImpactComparisonModalDescription
                          dialogId={`fr-modal-${modalPrefix}-impacts_${name}-Summary`}
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
                          buttonProps={getDialogControlButtonProps(
                            `fr-modal-${modalPrefix}-impacts_${name}-Summary`,
                          )}
                        />
                        <ImpactComparisonModalDescription
                          dialogId={`fr-modal-${modalPrefix}-impacts_${name}-Summary`}
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
                          buttonProps={getDialogControlButtonProps(
                            `fr-modal-${modalPrefix}-impacts_${name}-Summary`,
                          )}
                        />
                        <ImpactComparisonModalDescription
                          dialogId={`fr-modal-${modalPrefix}-impacts_${name}-Summary`}
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
                          buttonProps={getDialogControlButtonProps(
                            `fr-modal-${modalPrefix}-impacts_${name}-Summary`,
                          )}
                        />
                        <ImpactComparisonModalDescription
                          dialogId={`fr-modal-${modalPrefix}-impacts_${name}-Summary`}
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
                          buttonProps={getDialogControlButtonProps(
                            `fr-modal-${modalPrefix}-impacts_${name}-Summary`,
                          )}
                        />
                        <ImpactComparisonModalDescription
                          dialogId={`fr-modal-${modalPrefix}-impacts_${name}-Summary`}
                          initialState={{
                            sectionName: "summary",
                            impactData: { value, isSuccess, name },
                          }}
                          {...modalData}
                        />
                      </React.Fragment>
                    );
                  case "avoidedMaintenanceCostsForLocalAuthority":
                    return (
                      <React.Fragment key={name}>
                        <KeyImpactIndicatorCard
                          title={getSummaryIndicatorTitle({ name, isSuccess })}
                          type={isSuccess ? "success" : "error"}
                          buttonProps={getDialogControlButtonProps(
                            `fr-modal-${modalPrefix}-impacts_${name}-Summary`,
                          )}
                        />
                        <ImpactComparisonModalDescription
                          dialogId={`fr-modal-${modalPrefix}-impacts_${name}-Summary`}
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
      })}
    </div>
  );
};

export default ImpactSummaryView;
