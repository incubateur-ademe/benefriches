import type { ListAdminUsersRequestDto, ListAdminUsersResponseDto } from "shared";

import { success, type TResult } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

import type { AdminUsersQuery } from "../gateways/AdminUsersQuery";

export const ADMIN_USERS_PAGE_SIZE = 25;

export class ListAdminUsersUseCase implements UseCase<
  ListAdminUsersRequestDto,
  TResult<ListAdminUsersResponseDto>
> {
  private readonly adminUsersQuery: AdminUsersQuery;

  constructor(adminUsersQuery: AdminUsersQuery) {
    this.adminUsersQuery = adminUsersQuery;
  }

  async execute({
    search,
    page,
  }: ListAdminUsersRequestDto): Promise<TResult<ListAdminUsersResponseDto>> {
    const { users, total } = await this.adminUsersQuery.list({
      search: search || undefined,
      page,
      pageSize: ADMIN_USERS_PAGE_SIZE,
    });

    return success({
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        structureName: user.structureName,
        structureType: user.structureType,
        structureActivity: user.structureActivity,
        createdAt: user.createdAt.toISOString(),
        lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
      })),
      total,
      page,
      pageSize: ADMIN_USERS_PAGE_SIZE,
    });
  }
}
