import OnboardingStepShell from "../step-shell/OnboardingStepShell";

export default function OnboardingWelcomePage() {
  return (
    <OnboardingStepShell step="welcome" htmlTitle="Bienvenue - Premiers pas">
      <h2 className="mb-4">Bienvenue sur Bénéfriches !</h2>
      <p className="mb-0">
        Contenu à venir : ce texte est un espace réservé et sera remplacé par le contenu définitif
        dans un prochain ticket.
      </p>
    </OnboardingStepShell>
  );
}
