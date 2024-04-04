import { fr } from "@codegouvfr/react-dsfr";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";

type SelectableTileProps = {
  title: string;
  description?: string;
  imgSrc: string;
  isSelected: boolean;
  onSelect: () => void;
};

export default function SelectableTile({
  title,
  description,
  imgSrc,
  isSelected,
  onSelect,
}: SelectableTileProps) {
  return (
    <div
      className={fr.cx("fr-py-2w", "fr-px-3w")}
      style={{
        border: `1px solid ${isSelected ? "#000091" : "#DDD"}`,
        minHeight: "240px",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={(ev) => {
        // stop event propagation so it is not fired twice when checkbox is clicked
        ev.stopPropagation();
        ev.preventDefault();
        onSelect();
      }}
    >
      <div style={{ textAlign: "center" }}>
        <img src={imgSrc} width="80px" alt={`Illustration pour la tuile ${title}`} />
      </div>
      <div className={fr.cx("fr-mt-1w")} style={{ textAlign: "center" }}>
        <label className={fr.cx("fr-text--lg", "fr-text--bold")}>{title}</label>
      </div>
      {description && (
        <div className={fr.cx("fr-mt-1w")} style={{ textAlign: "center" }}>
          <legend className={fr.cx("fr-text--sm")}>{description}</legend>
        </div>
      )}
      <div style={{ position: "absolute", top: "16px", right: "0" }}>
        <Checkbox
          options={[
            {
              label: "",
              nativeInputProps: {
                checked: isSelected,
                onChange: () => {},
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
