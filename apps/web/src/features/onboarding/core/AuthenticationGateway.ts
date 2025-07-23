export interface AuthenticationGateway {
  requestLink(email: string): Promise<void>;
  authenticateWithToken(token: string): Promise<void>;
}
