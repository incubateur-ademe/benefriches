export interface UserRepository {
  existsWithEmail(email: string): Promise<boolean>;
}
