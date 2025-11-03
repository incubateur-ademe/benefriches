import Button from "@codegouvfr/react-dsfr/Button";
import { ReactNode, useState } from "react";

import classNames from "../../clsx";

type AccordionProps = {
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export default function Accordion({ label, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <div>
      <div
        className={classNames(
          "py-2 px-4 mb-4",
          "rounded-sm border border-solid border-transparent",
          "bg-impacts-main dark:bg-blue-dark",
          "cursor-pointer",
          "transition ease-in-out duration-500",
          "hover:border-grey-dark hover:dark:border-white",
          "flex items-center gap-2",
        )}
        onClick={toggle}
      >
        <Button
          className={classNames("text-black dark:text-white")}
          iconId={isOpen ? "fr-icon-arrow-up-s-fill" : "fr-icon-arrow-down-s-fill"}
          onClick={(e) => {
            e.preventDefault();
          }}
          size="small"
          priority="tertiary no outline"
          title={isOpen ? "Fermer la section" : "Afficher la section"}
        />
        <h2 className="text-lg mb-0">{label}</h2>
      </div>
      {isOpen && <div className="px-4">{children}</div>}
    </div>
  );
}
