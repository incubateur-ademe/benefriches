import ModalHeader from "../../shared/ModalHeader";

const AvoidedVehiculeKilometersDescription = () => {
  return (
    <>
      <ModalHeader
        title="🚙 Kilomètres évités"
        breadcrumbSegments={[
          {
            label: "Impacts sociaux",
            id: "social",
          },
          { label: "Kilomètres évités" },
        ]}
      />
      <p>
        Il s’agit du nombre de kilomètres totaux qui ne seront pas parcourus dans les transports par
        les personnes impactées par le projet.
      </p>
    </>
  );
};

export default AvoidedVehiculeKilometersDescription;
