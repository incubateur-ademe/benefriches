import { roundToInteger } from "shared";

import { SoilsCarbonStorageResult } from "@/features/create-project/application/soilsCarbonStorage.actions";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { getPercentageDifference } from "@/shared/services/percentage/percentage";
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
      <h2>Stockage du carbone par les sols</h2>
      <CarbonStorageDifferenceSection carbonStorageDifference={carbonStorageDifference} />
      <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6 tw-pb-10">
        <div className="tw-border tw-border-solid tw-border-borderGrey tw-p-8">
          <h3 className="tw-uppercase tw-text-base">Site existant :</h3>
          <p>
            <strong>{formatCarbonStorage(currentCarbonStorage.totalCarbonStorage)} t</strong> de
            carbone stockés
          </p>
          <SoilsCarbonStorageChart soilsCarbonStorage={currentCarbonStorage.soilsStorage} />
        </div>

        <div className="tw-border tw-border-solid tw-border-borderGrey tw-p-8">
          <h3 className="tw-uppercase tw-text-base">Site avec projet :</h3>
          <p>
            <strong>{formatCarbonStorage(projectedCarbonStorage.totalCarbonStorage)} t</strong> de
            carbone stockés {differenceInPercentage ? `(${differenceInPercentage})` : null}
          </p>
          <SoilsCarbonStorageChart soilsCarbonStorage={projectedCarbonStorage.soilsStorage} />
        </div>
      </div>

      <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
    </>
  );
};

export default SoilsCarbonStorageComparison;