import { UrbanSprawlComparisonImpacts } from "shared";

import { getSocialImpactLabel } from "../../../project-page/impacts/getImpactLabel";
import {
  formatDefaultImpact,
  formatETPImpact,
  formatTimeImpact,
} from "../../../shared/formatImpactValue";
import TableAccordionRow from "../layout/TableAccordionRows";
import ImpactComparisonTableRow from "../layout/TableRow";
import ImpactComparisonTableSectionRow from "../layout/TableSectionRow";
import ImpactComparisonTableSeparatorRow from "../layout/TableSeparatorRow";

type Props = {
  baseCase: {
    impacts: UrbanSprawlComparisonImpacts;
    siteName: string;
  };
  comparisonCase: {
    impacts: UrbanSprawlComparisonImpacts;
    siteName: string;
  };
};

const ImpactComparisonListSocialSection = ({ baseCase, comparisonCase }: Props) => {
  return (
    <ImpactComparisonTableSectionRow label="Impacts sociaux">
      {(() => {
        const base = baseCase.impacts.social.fullTimeJobs;
        const comparison = comparisonCase.impacts.social.fullTimeJobs;

        if (!base?.difference && !comparison?.difference) {
          return null;
        }

        const formatValueFn = formatETPImpact;

        return (
          <ImpactComparisonTableSectionRow label="Impacts sur l'emploi" subSection>
            <TableAccordionRow
              label={getSocialImpactLabel("full_time_jobs")}
              baseValue={base?.difference ?? 0}
              comparisonValue={comparison?.difference ?? 0}
              formatValueFn={formatValueFn}
            >
              {base?.conversion || comparison?.conversion ? (
                <ImpactComparisonTableRow
                  label={getSocialImpactLabel("conversion_full_time_jobs")}
                  isLast={!base?.operations.difference && !comparison?.operations.difference}
                  baseValue={base?.conversion.difference ?? 0}
                  comparisonValue={comparison?.conversion.difference ?? 0}
                  formatValueFn={formatValueFn}
                />
              ) : undefined}
              {base?.operations || comparison?.operations ? (
                <ImpactComparisonTableRow
                  label={getSocialImpactLabel("operations_full_time_jobs")}
                  isLast
                  baseValue={base?.operations.difference ?? 0}
                  comparisonValue={comparison?.operations.difference ?? 0}
                  formatValueFn={formatValueFn}
                />
              ) : undefined}
            </TableAccordionRow>
          </ImpactComparisonTableSectionRow>
        );
      })()}

      {(() => {
        const baseAvoidedVehiculeKilometers = baseCase.impacts.social.avoidedVehiculeKilometers;
        const comparisonAvoidedVehiculeKilometers =
          comparisonCase.impacts.social.avoidedVehiculeKilometers;

        const baseTravelTimeSaved = baseCase.impacts.social.travelTimeSaved;
        const comparisonTravelTimeSaved = comparisonCase.impacts.social.travelTimeSaved;
        const baseAvoidedTrafficAccidents = baseCase.impacts.social.avoidedTrafficAccidents;
        const comparisonAvoidedTrafficAccidents =
          comparisonCase.impacts.social.avoidedTrafficAccidents;

        if (
          !baseAvoidedVehiculeKilometers &&
          !comparisonAvoidedVehiculeKilometers &&
          !baseTravelTimeSaved &&
          !comparisonTravelTimeSaved &&
          !baseAvoidedTrafficAccidents &&
          !comparisonAvoidedTrafficAccidents
        ) {
          return null;
        }

        return (
          <ImpactComparisonTableSectionRow label="Impacts sur les riverains" subSection>
            {baseAvoidedVehiculeKilometers || comparisonAvoidedVehiculeKilometers ? (
              <ImpactComparisonTableRow
                label={getSocialImpactLabel("avoided_vehicule_kilometers")}
                baseValue={baseAvoidedVehiculeKilometers ?? 0}
                comparisonValue={comparisonAvoidedVehiculeKilometers ?? 0}
                isFirst
                isLast
                formatValueFn={formatDefaultImpact}
              />
            ) : undefined}
            <ImpactComparisonTableSeparatorRow />

            {baseTravelTimeSaved || comparisonTravelTimeSaved ? (
              <ImpactComparisonTableRow
                label={getSocialImpactLabel("travel_time_saved")}
                baseValue={baseTravelTimeSaved ?? 0}
                comparisonValue={comparisonTravelTimeSaved ?? 0}
                formatValueFn={formatTimeImpact}
                isFirst
                isLast
              />
            ) : undefined}
            <ImpactComparisonTableSeparatorRow />

            {baseAvoidedTrafficAccidents || comparisonAvoidedTrafficAccidents ? (
              <TableAccordionRow
                label={getSocialImpactLabel("avoided_traffic_accidents")}
                baseValue={baseAvoidedTrafficAccidents?.total ?? 0}
                comparisonValue={comparisonAvoidedTrafficAccidents?.total ?? 0}
                formatValueFn={formatDefaultImpact}
              >
                {baseAvoidedTrafficAccidents?.minorInjuries ||
                comparisonAvoidedTrafficAccidents?.minorInjuries ? (
                  <ImpactComparisonTableRow
                    label={getSocialImpactLabel("avoided_traffic_minor_injuries")}
                    isLast={
                      !baseAvoidedTrafficAccidents?.severeInjuries &&
                      !comparisonAvoidedTrafficAccidents?.severeInjuries &&
                      !baseAvoidedTrafficAccidents?.deaths &&
                      !comparisonAvoidedTrafficAccidents?.deaths
                    }
                    baseValue={baseAvoidedTrafficAccidents?.minorInjuries ?? 0}
                    comparisonValue={comparisonAvoidedTrafficAccidents?.minorInjuries ?? 0}
                    formatValueFn={formatDefaultImpact}
                  />
                ) : undefined}
                {baseAvoidedTrafficAccidents?.severeInjuries ||
                comparisonAvoidedTrafficAccidents?.severeInjuries ? (
                  <ImpactComparisonTableRow
                    label={getSocialImpactLabel("avoided_traffic_severe_injuries")}
                    isLast={
                      !baseAvoidedTrafficAccidents?.deaths &&
                      !comparisonAvoidedTrafficAccidents?.deaths
                    }
                    baseValue={baseAvoidedTrafficAccidents?.severeInjuries ?? 0}
                    comparisonValue={comparisonAvoidedTrafficAccidents?.severeInjuries ?? 0}
                    formatValueFn={formatDefaultImpact}
                  />
                ) : undefined}
                {baseAvoidedTrafficAccidents?.deaths ||
                comparisonAvoidedTrafficAccidents?.deaths ? (
                  <ImpactComparisonTableRow
                    label={getSocialImpactLabel("avoided_traffic_deaths")}
                    isLast
                    baseValue={baseAvoidedTrafficAccidents?.deaths ?? 0}
                    comparisonValue={comparisonAvoidedTrafficAccidents?.deaths ?? 0}
                    formatValueFn={formatDefaultImpact}
                  />
                ) : undefined}
              </TableAccordionRow>
            ) : undefined}
          </ImpactComparisonTableSectionRow>
        );
      })()}

      {(() => {
        const baseFricheAccidents = baseCase.impacts.social.accidents;
        const comparisonFricheAccidents = comparisonCase.impacts.social.accidents;

        const baseHouseholdsPoweredByEnR =
          baseCase.impacts.social.householdsPoweredByRenewableEnergy;
        const comparisonHouseholdsPoweredByEnR =
          comparisonCase.impacts.social.householdsPoweredByRenewableEnergy;

        if (
          !baseFricheAccidents &&
          !comparisonFricheAccidents &&
          !baseHouseholdsPoweredByEnR &&
          !comparisonHouseholdsPoweredByEnR
        ) {
          return null;
        }
        const formatValueFn = formatDefaultImpact;

        return (
          <ImpactComparisonTableSectionRow label="Impacts sur la société française" subSection>
            {baseFricheAccidents || comparisonFricheAccidents ? (
              <TableAccordionRow
                label={getSocialImpactLabel("avoided_friche_accidents")}
                baseValue={baseFricheAccidents?.difference ?? 0}
                comparisonValue={comparisonFricheAccidents?.difference ?? 0}
                formatValueFn={formatValueFn}
              >
                {baseFricheAccidents?.minorInjuries || comparisonFricheAccidents?.minorInjuries ? (
                  <ImpactComparisonTableRow
                    label={getSocialImpactLabel("avoided_friche_minor_accidents")}
                    isLast={
                      !baseFricheAccidents?.severeInjuries &&
                      !comparisonFricheAccidents?.severeInjuries &&
                      !baseFricheAccidents?.deaths &&
                      !comparisonFricheAccidents?.deaths
                    }
                    baseValue={baseFricheAccidents?.minorInjuries.difference ?? 0}
                    comparisonValue={comparisonFricheAccidents?.minorInjuries.difference ?? 0}
                    formatValueFn={formatValueFn}
                  />
                ) : undefined}
                {baseFricheAccidents?.severeInjuries ||
                comparisonFricheAccidents?.severeInjuries ? (
                  <ImpactComparisonTableRow
                    label={getSocialImpactLabel("avoided_friche_severe_accidents")}
                    isLast
                    baseValue={baseFricheAccidents?.severeInjuries.difference ?? 0}
                    comparisonValue={comparisonFricheAccidents?.severeInjuries.difference ?? 0}
                    formatValueFn={formatValueFn}
                  />
                ) : undefined}
              </TableAccordionRow>
            ) : undefined}
            <ImpactComparisonTableSeparatorRow />

            {baseHouseholdsPoweredByEnR || comparisonHouseholdsPoweredByEnR ? (
              <ImpactComparisonTableRow
                label={getSocialImpactLabel("households_powered_by_renewable_energy")}
                baseValue={baseHouseholdsPoweredByEnR?.difference ?? 0}
                comparisonValue={comparisonHouseholdsPoweredByEnR?.difference ?? 0}
                isFirst
                isLast
                formatValueFn={formatValueFn}
              />
            ) : undefined}
          </ImpactComparisonTableSectionRow>
        );
      })()}
    </ImpactComparisonTableSectionRow>
  );
};

export default ImpactComparisonListSocialSection;
