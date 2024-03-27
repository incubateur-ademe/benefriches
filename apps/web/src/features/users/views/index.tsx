import { fr } from "@codegouvfr/react-dsfr";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";

function CreateUserPage() {
  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <h1>Créer un compte</h1>
      <CallOut title="En construction">La création de compte est en cours de construction</CallOut>
    </section>
  );
}

export default CreateUserPage;
