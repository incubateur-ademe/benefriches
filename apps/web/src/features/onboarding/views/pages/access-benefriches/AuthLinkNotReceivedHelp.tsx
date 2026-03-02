import Button from "@codegouvfr/react-dsfr/Button";

import { BENEFRICHES_ENV } from "@/app/envVars";
import { useAppDispatch } from "@/app/hooks/store.hooks";
import { authLinkNotReceivedHelpRequested } from "@/features/support/core/authLinkNotReceivedHelpRequested.action";

type Props = {
  email: string;
};

export default function AuthLinkNotReceivedHelp({ email }: Props) {
  const dispatch = useAppDispatch();

  return (
    <div className="mt-4 rounded border border-default-grey bg-alt-grey p-4">
      <p className="mb-2 font-bold">Vous n'avez pas reçu l'email ?</p>
      <p className="mb-2 text-sm">
        Certaines protections e-mail (MailInBlack, etc.) peuvent bloquer nos messages. Contactez
        notre support pour recevoir votre lien de connexion.
      </p>
      {/* TODO: display a "Contacter le support" button leading to support email address */}
      {BENEFRICHES_ENV.crispEnabled && (
        <Button
          type="button"
          priority="secondary"
          iconId="ri-chat-3-line"
          onClick={() => {
            void dispatch(authLinkNotReceivedHelpRequested({ email }));
          }}
        >
          Contacter le support
        </Button>
      )}
    </div>
  );
}
