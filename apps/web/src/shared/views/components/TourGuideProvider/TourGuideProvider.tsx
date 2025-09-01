import Button from "@codegouvfr/react-dsfr/Button";
import { breakpoints } from "@codegouvfr/react-dsfr/fr/breakpoints";
import { PopoverContentProps, StepType, TourProvider } from "@reactour/tour";
import { ReactElement, ReactNode } from "react";

type Props = {
  children: ReactNode;
  disableCloseBeforeEnd?: boolean;
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
      <h4 className="text-base font-medium mb-2">{title}</h4>
      {description && <span>{description}</span>}
    </>
  );

  if (selector) {
    return {
      selector,
      content,
      padding: {
        popover: [10, 5, 10, 5],
      },
    };
  }

  return {
    selector: ".tour-guide-no-selector",
    content,
    position: ({ windowHeight, height, windowWidth }) =>
      windowWidth < breakpoints.getPxValues().sm
        ? [16, windowHeight - height - 16]
        : [32, windowHeight - height - 32],
    styles: {
      maskArea: (base) => ({ ...base, height: 0, width: 0 }),
    },
  };
};

const preventBodyOverflow = () => {
  document.body.classList.add("overflow-hidden");
};

const allowBodyOverflow = () => {
  document.body.classList.remove("overflow-hidden");
};

function TourGuideProvider({
  children,
  steps,
  onCloseTutorial,
  disableCloseBeforeEnd = false,
}: Props) {
  const hasIntro = !steps[0]?.selector;

  return (
    <TourProvider
      className="rounded-lg p-4 max-w-[calc(100%-16px)]  sm:max-w-96!"
      afterOpen={preventBodyOverflow}
      beforeClose={allowBodyOverflow}
      onClickMask={({ setIsOpen, setCurrentStep }) => {
        if (disableCloseBeforeEnd) {
          setIsOpen(true);
          return;
        }
        setIsOpen(false);
        setCurrentStep(0);
        if (onCloseTutorial) {
          onCloseTutorial();
        }
      }}
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
          setCurrentStep(0);
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
              <span className="text-xs">
                {currentStepLabel} / {totalStepsLabel}
              </span>
            )}
            <div className="py-2">{stepContent as ReactNode}</div>
            <div className="flex justify-between mt-2">
              <Button priority="primary" onClick={onNext}>
                {isIntro ? "C’est parti" : isLast ? "C’est compris" : "Suivant"}
              </Button>
              {!disableCloseBeforeEnd && (
                <Button priority="tertiary no outline" onClick={onClose}>
                  Quitter le tutoriel
                </Button>
              )}
            </div>
          </>
        );
      }}
      styles={{
        popover: (base) => ({
          ...base,
          padding: "1rem",
          backgroundColor: "var(--background-default-grey)",
        }),
        maskArea: (base) => ({ ...base, rx: 8 }),
      }}
    >
      {children}
    </TourProvider>
  );
}

export default TourGuideProvider;
