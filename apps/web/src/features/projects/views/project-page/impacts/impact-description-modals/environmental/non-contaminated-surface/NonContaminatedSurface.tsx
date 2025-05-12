import { ModalDataProps } from "../../ImpactModalDescription";
import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalData from "../../shared/ModalData";
import ModalGrid from "../../shared/ModalGrid";
import ModalHeader from "../../shared/ModalHeader";
import ModalAreaChart from "../../shared/modal-charts/ModalAreaChart";
import { mainBreadcrumbSection, soilsBreadcrumbSection } from "../breadcrumbSections";

type Props = {
  impactData: Exclude<
    ModalDataProps["impactsData"]["environmental"]["nonContaminatedSurfaceArea"],
    undefined
  >;
};

const NonContaminatedSurfaceDescription = ({ impactData }: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title="✨ Surface non polluée"
        breadcrumbSegments={[
          mainBreadcrumbSection,
          soilsBreadcrumbSection,
          { label: "Surface non polluée" },
        ]}
      />
      <ModalGrid>
        <ModalData>
          <ModalAreaChart
            type="surfaceArea"
            color="#FCDF3B"
            base={impactData.base}
            forecast={impactData.forecast}
            difference={impactData.difference}
            title="Surface non polluée"
          />
        </ModalData>

        <ModalContent>
          <p>
            Les friches sont bien souvent concernées par des pollutions des sols, vestiges des
            activités passées. Réaliser un projet sur un tel site implique donc souvent la mise en
            place de mesure de gestion des pollutions (ex : traitement de dépollution) pour réduire
            l’ampleur de la pollution (surface occupée, teneurs présentes, etc.) et les risques
            sanitaires associés, pour les futurs usagers (habitants, salariés, etc.).
          </p>
          <p>
            La surface non polluée est une donnée saisie par l'utilisateur pour le site et pour le
            projet.
          </p>
        </ModalContent>
      </ModalGrid>
    </ModalBody>
  );
};

export default NonContaminatedSurfaceDescription;
