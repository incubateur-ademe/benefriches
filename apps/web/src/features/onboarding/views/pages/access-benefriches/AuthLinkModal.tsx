import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { useForm, useWatch } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { authLinkRequestReset } from "@/features/onboarding/core/authLinkRequestReset.action";
import { authLinkRequested } from "@/features/onboarding/core/authLinkRequested.action";
import { useDelayed } from "@/shared/views/hooks/useDelayed";

import AuthLinkNotReceivedHelp from "./AuthLinkNotReceivedHelp";
import AuthLinkRequestError from "./AuthLinkRequestError";
import { authLinkModal } from "./createAuthLinkModal";

const HELP_DELAY_MS = 3_000;

function RequestResult({ email }: { email: string }) {
  const { authLinkRequestState, authLinkRequestError } = useAppSelector((state) => state.auth);
  const showHelp = useDelayed(authLinkRequestState === "success", HELP_DELAY_MS);

  switch (authLinkRequestState) {
    case "loading":
      return <p className="mt-2">Envoi du lien de connexion en cours...</p>;
    case "success":
      return (
        <>
          <Alert
            severity="success"
            title="Un lien de connexion a été envoyé"
            description="Cliquez sur le lien dans l'email pour vous connecter à Bénéfriches. Pensez à vérifier vos spams."
            className="mt-4"
            small
          />
          {showHelp && <AuthLinkNotReceivedHelp email={email} />}
        </>
      );
    case "error":
      return <AuthLinkRequestError errorKind={authLinkRequestError ?? ""} />;
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
  const { register, handleSubmit, control } = useForm<{ email: string }>();
  const email = useWatch({ control, name: "email", defaultValue: "" });

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
        <RequestResult email={email} />
      </form>
    </authLinkModal.Component>
  );
}
