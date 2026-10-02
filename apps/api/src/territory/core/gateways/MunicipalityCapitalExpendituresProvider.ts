export type CapitalExpendituresResult = {
  amount: number;
  referenceYear: string;
};

export interface MunicipalityCapitalExpendituresProvider {
  getLastReferenceYear(cityCode: string): Promise<CapitalExpendituresResult>;
}
