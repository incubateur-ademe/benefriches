import { JwtSignOptions } from "@nestjs/jwt";

export const ACCESS_TOKEN_SERVICE_INJECTION_TOKEN = Symbol("AccessTokenService");

export interface AccessTokenService {
  signAsync(payload: object | string, options?: JwtSignOptions): Promise<string>;
  // oxlint-disable-next-line typescript/no-unnecessary-type-parameters
  decode<TToken extends object>(token: string): TToken | null;
  verifyAsync<TPayload extends object>(
    token: string,
    options: { secret: string },
  ): Promise<TPayload>;
}
