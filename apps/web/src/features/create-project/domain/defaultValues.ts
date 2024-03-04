// Droits de mutation par transaction  (Etat + département + collectivité territoriale)
const TRANSFER_TAX_PERCENT_PER_TRANSACTION = 0.0581;

export const computeTransferTaxFromSellingPrice = (sellingPrice: number) => {
  return Math.round(TRANSFER_TAX_PERCENT_PER_TRANSACTION * sellingPrice * 100) / 100;
};
