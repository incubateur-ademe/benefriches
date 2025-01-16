import { getCarbonTonsInAverageFrenchAnnualEmissionsPerPerson } from "@/shared/core/carbonEmissions";

import { formatCarbonStorage, formatPerFrenchPersonAnnualEquivalent } from "./formatCarbonStorage";

type Props = {
  carbonStorageDifference: number;
};

const AnnualFrenchEmissionPerPersonEquivalent = ({ carbonStorage }: { carbonStorage: number }) => {
  const carbonStorageDifferenceInAnnualFrenchEmissionPerPerson = Math.abs(
    getCarbonTonsInAverageFrenchAnnualEmissionsPerPerson(carbonStorage),
  );
  const formattedValue = formatPerFrenchPersonAnnualEquivalent(
    carbonStorageDifferenceInAnnualFrenchEmissionPerPerson,
  );
  return (
    <p>
      C'est l'équivalent de ce qu'émettent <strong>{formattedValue} français</strong> en{" "}
      <strong>1 an</strong>.
    </p>
  );
};

const CarbonStorageDifferenceSection = ({ carbonStorageDifference }: Props) => {
  if (carbonStorageDifference > 0) {
    return (
      <div>
        <p>
          🤩 Bonne nouvelle, ce site pourrait stocker{" "}
          <strong>{formatCarbonStorage(carbonStorageDifference)} t de carbone</strong> en plus ! 🍂
        </p>
        <AnnualFrenchEmissionPerPersonEquivalent carbonStorage={carbonStorageDifference} />
      </div>
    );
  }

  if (carbonStorageDifference < 0) {
    return (
      <div>
        <p>
          😭 Malheureusement, ce site pourrait stocker{" "}
          <strong>
            {formatCarbonStorage(Math.abs(carbonStorageDifference))} t de carbone en moins. ☁️
          </strong>
        </p>
        <AnnualFrenchEmissionPerPersonEquivalent
          carbonStorage={Math.abs(carbonStorageDifference)}
        />
      </div>
    );
  }

  return (
    <div>
      <p>Aucun changement notable.</p>
      <p>La capacité de stockage du carbone par les sols ne sera pas affectée par le projet.</p>
    </div>
  );
};

export default CarbonStorageDifferenceSection;
