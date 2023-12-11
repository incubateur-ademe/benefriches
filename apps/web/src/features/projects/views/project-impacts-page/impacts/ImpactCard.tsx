import { fr } from "@codegouvfr/react-dsfr";
import ImpactContainer from "./ImpactContainer";

type Props = {
  title: string;
  impact: string;
  isPositive?: boolean;
  text?: string;
};

const ImpactCard = ({ title, impact, isPositive, text }: Props) => {
  return (
    <ImpactContainer>
      <p>
        <strong>{title}</strong>
      </p>
      <h5
        className={fr.cx("fr-mb-1v")}
        style={{
          color: `var(${
            isPositive ? "--text-default-success" : "--text-default-error"
          })`,
        }}
      >
        {impact}
      </h5>
      {text && <legend>{text}</legend>}
    </ImpactContainer>
  );
};

export default ImpactCard;
