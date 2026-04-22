export type GetFricheInactionCostDto = {
  cout_annuel_securisation: number;
  cout_annuel_debarras_depot_illegal: number;
  description: string;
  commune_data?: {
    population: number;
    superficie: number;
    nom: string;
  };
};
