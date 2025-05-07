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
import * as oidcClient from "openid-client";

import { ACCESS_TOKEN_SERVICE, AccessTokenService } from "./AccessTokenService";
import { JwtAuthGuard } from "./JwtAuthGuard";
import { getProConnectOidcConfig } from "./ProConnectOidcConfig";
import { ACCESS_TOKEN_COOKIE_KEY } from "./accessTokenCookie";

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
  ) {}

  @Get("/login/pro-connect")
  async login(@Req() req: Request, @Res() res: Response) {
    const proConnectOidcConfig = await getProConnectOidcConfig({
      providerDomain: this.configService.getOrThrow<string>("PRO_CONNECT_PROVIDER_DOMAIN"),
      clientId: this.configService.getOrThrow<string>("PRO_CONNECT_CLIENT_ID"),
      clientSecret: this.configService.getOrThrow<string>("PRO_CONNECT_CLIENT_SECRET"),
    });

    const nonce = oidcClient.randomNonce();
    const state = oidcClient.randomState();

    req.session.nonce = nonce;
    req.session.state = state;

    const redirectUrl = oidcClient.buildAuthorizationUrl(
      proConnectOidcConfig,
      new URLSearchParams({
        nonce,
        state,
        response_type: "code",
        redirect_uri: this.configService.getOrThrow<string>("PRO_CONNECT_LOGIN_CALLBACK_URL"),
        scope: "openid uid given_name usual_name email siret",
        acr_values: "eidas1",
      }),
    );

    res.redirect(redirectUrl.toString());
  }

  @Get("/login-callback/pro-connect")
  async proConnectLoginCallback(@Req() req: Request, @Res() res: Response) {
    const proConnectOidcConfig = await getProConnectOidcConfig({
      providerDomain: this.configService.getOrThrow<string>("PRO_CONNECT_PROVIDER_DOMAIN"),
      clientId: this.configService.getOrThrow<string>("PRO_CONNECT_CLIENT_ID"),
      clientSecret: this.configService.getOrThrow<string>("PRO_CONNECT_CLIENT_SECRET"),
    });

    const expectedState = req.session.state;
    const expectedNonce = req.session.nonce;

    if (!expectedState || !expectedNonce)
      throw new BadRequestException("Missing expected state or nonce");

    const currentUrl = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);

    // exchange received authorization code for tokens
    const tokens = await oidcClient.authorizationCodeGrant(proConnectOidcConfig, currentUrl, {
      expectedState,
      expectedNonce,
    });

    req.session.nonce = undefined;
    req.session.state = undefined;

    const claims = tokens.claims();

    if (!claims) throw new BadRequestException("Missing claims");

    const userInfo = await oidcClient.fetchUserInfo(
      proConnectOidcConfig,
      tokens.access_token,
      claims.sub,
    );

    // TODO
    // if user email exists in database
    //     if no record of user id in federated_credentials table, create one {userId, provider: "pro-connect", subject: claims.sub}
    // else
    //    fetch user collectivité or company information
    //    create user in database
    //    create federated_credentials entry in db {userId, provider: "pro-connect", subject: claims.sub}

    const accessToken = await this.accessTokenService.signAsync({
      sub: userInfo.sub,
      email: userInfo.email,
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
