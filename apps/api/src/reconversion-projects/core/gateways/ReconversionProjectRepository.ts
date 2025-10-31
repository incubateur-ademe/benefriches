import {
  ReconversionProjectSaveDto,
  ReconversionProjectDataView,
  ReconversionProjectUpdateDto,
} from "../model/reconversionProject";

export interface ReconversionProjectRepository {
  existsWithId(id: string): Promise<boolean>;
  getById(id: string): Promise<ReconversionProjectDataView | null>;
  save(reconversionProject: ReconversionProjectSaveDto): Promise<void>;
  update(reconversionProject: ReconversionProjectUpdateDto): Promise<void>;
}
