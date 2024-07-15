import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";

type Props = {
  title: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
};

const ImpactChartCard = ({ title, children, onClick }: Props) => {
  return (
    <figure
      className={classNames(
        fr.cx("fr-py-2w", "fr-px-3w", "fr-m-0"),
        "tw-flex",
        "tw-flex-col",
        "tw-border",
        "tw-border-solid",
        "tw-border-borderGrey",
        "tw-h-full",
        "tw-bg-impacts-main",
        "dark:tw-bg-grey-dark",
        onClick && [
          "tw-cursor-pointer",
          "hover:tw-underline",
          "hover:tw-bg-impacts-dark",
          "dark:hover:tw-bg-dsfr-contrastGrey",
        ],
      )}
      onClick={onClick}
    >
      <strong className={classNames("tw-text-lg")}>{title}</strong>
      <div className="tw-flex tw-flex-col tw-grow tw-justify-center">{children}</div>
    </figure>
  );
};

export default ImpactChartCard;
