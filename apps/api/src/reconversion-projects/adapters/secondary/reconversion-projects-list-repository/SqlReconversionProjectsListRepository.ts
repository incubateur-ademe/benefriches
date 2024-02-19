import { Knex } from "knex";
import {
  ReconversionProjectsGroupedBySite,
  ReconversionProjectsListRepository,
} from "src/reconversion-projects/domain/usecases/getReconversionProjectsBySite.usecase";

export class SqlReconversionProjectsListRepository implements ReconversionProjectsListRepository {
  constructor(private readonly sqlConnection: Knex) {}
  async getGroupedBySite(): Promise<ReconversionProjectsGroupedBySite> {
    const result = (await this.sqlConnection("sites")
      .leftJoin("reconversion_projects as rp", "sites.id", "=", "rp.related_site_id")
      .select(
        "sites.id as siteId",
        "sites.name as siteName",
        this.sqlConnection.raw(`
        CASE 
          WHEN count(rp.id) = 0 THEN '[]'::json
          ELSE json_agg(json_build_object('id', rp.id, 'name', rp.name)) 
        END as "reconversionProjects"`),
      )
      .groupBy("sites.id")) as {
      siteId: string;
      siteName: string;
      reconversionProjects: { id: string; name: string }[];
    }[];

    return result;
  }
}
