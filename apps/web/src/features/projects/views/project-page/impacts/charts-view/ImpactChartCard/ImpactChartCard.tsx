import { ReactNode, useId } from "react";

import classNames from "@/shared/views/clsx";

import ImpactModalDescriptionProviderContainer from "../../impact-description-modals";
import {
  ImpactModalDescriptionContext,
  OpenState,
} from "../../impact-description-modals/ImpactModalDescriptionContext";

export type ChartCardProps = {
  children?: ReactNode;
  dialogId: string;
  onOpenDialogArgs: OpenState;
};

const ImpactsChartCard = ({ children, onOpenDialogArgs, dialogId }: ChartCardProps) => {
  const id = useId();
  const dialogSectionId = `${dialogId}-${id}`;

  return (
    <ImpactModalDescriptionProviderContainer dialogId={dialogSectionId}>
      <ImpactModalDescriptionContext.Consumer>
        {({ getControlButtonProps }) => (
          <button
            className={classNames(
              "tw-p-6",
              "tw-m-0",
              "tw-mb-8",
              "tw-rounded-2xl",
              "tw-flex",
              "tw-flex-col",
              "tw-justify-between",
              "tw-bg-white hover:!tw-bg-white",
              "dark:tw-bg-black hover:!tw-bg-black",
              "tw-border",
              "tw-border-solid",
              "tw-border-transparent",
              "tw-cursor-pointer",
              "hover:tw-border-current",
              "tw-transition tw-ease-in-out tw-duration-500",
              "tw-text-left",
              "tw-w-full",
            )}
            {...getControlButtonProps(onOpenDialogArgs)}
          >
            {children}
          </button>
        )}
      </ImpactModalDescriptionContext.Consumer>
    </ImpactModalDescriptionProviderContainer>
  );
};

export default ImpactsChartCard;
