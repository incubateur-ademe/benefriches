import { z } from "zod";
import { ValueObject } from "../../../shared-kernel/valueObject";

export class Password extends ValueObject<string> {
  static readonly MINIMUM_LENGTH = 12;

  static create(value: string) {
    return new Password(value);
  }

  validate(value: string) {
    z.string()
      .min(Password.MINIMUM_LENGTH, "Password should be 12 or more characters")
      .parse(value);
  }

  getValue(): string {
    return this.value;
  }
}
