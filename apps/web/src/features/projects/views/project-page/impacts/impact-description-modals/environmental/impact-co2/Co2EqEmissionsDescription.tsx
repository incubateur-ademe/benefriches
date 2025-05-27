import { useContext } from "react";

import {
  CO2BenefitDetails,
  getEnvironmentalProjectImpacts,
} from "@/features/projects/domain/projectImpactsEnvironmental";
import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";

import { getAvoidedCo2eqEmissionsDetailsColor } from "../../../getImpactColor";
import { getEnvironmentalDetailsImpactLabel } from "../../../getImpactLabel";
import { ModalDataProps } from "../../ImpactModalDescription";
import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";
import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalData from "../../shared/ModalData";
import ModalGrid from "../../shared/ModalGrid";
import ModalHeader from "../../shared/ModalHeader";
import ModalTable from "../../shared/ModalTable";
import ModalAreaChart from "../../shared/modal-charts/ModalAreaChart";
import { co2BreadcrumbSection, mainBreadcrumbSection } from "../breadcrumbSections";

type Props = {
  impactsData: ModalDataProps["impactsData"];
};

const Co2BenefitDescription = ({ impactsData }: Props) => {
  const environmentalImpacts = getEnvironmentalProjectImpacts(impactsData);

  const co2Benefit = environmentalImpacts.find(({ name }) => "co2_benefit" === name);

  const { updateModalContent } = useContext(ImpactModalDescriptionContext);

  const total = co2Benefit?.impact.difference ?? 0;
  const details = co2Benefit?.impact.details ?? [];

  const impactList = details.map(({ impact, name }) => ({
    label: getEnvironmentalDetailsImpactLabel("co2_benefit", name),
    color: getAvoidedCo2eqEmissionsDetailsColor(name as CO2BenefitDetails),
    value: impact.difference,
    ...impact,
    name,
  }));

  return (
    <ModalBody size="large">
      <ModalHeader
        title="☁️ CO2-eq stocké ou évité"
        value={{
          text: formatCO2Impact(total),
          state: total > 0 ? "success" : "error",
        }}
        breadcrumbSegments={[
          mainBreadcrumbSection,
          co2BreadcrumbSection,
          { label: "CO2-eq stocké ou évité" },
        ]}
      />
      <ModalGrid>
        <ModalData>
          <ModalAreaChart
            type="co2"
            base={co2Benefit?.impact.base ?? 0}
            forecast={co2Benefit?.impact.forecast ?? 0}
            difference={co2Benefit?.impact.difference ?? 0}
            title="CO2-eq stocké ou évité"
            details={impactList}
          />

          <ModalTable
            formatFn={formatCO2Impact}
            caption="Détails des tonnes d'émissions de CO2 émises ou évitées"
            data={impactList.map(({ label, value, color, name }) => ({
              label,
              value,
              color,
              onClick: () => {
                updateModalContent({
                  sectionName: "environmental",
                  impactName: "co2_benefit",
                  impactDetailsName: name,
                });
              },
            }))}
          />
        </ModalData>

        <ModalContent>
          La réalisation du projet a des conséquences sur les émissions de CO2 pour plusieurs
          raisons, le cas échéant du fait :
          <ul>
            <li>
              du changement d’affectation des sols (ces derniers ayant une pouvoir de stockage de
              carbone variable selon leur type), par exemple via la désimperméabilisation puis
              renaturation,
            </li>
            <li>
              de la réduction des déplacements, par exemple par la création de fonctions urbaines en
              cœur de ville et non en périphérie,
            </li>
            <li>de la création de capacités de production d’énergies renouvelables,</li>
            <li>
              de la création d’îlot de fraîcheur urbaine, réduisant ainsi les besoin en
              rafraîchissement et/ou climatisation,
            </li>
            <li>
              de la réhabilitation de bâtiment, évitant ainsi la production de produits de
              construction.
            </li>
          </ul>
          <p>
            Des émissions sont toutefois associées à la création du projet (aménagement,
            construction neuve) pouvant de fait réduire l’ampleur des émissions évitées..
          </p>
        </ModalContent>
      </ModalGrid>
    </ModalBody>
  );
};

export default Co2BenefitDescription;
