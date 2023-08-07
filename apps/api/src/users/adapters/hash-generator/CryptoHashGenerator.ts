import bcrypt from "bcrypt";
import { HashGenerator } from "../../domain/gateways/HashGenerator";

export class CryptoHashGenerator implements HashGenerator {
  constructor(private readonly saltRounds: number) {}

  async generate(input: string) {
    const hash = await bcrypt.hash(input, this.saltRounds);
    return hash;
  }
}
