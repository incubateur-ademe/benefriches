import bcrypt from "bcrypt";
import { HashGenerator } from "src/users/domain/gateways/HashGenerator";

const SALT_ROUNDS = 10;

export class CryptoHashGenerator implements HashGenerator {
  async generate(input: string) {
    const hash = await bcrypt.hash(input, SALT_ROUNDS);
    return hash;
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}
