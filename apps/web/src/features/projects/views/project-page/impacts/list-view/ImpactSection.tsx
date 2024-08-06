import { ReactNode, useState } from "react";
import ImpactRowValue from "./ImpactRowValue";

import classNames from "@/shared/views/clsx";

type Props = {
  title: ReactNode;
  isMain?: boolean;
  total?: number;
  onClick?: () => void;
  children: ReactNode;
};

const ImpactSection = ({ title, total, isMain = false, onClick, children }: Props) => {
  const [displaySection, setDisplaySection] = useState(true);

  return (
    <section className="fr-mb-5w">
      <div
        className={classNames(
          "tw-py-2",
          "tw-px-4",
          "tw-w-full",
          isMain
            ? ["tw-bg-impacts-dark", "dark:tw-bg-black"]
            : ["tw-bg-impacts-main", "dark:tw-bg-black"],
          "tw-transition",
          onClick && [
            "tw-cursor-pointer",
            "hover:tw-border",
            "hover:tw-border-solid",
            "hover:tw-scale-[1.02]",
          ],
          isMain ? "tw-mb-6" : "tw-mb-2",
          "tw-bg-impacts-dark",
          "tw-rounded",
        )}
        onClick={onClick}
      >
        <ImpactRowValue
          value={total}
          type="monetary"
          isTotal
          isAccordionOpened={displaySection}
          onToggleAccordion={() => {
            setDisplaySection((current) => !current);
          }}
        >
          {isMain ? (
            <h3 className={classNames("tw-text-xl", "tw-mb-0")} onClick={onClick}>
              {title}
            </h3>
          ) : (
            <h4 className={classNames("tw-font-bold", "tw-text-lg", "tw-mb-0")}>{title}</h4>
          )}
        </ImpactRowValue>
      </div>
      {displaySection && children}
    </section>
  );
};

export default ImpactSection;
