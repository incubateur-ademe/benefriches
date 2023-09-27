import Button from "@codegouvfr/react-dsfr/Button";

type Props = {
  onNextClick: () => void;
};

function CarbonSummary({ onNextClick }: Props) {
  return (
    <>
      <h2>Stockage du carbone par les sols</h2>
      <p>
        Ce site stocke environ
        <strong>xxx t</strong> de carbon par an.
      </p>
      <p>
        C'est l'équivalent de ce qu'émettent <strong>N français</strong> en un 1
        an ℹ️
      </p>
      <div>TODO: data viz</div>
      <Button onClick={onNextClick}>Suivant</Button>
    </>
  );
}

export default CarbonSummary;
