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

const mapToSqlRow = (
  evaluation: ReconversionCompatibilityEvaluation,
): Tables["reconversion_compatibility_evaluations"] => ({
  id: evaluation.id,
  created_by: evaluation.createdBy,
  status: evaluation.status,
  mutafriches_evaluation_id: evaluation.mutafrichesEvaluationId,
  created_at: evaluation.createdAt,
  completed_at: evaluation.completedAt,
  // we need to convert to string because of how PG works with arrays
  // see https://knexjs.org/guide/schema-builder.html#json
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  project_creations: JSON.stringify(
    evaluation.projectCreations.map((pc) => ({
      reconversionProjectId: pc.reconversionProjectId,
      createdAt: pc.createdAt.toISOString(),
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any,
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
    await this.sqlConnection("reconversion_compatibility_evaluations")
      .insert(mapToSqlRow(evaluation))
      .onConflict("id")
      .merge();
  }

  async getById(id: string): Promise<ReconversionCompatibilityEvaluation | undefined> {
    const result = await this.sqlConnection("reconversion_compatibility_evaluations")
      .select("*")
      .where({ id })
      .first();

    if (!result) return undefined;

    return mapToEntity(result);
  }
}
