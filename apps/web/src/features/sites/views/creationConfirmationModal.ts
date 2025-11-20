import { createModal } from "@codegouvfr/react-dsfr/Modal";

export const { open, Component } = createModal({
  id: "site-creation-confirmation-modal",
  isOpenedByDefault: true,
});
