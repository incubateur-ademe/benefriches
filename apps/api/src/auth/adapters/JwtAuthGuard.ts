import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

import { ACCESS_TOKEN_SERVICE, AccessTokenService } from "./AccessTokenService";
import { ACCESS_TOKEN_COOKIE_KEY } from "./accessTokenCookie";

declare module "express" {
  interface Request {
    authenticatedUser?: { id: string; email: string };
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(ACCESS_TOKEN_SERVICE) private readonly accessTokenService: AccessTokenService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = (request.cookies as { [ACCESS_TOKEN_COOKIE_KEY]?: string })[
      ACCESS_TOKEN_COOKIE_KEY
    ];

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.accessTokenService.verifyAsync<{ sub: string; email: string }>(
        token,
        { secret: this.configService.getOrThrow<string>("AUTH_JWT_SECRET") },
      );
      request.authenticatedUser = {
        id: payload.sub,
        email: payload.email,
      };
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
