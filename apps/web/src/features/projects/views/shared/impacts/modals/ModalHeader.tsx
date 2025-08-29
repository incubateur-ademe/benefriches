import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode, useContext } from "react";

import classNames from "@/shared/views/clsx";

import { ImpactModalDescriptionContext } from "./ImpactModalDescriptionContext";
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
        "border-0",
        "border-solid",
        "border-b",
        "border-borderGrey",
        "bg-white dark:bg-black",
        "p-6",
        "flex-col",
      )}
    >
      <div className="flex justify-around items-start w-full">
        <ModalBreadcrumb segments={breadcrumbSegments} />
        <button className={fr.cx("fr-btn--close", "fr-btn")} aria-controls={dialogId} type="button">
          Fermer
        </button>
      </div>
      <h1 id={dialogTitleId} className={classNames(fr.cx("fr-modal__title"), "mb-2")}>
        {title}
      </h1>

      {subtitle && <div className="font-bold mb-2">{subtitle}</div>}
      {value && (
        <div>
          <span
            className={classNames(
              "text-2xl",
              "font-bold",
              value.state === "success"
                ? "text-impacts-positive-main dark:text-impacts-positive-light"
                : "text-impacts-negative-main dark:text-impacts-negative-light",
            )}
          >
            {value.text}
          </span>

          {value.description && <span className="text-text-light">{` ${value.description}`}</span>}
        </div>
      )}
    </div>
  );
};

export default ModalHeader;
