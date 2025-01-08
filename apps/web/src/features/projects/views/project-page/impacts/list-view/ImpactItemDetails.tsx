import { MouseEvent, useContext, useState } from "react";

import classNames from "@/shared/views/clsx";

import { ImpactDescriptionModalCategory } from "../impact-description-modals/ImpactDescriptionModalWizard";
import { ImpactModalDescriptionContext } from "../impact-description-modals/ImpactModalDescriptionContext";
import ImpactRowValue from "./ImpactRowValue";

type Props = {
  label: string;
  actor?: string;
  value: number;
  descriptionModalId?: ImpactDescriptionModalCategory;
  data?: { label: string; value: number; descriptionModalId?: ImpactDescriptionModalCategory }[];
  type?: "surfaceArea" | "monetary" | "co2" | "default" | "etp" | "time" | undefined;
};

const getFromChildEventPropFunction = (fn?: () => void) => {
  if (!fn) {
    return undefined;
  }

  return (e?: MouseEvent<HTMLElement>) => {
    if (e) {
      e.stopPropagation();
    }
    fn();
  };
};

const ImpactItemDetails = ({ label, value, actor, data, type, descriptionModalId }: Props) => {
  const hasData = data && data.length > 0;

  const [displayDetails, setDisplayDetails] = useState(false);

  const onToggleAccordion = () => {
    setDisplayDetails((current) => !current);
  };

  const onToggleAccordionFromChild = getFromChildEventPropFunction(onToggleAccordion);

  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  return (
    <div
      onClick={hasData ? onToggleAccordion : undefined}
      className={classNames(hasData && "tw-cursor-pointer")}
    >
      <ImpactRowValue
        label={label}
        actor={actor}
        value={value}
        type={type}
        isTotal
        isAccordionOpened={displayDetails}
        labelProps={{
          onClick: getFromChildEventPropFunction(
            descriptionModalId
              ? () => {
                  openImpactModalDescription(descriptionModalId);
                }
              : undefined,
          ),
        }}
        onToggleAccordion={hasData ? onToggleAccordionFromChild : undefined}
      />
      {hasData && displayDetails && (
        <div className={classNames("tw-pl-4")}>
          {data.map(
            ({
              label: detailsLabel,
              value: detailsValue,
              descriptionModalId: detailsDescriptionModalId,
            }) => (
              <ImpactRowValue
                value={detailsValue}
                type={type}
                key={detailsLabel}
                label={detailsLabel}
                labelProps={{
                  onClick: getFromChildEventPropFunction(
                    detailsDescriptionModalId
                      ? () => {
                          openImpactModalDescription(detailsDescriptionModalId);
                        }
                      : undefined,
                  ),
                }}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default ImpactItemDetails;
