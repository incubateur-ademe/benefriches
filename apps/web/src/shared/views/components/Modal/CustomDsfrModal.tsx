import { fr, FrIconClassName, RiIconClassName } from "@codegouvfr/react-dsfr";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ReactNode } from "react";

import classNames from "../../clsx";

type Props = {
  className?: string;
  title: ReactNode;
  children: ReactNode;
  iconId?: FrIconClassName | RiIconClassName;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  size?: "small" | "large";
};

export default function CustomDsfrModal({
  title,
  children,
  iconId,
  isOpen,
  setIsOpen,
  size = "large",
}: Props) {
  const close = () => {
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      as="dialog"
      className={classNames(fr.cx("fr-modal", "fr-modal--opened"), "tw-overflow-auto", "tw-z-40")}
      onClose={close}
    >
      <DialogPanel>
        <div
          className={classNames(
            fr.cx("fr-container", "fr-container--fluid", "fr-container-md"),
            size === "small" && "md:tw-w-5/12",
          )}
        >
          <div
            className={classNames(
              fr.cx("fr-modal__body"),
              "!tw-max-h-[unset]",
              "tw-overflow-hidden",
            )}
          >
            <div className={fr.cx("fr-modal__header")}>
              <button
                className={fr.cx("fr-btn--close", "fr-btn")}
                title="Fermer"
                onClick={close}
                type="button"
              >
                Fermer
              </button>
            </div>
            <div className={fr.cx("fr-modal__content")}>
              <DialogTitle as="h1" className={fr.cx("fr-modal__title")}>
                {iconId !== undefined && (
                  <span className={fr.cx(iconId, "fr-fi--lg")} aria-hidden={true} />
                )}
                {title}
              </DialogTitle>
              {children}
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  );
}
