import StepView from "./StepView";

type Props = {
  onBackClick: () => void;
  onNextClick: () => void;
  canSkipOnboarding: boolean;
  skipOnboarding: () => void;
};

export default function Step3({
  onNextClick,
  onBackClick,
  canSkipOnboarding,
  skipOnboarding,
}: Props) {
  return (
    <StepView
      htmlTitle="Détails des calculs - Introduction - Impacts du projet"
      title={
        <>
          Vous avez accès au{" "}
          <span className="bg-[#96ECFF] dark:text-black">calcul de tous les impacts</span>.
        </>
      }
      onNextClick={onNextClick}
      onBackClick={onBackClick}
      canSkipOnboarding={canSkipOnboarding}
      skipOnboarding={skipOnboarding}
    >
      <div className="flex justify-between gap-6">
        <div>
          <p className="text-xl font-bold max-w-72">Les indicateurs d'impact sont cliquables.</p>
          <img
            src="/img/pictograms/project-impacts-onboarding/step3-indicateur.svg"
            aria-hidden="true"
            alt="pictogramme indicateur"
          />
        </div>

        <img
          className="dark:invert"
          src="/img/pictograms/project-impacts-onboarding/step3-arrows.svg"
          aria-hidden="true"
          alt="pictogramme flèches"
        />

        <div className="my-auto">
          <p className="max-w-96 mx-auto">
            Ils ouvrent une fenêtre qui contient toutes les informations sur l'impact : définition,
            données utilisées, mode de calcul, sources, etc.
          </p>
          <img
            src="/img/pictograms/project-impacts-onboarding/step3-popin.png"
            aria-hidden="true"
            alt="pictogramme popin"
          />
        </div>
      </div>
    </StepView>
  );
}
