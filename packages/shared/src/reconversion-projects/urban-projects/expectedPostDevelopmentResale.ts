import { computePropertyTransferDutiesFromSellingPrice } from "../../financial";

export const computeExpectedPostDevelopmentResaleFromSiteSurfaceArea = (
  surfaceArea: number,
): { sellingPrice: number; propertyTransferDuties: number } => {
  const sellingPrice = surfaceArea * 150 * 0.38;
  const propertyTransferDuties = computePropertyTransferDutiesFromSellingPrice(sellingPrice);
  return { sellingPrice, propertyTransferDuties };
};
