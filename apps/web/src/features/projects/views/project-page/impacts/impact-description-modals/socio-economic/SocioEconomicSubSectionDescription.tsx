import Button from "@codegouvfr/react-dsfr/Button";
import { ReactNode, useContext } from "react";

import { SocioEconomicMainImpactName } from "@/features/projects/core/projectImpactsSocioEconomic";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import {
  ImpactModalDescriptionContext,
  SocioEconomicSubSectionName,
} from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalData from "@/features/projects/views/shared/impacts/modals/ModalData";
import ModalGrid from "@/features/projects/views/shared/impacts/modals/ModalGrid";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";

import ModalGroupTable from "../shared/ModalGroupTable";
import ModalColumnSeriesChart from "../shared/modal-charts/ModalColumnSeriesChart";
import { mainBreadcrumbSection } from "./breadcrumbSections";

type Props = {
  impactsData: {
    total: number;
    details: {
      label: string;
      total: number;
      values: {
        name: SocioEconomicMainImpactName;
        color?: string;
        label: string;
        value: number;
        onClick?: () => void;
      }[];
    }[];
  };
  subSectionName: SocioEconomicSubSectionName;
  title: string;
  children: ReactNode;
  valueDescription?: string;
};

const SocioEconomicSubSectionDescription = ({ impactsData, title, children }: Props) => {
  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  return (
    <ModalBody size="large">
      <ModalHeader
        title={title}
        value={{
          state: impactsData.total > 0 ? "success" : "error",
          text: formatMonetaryImpact(impactsData.total),
        }}
        breadcrumbSegments={[mainBreadcrumbSection, { label: title }]}
      />
      <ModalGrid>
        <ModalData>
          <ModalColumnSeriesChart
            format="monetary"
            data={impactsData.details}
            exportTitle={title}
          />

          <ModalGroupTable
            caption="Liste des impacts socio-économiques"
            data={impactsData.details}
          />
        </ModalData>

        <ModalContent>
          Les impacts socio-économiques sont classés en 3 catégories :
          <ul className="list-none pl-0">
            <li>
              <Button
                className="px-1 text-left"
                priority="tertiary no outline"
                onClick={() => {
                  updateModalContent({
                    sectionName: "socio_economic",
                    subSectionName: "localAuthority",
                  });
                }}
              >
                🏛️ les impacts économiques pour la collectivité locale
              </Button>
            </li>
            <li>
              <Button
                className="px-1 text-left"
                priority="tertiary no outline"
                onClick={() => {
                  updateModalContent({
                    sectionName: "socio_economic",
                    subSectionName: "localPeopleOrCompany",
                  });
                }}
              >
                🏘️ les impacts économiques pour les riverains
              </Button>
            </li>
            <li>
              <Button
                className="px-1 text-left"
                priority="tertiary no outline"
                onClick={() => {
                  updateModalContent({
                    sectionName: "socio_economic",
                    subSectionName: "humanity",
                  });
                }}
              >
                🌍️ les impacts économiques pour la société française et mondiale
              </Button>
            </li>
          </ul>
          {children}
        </ModalContent>
      </ModalGrid>
    </ModalBody>
  );
};

export default SocioEconomicSubSectionDescription;
