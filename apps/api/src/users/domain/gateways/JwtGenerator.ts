export interface JwtGenerator {
  sign(payload: object | string): Promise<string>;
}
