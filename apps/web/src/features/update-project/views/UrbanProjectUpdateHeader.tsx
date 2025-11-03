import { Badge, BadgeProps } from "@codegouvfr/react-dsfr/Badge";

type Props = {
  projectName: string;
  saveState?: "success" | "idle" | "error" | "loading";
  updatedAt?: string;
};

const getBadgeProps = (
  saveState: Exclude<Props["saveState"], undefined>,
): { severity: BadgeProps["severity"]; text: string } => {
  switch (saveState) {
    case "success":
      return { severity: "success", text: "Enregistré" };
    case "error":
      return {
        severity: "error",
        text: "Problème d'enregistrement",
      };
    case "loading":
      return {
        severity: "info",
        text: "Enregistrement...",
      };
    case "idle":
      return {
        severity: "warning",
        text: "modification en cours",
      };
  }
};

const SaveStateInfo = ({
  saveState,
  updatedAt,
}: {
  saveState: "success" | "idle" | "error" | "loading";
  updatedAt?: string;
}) => {
  const { text, severity } = getBadgeProps(saveState);

  return (
    <div className="flex gap-2 items-center">
      <Badge small severity={severity}>
        {text}
      </Badge>
      {updatedAt && (
        <span className="text-xs uppercase text-(--text-mention-grey)">
          Dernière sauvegarde :{" "}
          {new Intl.DateTimeFormat("fr-FR", {
            year: "2-digit",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }).format(new Date(updatedAt))}
        </span>
      )}
    </div>
  );
};

function UrbanProjectUpdateHeader({ projectName, saveState, updatedAt }: Props) {
  return (
    <div className="flex gap-2 justify-between items-center">
      <div className="flex flex-col">
        <div className="flex gap-2 items-center mb-1.5">
          Modification du projet
          <span> - </span>
          <span className="mt-1 text-sm uppercase font-normal text-dsfr-text-label-grey">
            {projectName}
          </span>
        </div>
        {saveState && <SaveStateInfo saveState={saveState} updatedAt={updatedAt} />}
      </div>
    </div>
  );
}
export default UrbanProjectUpdateHeader;
