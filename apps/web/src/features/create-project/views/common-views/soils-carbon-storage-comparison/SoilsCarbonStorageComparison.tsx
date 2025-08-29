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
      <h2>Stockage du carbone par les sols après aménagement</h2>
      <CarbonStorageDifferenceSection carbonStorageDifference={carbonStorageDifference} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        <div className="border border-solid border-borderGrey p-8">
          <h3 className="uppercase text-base">Site existant :</h3>
          <p>
            <strong>{formatCarbonStorage(currentCarbonStorage.totalCarbonStorage)} t</strong> de
            carbone stockés
          </p>
          <SoilsCarbonStorageChart
            soilsCarbonStorage={currentCarbonStorage.soilsStorage}
            exportConfig={{
              title: "Stockage du carbone par les sols avant aménagement",
              caption: `${formatCarbonStorage(currentCarbonStorage.totalCarbonStorage)} t de carbone stockés`,
            }}
          />
        </div>

        <div className="border border-solid border-borderGrey p-8">
          <h3 className="uppercase text-base">Site avec projet :</h3>
          <p>
            <strong>{formatCarbonStorage(projectedCarbonStorage.totalCarbonStorage)} t</strong> de
            carbone stockés {differenceInPercentage ? `(${differenceInPercentage})` : null}
          </p>
          <SoilsCarbonStorageChart
            soilsCarbonStorage={projectedCarbonStorage.soilsStorage}
            exportConfig={{
              title: "Stockage du carbone par les sols après aménagement",
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
