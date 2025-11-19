import { ReactNode } from "react";

import classNames, { ClassValue } from "@/shared/views/clsx";

type Props = {
  linkProps?: { href: string };
  className?: ClassValue;
  children: ReactNode;
  justify?: "center" | "start";
  border?: "dashed" | "solid";
};

function MyEvaluationsProjectLinkTile({
  children,
  linkProps,
  className,
  border = "solid",
  justify = "center",
}: Props) {
  return (
    <a
      className={classNames(
        "p-3",
        "border",
        "rounded-lg",
        "w-52",
        "h-52",
        "hover:bg-grey-light hover:dark:bg-grey-dark",
        "bg-none",
        "flex",
        "flex-col",
        "gap-2",
        "items-center",
        "text-center",
        border === "dashed" ? "border-dashed" : "border-solid",
        justify === "center" ? "justify-center" : "justify-start",
        className,
      )}
      {...linkProps}
    >
      {children}
    </a>
  );
}

export default MyEvaluationsProjectLinkTile;
