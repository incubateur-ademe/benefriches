import { roundTo2Digits } from "../services";

// Droits de mutation par transaction  (Etat + département + collectivité territoriale)
export const TRANSFER_TAX_PERCENT_PER_TRANSACTION = 0.0581;

export const computePropertyTransferDutiesFromSellingPrice = (sellingPrice: number): number => {
  return roundTo2Digits(TRANSFER_TAX_PERCENT_PER_TRANSACTION * sellingPrice);
};
