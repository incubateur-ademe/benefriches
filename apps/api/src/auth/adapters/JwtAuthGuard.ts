import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

import {
  ACCESS_TOKEN_SERVICE_INJECTION_TOKEN,
  type AccessTokenService,
} from "./access-token/AccessTokenService";
import { readAccessTokenCookie } from "./access-token/accessTokenCookie";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  authProvider: string;
  authProviderIdToken?: string;
};

export interface RequestWithAuthenticatedUser extends Request {
  accessTokenPayload: {
    userId: string;
    userEmail: string;
    authProvider: string;
    authProviderTokenId: string | undefined;
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly accessTokenService: AccessTokenService;
  private readonly configService: ConfigService;
  constructor(
    @Inject(ACCESS_TOKEN_SERVICE_INJECTION_TOKEN) accessTokenService: AccessTokenService,
    configService: ConfigService,
  ) {
    this.accessTokenService = accessTokenService;
    this.configService = configService;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = readAccessTokenCookie(request);

    if (!token) throw new UnauthorizedException();

    try {
      const jwtSecret = this.configService.getOrThrow<string>("AUTH_JWT_SECRET");
      const payload = await this.accessTokenService.verifyAsync<AccessTokenPayload>(token, {
        secret: jwtSecret,
      });

      (request as RequestWithAuthenticatedUser).accessTokenPayload = {
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
