import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { useForm } from "react-hook-form";

import { authLinkRequestReset } from "@/features/onboarding/core/authLinkRequestReset.action";
import { authLinkRequested } from "@/features/onboarding/core/authLinkRequested.action";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { authLinkModal } from "./createAuthLinkModal";

function RequestResult() {
  const { authLinkRequestState, authLinkRequestError } = useAppSelector((state) => state.auth);
  switch (authLinkRequestState) {
    case "loading":
      return <p className="mt-2">Envoi du lien de connexion en cours...</p>;
    case "success":
      return (
        <Alert
          severity="success"
          title="Un lien de connexion a été envoyé"
          description="Cliquez sur le lien dans l'email pour vous connecter à Bénéfriches."
          className="mt-4"
          small
        />
      );
    case "error":
      return (
        <Alert
          severity="error"
          title="Une erreur est survenue lors de l'envoi du lien"
          description={authLinkRequestError ?? ""}
          className="mt-4"
          small
        />
      );
    default:
      return null;
  }
}

type Props = {
  postLoginRedirectTo?: string;
};

export default function AuthLinkModal({ postLoginRedirectTo }: Props) {
  const dispatch = useAppDispatch();
  useIsModalOpen(authLinkModal, {
    onConceal: () => {
      dispatch(authLinkRequestReset());
    },
  });
  const { register, handleSubmit } = useForm<{ email: string }>();

  return (
    <authLinkModal.Component size="medium" title="Demande de lien de connexion">
      <form
        onSubmit={handleSubmit((data) => {
          void dispatch(authLinkRequested({ email: data.email, postLoginRedirectTo }));
        })}
      >
        <Input
          label="Adresse e-mail"
          nativeInputProps={{ type: "email", ...register("email", { required: true }) }}
        />
        <div className="text-right">
          <Button type="submit" priority="primary">
            Recevoir un lien de connexion
          </Button>
        </div>
        <RequestResult />
      </form>
    </authLinkModal.Component>
  );
}
