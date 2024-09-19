import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

type Props = {
  onBack: () => void;
  onNext?: () => void;
  disabled?: boolean;
  nextLabel?: string;
};

const BackNextButtonsGroup = ({
  onBack,
  onNext,
  disabled = false,
  nextLabel = "Suivant",
}: Props) => {
  const backButtonProps = {
    children: "Précédent",
    priority: "secondary",
    nativeButtonProps: { type: "button", onClick: onBack },
  } as const;
  const nextButtonProps = {
    children: nextLabel,
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
