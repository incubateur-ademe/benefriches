import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";

type Props = {
  title: ReactNode;
  children?: ReactNode;
  onTitleClick?: () => void;
};

const ImpactChartCard = ({ title, children, onTitleClick }: Props) => {
  return (
    <figure
      className={classNames(
        fr.cx("fr-py-2w", "fr-px-3w", "fr-m-0"),
        "tw-flex",
        "tw-flex-col",
        "tw-border",
        "tw-border-solid",
        "tw-border-grey",
        "tw-h-full",
        "tw-bg-impacts-main",
        "dark:tw-bg-darkGrey",
      )}
    >
      <strong
        className={classNames(
          "fr-text--sm",
          onTitleClick && "tw-cursor-pointer hover:tw-underline",
        )}
        onClick={onTitleClick}
      >
        {title}
      </strong>
      <div className="tw-flex tw-flex-col tw-grow tw-justify-center">{children}</div>
    </figure>
  );
};

export default ImpactChartCard;
