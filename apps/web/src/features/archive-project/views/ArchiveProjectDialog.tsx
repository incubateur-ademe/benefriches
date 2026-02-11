import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import { useState } from "react";

import { selectCurrentUserEmail } from "@/features/onboarding/core/user.reducer";
import DsfrDialogContent from "@/shared/views/components/Dialog/DsfrDialogContent";
import DsfrDialogFooter from "@/shared/views/components/Dialog/DsfrDialogFooter";
import DsfrDialogHeader from "@/shared/views/components/Dialog/DsfrDialogHeader";
import DsfrDialogTitle from "@/shared/views/components/Dialog/DsfrDialogTitle";
import DsfrDialogWrapper from "@/shared/views/components/Dialog/DsfrDialogWrapper";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import { HttpArchiveProjectService } from "../infrastructure/HttpArchiveProjectService";

type Props = {
  dialogId: string;
  projectId: string;
  projectName: string;
  onSuccess?: () => void;
};

function ArchiveProjectDialog({ projectId, projectName, onSuccess, dialogId }: Props) {
  const [archiveState, setArchiveState] = useState("idle");

  const currentUserEmail = useAppSelector(selectCurrentUserEmail);

  const onConfirm = async () => {
    setArchiveState("loading");
    try {
      await new HttpArchiveProjectService().archive(projectId);
      setArchiveState("success");
    } catch (err) {
      console.error("Impossible d'archiver le projet", err);
      setArchiveState("error");
    }
  };

  const onCancel = () => {
    setArchiveState("idle");
  };

  return (
    <DsfrDialogWrapper
      size="small"
      dialogId={dialogId}
      onConceal={() => {
        if (onSuccess && archiveState === "success") {
          onSuccess();
        }
      }}
    >
      <DsfrDialogHeader />
      <DsfrDialogContent>
        <DsfrDialogTitle>
          {archiveState === "success" ? (
            <>
              <div className="text-3xl pb-4" aria-hidden="true">
                ✅
              </div>
              <span>Votre projet «&nbsp;{projectName}&nbsp;» a été supprimé</span>
            </>
          ) : (
            <>Voulez-vous vraiment supprimer le projet «&nbsp;{projectName}&nbsp;»&nbsp;?</>
          )}
        </DsfrDialogTitle>
        {archiveState === "loading" && <LoadingSpinner loadingText="Suppression en cours..." />}
        {archiveState === "error" && (
          <Alert
            title="Impossible de supprimer"
            severity="error"
            description={
              <>
                Une erreur s'est produite lors de la suppression... Veuillez réessayer.
                <br />
                <Button
                  iconId="fr-icon-question-line"
                  priority="tertiary no outline"
                  size="small"
                  nativeButtonProps={{
                    "data-tally-open": "mOVXLY",
                    "data-tally-width": "400",
                    "data-tally-emoji-text": "👋",
                    "data-tally-emoji-animation": "wave",
                    "data-tally-auto-close": "0",
                    "data-email": currentUserEmail,
                    "data-url": window.location.href,
                  }}
                >
                  Contacter le support
                </Button>
              </>
            }
          />
        )}
      </DsfrDialogContent>
      {archiveState !== "success" && (
        <DsfrDialogFooter
          buttons={[
            {
              priority: "secondary",
              onClick: onCancel,
              children: "Annuler",
              disabled: archiveState === "loading",
              closeModal: true,
            },
            {
              priority: "primary",
              className: "bg-error-ultradark",
              onClick: onConfirm,
              children:
                archiveState === "error" ? "Supprimer le projet" : "Confirmer la suppression",
              disabled: archiveState === "loading",
            },
          ]}
        ></DsfrDialogFooter>
      )}
    </DsfrDialogWrapper>
  );
}

export default ArchiveProjectDialog;
