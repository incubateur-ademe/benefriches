import HowItWorksStep from "./HowItWorksStep";

export default function HasOnlySiteSteps() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <HowItWorksStep emoji="✍️" title="Je décris ma friche">
        Adresse, terrain, bâtiments, environnement... avec un maximum de données pré-remplies par
        l'outil.
      </HowItWorksStep>
      <HowItWorksStep emoji="🔍" title="L'outil analyse ma friche">
        Et me propose les projets d'aménagement les plus adaptés, classés par pertinence.
      </HowItWorksStep>
      <HowItWorksStep emoji="📊" title="L'outil calcule les impacts d'un projet sur ma friche">
        Pour certains projets, l'outil peut calculer les impacts sur l'environnement, l'emploi, les
        finances publiques...
      </HowItWorksStep>
      <HowItWorksStep emoji="💡" title="Je découvre les solutions pour reconvertir ma friche">
        Outils, subventions disponibles, mise en relation avec un conseiller ou avec des porteurs de
        projets...
      </HowItWorksStep>
    </div>
  );
}
