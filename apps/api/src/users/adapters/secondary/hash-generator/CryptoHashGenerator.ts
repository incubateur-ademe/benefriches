import bcrypt from "bcrypt";
import { HashGenerator } from "src/users/domain/gateways/HashGenerator";

export class CryptoHashGenerator implements HashGenerator {
  constructor(private readonly saltRounds: number = 10) {}

  async generate(input: string) {
    const hash = await bcrypt.hash(input, this.saltRounds);
    return hash;
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}
