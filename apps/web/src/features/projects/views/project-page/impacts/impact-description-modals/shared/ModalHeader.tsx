import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode, useContext } from "react";

import classNames from "@/shared/views/clsx";

import { ImpactModalDescriptionContext } from "../ImpactModalDescriptionContext";
import ModalBreadcrumb, { BreadcrumbProps } from "./ModalBreadcrumb";

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumbSegments: BreadcrumbProps["segments"];
  value?: {
    state: "success" | "error";
    text: string;
    description?: string;
  };
};

const ModalHeader = ({ title, subtitle, breadcrumbSegments, value }: Props) => {
  const { dialogId, dialogTitleId } = useContext(ImpactModalDescriptionContext);
  return (
    <div
      className={classNames(
        "tw-border-0",
        "tw-border-solid",
        "tw-border-b",
        "tw-border-borderGrey",
        "tw-bg-white dark:tw-bg-black",
        "tw-p-6",
        "tw-flex-col",
      )}
    >
      <div className="tw-flex tw-justify-around tw-items-start tw-w-full">
        <ModalBreadcrumb segments={breadcrumbSegments} />
        <button
          className={fr.cx("fr-btn--close", "fr-btn")}
          title="Fermer"
          aria-controls={dialogId}
          type="button"
        >
          Fermer
        </button>
      </div>
      <h1 id={dialogTitleId} className={classNames(fr.cx("fr-modal__title"), "tw-mb-2")}>
        {title}
      </h1>

      {subtitle && <div className="tw-font-bold tw-mb-2">{subtitle}</div>}
      {value && (
        <div>
          <span
            className={classNames(
              "tw-text-2xl",
              "tw-font-bold",
              value.state === "success"
                ? "tw-text-impacts-positive-main dark:tw-text-impacts-positive-light"
                : "tw-text-impacts-negative-main dark:tw-text-impacts-negative-light",
            )}
          >
            {value.text}
          </span>

          {value.description && (
            <span className="tw-text-text-light">{` ${value.description}`}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ModalHeader;
