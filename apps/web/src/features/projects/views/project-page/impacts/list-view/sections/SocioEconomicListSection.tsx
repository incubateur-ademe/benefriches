import React, { useContext } from "react";

import { SocioEconomicImpactsByBearerListView } from "@/features/projects/core/projectImpactsSocioEconomic";
import { ImpactModalDescriptionContext } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";

import { getSocioEconomicImpactLabel } from "../../getImpactLabel";
import ImpactItemDetails from "../ImpactItemDetails";
import ImpactItemGroup from "../ImpactItemGroup";
import ImpactSection from "../ImpactSection";

type Props = {
  socioEconomicImpacts: SocioEconomicImpactsByBearerListView;
};

const SocioEconomicImpactsListSection = ({ socioEconomicImpacts }: Props) => {
  const { total } = socioEconomicImpacts;
  const { getDetailsLink } = useContext(ImpactModalDescriptionContext);

  return (
    <ImpactSection
      title="Impacts socio-économiques"
      isMain
      total={total}
      initialShowSectionContent={false}
      labelProps={getDetailsLink({ sectionName: `socioEconomic` })}
    >
      {socioEconomicImpacts.localAuthority.impacts.length > 0 && (
        <ImpactSection
          title="Impacts économiques pour la collectivité locale"
          total={socioEconomicImpacts.localAuthority.total}
          labelProps={getDetailsLink({ sectionName: `socioEconomic.localAuthority` })}
        >
          {socioEconomicImpacts.localAuthority.impacts.map(({ keyName, total, ...rest }) => (
            <React.Fragment key={`wrapper-${keyName}`}>
              <ImpactItemGroup isClickable key={`group-${keyName}`}>
                <ImpactItemDetails
                  value={total}
                  label={getSocioEconomicImpactLabel(keyName)}
                  actor={"bearerName" in rest ? rest.bearerName : undefined}
                  data={
                    "details" in rest
                      ? rest.details.map((item) => ({
                          label: getSocioEconomicImpactLabel(item.keyName),
                          value: item.total,
                          labelProps: getDetailsLink({
                            sectionName: `socioEconomic.localAuthority`,
                            impactDetailsName: item.keyName,
                          }),
                        }))
                      : undefined
                  }
                  type="monetary"
                  labelProps={getDetailsLink({
                    sectionName: `socioEconomic.localAuthority`,
                    impactDetailsName: keyName,
                  })}
                />
              </ImpactItemGroup>
            </React.Fragment>
          ))}
        </ImpactSection>
      )}
      {socioEconomicImpacts.localPeopleOrCompany.impacts.length > 0 && (
        <ImpactSection
          title="Impacts économiques pour les riverains"
          total={socioEconomicImpacts.localPeopleOrCompany.total}
          labelProps={getDetailsLink({ sectionName: `socioEconomic.localPeopleOrCompany` })}
        >
          {socioEconomicImpacts.localPeopleOrCompany.impacts.map(({ keyName, total, ...rest }) => (
            <React.Fragment key={`wrapper-${keyName}`}>
              <ImpactItemGroup isClickable key={`group-${keyName}`}>
                <ImpactItemDetails
                  value={total}
                  label={getSocioEconomicImpactLabel(keyName)}
                  actor={"bearerName" in rest ? rest.bearerName : undefined}
                  data={
                    "details" in rest
                      ? rest.details.map((item) => ({
                          label: getSocioEconomicImpactLabel(item.keyName),
                          value: item.total,
                          labelProps: getDetailsLink({
                            sectionName: `socioEconomic.localPeopleOrCompany`,
                            impactDetailsName: item.keyName,
                          }),
                        }))
                      : undefined
                  }
                  type="monetary"
                  labelProps={getDetailsLink({
                    sectionName: `socioEconomic.localPeopleOrCompany`,
                    impactDetailsName: keyName,
                  })}
                />
              </ImpactItemGroup>
            </React.Fragment>
          ))}
        </ImpactSection>
      )}
      {socioEconomicImpacts.humanity.impacts.length > 0 && (
        <ImpactSection
          title="Impacts économiques pour la société française et mondiale"
          total={socioEconomicImpacts.humanity.total}
          labelProps={getDetailsLink({ sectionName: `socioEconomic.humanity` })}
        >
          {socioEconomicImpacts.humanity.impacts.map(({ keyName, total, ...rest }) => (
            <React.Fragment key={`wrapper-${keyName}`}>
              <ImpactItemGroup isClickable key={`group-${keyName}`}>
                <ImpactItemDetails
                  value={total}
                  label={getSocioEconomicImpactLabel(keyName)}
                  actor={"bearerName" in rest ? rest.bearerName : undefined}
                  data={
                    "details" in rest
                      ? rest.details.map((item) => ({
                          label: getSocioEconomicImpactLabel(item.keyName),
                          value: item.total,
                          labelProps: getDetailsLink({
                            sectionName: `socioEconomic.humanity`,
                            impactDetailsName: item.keyName,
                          }),
                        }))
                      : undefined
                  }
                  type="monetary"
                  labelProps={getDetailsLink({
                    sectionName: `socioEconomic.humanity`,
                    impactDetailsName: keyName,
                  })}
                />
              </ImpactItemGroup>
            </React.Fragment>
          ))}
        </ImpactSection>
      )}
    </ImpactSection>
  );
};

export default SocioEconomicImpactsListSection;
