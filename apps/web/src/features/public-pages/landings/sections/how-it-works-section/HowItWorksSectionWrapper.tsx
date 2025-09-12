import classNames from "@/shared/views/clsx";

type Props = {
  mode?: "white" | "grey";
  children: React.ReactNode;
};

export default function HowItWorksSectionWrapper({ children, mode = "grey" }: Props) {
  return (
    <section
      className={classNames(
        "py-20",
        mode === "white" ? "bg-white dark:bg-blue-ultradark" : "bg-grey-light dark:bg-grey-dark",
      )}
    >
      <div className="fr-container">{children}</div>
    </section>
  );
}
