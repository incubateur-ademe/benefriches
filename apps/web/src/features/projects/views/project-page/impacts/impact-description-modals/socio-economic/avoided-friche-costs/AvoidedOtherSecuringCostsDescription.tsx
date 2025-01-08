import ModalHeader from "../../shared/ModalHeader";

const AvoidedOtherSecuringCostsDescription = () => {
  return (
    <>
      <ModalHeader
        title="🛡 Autres dépenses de sécurisation"
        breadcrumbSegments={[
          {
            label: "Impacts socio-économiques",
            id: "socio-economic",
          },
          {
            label: "Impacts économiques directs",
          },
          {
            label: "Dépenses friche évitées",
            id: "socio-economic.avoided-friche-costs",
          },

          { label: "Autres dépenses de sécurisation" },
        ]}
      />
      <p>
        En plus des dépenses d’entretien, de débarras de dépôts sauvages ou de gardiennage, d’autres
        dépenses peuvent être nécessaires, par exemple pour la réparation de dommages non couverts
        par les assureurs (ex : incendie, réparation de clôture, portail ou dispositifs de
        fermeture).
      </p>
      <p>
        <strong>Bénéficiaire</strong> : actuel exploitant
      </p>

      <p>Les données du site ont été saisies par l’utilisateur·ice.</p>
    </>
  );
};

export default AvoidedOtherSecuringCostsDescription;
