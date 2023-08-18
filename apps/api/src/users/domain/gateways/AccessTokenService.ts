export interface AccessTokenService {
  sign(payload: object | string): Promise<string>;
}
