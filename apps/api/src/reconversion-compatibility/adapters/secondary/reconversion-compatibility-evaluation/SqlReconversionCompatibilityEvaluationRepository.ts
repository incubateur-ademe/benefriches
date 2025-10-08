import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { Tables } from "knex/types/tables";

import { ReconversionCompatibilityEvaluationRepository } from "src/reconversion-compatibility/core/gateways/ReconversionCompatibilityEvaluationRepository";
import { ReconversionCompatibilityEvaluation } from "src/reconversion-compatibility/core/reconversionCompatibilityEvaluation";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

const mapToEntity = (
  row: Tables["reconversion_compatibility_evaluations"],
): ReconversionCompatibilityEvaluation => ({
  id: row.id,
  createdBy: row.created_by,
  status: row.status as ReconversionCompatibilityEvaluation["status"],
  mutafrichesEvaluationId: row.mutafriches_evaluation_id,
  createdAt: row.created_at,
  completedAt: row.completed_at,
  projectCreations: row.project_creations.map((pc) => ({
    reconversionProjectId: pc.reconversionProjectId,
    createdAt: new Date(pc.createdAt),
  })),
});

@Injectable()
export class SqlReconversionCompatibilityEvaluationRepository
  implements ReconversionCompatibilityEvaluationRepository
{
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async existsWithId(id: string): Promise<boolean> {
    const result = await this.sqlConnection("reconversion_compatibility_evaluations")
      .select("id")
      .where({ id })
      .first();

    return !!result;
  }

  async save(evaluation: ReconversionCompatibilityEvaluation): Promise<void> {
    await this.sqlConnection.raw(
      `INSERT INTO reconversion_compatibility_evaluations 
     (id, created_by, status, mutafriches_evaluation_id, created_at, completed_at, project_creations) 
     VALUES (?, ?, ?, ?, ?, ?, ?::jsonb)
     ON CONFLICT (id) 
     DO UPDATE SET 
       created_by = EXCLUDED.created_by,
       status = EXCLUDED.status,
       mutafriches_evaluation_id = EXCLUDED.mutafriches_evaluation_id,
       created_at = EXCLUDED.created_at,
       completed_at = EXCLUDED.completed_at,
       project_creations = EXCLUDED.project_creations`,
      [
        evaluation.id,
        evaluation.createdBy,
        evaluation.status,
        evaluation.mutafrichesEvaluationId,
        evaluation.createdAt,
        evaluation.completedAt,
        JSON.stringify(evaluation.projectCreations),
      ],
    );
  }

  async getById(id: string): Promise<ReconversionCompatibilityEvaluation | null> {
    const result = await this.sqlConnection("reconversion_compatibility_evaluations")
      .select("*")
      .where({ id })
      .first();

    if (!result) return null;

    return mapToEntity(result);
  }
}
