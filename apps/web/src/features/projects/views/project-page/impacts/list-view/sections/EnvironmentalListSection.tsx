import { fr } from "@codegouvfr/react-dsfr";

import { EnvironmentalImpact } from "@/features/projects/domain/projectImpactsEnvironmental";

import {
  getEnvironmentalDetailsImpactLabel,
  getEnvironmentalImpactLabel,
} from "../../getImpactLabel";
import ImpactModalDescriptionProviderContainer from "../../impact-description-modals";
import { ImpactModalDescriptionContext } from "../../impact-description-modals/ImpactModalDescriptionContext";
import ImpactItemDetails from "../ImpactItemDetails";
import ImpactItemGroup from "../ImpactItemGroup";
import ImpactSection from "../ImpactSection";

type Props = {
  impacts: EnvironmentalImpact[];
};

const ENVIRONMENTAL_SECTIONS = {
  co2: ["co2_benefit"],
  soils: ["non_contaminated_surface_area", "permeable_surface_area"],
};

const EnvironmentalListSection = ({ impacts }: Props) => {
  const co2Impacts = impacts.filter(({ name }) => ENVIRONMENTAL_SECTIONS.co2.includes(name));
  const soilsImpacts = impacts.filter(({ name }) => ENVIRONMENTAL_SECTIONS.soils.includes(name));

  return (
    <ImpactModalDescriptionProviderContainer dialogId={`environmental_list`}>
      <ImpactModalDescriptionContext.Consumer>
        {({ openImpactModalDescription, dialogId }) => (
          <>
            <button
              aria-hidden="true"
              className={fr.cx("fr-hidden")}
              id={`${dialogId}-controlButton`}
              aria-controls={dialogId}
              data-fr-opened="false"
            ></button>
            <ImpactSection
              isMain
              title="Impacts environnementaux"
              onTitleClick={() => {
                document.getElementById(`${dialogId}-controlButton`)?.click();
                openImpactModalDescription({ sectionName: "environmental" });
              }}
            >
              {co2Impacts.length > 0 && (
                <ImpactSection
                  title="Impacts sur le CO2-eq"
                  onTitleClick={() => {
                    document.getElementById(`${dialogId}-controlButton`)?.click();
                    openImpactModalDescription({
                      sectionName: "environmental",
                      subSectionName: "co2",
                    });
                  }}
                >
                  {co2Impacts.map(({ name, impact, type }) => (
                    <ImpactItemGroup key={name} isClickable>
                      <ImpactItemDetails
                        label={getEnvironmentalImpactLabel(name)}
                        value={impact.difference}
                        onClick={() => {
                          document.getElementById(`${dialogId}-controlButton`)?.click();
                          openImpactModalDescription({
                            sectionName: "environmental",
                            subSectionName: "co2",
                            impactName: name,
                          });
                        }}
                        data={
                          impact.details
                            ? impact.details.map(
                                ({ name: detailsName, impact: detailsImpact }) => ({
                                  label: getEnvironmentalDetailsImpactLabel(name, detailsName),
                                  value: detailsImpact.difference,
                                  onClick: () => {
                                    document.getElementById(`${dialogId}-controlButton`)?.click();
                                    openImpactModalDescription({
                                      sectionName: "environmental",
                                      impactName: name,
                                      impactDetailsName: detailsName,
                                    });
                                  },
                                }),
                              )
                            : undefined
                        }
                        type={type}
                      />
                    </ImpactItemGroup>
                  ))}
                </ImpactSection>
              )}
              {soilsImpacts.length > 0 && (
                <ImpactSection
                  title="Impacts sur  les sols"
                  onTitleClick={() => {
                    document.getElementById(`${dialogId}-controlButton`)?.click();
                    openImpactModalDescription({
                      sectionName: "environmental",
                      subSectionName: "soils",
                    });
                  }}
                >
                  {soilsImpacts.map(({ name, impact, type }) => (
                    <ImpactItemGroup key={name} isClickable>
                      <ImpactItemDetails
                        label={getEnvironmentalImpactLabel(name)}
                        value={impact.difference}
                        onClick={() => {
                          document.getElementById(`${dialogId}-controlButton`)?.click();
                          openImpactModalDescription({
                            sectionName: "environmental",
                            subSectionName: "soils",
                            impactName: name,
                          });
                        }}
                        data={
                          impact.details
                            ? impact.details.map(
                                ({ name: detailsName, impact: detailsImpact }) => ({
                                  label: getEnvironmentalDetailsImpactLabel(name, detailsName),
                                  value: detailsImpact.difference,
                                  onClick: () => {
                                    document.getElementById(`${dialogId}-controlButton`)?.click();
                                    openImpactModalDescription({
                                      sectionName: "environmental",
                                      impactName: name,
                                      impactDetailsName: detailsName,
                                    });
                                  },
                                }),
                              )
                            : undefined
                        }
                        type={type}
                      />
                    </ImpactItemGroup>
                  ))}
                </ImpactSection>
              )}
            </ImpactSection>
          </>
        )}
      </ImpactModalDescriptionContext.Consumer>
    </ImpactModalDescriptionProviderContainer>
  );
};

export default EnvironmentalListSection;
