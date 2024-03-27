import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";

type Props = {
  title: string;
  instructions?: ReactNode;
  children: ReactNode;
};

function WizardFormLayout({ title, children, instructions = null }: Props) {
  return (
    <div style={{ display: "flex" }}>
      <section style={{ flex: "3", maxWidth: "66%" }}>
        <h2>{title}</h2>
        {children}
      </section>
      {instructions && (
        <section
          className={fr.cx("fr-p-3w", "fr-ml-2w")}
          style={{ flex: "2", maxWidth: "33%", background: "var(--background-alt-grey)" }}
        >
          <div>{instructions}</div>
        </section>
      )}
    </div>
  );
}

export default WizardFormLayout;
