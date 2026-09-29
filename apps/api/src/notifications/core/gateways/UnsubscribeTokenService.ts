// Signs and verifies the token carried by the unsubscribe link of every lifecycle email.
// The token must never expire (a "your link has expired" page is not acceptable for an
// unsubscribe link), so the contract has no notion of time.
export interface UnsubscribeTokenService {
  sign(userId: string): string;
  // Returns the user id the token was signed for, or undefined when the token is invalid.
  verify(token: string): string | undefined;
}
