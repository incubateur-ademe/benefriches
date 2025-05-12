import Button from "@codegouvfr/react-dsfr/Button";
import { useContext } from "react";

import { EnvironmentalImpactDetailsName } from "@/features/projects/domain/projectImpactsEnvironmental";
import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";

import { ModalDataProps } from "../../ImpactModalDescription";
import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";
import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalData from "../../shared/ModalData";
import ModalGrid from "../../shared/ModalGrid";
import ModalHeader from "../../shared/ModalHeader";
import ModalTable from "../../shared/ModalTable";
import ModalAreaChart from "../../shared/modal-charts/ModalAreaChart";
import { mainBreadcrumbSection, soilsBreadcrumbSection } from "../breadcrumbSections";

type Props = {
  impactData: ModalDataProps["impactsData"]["environmental"]["permeableSurfaceArea"];
};

const PermeableSurfaceDescription = ({ impactData }: Props) => {
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const data = [
    {
      ...impactData.greenSoil,
      label: "Surface perméable végétalisée",
      color: "#7ACA17",
      name: "green_soil" as EnvironmentalImpactDetailsName,
    },
    {
      ...impactData.mineralSoil,
      label: "Surface perméable minérale",
      color: "#70706A",
      name: "mineral_soil" as EnvironmentalImpactDetailsName,
    },
  ].filter(({ difference }) => difference !== 0);

  return (
    <ModalBody size="large">
      <ModalHeader
        title="🌧 Surface perméable"
        breadcrumbSegments={[
          mainBreadcrumbSection,
          soilsBreadcrumbSection,
          { label: "Surface perméable" },
        ]}
      />

      <ModalGrid>
        <ModalData>
          <ModalAreaChart
            type="surfaceArea"
            base={impactData.base}
            forecast={impactData.forecast}
            difference={impactData.difference}
            title="🌧 Surface perméable"
            details={data}
          />

          <ModalTable
            formatFn={formatSurfaceArea}
            caption="Détails des tonnes d'émissions de CO2 émises ou évitées"
            data={data.map(({ label, forecast, base, color, name }) => ({
              label,
              value: forecast - base,
              color,
              onClick: () => {
                updateModalContent({
                  sectionName: "environmental",
                  impactName: "permeable_surface_area",
                  impactDetailsName: name,
                });
              },
            }))}
          />
        </ModalData>

        <ModalContent>
          <p>
            Il s'agit de la surface qui n'est pas imperméabilisée et permet ainsi l'infiltration de
            l'eau de pluie sur la parcelle. La surface perméable peut être{" "}
            <Button
              onClick={() => {
                updateModalContent({
                  sectionName: "environmental",
                  impactName: "permeable_surface_area",
                  impactDetailsName: "mineral_soil",
                });
              }}
              priority="tertiary no outline"
            >
              🪨 minérale
            </Button>{" "}
            ou{" "}
            <Button
              onClick={() => {
                updateModalContent({
                  sectionName: "environmental",
                  impactName: "permeable_surface_area",
                  impactDetailsName: "green_soil",
                });
              }}
              priority="tertiary no outline"
            >
              ☘️ végétalisée
            </Button>
            .
          </p>
          <p>
            La valeur est la somme des surfaces détaillées ci-dessus, qui ont été renseignées par
            l'utilisateur, pour le site et pour le projet.
          </p>
        </ModalContent>
      </ModalGrid>
    </ModalBody>
  );
};

export default PermeableSurfaceDescription;
