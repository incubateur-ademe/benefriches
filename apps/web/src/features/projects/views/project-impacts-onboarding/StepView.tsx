import Button from "@codegouvfr/react-dsfr/Button";
import { ReactNode } from "react";

import { useHeaderHeight } from "@/shared/views/hooks/useHeaderHeight";

type Props = {
  title: ReactNode;
  children: ReactNode;
  nextButtonLabel?: string;
  onNextClick: () => void;
  onBackClick?: () => void;
  canSkipOnboarding: boolean;
  skipOnboarding: () => void;
};

export default function StepView({
  title,
  children,
  onNextClick,
  nextButtonLabel = "Suivant",
  onBackClick,
  canSkipOnboarding,
  skipOnboarding,
}: Props) {
  const headerHeight = useHeaderHeight();
  const innerPageHeight = `calc(100vh - ${headerHeight}px)`;

  return (
    <div className="flex flex-col" style={{ minHeight: innerPageHeight }}>
      <section className="flex-1 py-8 md:pt-20">
        <h1 className="text-[32px]">{title}</h1>
        {children}
      </section>

      <ul className="list-none p-0 m-0 flex gap-4 items-center justify-between sticky bottom-0 right-0 bg-white border-t border-border-grey py-4">
        {onBackClick && (
          <li>
            <Button priority="secondary" onClick={onBackClick}>
              Retour
            </Button>
          </li>
        )}
        {canSkipOnboarding && (
          <li className="ml-auto">
            <Button priority="tertiary no outline" onClick={skipOnboarding}>
              Passer l'introduction
            </Button>
          </li>
        )}
        <li className={!canSkipOnboarding ? "ml-auto" : ""}>
          <Button priority="primary" onClick={onNextClick}>
            {nextButtonLabel}
          </Button>
        </li>
      </ul>
    </div>
  );
}
