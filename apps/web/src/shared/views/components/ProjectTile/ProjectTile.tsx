import { Link } from "type-route";

import classNames, { ClassValue } from "../../clsx";

type TileCardProps = {
  children: React.ReactNode;
  className?: ClassValue;
  linkProps?: Link;
  variant?: "solid" | "dashed";
  title?: string;
};

function ProjectTile({ children, className, variant = "solid", linkProps, title }: TileCardProps) {
  const baseClasses = classNames(
    "border rounded-lg flex flex-col items-center text-center",
    "hover:bg-grey-light hover:dark:bg-grey-dark bg-none",
    "h-56 w-56 gap-2",
    "text-lg p-3",
    variant === "dashed" && "border-dashed border-blue-france dark:border-blue-light",
    variant === "solid" && "border-solid",
    className,
  );

  if (linkProps) {
    return (
      <a {...linkProps} className={baseClasses} title={title}>
        {children}
      </a>
    );
  }

  return (
    <div className={baseClasses} title={title}>
      {children}
    </div>
  );
}

export default ProjectTile;
