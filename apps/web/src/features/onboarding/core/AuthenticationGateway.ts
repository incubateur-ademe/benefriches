export interface AuthenticationGateway {
  requestLink(email: string, postLoginRedirectTo: string | undefined): Promise<void>;
  authenticateWithToken(token: string): Promise<void>;
}
