import { HashGenerator } from "../../domain/gateways/HashGenerator";

export class DeterministicHashGenerator implements HashGenerator {
  constructor(private readonly hashPrefix: string) {}

  generate(input: string) {
    return Promise.resolve(`${this.hashPrefix}:${input}`);
  }
}
