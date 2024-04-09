import { formatCarbonStorage } from "./formatCarbonStorage";

import { getCarbonTonsInAverageFrenchAnnualEmissionsPerPerson } from "@/shared/domain/carbonEmissions";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  carbonStorageDifference: number;
};

const CarbonStorageDifferenceSection = ({ carbonStorageDifference }: Props) => {
  const carbonStorageDifferenceInAnnualFrenchEmissionPerPerson = Math.abs(
    getCarbonTonsInAverageFrenchAnnualEmissionsPerPerson(carbonStorageDifference),
  );

  if (carbonStorageDifference === 0) {
    return <p>Ce site stockera autant de carbone.</p>;
  }

  if (carbonStorageDifference > 0) {
    return (
      <div>
        <p>
          🤩 Bonne nouvelle, ce site pourrait stocker{" "}
          <strong>{formatCarbonStorage(carbonStorageDifference)} t de carbone</strong> en plus ! 🍂
        </p>
        <p>
          C'est l'équivalent de ce qu'émettent{" "}
          <strong>
            {formatCarbonStorage(carbonStorageDifferenceInAnnualFrenchEmissionPerPerson)} français
          </strong>{" "}
          en <strong>1 an</strong>.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p>
        Ce site stockerait{" "}
        <strong>
          {formatCarbonStorage(Math.abs(carbonStorageDifference))} t de carbone en moins.
        </strong>
      </p>
      <p>
        C'est l'équivalent de ce qu'émettent{" "}
        <strong>
          {formatNumberFr(Math.round(carbonStorageDifferenceInAnnualFrenchEmissionPerPerson))}{" "}
          français
        </strong>{" "}
        en <strong>1 an</strong>.
      </p>
    </div>
  );
};

export default CarbonStorageDifferenceSection;
