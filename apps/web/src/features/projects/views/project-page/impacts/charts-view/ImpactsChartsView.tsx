import { useContext } from "react";

import { EconomicBalance } from "@/features/projects/domain/projectImpactsEconomicBalance";
import {
  EnvironmentalImpact,
  EnvironmentalImpactDetailsName,
} from "@/features/projects/domain/projectImpactsEnvironmental";
import {
  SocialImpact,
  SocialImpactDetailsName,
} from "@/features/projects/domain/projectImpactsSocial";
import { SocioEconomicImpactByActor } from "@/features/projects/domain/projectImpactsSocioEconomic";

import { getEnvironmentalImpactLabel } from "../getImpactLabel";
import { ImpactModalDescriptionContext } from "../impact-description-modals/ImpactModalDescriptionContext";
import ImpactAreaChartCard from "./ImpactChartCard/ImpactAreaChartCard";
import ImpactsChartsEconomicSection from "./ImpactsChartsEconomicSection";

type Props = {
  projectName: string;
  economicBalance: EconomicBalance;
  socioEconomicTotalImpact: number;
  socioEconomicImpactsByActor: SocioEconomicImpactByActor;
  environmentImpacts: EnvironmentalImpact[];
  socialImpacts: SocialImpact[];
};

const getImpactColor = (name: SocialImpactDetailsName | EnvironmentalImpactDetailsName) => {
  switch (name) {
    case "mineral_soil":
      return "#70706A";
    case "green_soil":
      return "#7ACA17";
    case "avoided_air_conditioning_co2_eq_emissions":
      return "#14C3EA";
    case "avoided_car_traffic_co2_eq_emissions":
      return "#14EA81";
    case "avoided_co2_eq_emissions_with_production":
      return "#149FEA";
    case "stored_co2_eq":
      return "#E6EA14";
    case "conversion_full_time_jobs":
      return "#D6BB1D";
    case "operations_full_time_jobs":
      return "#C4D3DE";
    default:
      return undefined;
  }
};

const getImpactDetailsLabel = (name: EnvironmentalImpactDetailsName | SocialImpactDetailsName) => {
  switch (name) {
    case "stored_co2_eq":
      return "CO2-eq stocké dans les sols";
    case "avoided_co2_eq_emissions_with_production":
      return "Évitées grâce à la production d'EnR";
    case "avoided_car_traffic_co2_eq_emissions":
      return "Evitées grâce aux déplacements en voiture évités";
    case "avoided_air_conditioning_co2_eq_emissions":
      return "Evitées grâce à l'utilisation réduite de de la climatisation";
    case "mineral_soil":
      return "Surface perméable minérale";
    case "green_soil":
      return "Surface perméable végétalisée";
    case "conversion_full_time_jobs":
      return "Reconversion du site";
    case "operations_full_time_jobs":
      return "Exploitation du site";
    default:
      return "";
  }
};

const formatImpactDetails = (
  details: EnvironmentalImpact["impact"]["details"] | SocialImpact["impact"]["details"],
) => {
  if (!details) {
    return undefined;
  }

  return details.map(({ impact, name }) => ({
    impactLabel: getImpactDetailsLabel(name),
    color: getImpactColor(name),
    ...impact,
  }));
};

const ImpactsChartsView = ({
  economicBalance,
  socioEconomicTotalImpact,
  socioEconomicImpactsByActor,
  environmentImpacts,
  socialImpacts,
}: Props) => {
  const displayEconomicBalance = economicBalance.economicBalance.length > 0;

  const co2Benefit = environmentImpacts.find(({ name }) => "co2_benefit" === name);
  const permeableSurfaceArea = environmentImpacts.find(
    ({ name }) => "permeable_surface_area" === name,
  );
  const fullTimeJobs = socialImpacts.find(({ name }) => "full_time_jobs" === name);

  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  return (
    <div>
      {(displayEconomicBalance || socioEconomicImpactsByActor.length > 0) && (
        <ImpactsChartsEconomicSection
          economicBalance={economicBalance}
          socioEconomicTotalImpact={socioEconomicTotalImpact}
          socioEconomicImpactsByActor={socioEconomicImpactsByActor}
        />
      )}

      <div className="tw-grid tw-gap-6 tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 ">
        {co2Benefit && (
          <ImpactAreaChartCard
            type="co2"
            impact={{
              impactLabel: getEnvironmentalImpactLabel("co2_benefit"),
              ...co2Benefit.impact,
              details: formatImpactDetails(co2Benefit.impact.details),
            }}
          />
        )}
        {permeableSurfaceArea && (
          <ImpactAreaChartCard
            type="surfaceArea"
            impact={{
              impactLabel: getEnvironmentalImpactLabel("permeable_surface_area"),
              ...permeableSurfaceArea.impact,
              details: formatImpactDetails(permeableSurfaceArea.impact.details),
            }}
            onClick={() => {
              openImpactModalDescription("environmental.permeable-surface");
            }}
          />
        )}
        {fullTimeJobs && (
          <ImpactAreaChartCard
            type="etp"
            impact={{
              impactLabel: "🧑‍🔧️ Emploi",
              ...fullTimeJobs.impact,
              details: formatImpactDetails(fullTimeJobs.impact.details),
            }}
            onClick={() => {
              openImpactModalDescription("social.full-time-jobs");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ImpactsChartsView;
