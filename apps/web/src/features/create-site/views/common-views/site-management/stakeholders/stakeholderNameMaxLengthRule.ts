import { SITE_STAKEHOLDER_NAME_MAX_LENGTH } from "shared";

export const stakeholderNameMaxLengthRule = {
  value: SITE_STAKEHOLDER_NAME_MAX_LENGTH,
  message: `Le nom ne doit pas dépasser ${SITE_STAKEHOLDER_NAME_MAX_LENGTH} caractères.`,
};
