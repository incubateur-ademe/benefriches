import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr/fr";

import classNames from "@/shared/views/clsx";

type Props = {
  children: ReactNode;
  onSelect: () => void;
  isSelected: boolean;
};

function SelectableProjectCard({ children, isSelected, onSelect }: Props) {
  return (
    <div
      className={classNames(
        fr.cx("fr-grid-row", "fr-py-2w", "fr-px-3w"),
        "tw-border-solid",
        "tw-border-borderGrey",
        "tw-border-2",
        "tw-cursor-pointer",
        "tw-relative",
        "tw-items-center",
        "tw-min-h-40",
        "tw-rounded-lg",
      )}
      onClick={onSelect}
    >
      <div className="tw-absolute tw-top-[8px] tw-right-[12px]">
        <input type="radio" checked={isSelected} />
      </div>
      <h5>{children}</h5>
    </div>
  );
}

export default SelectableProjectCard;
