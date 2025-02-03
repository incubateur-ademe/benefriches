import { useContext } from "react";
import { AvoidedCO2EqEmissions } from "shared";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import { getSocioEconomicImpactLabel } from "../../../getImpactLabel";
import ImpactItemDetails from "../../../list-view/ImpactItemDetails";
import ImpactItemGroup from "../../../list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";
import { ImpactsData } from "../../ImpactModalDescriptionProvider";
import ModalBarColoredChart from "../../shared/ModalBarColoredChart";
import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import {
  environmentalMonetaryBreadcrumbSection,
  mainBreadcrumbSection,
} from "../breadcrumbSections";

type Props = {
  impactsData: ImpactsData;
};

const getChartColor = (impactName: AvoidedCO2EqEmissions["details"][number]["impact"]) => {
  switch (impactName) {
    case "avoided_co2_eq_with_enr":
      return "#149FEA";
    case "avoided_air_conditioning_co2_eq_emissions":
      return "#14C3EA";
    case "avoided_traffic_co2_eq_emissions":
      return "#14EA81";
  }
};

const AvoidedCo2MonetaryValueDescription = ({ impactsData }: Props) => {
  const impactData = impactsData.socioeconomic.impacts.find(
    (impact): impact is AvoidedCO2EqEmissions => impact.impact === "avoided_co2_eq_emissions",
  );
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  return (
    <ModalBody size="large">
      <ModalHeader
        title="☁️ Valeur monétaire de la décarbonation"
        value={
          impactData
            ? {
                state: impactData.amount > 0 ? "success" : "error",
                text: formatMonetaryImpact(impactData.amount),
                description: "pour l'humanité",
              }
            : undefined
        }
        breadcrumbSegments={[
          mainBreadcrumbSection,
          environmentalMonetaryBreadcrumbSection,
          {
            label: "Valeur monétaire de la décarbonation ",
            openState: {
              sectionName: mainBreadcrumbSection.openState.sectionName,
              impactName: "avoided_co2_eq_emissions",
            },
          },
          { label: "Valeur monétaire de la décarbonation" },
        ]}
      />
      <div className="tw-grid lg:tw-grid-cols-2">
        <div className="tw-p-10">
          <ModalBarColoredChart
            data={
              impactData?.details.map(({ amount, impact }) => ({
                label: getSocioEconomicImpactLabel(impact),
                color: getChartColor(impact),
                value: amount,
              })) ?? []
            }
          />

          {impactData?.details.map(({ impact, amount }) => (
            <ImpactItemGroup isClickable key={impact}>
              <ImpactItemDetails
                value={amount}
                label={getSocioEconomicImpactLabel(impact)}
                type="monetary"
                onClick={() => {
                  openImpactModalDescription({
                    sectionName: "socio_economic",
                    impactName: "avoided_co2_eq_emissions",
                    impactDetailsName: impact,
                  });
                }}
              />
            </ImpactItemGroup>
          ))}
        </div>

        <ModalContent>
          <p>
            Suite à l’accord de Paris, la France s’est fixé pour objectif d’atteindre la neutralité
            carbone en 2050. Pour y parvenir, État, ménages, collectivités territoriales et
            entreprises doivent réduire leurs émissions de gaz à effet de serre. Les actions à mener
            en ce sens peuvent être guidées par une valeur donnée à l’action pour le climat : « la
            valeur tutélaire du carbone ».
          </p>
          <p>
            La valeur monétaire de la décarbonation traduit l’investissement qui peut être évité
            pour décarboner à un niveau équivalent à ce que le projet permet.
          </p>

          <p>
            Dans le cadre des projets de reconversion de friches ou plus largement d’aménagement en
            renouvellement urbain, les sources d’émissions évitées en CO2 peuvent être multiples,
            selon le type de projet et ses caractéristiques. On peut notamment citer :
          </p>

          <ul>
            <li>la désimperméabilisation puis renaturation des sols,</li>
            <li>la production d’énergies renouvelables,</li>
            <li>la réduction des déplacements en véhicules individuels (thermiques),</li>
            <li>la réhabilitation de bâtiments,</li>
            <li>la réduction du besoin en rafraîchissement ou climatisation.</li>
          </ul>
        </ModalContent>
      </div>
    </ModalBody>
  );
};

export default AvoidedCo2MonetaryValueDescription;
