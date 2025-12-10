import StepView from "./StepView";

type Props = {
  onBackClick: () => void;
  onNextClick: () => void;
  canSkipOnboarding: boolean;
  skipOnboarding: () => void;
};

export default function Step4({
  onNextClick,
  onBackClick,
  canSkipOnboarding,
  skipOnboarding,
}: Props) {
  return (
    <StepView
      htmlTitle="Sauvegarde - Introduction - Impacts du projet"
      title={
        <>
          Votre site et votre projet sont{" "}
          <span className="bg-[#FBB8F6] dark:text-black">sauvegardés automatiquement</span>.
        </>
      }
      onNextClick={onNextClick}
      nextButtonLabel="Consulter les impacts"
      onBackClick={onBackClick}
      canSkipOnboarding={canSkipOnboarding}
      skipOnboarding={skipOnboarding}
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-2">
          <p className="text-xl font-bold">Ils se trouvent dans "Mes évaluations".</p>
          <img
            src="/img/pictograms/project-impacts-onboarding/step4-my-projects.svg"
            aria-hidden="true"
            alt=""
          />
        </div>
        <div className="my-auto">
          <p>
            Avec vos identifiants Bénéfriches, connectez-vous depuis n'importe quel ordinateur et
            retrouvez ici tous vos sites et vos projets créés.
          </p>
        </div>
      </div>
    </StepView>
  );
}
