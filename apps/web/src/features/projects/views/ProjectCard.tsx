import { fr } from "@codegouvfr/react-dsfr/fr";

type Props = {
  name: string;
  isReconversionProject: boolean;
};

function ProjectCard({ isReconversionProject, name }: Props) {
  return (
    <div
      style={{
        border: "2px gray solid",
        borderRadius: "9px",
        minHeight: "160px",
      }}
      className={fr.cx("fr-px-3w", "fr-py-4w")}
    >
      <h5>{isReconversionProject ? name : "Pas de changement"}</h5>
    </div>
  );
}

export default ProjectCard;
