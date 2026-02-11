import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";

import ArchiveProjectDialog from "./ArchiveProjectDialog";

type Props = {
  projectId: string;
  projectName: string;
  buttonProps: ButtonProps.Common &
    (ButtonProps.IconOnly | ButtonProps.WithIcon | ButtonProps.WithoutIcon);
  onSuccess?: () => void;
};

function ArchiveProjectDialogButton({ buttonProps, projectId, ...props }: Props) {
  const dialogId = `archive-project-${projectId}`;
  return (
    <>
      <Button
        {...buttonProps}
        nativeButtonProps={{
          "aria-controls": dialogId,
          "data-fr-opened": false,
        }}
      />
      <ArchiveProjectDialog projectId={projectId} dialogId={dialogId} {...props} />
    </>
  );
}

export default ArchiveProjectDialogButton;
