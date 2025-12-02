import { Button } from "@codegouvfr/react-dsfr/Button";
import { useState } from "react";
import { SiteActionStatus } from "shared";

import classNames from "@/shared/views/clsx";

const statusIconClasses = {
  done: "bg-success-ultralight border-success-light text-success-dark",
  skipped: "bg-success-ultralight border-success-light text-success-dark",
  todo: "border-text-medium bg-background-light",
} as const satisfies Record<SiteActionStatus, string>;

function StatusIndicator({ status }: { status: SiteActionStatus }) {
  return (
    <i
      className={classNames(
        "h-14 w-14 rounded-full flex items-center justify-center",
        statusIconClasses[status],
        status === "done" && "fr-icon-check-line",
        status === "skipped" && "fr-icon-close-line",
      )}
    />
  );
}

function CollapsableItem({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <div>
      <div
        className={classNames(
          "cursor-pointer",
          "transition ease-in-out duration-500",
          "flex items-center justify-between gap-2",
        )}
        onClick={toggle}
      >
        <h2 className="text-lg mb-0">{title}</h2>
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
      </div>
      {isOpen && <div className="py-4 pl-18">{children}</div>}
    </div>
  );
}

type Props = {
  title: string;
  description?: React.ReactNode;
  status: SiteActionStatus;
  children?: React.ReactNode;
  collapsable: boolean;
};

export function ActionItem({ title, status, collapsable, children }: Props) {
  const titleElement = (
    <div className="flex items-center gap-4">
      <StatusIndicator status={status} />
      <h4 className="mb-0 font-normal text-lg">{title}</h4>
    </div>
  );

  return (
    <li className="m-0 py-4 border-b border-border-grey">
      {collapsable ? (
        <CollapsableItem title={titleElement}>{children}</CollapsableItem>
      ) : (
        <div className="flex items-center justify-between">
          {titleElement}
          {!collapsable && children}
        </div>
      )}
    </li>
  );
}
