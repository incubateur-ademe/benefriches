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
    <section className={classNames(!noMarginBottom && "mb-10")}>
      <div
        className={classNames(
          "py-2 px-4",
          "w-full",
          "rounded-sm border border-solid border-transparent",
          isMain
            ? ["bg-grey-disabled", "dark:bg-black", "mb-6"]
            : ["bg-background-light", "dark:bg-black", "mb-2"],
          "cursor-pointer",
          "transition ease-in-out duration-500",
          "hover:border-grey-dark dark:hover:border-white",
        )}
        onClick={toggleDisplaySectionContent}
      >
        <ImpactRowValue
          label={title}
          labelProps={{
            role: "heading",
            "aria-level": isMain ? 3 : 4,
            className: isMain ? "text-xl" : "text-base",
            ...getDialogControlButtonProps(dialogId),
          }}
          value={total}
          type="monetary"
          isTotal
          isAccordionOpened={displaySectionContent}
          onToggleAccordion={onToggleAccordionFromChild}
        />
      </div>
      {displaySectionContent && <div className="text-sm">{children}</div>}
    </section>
  );
};

export default ImpactSection;
