import { stringToNumber } from "@/shared/services/number-conversion/numberConversion";

export const requiredNumericFieldRegisterOptions = {
  setValueAs: (v?: string) => (v ? stringToNumber(v) : undefined),
  required: "Ce champ est nécessaire pour déterminer les questions suivantes",
  min: {
    value: 1,
    message: "Veuillez entrer un montant valide",
  },
};

export const optionalNumericFieldRegisterOptions = {
  setValueAs: (v?: string) => (v ? stringToNumber(v) : undefined),
  min: {
    value: 0,
    message: "Veuillez entrer un montant valide",
  },
};
