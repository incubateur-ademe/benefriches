import { fr } from "@codegouvfr/react-dsfr";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";

function LoginPage() {
  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <h1>Se connecter</h1>
      <CallOut title="En construction">La connexion est en cours de construction</CallOut>
    </section>
  );
}

export default LoginPage;
