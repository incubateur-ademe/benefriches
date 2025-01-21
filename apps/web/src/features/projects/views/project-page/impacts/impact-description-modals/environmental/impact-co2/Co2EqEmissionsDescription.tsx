import { useContext } from "react";

import { getEnvironmentalProjectImpacts } from "@/features/projects/domain/projectImpactsEnvironmental";
import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";

import { getEnvironmentalDetailsImpactLabel } from "../../../getImpactLabel";
import ImpactItemDetails from "../../../list-view/ImpactItemDetails";
import ImpactItemGroup from "../../../list-view/ImpactItemGroup";
import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";
import { ImpactsData } from "../../ImpactModalDescriptionProvider";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import { co2BreadcrumbSection, mainBreadcrumbSection } from "../breadcrumbSections";

type Props = {
  impactsData: ImpactsData;
};

const Co2BenefitDescription = ({ impactsData }: Props) => {
  const environmentalImpacts = getEnvironmentalProjectImpacts(impactsData);

  const co2Benefit = environmentalImpacts.find(({ name }) => "co2_benefit" === name);

  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  const total = co2Benefit?.impact.difference ?? 0;
  const details = co2Benefit?.impact.details ?? [];

  return (
    <>
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
      <ModalContent>
        La réalisation du projet a des conséquences sur les émissions de CO2 pour plusieurs raisons,
        le cas échéant du fait :
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
          Des émissions sont toutefois associées à la création du projet (aménagement, construction
          neuve) pouvant de fait réduire l’ampleur des émissions évitées..
        </p>
        <div className="tw-flex tw-flex-col">
          {details.map(({ impact, name }) => (
            <ImpactItemGroup isClickable key={name}>
              <ImpactItemDetails
                value={impact.difference}
                label={getEnvironmentalDetailsImpactLabel("co2_benefit", name)}
                type="co2"
                onClick={() => {
                  openImpactModalDescription({
                    sectionName: "environmental",
                    impactName: "co2_benefit",
                    impactDetailsName: name,
                  });
                }}
              />
            </ImpactItemGroup>
          ))}
        </div>
      </ModalContent>
    </>
  );
};

export default Co2BenefitDescription;
