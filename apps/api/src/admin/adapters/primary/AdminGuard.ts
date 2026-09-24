import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from "@nestjs/common";

import {
  ADMINISTRATOR_QUERY_INJECTION_TOKEN,
  type AdministratorQuery,
} from "src/admin/core/gateways/AdministratorQuery";
import { JwtAuthGuard, type RequestWithAuthenticatedUser } from "src/auth/adapters/JwtAuthGuard";

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly jwtAuthGuard: JwtAuthGuard;
  private readonly administratorQuery: AdministratorQuery;

  constructor(
    jwtAuthGuard: JwtAuthGuard,
    @Inject(ADMINISTRATOR_QUERY_INJECTION_TOKEN) administratorQuery: AdministratorQuery,
  ) {
    this.jwtAuthGuard = jwtAuthGuard;
    this.administratorQuery = administratorQuery;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // throws UnauthorizedException when the request is not authenticated
    await this.jwtAuthGuard.canActivate(context);

    const request: RequestWithAuthenticatedUser = context.switchToHttp().getRequest();
    const isAdmin = await this.administratorQuery.isAdministrator(
      request.accessTokenPayload.userId,
    );

    if (!isAdmin) throw new ForbiddenException();

    return true;
  }
}
