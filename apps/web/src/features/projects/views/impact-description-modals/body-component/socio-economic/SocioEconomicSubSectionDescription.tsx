import Button from "@codegouvfr/react-dsfr/Button";
import { ReactNode, useContext } from "react";
import { Link } from "type-route";

import { SocioEconomicImpactMainImpactKeyName } from "@/features/projects/core/projectImpactsSocioEconomic";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";
import ModalColumnSeriesChart from "../../modal-charts/ModalColumnSeriesChart";
import ModalBody from "../../modal-layout/ModalBody";
import ModalContent from "../../modal-layout/ModalContent";
import ModalData from "../../modal-layout/ModalData";
import ModalGrid from "../../modal-layout/ModalGrid";
import ModalHeader from "../../modal-layout/ModalHeader";
import ModalGroupTable from "../../modal-table/ModalGroupTable";

type Props = {
  impactsData: {
    total: number;
    details: {
      label: string;
      total: number;
      values: {
        name: SocioEconomicImpactMainImpactKeyName;
        color?: string;
        label: string;
        value: number;
        linkProps?: Link;
      }[];
    }[];
  };
  title: string;
  children: ReactNode;
};

const SocioEconomicSubSectionDescription = ({ impactsData, title, children }: Props) => {
  const { getDetailsLink } = useContext(ImpactModalDescriptionContext);

  return (
    <ModalBody size="large">
      <ModalHeader
        title={title}
        value={{
          state: impactsData.total > 0 ? "success" : "error",
          text: formatMonetaryImpact(impactsData.total),
        }}
        breadcrumbSegments={[
          {
            label: "Impacts socio-économiques",
            contentState: { sectionName: "socioEconomic" },
          },
          { label: title },
        ]}
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
                {...getDetailsLink({
                  sectionName: "socioEconomic.localAuthority",
                })}
              >
                🏛️ les impacts économiques pour la collectivité locale
              </Button>
            </li>
            <li>
              <Button
                className="px-1 text-left"
                priority="tertiary no outline"
                {...getDetailsLink({
                  sectionName: "socioEconomic.localPeopleOrCompany",
                })}
              >
                🏘️ les impacts économiques pour les riverains
              </Button>
            </li>
            <li>
              <Button
                className="px-1 text-left"
                priority="tertiary no outline"
                {...getDetailsLink({
                  sectionName: "socioEconomic.humanity",
                })}
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
