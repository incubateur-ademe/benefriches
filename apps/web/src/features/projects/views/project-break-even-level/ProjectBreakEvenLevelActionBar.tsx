import { ReactNode, useState } from "react";

import classNames, { ClassValue } from "@/shared/views/clsx";

import ImpactEvaluationPeriodSelect from "../shared/actions/ImpactEvaluationPeriodSelect";
import ProjectImpactsStickyActionBar from "../shared/actions/StickyActionBar";

type Props = {
  evaluationPeriod: number | undefined;
  onEvaluationPeriodChange: (n: number) => void;
  header: ReactNode;
  className?: ClassValue;
};

function BreakEvenLevalImpactsActionBar({
  evaluationPeriod,
  onEvaluationPeriodChange,
  header,
  className,
}: Props) {
  const [isActionBarInViewport, setIsActionBarInViewPort] = useState(false);

  const inlineActionBarRef = (node: HTMLElement) => {
    const observer = new IntersectionObserver(([entry]) => {
      const entryIntersecting = entry?.isIntersecting ?? false;
      setIsActionBarInViewPort(entryIntersecting);
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  };

  return (
    <>
      {!isActionBarInViewport && (
        <ProjectImpactsStickyActionBar
          header={header}
          evaluationPeriod={evaluationPeriod}
          onEvaluationPeriodChange={onEvaluationPeriodChange}
        />
      )}
      <section ref={inlineActionBarRef} className={classNames(className)}>
        {evaluationPeriod !== undefined && (
          <ImpactEvaluationPeriodSelect
            onChange={onEvaluationPeriodChange}
            value={evaluationPeriod}
          />
        )}
      </section>
    </>
  );
}

export default BreakEvenLevalImpactsActionBar;
