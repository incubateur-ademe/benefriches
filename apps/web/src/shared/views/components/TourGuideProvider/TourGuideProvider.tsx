import { ReactElement, ReactNode } from "react";
import Button from "@codegouvfr/react-dsfr/Button";
import { PopoverContentProps, StepType, TourProvider } from "@reactour/tour";

type Props = {
  children: ReactNode;
  steps: {
    selector?: string | Element;
    title: ReactElement | string;
    description?: ReactElement | string;
  }[];
  onCloseTutorial?: () => void;
};

const mapStep = ({ selector, description, title }: Props["steps"][number]): StepType => {
  const content = (
    <>
      <h4 className="tw-text-base tw-font-medium tw-mb-2">{title}</h4>
      {description && <span>{description}</span>}
    </>
  );

  if (selector) {
    return { selector, content };
  }

  return {
    selector: ".tour-guide-no-selector",
    content,
    position: ({ windowHeight, height }) => [32, windowHeight - height - 32],
    styles: {
      maskArea: (base) => ({ ...base, height: 0, width: 0 }),
    },
  };
};

const preventBodyOverflow = () => {
  document.body.classList.add("tw-overflow-hidden");
};

const allowBodyOverflow = () => {
  document.body.classList.remove("tw-overflow-hidden");
};

function TourGuideProvider({ children, steps, onCloseTutorial }: Props) {
  const hasIntro = !steps[0]?.selector;

  return (
    <TourProvider
      className="tw-rounded-lg tw-p-4 !tw-max-w-96"
      afterOpen={preventBodyOverflow}
      beforeClose={allowBodyOverflow}
      steps={steps.map(mapStep)}
      ContentComponent={(props: PopoverContentProps) => {
        const { steps, currentStep: currentStepIndex, setIsOpen, setCurrentStep } = props;

        const currentStepLabel = hasIntro ? currentStepIndex : currentStepIndex + 1;
        const totalStepsLabel = hasIntro ? steps.length - 1 : steps.length;

        const currentStep = steps[currentStepIndex];
        const stepContent = currentStep?.content;

        const isIntro =
          currentStepIndex === 0 && currentStep?.selector === ".tour-guide-no-selector";
        const isLast = currentStepIndex === steps.length - 1;

        const onClose = () => {
          setIsOpen(false);
          if (onCloseTutorial) {
            onCloseTutorial();
          }
        };

        const onNext = () => {
          if (isLast) {
            onClose();
            return;
          }
          setCurrentStep((current) => (current === steps.length - 1 ? 0 : current + 1));
        };

        return (
          <>
            {!isIntro && (
              <span className="tw-text-xs">
                {currentStepLabel} / {totalStepsLabel}
              </span>
            )}
            <div className="tw-py-2">{stepContent as ReactNode}</div>
            <div className="tw-flex tw-justify-between tw-mt-2">
              <Button priority="primary" onClick={onNext}>
                {isIntro ? "C’est parti" : isLast ? "C’est compris" : "Suivant"}
              </Button>
              <Button priority="tertiary no outline" onClick={onClose}>
                Quitter le tutoriel
              </Button>
            </div>
          </>
        );
      }}
      styles={{
        popover: (base) => ({
          ...base,
          padding: "1rem",
        }),
      }}
    >
      {children}
    </TourProvider>
  );
}

export default TourGuideProvider;
