import Alert from "@codegouvfr/react-dsfr/Alert";

import { BENEFRICHES_ENV } from "@/shared/views/envVars";
import { routes, useRoute } from "@/shared/views/router";

type Props = {
  errorKind: string;
};

const commonAlertProps = {
  className: "my-7",
  small: true,
};

export default function AuthLinkRequestError({ errorKind }: Props) {
  const route = useRoute();

  switch (errorKind) {
    case "UserDoesNotExist":
      // eslint-disable-next-line no-case-declarations
      const accountCreationLink =
        route.name === "accessBenefriches" && route.params.redirectTo
          ? routes.onBoardingIdentity({ redirectTo: route.params.redirectTo }).link
          : routes.onBoardingIdentity().link;
      return (
        <Alert
          {...commonAlertProps}
          title="Aucun compte n'existe pour cette adresse e-mail"
          severity="warning"
          description={
            <p className="mb-4">
              {BENEFRICHES_ENV.authEnabled && (
                <span>
                  Vous pouvez créer un compte en suivant{" "}
                  <a className="text-sm font-medium" {...accountCreationLink}>
                    ce lien
                  </a>
                  .
                </span>
              )}
            </p>
          }
        />
      );
    case "TooManyRequests":
      return (
        <Alert
          {...commonAlertProps}
          title="Échec de l'envoi du lien"
          severity="warning"
          description={
            <p className="mb-4">Veuillez patienter 2 minutes avant de demander un nouveau lien.</p>
          }
        />
      );
    default:
      return (
        <Alert
          {...commonAlertProps}
          description="Une erreur est survenue lors de l'envoi du lien... Veuillez réessayer."
          severity="error"
          title="Échec de l'envoi du lien"
        />
      );
  }
}
