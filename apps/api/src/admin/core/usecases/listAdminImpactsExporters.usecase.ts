import type {
  ListAdminImpactsExportersRequestDto,
  ListAdminImpactsExportersResponseDto,
} from "shared";

import { success, type TResult } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

import type { AdminImpactsExportersQuery } from "../gateways/AdminImpactsExportersQuery";

export const ADMIN_IMPACTS_EXPORTERS_PAGE_SIZE = 25;

export class ListAdminImpactsExportersUseCase implements UseCase<
  ListAdminImpactsExportersRequestDto,
  TResult<ListAdminImpactsExportersResponseDto>
> {
  private readonly adminImpactsExportersQuery: AdminImpactsExportersQuery;

  constructor(adminImpactsExportersQuery: AdminImpactsExportersQuery) {
    this.adminImpactsExportersQuery = adminImpactsExportersQuery;
  }

  async execute({
    search,
    page,
  }: ListAdminImpactsExportersRequestDto): Promise<TResult<ListAdminImpactsExportersResponseDto>> {
    const { users, total } = await this.adminImpactsExportersQuery.list({
      search: search || undefined,
      page,
      pageSize: ADMIN_IMPACTS_EXPORTERS_PAGE_SIZE,
    });

    return success({
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        structureName: user.structureName,
        impactsExportsCount: user.impactsExportsCount,
        exportedProjectsCount: user.exportedProjectsCount,
        lastImpactsExportedAt: user.lastImpactsExportedAt.toISOString(),
      })),
      total,
      page,
      pageSize: ADMIN_IMPACTS_EXPORTERS_PAGE_SIZE,
    });
  }
}
