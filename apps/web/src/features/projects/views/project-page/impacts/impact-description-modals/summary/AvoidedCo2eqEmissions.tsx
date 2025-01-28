import { useContext } from "react";

import { formatPerFrenchPersonAnnualEquivalent } from "@/features/create-project/views/common-views/soils-carbon-storage-comparison/formatCarbonStorage";
import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";
import { getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson } from "@/shared/core/carbonEmissions";

import ImpactItemDetails from "../../list-view/ImpactItemDetails";
import ImpactItemGroup from "../../list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../ImpactModalDescriptionContext";
import ModalBody from "../shared/ModalBody";
import ModalContent from "../shared/ModalContent";
import ModalHeader from "../shared/ModalHeader";

type Props = {
  impactData: {
    value: number;
    isSuccess: boolean;
  };
};

const SummaryAvoidedCo2eqEmissionsDescription = ({ impactData }: Props) => {
  const { value, isSuccess } = impactData;
  const co2eqValue = Math.abs(value);
  const co2eqValueText = formatCO2Impact(co2eqValue, { withSignPrefix: false });

  const frenchPersonAnnualEquivalent =
    getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson(co2eqValue);
  const frenchPersonAnnualEquivalentText = formatPerFrenchPersonAnnualEquivalent(
    frenchPersonAnnualEquivalent,
  );

  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);
  const title = isSuccess ? "- d’émissions de CO2\u00a0☁️" : "+ d’émissions de CO2\u00a0☁️";

  return (
    <ModalBody>
      <ModalHeader
        title={title}
        value={{
          text: co2eqValueText,
          state: isSuccess ? "success" : "error",
          description: isSuccess
            ? `de CO2-éq évitées, soit les émissions de ${frenchPersonAnnualEquivalentText} français pendant 1 an`
            : `de CO2-éq émises, soit les émissions de ${frenchPersonAnnualEquivalentText} français pendant 1 an`,
        }}
        breadcrumbSegments={[{ label: "Synthèse" }, { label: title }]}
      />
      <ModalContent>
        <p>
          La réalisation du projet a des conséquences sur les émissions de CO2 pour plusieurs
          raisons, le cas échéant du fait :
        </p>
        <ul>
          <li>
            du changement d’affectation des sols (ces derniers ayant une pouvoir de stockage de
            carbone variable selon leur type), par exemple via la désimperméabilisation puis
            renaturation,
          </li>
          <li>
            de la réduction des déplacements, par exemple par la création de fonctions urbaines en
            coeur de ville et non en périphérie,
          </li>
          <li>de la création de capacités de production d’énergies renouvelables.</li>
        </ul>
        {isSuccess ? (
          <ImpactItemGroup isClickable>
            <ImpactItemDetails
              impactRowValueProps={{ buttonInfoAlwaysDisplayed: true }}
              value={co2eqValue}
              label="☁️ CO2-eq stocké ou évité"
              type="co2"
              onClick={() => {
                openImpactModalDescription({
                  sectionName: "environmental",
                  impactName: "co2_benefit",
                });
              }}
            />
          </ImpactItemGroup>
        ) : (
          <p>
            <i>En cours de rédaction...</i>
          </p>
        )}
      </ModalContent>
    </ModalBody>
  );
};

export default SummaryAvoidedCo2eqEmissionsDescription;
