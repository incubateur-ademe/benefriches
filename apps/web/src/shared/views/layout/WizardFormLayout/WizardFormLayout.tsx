import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";

type Props = {
  title: string;
  instructions?: ReactNode;
  children: ReactNode;
};

function WizardFormLayout({ title, children, instructions = null }: Props) {
  return (
    <>
      <h2>{title}</h2>
      <div style={{ display: "flex" }}>
        <section style={{ flex: "3", maxWidth: "66%" }}>{children}</section>
        {instructions && (
          <section
            className={fr.cx("fr-pl-2w", "fr-ml-2w", "fr-py-1w")}
            style={{ flex: "2", borderLeft: "2px solid #ddd" }}
          >
            <div>{instructions}</div>
          </section>
        )}
      </div>
    </>
  );
}

export default WizardFormLayout;
