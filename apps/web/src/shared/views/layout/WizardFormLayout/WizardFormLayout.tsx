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
          className={fr.cx("fr-ml-6w", "fr-py-1w")}
          style={{ flex: "2" }}
        >
          {instructions}
        </section>
      )}
    </div>
  );
}

export default WizardFormLayout;
