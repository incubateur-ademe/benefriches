import HowItWorksStep from "./HowItWorksStep";

export default function HasSiteAndProjectSteps() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <HowItWorksStep emoji="📍" title="Je décris mon site">
        Type de site, sols, pollution, gestion du site... avec un maximum de données pré-remplies
        par l'outil.
      </HowItWorksStep>
      <HowItWorksStep emoji="🏗️" title="Je décris mon projet">
        Type de projet, dépenses et recettes... avec là aussi un maximum de données pré-remplies.
      </HowItWorksStep>
      <HowItWorksStep emoji="📊" title="L'outil calcule les impacts du projet">
        Impact sur l'environnement, l'emploi, le cadre de vie des riverains, les finances
        publiques...
      </HowItWorksStep>
      <HowItWorksStep emoji="📥" title="Je m'approprie les impacts">
        Après avoir consulté les impacts, je peux les exporter en PDF et les comparer avec les
        impacts d'un autre projet.
      </HowItWorksStep>
    </div>
  );
}
