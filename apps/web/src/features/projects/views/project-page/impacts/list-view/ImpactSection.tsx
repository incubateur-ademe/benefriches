import { MouseEvent, ReactNode, useState } from "react";

import classNames from "@/shared/views/clsx";

import ImpactRowValue from "./ImpactRowValue";
import { getDialogControlButtonProps } from "./dialogControlBtnProps";

type Props = {
  title: string;
  isMain?: boolean;
  total?: number;
  dialogId: string;
  children: ReactNode;
  initialShowSectionContent?: boolean;
  noMarginBottom?: boolean;
};

const ImpactSection = ({
  title,
  total,
  isMain = false,
  dialogId,
  children,
  initialShowSectionContent = true,
  noMarginBottom = false,
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
    <section className={classNames(!noMarginBottom && "tw-mb-10")}>
      <div
        className={classNames(
          "tw-py-2 tw-px-4",
          "tw-w-full",
          "tw-rounded tw-border tw-border-solid tw-border-transparent",
          isMain
            ? ["tw-bg-impacts-dark", "dark:tw-bg-black", "tw-mb-6"]
            : ["tw-bg-impacts-main", "dark:tw-bg-black", "tw-mb-2"],
          "tw-cursor-pointer",
          "tw-transition tw-ease-in-out tw-duration-500",
          "hover:tw-border-grey-dark hover:dark:tw-border-white",
        )}
        onClick={toggleDisplaySectionContent}
      >
        <ImpactRowValue
          label={title}
          labelProps={{
            role: "heading",
            "aria-level": isMain ? 3 : 4,
            className: isMain ? "tw-text-xl" : "tw-text-base",
            ...getDialogControlButtonProps(dialogId),
          }}
          value={total}
          type="monetary"
          isTotal
          isAccordionOpened={displaySectionContent}
          onToggleAccordion={onToggleAccordionFromChild}
        />
      </div>
      {displaySectionContent && <div className="tw-text-sm">{children}</div>}
    </section>
  );
};

export default ImpactSection;
