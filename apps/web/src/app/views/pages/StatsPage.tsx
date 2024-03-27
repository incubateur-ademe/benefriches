import { fr } from "@codegouvfr/react-dsfr";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";

function StatsPage() {
  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <h1>Statistiques</h1>
      <CallOut title="En construction">
        Désolé, cette page est toujours en construction. Les données ne sont donc pas accessibles
        pour l'instant. Nous travaillons activement pour vous donner de la visibilité le plus
        rapidement possible.
      </CallOut>
    </section>
  );
}

export default StatsPage;
