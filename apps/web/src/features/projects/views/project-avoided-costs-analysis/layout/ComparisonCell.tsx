import classNames, { ClassValue } from "@/shared/views/clsx";

type ComparisonCellProps = {
  children?: React.ReactNode;
  className?: string;
  value?: number;
  bold?: boolean;
  firstCol?: boolean;
  firstRow?: boolean;
  colSpan?: 1 | 2 | 3;
  header?: boolean;
  size?: "sm" | "md" | "lg";
};

const getBgColorClassName = (value: number): ClassValue => {
  if (value === 0) {
    return "";
  } else if (value > 0) {
    return "bg-[#03814114]";
  } else {
    return "bg-[#E63E111A]";
  }
};
export default function ComparisonCell({
  children,
  className,
  value,
  bold,
  colSpan,
  header,
  size = "md",
  firstCol,
  firstRow,
}: ComparisonCellProps) {
  return (
    <div
      className={classNames(
        "p-6 border-r border-b border-border-grey",
        firstCol && "border-l",
        firstRow && "border-t",
        header && "bg-grey-light dark:bg-gray-600",
        bold && "font-bold",
        size === "lg" && "text-xl",
        size === "sm" && "text-base",
        colSpan === 3 && "col-span-3",
        value !== undefined && getBgColorClassName(value),
        className,
      )}
    >
      {children}
    </div>
  );
}
