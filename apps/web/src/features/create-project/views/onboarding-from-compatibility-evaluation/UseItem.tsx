import classNames from "@/shared/views/clsx";

export default function UseItem({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: "check" | "red-cross";
}) {
  const iconClass =
    icon === "check"
      ? "text-success-dark fr-icon-check-line"
      : "text-error-ultradark fr-icon-close-line";
  return (
    <li className="flex items-center gap-6">
      <i
        className={classNames(
          "bg-grey-light rounded-full shrink-0 p-1 flex items-center justify-center text-xl",
          iconClass,
        )}
        style={{ width: "48px", height: "48px" }}
        aria-hidden="true"
      />
      <span className="text-lg">{children}</span>
    </li>
  );
}
