import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

type Props = {
  onBack: () => void;
  onNext?: () => void;
  disabled?: boolean;
};

const BackNextButtonsGroup = ({ onBack, onNext, disabled = false }: Props) => {
  const backButtonProps = {
    children: "Précédent",
    priority: "secondary",
    nativeButtonProps: { type: "button", onClick: onBack },
  } as const;
  const nextButtonProps = {
    children: "Suivant",
    nativeButtonProps: { type: "submit", onClick: onNext, disabled },
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
