import { fr } from "@codegouvfr/react-dsfr/fr";

type Props = {
  name: string;
  isReconversionProject: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
};

function ProjectCard({
  isReconversionProject,
  name,
  isSelected,
  onSelect,
}: Props) {
  const isSelectable = Boolean(onSelect);

  return (
    <div
      style={{
        border: "2px gray solid",
        borderRadius: "9px",
        minHeight: "160px",
        cursor: isSelectable ? "pointer" : "initial",
        position: "relative",
        alignItems: "center",
      }}
      className={fr.cx("fr-grid-row", "fr-py-2w", "fr-px-3w")}
      onClick={() => onSelect && onSelect()}
    >
      {isSelectable && (
        <div style={{ position: "absolute", top: "8px", right: "12px" }}>
          <input type="radio" checked={isSelected} />
        </div>
      )}
      <h5>
        {isReconversionProject ? name : "Pas de changement (site existant)"}
      </h5>
    </div>
  );
}

export default ProjectCard;
