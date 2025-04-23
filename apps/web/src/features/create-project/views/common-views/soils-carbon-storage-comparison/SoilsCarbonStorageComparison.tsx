import { roundToInteger } from "shared";

import { SoilsCarbonStorageResult } from "@/features/create-project/core/actions/soilsCarbonStorage.action";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import { getPercentageDifference } from "@/shared/core/percentage/percentage";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SoilsCarbonStorageChart from "@/shared/views/components/Charts/SoilsCarbonStorageChart";

import CarbonStorageDifferenceSection from "./CarbonStorageDifferenceSection";
import { formatCarbonStorage } from "./formatCarbonStorage";

type Props = {
  currentCarbonStorage: SoilsCarbonStorageResult;
  projectedCarbonStorage: SoilsCarbonStorageResult;
  onNext: () => void;
  onBack: () => void;
};

const getPercentageDifferenceFormated = (current: number, projected: number) => {
  const percentage = getPercentageDifference(current, projected);
  const roundedValue = roundToInteger(percentage);

  return `${roundedValue > 0 ? "+" : ""}${formatNumberFr(roundedValue)}%`;
};

const SoilsCarbonStorageComparison = ({
  onNext,
  onBack,
  currentCarbonStorage,
  projectedCarbonStorage,
}: Props) => {
  const carbonStorageDifference =
    projectedCarbonStorage.totalCarbonStorage - currentCarbonStorage.totalCarbonStorage;
  const differenceInPercentage =
    carbonStorageDifference !== 0
      ? getPercentageDifferenceFormated(
          currentCarbonStorage.totalCarbonStorage,
          projectedCarbonStorage.totalCarbonStorage,
        )
      : 0;
  return (
    <>
      <h2>Stockage du carbone par les sols après transformation</h2>
      <CarbonStorageDifferenceSection carbonStorageDifference={carbonStorageDifference} />
      <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6 tw-pb-10">
        <div className="tw-border tw-border-solid tw-border-borderGrey tw-p-8">
          <h3 className="tw-uppercase tw-text-base">Site existant :</h3>
          <p>
            <strong>{formatCarbonStorage(currentCarbonStorage.totalCarbonStorage)} t</strong> de
            carbone stockés
          </p>
          <SoilsCarbonStorageChart
            soilsCarbonStorage={currentCarbonStorage.soilsStorage}
            exportConfig={{
              title: "Stockage du carbone par les sols avant transformation",
              caption: `${formatCarbonStorage(currentCarbonStorage.totalCarbonStorage)} t de carbone stockés`,
            }}
          />
        </div>

        <div className="tw-border tw-border-solid tw-border-borderGrey tw-p-8">
          <h3 className="tw-uppercase tw-text-base">Site avec projet :</h3>
          <p>
            <strong>{formatCarbonStorage(projectedCarbonStorage.totalCarbonStorage)} t</strong> de
            carbone stockés {differenceInPercentage ? `(${differenceInPercentage})` : null}
          </p>
          <SoilsCarbonStorageChart
            soilsCarbonStorage={projectedCarbonStorage.soilsStorage}
            exportConfig={{
              title: "Stockage du carbone par les sols après transformation",
              caption: `${formatCarbonStorage(projectedCarbonStorage.totalCarbonStorage)} t de carbone stockés ${differenceInPercentage ? `(${differenceInPercentage})` : ""}`,
            }}
          />
        </div>
      </div>

      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </>
  );
};

export default SoilsCarbonStorageComparison;
