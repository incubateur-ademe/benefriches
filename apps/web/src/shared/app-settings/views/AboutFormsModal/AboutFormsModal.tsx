import { useEffect, useState } from "react";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { createModal } from "@codegouvfr/react-dsfr/Modal";

const modal = createModal({
  id: "about-benefriches-forms-modal",
  isOpenedByDefault: false,
});

type StopDisplayingModalCheckboxProps = {
  checked: boolean;
  onChange: () => void;
};

function StopDisplayingModalCheckbox({ checked, onChange }: StopDisplayingModalCheckboxProps) {
  return (
    <Checkbox
      options={[
        {
          label: "Ne plus afficher ce message",
          nativeInputProps: {
            name: "stop-displaying-message",
            checked,
            onChange,
          },
        },
      ]}
    />
  );
}

type Props = {
  shouldOpenModal: boolean;
  setShouldNotDisplayAgain: (value: boolean) => void;
};

function AboutFormsModal({ shouldOpenModal, setShouldNotDisplayAgain }: Props) {
  const [shouldStopDisplayingModal, setShouldStopDisplayingModal] = useState(false);

  useEffect(() => {
    if (shouldOpenModal) {
      setTimeout(() => {
        modal.open();
      }, 150);
    }
  }, [shouldOpenModal]);

  return (
    <modal.Component
      title="À propos du formulaire Bénéfriches"
      buttons={[
        {
          children: "Saisir les informations",
          type: "button",
        },
      ]}
    >
      <ul>
        <li>
          <strong>La plupart des questions ne sont pas obligatoires</strong>
        </li>
        <p>Vous pouvez ne pas y répondre. Les questions obligatoires sont signalées par un *.</p>
        <li>
          <strong>Sur certaines questions, Bénéfriches vous propose des réponses par défaut</strong>
        </li>
        <p>
          Ces valeurs sont calculées à partir des réponses que vous avez apportées, en combinaison
          avec des ratios issus du retour d'expériences de l'ADEME ou d’autres ressources
          documentaires. Vous pouvez les modifier.
        </p>
      </ul>
      <StopDisplayingModalCheckbox
        checked={shouldStopDisplayingModal}
        onChange={() => {
          setShouldStopDisplayingModal(!shouldStopDisplayingModal);
          setShouldNotDisplayAgain(!shouldStopDisplayingModal);
        }}
      />
    </modal.Component>
  );
}

export default AboutFormsModal;
