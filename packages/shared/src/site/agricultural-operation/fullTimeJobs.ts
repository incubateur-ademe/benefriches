import { roundTo1Digit } from "../../services";
import { convertSquareMetersToHectares } from "../../surface-area";
import { AgriculturalOperationActivity } from "./operationActivity";

export const ETP_PER_HECTARE = {
  CATTLE_FARMING: 1.09,
  CEREALS_AND_OILSEEDS_CULTIVATION: 0.7,
  LARGE_VEGETABLE_CULTIVATION: 1.1,
  MARKET_GARDENING: 2.6,
  FLOWERS_AND_HORTICULTURE: 2.75,
  VITICULTURE: 1.51,
  FRUITS_AND_OTHER_PERMANENT_CROPS: 1.68,
  PIG_FARMING: 1.23,
  POULTRY_FARMING: 1.17,
  SHEEP_AND_GOAT_FARMING: 0.82,
  POLYCULTURE_AND_LIVESTOCK: 1.09,
};

type Props = {
  operationActivity: AgriculturalOperationActivity;
  surfaceArea: number;
};

export const computeAgriculturalOperationEtpFromSurface = ({
  operationActivity,
  surfaceArea,
}: Props): number => {
  const surfaceInHectare = convertSquareMetersToHectares(surfaceArea);
  return roundTo1Digit(ETP_PER_HECTARE[operationActivity] * surfaceInHectare);
};
