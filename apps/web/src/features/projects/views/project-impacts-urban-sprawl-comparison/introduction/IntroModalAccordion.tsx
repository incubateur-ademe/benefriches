import { ReactNode, useState } from "react";

import classNames from "@/shared/views/clsx";

type Props = {
  title: string;
  children: ReactNode;
};

const IntroModalAccordion = ({ title, children }: Props) => {
  const [isAccordionOpened, setIsAccordionOpened] = useState(false);

  const onToggleAccordion = () => {
    setIsAccordionOpened((current) => !current);
  };

  return (
    <section>
      <button
        className={classNames(
          "p-2",
          "w-full",
          "rounded-sm border border-solid border-transparent",
          "bg-grey-disabled",
          "dark:bg-black",
          "mb-6",
          "transition ease-in-out duration-500",
          "hover:border-grey-dark dark:hover:border-white",

          "grid",
          `grid-cols-[2rem_1fr]`,
          "items-center",
          "gap-2",
          "text-left",

          "font-bold",
        )}
        onClick={onToggleAccordion}
      >
        <span
          className={classNames(
            "col-start-1",
            "text-black dark:text-white",
            "text-xl",
            "fr-btn fr-btn--tertiary-no-outline fr-btn--sm",
            "hover:bg-(--hover-tint)",
            isAccordionOpened ? "fr-icon-arrow-up-s-fill" : "fr-icon-arrow-down-s-fill",
          )}
          title={isAccordionOpened ? "Fermer le contenu" : "Afficher le contenu"}
        ></span>

        <div className="col-start-2">{title}</div>
      </button>
      {isAccordionOpened && <div className="transition px-4">{children}</div>}
    </section>
  );
};

export default IntroModalAccordion;
