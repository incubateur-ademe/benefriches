export interface HashGenerator {
  generate(input: string): Promise<string>;
}
