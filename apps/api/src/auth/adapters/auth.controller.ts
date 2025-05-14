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
  ) {}

  @Get("/login/pro-connect")
  async login(@Req() req: Request, @Res() res: Response) {
    const { authorizationUrl, nonce, state } = await this.oidcLogin.getAuthorizationUrl(
      this.configService.getOrThrow<string>("PRO_CONNECT_LOGIN_CALLBACK_URL"),
    );

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

    const userIdentity = await this.oidcLogin.fetchUserIdentity({
      expectedState,
      expectedNonce,
      currentUrl,
    });

    // TODO
    // if user email exists in database
    if (await this.usersRepository.existsWithEmail(userIdentity.email)) {
      console.log("exists in DB");
    }
    console.log({ userIdentity });
    //     if no record of user id in federated_credentials table, create one {userId, provider: "pro-connect", subject: claims.sub}
    // else
    //    fetch user collectivité or company information
    //    create user in database
    //    create federated_credentials entry in db {userId, provider: "pro-connect", subject: claims.sub}

    const accessToken = await this.accessTokenService.signAsync({
      sub: userIdentity.id,
      email: userIdentity.email,
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
  me(@Req() req: Request, @Res() res: Response) {
    const { authenticatedUser } = req;
    if (!authenticatedUser) throw new UnauthorizedException();

    res.json({ id: authenticatedUser.id, email: authenticatedUser.email });
  }
}
