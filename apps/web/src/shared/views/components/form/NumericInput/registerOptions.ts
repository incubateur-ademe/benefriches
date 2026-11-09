import { stringToNumber } from "@/shared/core/number-conversion/numberConversion";

// Never yields NaN: text that is not a number is read as undefined (empty).
export const numericFieldSetValueAs = (v?: string | number) => (v ? stringToNumber(v) : undefined);

export const requiredNumericFieldRegisterOptions = {
  setValueAs: numericFieldSetValueAs,
  required: "Ce champ est nécessaire pour déterminer les questions suivantes",
  min: {
    value: 1,
    message: "Veuillez entrer un nombre valide",
  },
};

export const optionalNumericFieldRegisterOptions = {
  setValueAs: numericFieldSetValueAs,
  min: {
    value: 0,
    message: "Veuillez entrer un nombre valide",
  },
};
