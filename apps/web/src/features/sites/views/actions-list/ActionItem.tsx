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

export function ActionItem({
  name,
  status,
  children,
}: {
  name: string;
  status: SiteActionStatus;
  children?: React.ReactNode;
}) {
  return (
    <li className="flex items-center justify-between m-0 py-4 border-b border-border-grey">
      <div className="flex items-center gap-4">
        <StatusIndicator status={status} />
        <h4 className="mb-0 font-normal text-lg">{name}</h4>
      </div>
      {children}
    </li>
  );
}
