export const ACCESS_TOKEN_SERVICE = Symbol("AccessTokenService");

export interface AccessTokenService {
  signAsync(payload: object | string): Promise<string>;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  decode<TToken extends object>(token: string): TToken | null;
  verifyAsync<TPayload extends object>(
    token: string,
    options: { secret: string },
  ): Promise<TPayload>;
}
