import { EmailAddress } from "./emailAddress";

type UserProps = {
  id: string;
  email: EmailAddress;
  password: string;
};

export class User {
  private constructor(
    readonly id: string,
    readonly email: string,
    readonly password: string,
  ) {}

  static create({ id, email, password }: UserProps): User {
    return new User(id, email.getValue(), password);
  }
}
