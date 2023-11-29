import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr/fr";

type Props = {
  children: ReactNode;
  onSelect: () => void;
  isSelected: boolean;
};

function SelectableProjectCard({ children, isSelected, onSelect }: Props) {
  return (
    <div
      style={{
        border: "2px #ddd solid",
        minHeight: "160px",
        cursor: "pointer",
        position: "relative",
        alignItems: "center",
      }}
      className={fr.cx("fr-grid-row", "fr-py-2w", "fr-px-3w")}
      onClick={onSelect}
    >
      <div style={{ position: "absolute", top: "8px", right: "12px" }}>
        <input type="radio" checked={isSelected} />
      </div>
      <h5>{children}</h5>
    </div>
  );
}

export default SelectableProjectCard;
