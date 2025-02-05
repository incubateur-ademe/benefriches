import { computePropertyTransferDutiesFromSellingPrice } from "../../financial";

export const computeDefaultSitePurchaseFromSiteSurfaceArea = (
  surfaceArea: number,
): { sellingPrice: number; propertyTransactionDuties: number } => {
  const sellingPrice = surfaceArea * 72;
  const propertyTransactionDuties = computePropertyTransferDutiesFromSellingPrice(sellingPrice);
  return { sellingPrice, propertyTransactionDuties };
};
