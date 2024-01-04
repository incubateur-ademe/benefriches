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
        <p>Bonne nouvelle !</p>
        <p>
          Ce site pourrait stocker{" "}
          <strong>{formatNumberFr(carbonStorageDifference)} tonnes de carbone en plus.</strong>
        </p>
        <p>
          ℹ️ C'est l'équivalent de ce qu'émettent{" "}
          <strong>
            {formatNumberFr(carbonStorageDifferenceInAnnualFrenchEmissionPerPerson)} français
          </strong>{" "}
          en 1 an. ℹ️
        </p>
      </div>
    );
  }

  return (
    <div>
      <p>
        Ce site stockerait{" "}
        <strong>
          {formatNumberFr(Math.abs(carbonStorageDifference))} tonnes de carbone en moins.
        </strong>
      </p>
      <p>
        ℹ️ C'est l'équivalent de ce qu'émettent{" "}
        <strong>
          {formatNumberFr(carbonStorageDifferenceInAnnualFrenchEmissionPerPerson)} français
        </strong>{" "}
        en 1 an. ℹ️
      </p>
    </div>
  );
};

export default CarbonStorageDifferenceSection;
