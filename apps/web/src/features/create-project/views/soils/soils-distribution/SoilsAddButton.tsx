import { useState } from "react";
import Button from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import Select from "@codegouvfr/react-dsfr/Select";
import { SoilType } from "shared";

import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";

type Props = {
  onValidate: (data: { soilType: SoilType; surface: number }) => void;
  soilTypes: SoilType[];
};

const modal = createModal({
  id: "add-soil-modal",
  isOpenedByDefault: false,
});

function SoilsAddButton({ onValidate, soilTypes }: Props) {
  const [value, setValue] = useState<SoilType>();

  const onClick = () => {
    if (!value) {
      return;
    }
    onValidate({ soilType: value, surface: 0 });
  };

  return (
    <>
      <Button
        onClick={() => {
          modal.open();
        }}
        priority="secondary"
        nativeButtonProps={{ type: "button" }}
      >
        Ajouter un sol
      </Button>
      <modal.Component
        title="Ajouter un sol"
        buttons={[
          {
            onClick,
            children: "Ajouter",
            disabled: !value,
            type: "button",
          },
        ]}
      >
        <Select
          label="Type de sol"
          nativeSelectProps={{
            onChange: (event) => {
              setValue(event.target.value as SoilType);
            },
            value,
          }}
        >
          <option value="">Sélectionner un type de sol</option>
          {soilTypes.map((soilType) => (
            <option key={soilType} value={soilType}>
              {getLabelForSoilType(soilType)}
            </option>
          ))}
        </Select>
      </modal.Component>
    </>
  );
}

export default SoilsAddButton;
