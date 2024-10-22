import { MouseEvent, ReactNode, useState } from "react";

import classNames from "@/shared/views/clsx";

import ImpactRowValue from "./ImpactRowValue";

type Props = {
  title: ReactNode;
  isMain?: boolean;
  total?: number;
  onTitleClick?: () => void;
  children: ReactNode;
  initialShowSectionContent?: boolean;
};

const ImpactSection = ({
  title,
  total,
  isMain = false,
  onTitleClick,
  children,
  initialShowSectionContent = true,
}: Props) => {
  const [displaySectionContent, setDisplaySectionContent] = useState(initialShowSectionContent);

  const toggleDisplaySectionContent = () => {
    setDisplaySectionContent((displaySectionContent) => !displaySectionContent);
  };

  const onToggleAccordionFromChild = (e?: MouseEvent<HTMLElement>) => {
    if (e) {
      e.stopPropagation();
    }
    toggleDisplaySectionContent();
  };

  return (
    <section className="tw-mb-10">
      <div
        className={classNames(
          "tw-py-2 tw-px-4",
          "tw-w-full",
          "tw-rounded",
          isMain
            ? ["tw-bg-impacts-dark", "dark:tw-bg-black", "tw-mb-6"]
            : ["tw-bg-impacts-main", "dark:tw-bg-black", "tw-mb-2"],
          "tw-cursor-pointer",
          onTitleClick && [
            "tw-transition tw-ease-in-out tw-duration-500",
            "hover:tw-border hover:tw-border-solid",
            "hover:tw-scale-x-[1.02]",
          ],
        )}
        onClick={toggleDisplaySectionContent}
      >
        <ImpactRowValue
          label={
            isMain ? (
              <h3 className="tw-text-xl tw-mb-0" onClick={onTitleClick}>
                {title}
              </h3>
            ) : (
              <h4 className={classNames("tw-font-bold", "tw-text-base", "tw-mb-0")}>{title}</h4>
            )
          }
          value={total}
          type="monetary"
          isTotal
          isAccordionOpened={displaySectionContent}
          onLabelClick={
            onTitleClick
              ? (e?: MouseEvent<HTMLElement>) => {
                  if (e) {
                    e.stopPropagation();
                  }
                  onTitleClick();
                }
              : undefined
          }
          onToggleAccordion={onToggleAccordionFromChild}
        />
      </div>
      {displaySectionContent && <div className="tw-text-sm">{children}</div>}
    </section>
  );
};

export default ImpactSection;
