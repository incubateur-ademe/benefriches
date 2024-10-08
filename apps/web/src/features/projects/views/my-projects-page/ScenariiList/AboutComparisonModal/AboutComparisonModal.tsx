import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useEffect, useState } from "react";

const modal = createModal({
  id: "about-projects-comparison-modal",
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
            name: "stop-displaying-projects-comparison-modal-message",
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

function AboutComparisonModal({ shouldOpenModal, setShouldNotDisplayAgain }: Props) {
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
      size="large"
      title="Que peut-on comparer sur Bénéfriches ?"
      iconId="fr-icon-arrow-right-line"
      buttons={[
        {
          children: "Sélectionner des scénarii à comparer",
          type: "button",
        },
      ]}
    >
      <p>
        Bénéfriches vous permet de comparer les impacts économiques, sociaux et environnementaux de
        plusieurs scénarii.
      </p>

      <p>Vous pouvez comparer : </p>

      <ul>
        <li>Des scenarii différents sur un même site</li>
        <li>Des scenarii similaires sur des sites différents</li>
      </ul>
      <p>Vous ne pouvez pas comparer des scenarii différents sur des sites différents.</p>
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

export default AboutComparisonModal;
