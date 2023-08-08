import { z } from "zod";
import { ValueObject } from "../../../shared-kernel/valueObject";

export class EmailAddress extends ValueObject<string> {
  static create(value: string) {
    return new EmailAddress(value);
  }

  validate(value: string) {
    z.string().email({ message: "Email is invalid" }).parse(value);
  }

  getValue(): string {
    return this.value;
  }
}
