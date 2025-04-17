/* eslint-disable no-case-declarations */
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { CreateUserUseCase } from "src/auth/core/createUser.usecase";

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
import {
  VERIFIED_EMAIL_REPOSITORY_TOKEN,
  VerifiedEmailRepository,
} from "./verified-email-repository/VerifiedEmailRepository";

declare module "express-session" {
  interface SessionData {
    nonce?: string;
    state?: string;
    postLoginRedirectUrl?: string;
  }
}

export const registerUserBodySchema = z.object({
  id: z.uuid(),
  email: z.email(),
  firstname: z.string(),
  lastname: z.string(),
  structureType: z.string(),
  structureActivity: z.string(),
  structureName: z.string().optional(),
  personalDataStorageConsented: z.literal(true),
  personalDataAnalyticsUseConsented: z.boolean(),
  personalDataCommunicationUseConsented: z.boolean(),
  // todo: delete when the demo app is removed
  createdFrom: z.enum(["demo_app", "features_app"]),
});

export class RegisterUserBodyDto extends createZodDto(registerUserBodySchema) {}

@Controller("auth")
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(ACCESS_TOKEN_SERVICE)
    private readonly accessTokenService: AccessTokenService,
    private readonly configService: ConfigService,
    @Inject(AUTH_USER_REPOSITORY_TOKEN)
    private readonly usersRepository: AuthUserRepository,
    @Inject(PRO_CONNECT_CLIENT_INJECTION_TOKEN)
    private readonly oidcLogin: ProConnectClient,
    @Inject(EXTERNAL_USER_IDENTITIES_REPOSITORY_INJECTION_TOKEN)
    private readonly externalUserIdentitiesRepository: ExternalUserIdentityRepository,
    @Inject(VERIFIED_EMAIL_REPOSITORY_TOKEN)
    private readonly verifiedEmailRepository: VerifiedEmailRepository,
  ) {}

  @Post("/register")
  async createUser(@Body() createUserDto: RegisterUserBodyDto, @Res() response: Response) {
    const result = await this.createUserUseCase.execute({
      user: createUserDto,
    });

    if (!result.success) {
      switch (result.error) {
        case "UserEmailAlreadyExists":
          throw new ConflictException({
            error: "EMAIL_ALREADY_EXISTS",
            message: "Email already taken",
          });
        case "PersonalDataStorageNotConsented":
          throw new BadRequestException({
            error: "PERSONAL_DATA_STORAGE_NOT_CONSENTED",
            message: "Personal data storage not consented",
          });
      }
    }

    const accessToken = await this.accessTokenService.signAsync({
      sub: createUserDto.id,
      email: createUserDto.email,
      authProvider: "benefriches",
    });

    const decodedAccessToken = this.accessTokenService.decode<{
      exp: number;
    }>(accessToken);

    const accessTokenExpiryInMs = (decodedAccessToken?.exp ?? 0) * 1000;
    response.cookie(ACCESS_TOKEN_COOKIE_KEY, accessToken, {
      httpOnly: true,
      secure: this.configService.get("NODE_ENV") === "production",
      expires: new Date(accessTokenExpiryInMs),
    });

    return response.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  }

  @Get("/login/pro-connect")
  async login(@Req() req: Request, @Res() res: Response) {
    const { authorizationUrl, nonce, state } = await this.oidcLogin.getAuthorizationUrl(
      this.configService.getOrThrow<string>("PRO_CONNECT_LOGIN_CALLBACK_URL"),
    );

    // in case of a silent login, for instance after account creation
    if (req.query.noPrompt) {
      authorizationUrl.searchParams.set("prompt", "none");
    }

    req.session.nonce = nonce;
    req.session.state = state;
    if (req.query.redirectTo) {
      req.session.postLoginRedirectUrl = req.query.redirectTo as string;
    }

    res.redirect(authorizationUrl.toString());
  }

  @Get("/login-callback/pro-connect")
  async proConnectLoginCallback(@Req() req: Request, @Res() res: Response) {
    const expectedState = req.session.state;
    const expectedNonce = req.session.nonce;

    if (!expectedState || !expectedNonce) {
      throw new BadRequestException("Missing expected state or nonce");
    }

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

    const isEmailVerified = await this.verifiedEmailRepository.isVerified(oidcIdentity.email);
    if (!isEmailVerified) {
      await this.verifiedEmailRepository.save(oidcIdentity.email, new Date());
    }

    const accessToken = await this.accessTokenService.signAsync({
      sub: userInDb.id,
      email: userInDb.email,
      authProvider: "pro-connect",
      authProviderIdToken: oidcIdentity.idToken,
    });

    const decodedAccessToken = this.accessTokenService.decode<{
      exp: number;
    }>(accessToken);

    res.cookie(ACCESS_TOKEN_COOKIE_KEY, accessToken, {
      httpOnly: true,
      secure: this.configService.get("NODE_ENV") === "production",
      expires: new Date((decodedAccessToken?.exp ?? 0) * 1000),
    });

    const redirectTo =
      req.session.postLoginRedirectUrl ?? this.configService.getOrThrow<string>("WEBAPP_URL");
    res.redirect(redirectTo);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async me(@Req() req: Request, @Res() res: Response) {
    const { accessTokenPayload } = req;
    if (!accessTokenPayload) throw new UnauthorizedException();

    const authenticatedUser = await this.usersRepository.getWithId(accessTokenPayload.userId);

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

  @UseGuards(JwtAuthGuard)
  @Get("logout")
  async logout(@Req() req: Request, @Res() res: Response) {
    const { accessTokenPayload } = req;
    if (!accessTokenPayload) throw new UnauthorizedException();

    switch (accessTokenPayload.authProvider) {
      case "pro-connect":
        const state = randomUUID();
        req.session.state = state;
        const providerIdToken = accessTokenPayload.authProviderTokenId;
        const providerLogoutUrl = await this.oidcLogin.getLogoutUrl({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          idToken: providerIdToken!,
          postLogoutRedirectUri: this.configService.getOrThrow<string>("AUTH_LOGOUT_CALLBACK_URL"),
          state,
        });
        res.redirect(providerLogoutUrl.toString());
        break;
      default:
        res.redirect(this.configService.getOrThrow<string>("AUTH_LOGOUT_CALLBACK_URL"));
        break;
    }
  }

  @Get("logout-callback")
  logoutCallback(@Req() req: Request, @Res() res: Response) {
    if (req.query.state && req.query.state !== req.session.state) {
      throw new BadRequestException("Invalid state");
    }

    res.clearCookie(ACCESS_TOKEN_COOKIE_KEY);
    res.redirect(this.configService.getOrThrow<string>("WEBAPP_URL"));
  }
}
