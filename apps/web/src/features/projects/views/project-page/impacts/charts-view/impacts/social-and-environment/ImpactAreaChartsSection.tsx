import { useContext } from "react";

import {
  EnvironmentalAreaChartImpactsData,
  SocialAreaChartImpactsData,
} from "@/features/projects/domain/projectImpactsAreaChartsData";

import { ImpactModalDescriptionContext } from "../../../impact-description-modals/ImpactModalDescriptionContext";
import ImpactAreaChartCard from "../../ImpactChartCard/ImpactAreaChartCard";

type Props = {
  environmentalAreaChartImpactsData: EnvironmentalAreaChartImpactsData;
  socialAreaChartImpactsData: SocialAreaChartImpactsData;
};

const ImpactAreaChartsSection = ({
  environmentalAreaChartImpactsData,
  socialAreaChartImpactsData,
}: Props) => {
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  const { fullTimeJobs, householdsPoweredByRenewableEnergy } = socialAreaChartImpactsData;
  const { nonContaminatedSurfaceArea, avoidedCo2eqEmissions, permeableSurfaceArea } =
    environmentalAreaChartImpactsData;

  return (
    <div className="tw-grid tw-gap-10 tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-mb-8">
      {fullTimeJobs && (
        <ImpactAreaChartCard
          type="etp"
          impact={{
            impactLabel: "🧑‍🔧️ Emplois équivalent temps plein",
            ...fullTimeJobs,
            details: [
              {
                ...fullTimeJobs.operations,
                impactLabel: "Exploitation du site",
                color: "#C4D3DE",
              },
              {
                ...fullTimeJobs.conversion,
                impactLabel: "Reconversion du site",
                color: "#D6BB1D",
              },
            ],
          }}
          onClick={() => {
            openImpactModalDescription({ sectionName: "social", impactName: "full_time_jobs" });
          }}
        />
      )}

      {householdsPoweredByRenewableEnergy && (
        <ImpactAreaChartCard
          type="default"
          impact={{
            impactLabel: "🏠 Foyers alimentés par les énergies renouvelables",
            color: "#E3CFA9",
            ...householdsPoweredByRenewableEnergy,
          }}
          onClick={() => {
            openImpactModalDescription({
              sectionName: "social",
              impactName: "households_powered_by_renewable_energy",
            });
          }}
        />
      )}

      {avoidedCo2eqEmissions && (
        <ImpactAreaChartCard
          type="co2"
          impact={{
            impactLabel: "☁️ CO2 eq stocké ou évité",
            ...avoidedCo2eqEmissions,
            details: [
              {
                ...avoidedCo2eqEmissions.soilsCo2eqStorage,
                impactLabel: "CO2-eq stocké dans les sols",
                color: "#E6EA14",
              },
              {
                ...avoidedCo2eqEmissions.withAirConditioningDiminution,
                impactLabel: "Evitées grâce à l'utilisation réduite de de la climatisation",
                color: "#14C3EA",
              },
              {
                ...avoidedCo2eqEmissions.withCarTrafficDiminution,
                impactLabel: "Evitées grâce aux déplacements en voiture évités",
                color: "#14EA81",
              },
              {
                ...avoidedCo2eqEmissions.withRenewableEnergyProduction,
                impactLabel: "Évitées grâce à la production d'EnR",
                color: "#149FEA",
              },
            ],
          }}
          onClick={() => {
            openImpactModalDescription({ sectionName: "environmental", impactName: "co2_benefit" });
          }}
        />
      )}

      {permeableSurfaceArea && (
        <ImpactAreaChartCard
          type="surfaceArea"
          impact={{
            impactLabel: "🌧 Surface perméable",
            ...permeableSurfaceArea,
            details: [
              {
                ...permeableSurfaceArea.greenSoil,
                impactLabel: "Surface perméable végétalisée",
                color: "#7ACA17",
              },
              {
                ...permeableSurfaceArea.mineralSoil,
                impactLabel: "Surface perméable minérale",
                color: "#70706A",
              },
            ],
          }}
          onClick={() => {
            openImpactModalDescription({
              sectionName: "environmental",
              impactName: "permeable_surface_area",
            });
          }}
        />
      )}

      {nonContaminatedSurfaceArea && (
        <ImpactAreaChartCard
          type="surfaceArea"
          impact={{
            impactLabel: "✨ Surface non polluée",
            color: "#FCDF3B",
            ...nonContaminatedSurfaceArea,
          }}
          onClick={() => {
            openImpactModalDescription({
              sectionName: "environmental",
              impactName: "non_contaminated_surface_area",
            });
          }}
        />
      )}
    </div>
  );
};

export default ImpactAreaChartsSection;
