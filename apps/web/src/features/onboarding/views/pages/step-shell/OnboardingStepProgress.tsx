type Props = {
  currentStep: number;
  totalSteps: number;
};

export default function OnboardingStepProgress({ currentStep, totalSteps }: Props) {
  const stepNumbers = Array.from({ length: totalSteps }, (_, index) => index + 1);

  return (
    <div
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Étape ${currentStep} sur ${totalSteps}`}
      className="flex gap-2 mb-8 md:mb-12"
    >
      {stepNumbers.map((stepNumber) => (
        <span
          key={stepNumber}
          className={`h-2 flex-1 rounded-[4px] ${
            stepNumber <= currentStep ? "bg-blue-france" : "bg-background-light"
          }`}
        />
      ))}
    </div>
  );
}
