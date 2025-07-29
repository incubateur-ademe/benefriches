import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

import { ACCESS_TOKEN_SERVICE, AccessTokenService } from "./access-token/AccessTokenService";
import { ACCESS_TOKEN_COOKIE_KEY } from "./access-token/accessTokenCookie";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  authProvider: string;
  authProviderIdToken?: string;
};

declare module "express" {
  interface Request {
    accessTokenPayload?: {
      userId: string;
      userEmail: string;
      authProvider: string;
      authProviderTokenId: string | undefined;
    };
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
      const jwtSecret = this.configService.getOrThrow<string>("AUTH_JWT_SECRET");
      const payload = await this.accessTokenService.verifyAsync<AccessTokenPayload>(token, {
        secret: jwtSecret,
      });

      request.accessTokenPayload = {
        userId: payload.sub,
        userEmail: payload.email,
        authProvider: payload.authProvider,
        authProviderTokenId: payload.authProviderIdToken,
      };
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
