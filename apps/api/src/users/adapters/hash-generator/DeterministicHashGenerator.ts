import { HashGenerator } from "../../domain/gateways/HashGenerator";

export class DeterministicHashGenerator implements HashGenerator {
  constructor(private hashPrefix: string) {}

  async generate(input: string) {
    return `${this.hashPrefix}:${input}`;
  }
}
