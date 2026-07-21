import Button from "@codegouvfr/react-dsfr/Button";
import { useContext } from "react";

import {
  EnvironmentalImpact,
  EnvironmentalImpactDetailsName,
} from "@/features/projects/domain/projectImpactsEnvironmental";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";

import ModalTable from "../../shared/ModalTable";
import ModalAreaChart from "../../shared/modal-charts/ModalAreaChart";
import { mainBreadcrumbSection, soilsBreadcrumbSection } from "../breadcrumbSections";

type Props = {
  impactData?: EnvironmentalImpact;
};

const getPermeableSurfaceDetailsColor = (impactName: "mineral_soil" | "green_soil") => {
  switch (impactName) {
    case "green_soil":
      return "#7ACA17";
    case "mineral_soil":
      return "#70706A";
  }
};

const PermeableSurfaceDescription = ({ impactData }: Props) => {
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const data = (impactData?.impact.details ?? []).reduce<
    {
      name: EnvironmentalImpactDetailsName;
      label: string;
      base: number;
      forecast: number;
      difference: number;
      color?: string | undefined;
    }[]
  >((result, item) => {
    switch (item.name) {
      case "mineral_soil":
        return result.concat({
          ...item.impact,
          label: "Surface perméable végétalisée",
          color: getPermeableSurfaceDetailsColor("green_soil"),
          name: "green_soil",
        });
      case "green_soil":
        return result.concat({
          ...item.impact,
          label: "Surface perméable végétalisée",
          color: getPermeableSurfaceDetailsColor("green_soil"),
          name: "green_soil",
        });
      default:
        return result;
    }
  }, []);

  return (
    <ModalBody size="large">
      <ModalHeader
        title="🌧️ Surface perméable"
        breadcrumbSegments={[
          mainBreadcrumbSection,
          soilsBreadcrumbSection,
          { label: "Surface perméable" },
        ]}
      />

      <ModalGrid>
        <ModalData>
          <ModalAreaChart
            type="surface_area"
            base={impactData?.impact?.base ?? 0}
            forecast={impactData?.impact?.forecast ?? 0}
            difference={impactData?.impact?.difference ?? 0}
            title="🌧️ Surface perméable"
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
