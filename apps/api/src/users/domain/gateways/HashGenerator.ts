export interface HashGenerator {
  generate(input: string): Promise<string>;
  compare(plainText: string, hash: string): Promise<boolean>;
}
