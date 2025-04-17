import { fr } from "@codegouvfr/react-dsfr";
import { ProConnectButton } from "@codegouvfr/react-dsfr/ProConnectButton";

function LoginPage() {
  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <h1>Se connecter</h1>
      <div className="tw-rounded-2xl tw-bg-gray-100 tw-px-12 tw-py-9">
        <h2 className="tw-text-xl tw-font-bold tw-text-dsfr-text-title-grey">
          Vous êtes agent ou élu(e) d'une collectivité ? Connectez-vous, créez votre projet et
          accédez à de nombreuses recommandations !
        </h2>
        <div className="tw-mb-8 tw-mt-8">
          Pour vous connecter avec ProConnect, il vous suffit de renseigner votre adresse
          professionnelle.
        </div>
        <ProConnectButton url="/api/auth/login/pro-connect" />
      </div>
    </section>
  );
}

export default LoginPage;
