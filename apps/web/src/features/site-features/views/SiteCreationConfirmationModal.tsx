import { Component } from "./creationConfirmationModal";

export default function SiteCreationConfirmationModal() {
  return (
    <Component
      title="✅ Votre friche a été sauvegardée !"
      concealingBackdrop={false}
      size="medium"
      buttons={[
        {
          children: "Voir la page de ma friche",
          doClosesModal: true,
        },
      ]}
    >
      {" "}
    </Component>
  );
}
