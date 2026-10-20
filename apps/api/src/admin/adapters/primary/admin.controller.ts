import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  type AdminUserIdParam,
  adminUserIdParamSchema,
  type GetAdminDashboardStatsResponseDto,
  type GetAdminUserResponseDto,
  type ListAdminUsersRequestDto,
  listAdminUsersRequestDtoSchema,
  type ListAdminUsersResponseDto,
} from "shared";

import { GetAdminDashboardStatsUseCase } from "src/admin/core/usecases/getAdminDashboardStats.usecase";
import { GetAdminUserActivityUseCase } from "src/admin/core/usecases/getAdminUserActivity.usecase";
import { ListAdminUsersUseCase } from "src/admin/core/usecases/listAdminUsers.usecase";
import { AdminGuard } from "src/auth/adapters/AdminGuard";

@Controller("admin")
@UseGuards(AdminGuard)
export class AdminController {
  private readonly getAdminDashboardStatsUseCase: GetAdminDashboardStatsUseCase;
  private readonly listAdminUsersUseCase: ListAdminUsersUseCase;
  private readonly getAdminUserActivityUseCase: GetAdminUserActivityUseCase;

  constructor(
    getAdminDashboardStatsUseCase: GetAdminDashboardStatsUseCase,
    listAdminUsersUseCase: ListAdminUsersUseCase,
    getAdminUserActivityUseCase: GetAdminUserActivityUseCase,
  ) {
    this.getAdminDashboardStatsUseCase = getAdminDashboardStatsUseCase;
    this.listAdminUsersUseCase = listAdminUsersUseCase;
    this.getAdminUserActivityUseCase = getAdminUserActivityUseCase;
  }

  @Get("stats")
  async getStats(): Promise<GetAdminDashboardStatsResponseDto> {
    const result = await this.getAdminDashboardStatsUseCase.execute();

    if (result.isFailure()) {
      throw new InternalServerErrorException({
        message: "Unexpected Internal Error",
      });
    }

    return result.getData();
  }

  @Get("users")
  async listUsers(
    @Query({ schema: listAdminUsersRequestDtoSchema })
    query: ListAdminUsersRequestDto,
  ): Promise<ListAdminUsersResponseDto> {
    const result = await this.listAdminUsersUseCase.execute(query);

    if (result.isFailure()) {
      throw new InternalServerErrorException({
        message: "Unexpected Internal Error",
      });
    }

    return result.getData();
  }

  @Get("users/:userId")
  async getUser(
    @Param("userId", { schema: adminUserIdParamSchema })
    userId: AdminUserIdParam,
  ): Promise<GetAdminUserResponseDto> {
    const result = await this.getAdminUserActivityUseCase.execute({ userId });

    if (result.isFailure()) {
      switch (result.getError()) {
        case "UserNotFound":
          throw new NotFoundException({
            code: "UserNotFound",
            message: "User not found",
          });
      }
    }

    return result.getData();
  }
}
