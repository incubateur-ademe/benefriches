import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";

import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/services/format-number/formatNumber";

type InputMode = "squareMeters" | "percentage";

type Props = {
  value: InputMode;
  onChange: (value: InputMode) => void;
};

function InputModeSelect({ value, onChange }: Props) {
  return (
    <SegmentedControl
      legend="Sélection mode de saisie"
      segments={[
        {
          label: "%",
          nativeInputProps: {
            checked: value === "percentage",
            onChange: () => {
              onChange("percentage");
            },
          },
        },
        {
          label: SQUARE_METERS_HTML_SYMBOL,
          nativeInputProps: {
            checked: value === "squareMeters",
            onChange: () => {
              onChange("squareMeters");
            },
          },
        },
      ]}
      small
      hideLegend
    />
  );
}

export default InputModeSelect;
