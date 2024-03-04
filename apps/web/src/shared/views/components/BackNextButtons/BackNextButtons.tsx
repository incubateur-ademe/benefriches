import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

type Props = {
  onBack: () => void;
  onNext?: () => void;
};

const BackNextButtonsGroup = ({ onBack, onNext }: Props) => {
  const backButtonProps = {
    children: "Précédent",
    priority: "secondary",
    nativeButtonProps: { type: "button", onClick: onBack },
  } as const;
  const nextButtonProps = {
    children: "Suivant",
    nativeButtonProps: { type: "submit", onClick: onNext },
  } as const;
  return (
    <ButtonsGroup
      buttonsEquisized
      inlineLayoutWhen="always"
      alignment="between"
      buttons={[backButtonProps, nextButtonProps]}
    />
  );
};

export default BackNextButtonsGroup;
