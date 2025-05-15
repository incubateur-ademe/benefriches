import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";

import { JwtAuthGuard } from "./JwtAuthGuard";
import { ACCESS_TOKEN_SERVICE, AccessTokenService } from "./access-token/AccessTokenService";
import { ACCESS_TOKEN_COOKIE_KEY } from "./access-token/accessTokenCookie";
import {
  AUTH_USER_REPOSITORY_TOKEN,
  AuthUserRepository,
} from "./auth-user-repository/AuthUsersRepository";
import {
  EXTERNAL_USER_IDENTITIES_REPOSITORY_INJECTION_TOKEN,
  ExternalUserIdentityRepository,
} from "./external-user-identities-repository/ExternalUserIdentitiesRepository";
import {
  PRO_CONNECT_CLIENT_INJECTION_TOKEN,
  ProConnectClient,
} from "./pro-connect/ProConnectClient";

declare module "express-session" {
  interface SessionData {
    nonce?: string;
    state?: string;
  }
}

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(ACCESS_TOKEN_SERVICE)
    private readonly accessTokenService: AccessTokenService,
    private readonly configService: ConfigService,
    @Inject(AUTH_USER_REPOSITORY_TOKEN)
    private readonly usersRepository: AuthUserRepository,
    @Inject(PRO_CONNECT_CLIENT_INJECTION_TOKEN)
    private readonly oidcLogin: ProConnectClient,
    @Inject(EXTERNAL_USER_IDENTITIES_REPOSITORY_INJECTION_TOKEN)
    private readonly externalUserIdentitiesRepository: ExternalUserIdentityRepository,
  ) {}

  @Get("/login/pro-connect")
  async login(@Req() req: Request, @Res() res: Response) {
    const { authorizationUrl, nonce, state } = await this.oidcLogin.getAuthorizationUrl(
      this.configService.getOrThrow<string>("PRO_CONNECT_LOGIN_CALLBACK_URL"),
    );

    // authorizationUrl.searchParams.set("prompt", "none");

    req.session.nonce = nonce;
    req.session.state = state;

    res.redirect(authorizationUrl.toString());
  }

  @Get("/login-callback/pro-connect")
  async proConnectLoginCallback(@Req() req: Request, @Res() res: Response) {
    const expectedState = req.session.state;
    const expectedNonce = req.session.nonce;

    if (!expectedState || !expectedNonce)
      throw new BadRequestException("Missing expected state or nonce");

    const callbackUrl = new URL(
      this.configService.getOrThrow<string>("PRO_CONNECT_LOGIN_CALLBACK_URL"),
    );
    // we use the origin defined in config because current url may be different due to reverse proxy
    const currentUrl = new URL(`${callbackUrl.origin}${req.originalUrl}`);

    req.session.nonce = undefined;
    req.session.state = undefined;

    const oidcIdentity = await this.oidcLogin.fetchUserIdentity({
      expectedState,
      expectedNonce,
      currentUrl,
    });

    // redirect new users to account creation page
    const userInDb = await this.usersRepository.getWithEmail(oidcIdentity.email);
    if (!userInDb) {
      const createAccountUrl = new URL(
        this.configService.getOrThrow<string>("AUTH_CREATE_USER_ACCOUNT_URL"),
      );
      createAccountUrl.searchParams.set("hintEmail", oidcIdentity.email);
      createAccountUrl.searchParams.set("hintFirstName", oidcIdentity.firstName);
      createAccountUrl.searchParams.set("hintLastName", oidcIdentity.lastName);
      res.redirect(createAccountUrl.toString());
      return;
    }
    const shouldCreateProConnectUserIdentity =
      !(await this.externalUserIdentitiesRepository.findByProviderUserId(
        "pro-connect",
        oidcIdentity.id,
      ));
    if (shouldCreateProConnectUserIdentity) {
      await this.externalUserIdentitiesRepository.save({
        id: oidcIdentity.id,
        userId: userInDb.id,
        provider: "pro-connect",
        providerUserId: oidcIdentity.id,
        createdAt: new Date(),
      });
    }

    const accessToken = await this.accessTokenService.signAsync({
      sub: userInDb.id,
      email: userInDb.email,
    });

    const decodedAccessToken = this.accessTokenService.decode<{
      exp: number;
    }>(accessToken);

    res.cookie(ACCESS_TOKEN_COOKIE_KEY, accessToken, {
      httpOnly: true,
      secure: this.configService.get("NODE_ENV") === "production",
      expires: new Date((decodedAccessToken?.exp ?? 0) * 1000),
    });
    res.redirect(this.configService.getOrThrow<string>("WEBAPP_URL"));
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async me(@Req() req: Request, @Res() res: Response) {
    const { authenticatedUser: userInJwt } = req;
    if (!userInJwt) throw new UnauthorizedException();

    const authenticatedUser = await this.usersRepository.getWithId(userInJwt.id);

    if (!authenticatedUser) throw new UnauthorizedException();

    res.json({
      id: authenticatedUser.id,
      email: authenticatedUser.email,
      firstName: authenticatedUser.firstName,
      lastName: authenticatedUser.lastName,
      structureType: authenticatedUser.structureType,
      structureActivity: authenticatedUser.structureActivity,
      structureName: authenticatedUser.structureName,
    });
  }
}
