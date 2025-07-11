import { fr } from "@codegouvfr/react-dsfr";
import React from "react";

import { KeyImpactIndicatorData } from "@/features/projects/domain/projectKeyImpactIndicators";
import classNames from "@/shared/views/clsx";

import { getDialogControlButtonProps } from "../../project-page/impacts/list-view/dialogControlBtnProps";
import KeyImpactIndicatorCard from "../../project-page/impacts/summary-view/KeyImpactIndicatorCard";
import { getSummaryIndicatorTitle, PRIORITY_ORDER } from "../../shared/impacts/summary";
import ImpactComparisonModalDescription, {
  ModalDataProps,
} from "../description-modals/ImpactComparisonModalDescription";

type Props = {
  baseCase: {
    indicators: KeyImpactIndicatorData[];
    siteName: string;
  };
  comparisonCase: {
    indicators: KeyImpactIndicatorData[];
    siteName: string;
  };
  modalData: ModalDataProps;
};

const ImpactSummaryView = ({ baseCase, comparisonCase, modalData }: Props) => {
  return (
    <div className="tw-grid md:tw-grid-cols-2 tw-gap-6 tw-mb-8 ">
      {[baseCase, comparisonCase].map(({ siteName, indicators }, index) => {
        const modalPrefix = index === 0 ? "base" : "comparison";
        return (
          <div
            key={index}
            className="tw-flex tw-flex-col tw-gap-6 tw-p-6 tw-bg-[var(--background-raised-grey)] tw-rounded-2xl"
          >
            <h3
              className={classNames(
                index === 0
                  ? "tw-text-[#806922] dark:tw-text-[#F6F1E1]"
                  : "tw-text-[#7F236B] dark:tw-text-[#F6E1F1]",
                "tw-text-2xl",
              )}
            >
              <span
                className={fr.cx("fr-icon--sm", "fr-icon-map-pin-2-line", "fr-pr-1w")}
                aria-hidden="true"
              ></span>
              {siteName}
            </h3>
            {indicators
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
