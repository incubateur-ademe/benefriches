import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

type Props = {
  onNext: () => void;
};

function SiteExpensesSummary({ onNext }: Props) {
  return (
    <>
      <h2>Récapitulatif des coûts annuels du site</h2>
      <h3>Par acteurs</h3>
      <p>A faire</p>
      <h3>Par type de dépenses</h3>
      <p>A faire</p>
      <ButtonsGroup
        buttonsEquisized
        inlineLayoutWhen="always"
        buttons={[
          {
            children: "Suivant",
            nativeButtonProps: { type: "submit" },
            onClick: onNext,
          },
        ]}
      />
    </>
  );
}

export default SiteExpensesSummary;
