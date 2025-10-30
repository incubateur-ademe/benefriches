import {
  ReconversionProjectInput,
  ReconversionProjectUpdateInput,
} from "../model/reconversionProject";

export interface ReconversionProjectRepository {
  existsWithId(id: string): Promise<boolean>;
  getById(id: string): Promise<ReconversionProjectInput | null>;
  save(reconversionProject: ReconversionProjectInput): Promise<void>;
  update(reconversionProject: ReconversionProjectUpdateInput): Promise<void>;
}
