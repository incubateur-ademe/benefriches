import { Controller, Get, HttpStatus, Inject, Res } from "@nestjs/common";
import type { Response } from "express";
import type { Knex } from "knex";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

type HealthStatus = "healthy" | "unhealthy";
type DatabaseStatus = "connected" | "disconnected";

type HealthCheckResponse = {
  status: HealthStatus;
  timestamp: string;
  checks: {
    database: DatabaseStatus;
  };
};

@Controller("healthcheck")
export class HealthCheckController {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  @Get()
  async getHealthcheck(@Res() res: Response): Promise<Response<HealthCheckResponse>> {
    const timestamp = new Date().toISOString();

    try {
      await this.sqlConnection.raw("SELECT 1");

      const response: HealthCheckResponse = {
        status: "healthy",
        timestamp,
        checks: {
          database: "connected",
        },
      };

      return res.status(HttpStatus.OK).json(response);
    } catch {
      const response: HealthCheckResponse = {
        status: "unhealthy",
        timestamp,
        checks: {
          database: "disconnected",
        },
      };

      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json(response);
    }
  }
}
