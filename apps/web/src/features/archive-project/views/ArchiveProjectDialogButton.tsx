import Button from "@codegouvfr/react-dsfr/Button";

import ArchiveProjectDialog from "./ArchiveProjectDialog";

type Props = {
  projectId: string;
  projectName: string;
  onSuccess?: () => void;
};

function ArchiveProjectDialogButton({ projectId, ...props }: Props) {
  const dialogId = `archive-project-${projectId}`;
  return (
    <>
      <Button
        className="py-1.5 px-4 w-full text-error-ultradark hover:bg-white hover:dark:bg-black"
        priority="tertiary no outline"
        size="small"
        iconId="fr-icon-delete-line"
        title="Supprimer le projet"
        nativeButtonProps={{
          "aria-controls": dialogId,
          "data-fr-opened": false,
        }}
      >
        Supprimer
      </Button>
      <ArchiveProjectDialog projectId={projectId} dialogId={dialogId} {...props} />
    </>
  );
}

export default ArchiveProjectDialogButton;
