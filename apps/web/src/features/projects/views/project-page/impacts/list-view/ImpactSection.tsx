import { ReactNode, useState } from "react";
import ImpactRowLabel from "./ImpactRowLabel";
import ImpactRowValue from "./ImpactRowValue";

import classNames from "@/shared/views/clsx";

type Props = {
  title: ReactNode;
  isMain?: boolean;
  total?: number;
  onTitleClick?: () => void;
  children: ReactNode;
};

const ImpactSection = ({ title, total, isMain = false, onTitleClick, children }: Props) => {
  const [displaySectionContent, setDisplaySectionContent] = useState(true);
  const toggleDisplaySectionContent = () => {
    setDisplaySectionContent((displaySectionContent) => !displaySectionContent);
  };

  return (
    <section className="fr-mb-5w">
      <div
        className={classNames(
          "tw-py-2 tw-px-4",
          "tw-w-full",
          "tw-rounded",
          isMain
            ? ["tw-bg-impacts-dark", "dark:tw-bg-black", "tw-mb-6"]
            : ["tw-bg-impacts-main", "dark:tw-bg-black", "tw-mb-2"],
          onTitleClick && [
            "tw-cursor-pointer",
            "tw-transition",
            "hover:tw-border hover:tw-border-solid",
          ],
        )}
      >
        <ImpactRowValue
          value={total}
          type="monetary"
          isTotal
          isAccordionOpened={displaySectionContent}
          onToggleAccordion={toggleDisplaySectionContent}
        >
          <ImpactRowLabel onLabelClick={onTitleClick}>
            {isMain ? (
              <h3 className="tw-text-xl tw-mb-0" onClick={onTitleClick}>
                {title}
              </h3>
            ) : (
              <h4 className={classNames("tw-font-bold", "tw-text-lg", "tw-mb-0")}>{title}</h4>
            )}
          </ImpactRowLabel>
        </ImpactRowValue>
      </div>
      {displaySectionContent && children}
    </section>
  );
};

export default ImpactSection;
