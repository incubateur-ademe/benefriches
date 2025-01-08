import ModalHeader from "../../shared/ModalHeader";

const RealEstateAcquisitionDescription = () => {
  return (
    <>
      <ModalHeader
        title="🏠 Acquisition du site"
        breadcrumbSegments={[
          {
            label: "Bilan de l'opération",
            id: "economic-balance",
          },
          { label: "Acquisition du site" },
        ]}
      />
      <p>
        Il s'agit des dépenses d'acquisition foncière (y compris bâtiments) nécessaires à la
        réalisation du projet, auxquelles s'ajoutent les éventuels frais d'enregistrement (« frais
        de notaire ») et autres frais (frais d'évictions, etc.).
      </p>
      <p>La valeur est saisie par l'utilisateur.</p>
      <p>
        <strong>Déficitaire</strong> : futur propriétaire
      </p>
    </>
  );
};

export default RealEstateAcquisitionDescription;
