import Button from "@codegouvfr/react-dsfr/Button";

type Props = {
  surface: number;
  onNextClick: () => void;
};

function SoilSummary({ surface, onNextClick }: Props) {
  return (
    <>
      <h2>Récapitulatif des sols du site</h2>
      <p>
        <strong>Superficie totale de la friche</strong> : {surface} m2, soit{" "}
        {surface / 10000}ha.
      </p>
      <div>TODO: data viz</div>
      <Button onClick={onNextClick}>Suivant</Button>
    </>
  );
}

export default SoilSummary;
