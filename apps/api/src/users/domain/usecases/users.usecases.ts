import z from "zod";
import { UuidGenerator } from "../gateways/UuidGenerator";
import { UserRepository } from "../gateways/UserRepository";
import { UseCase } from "../../../shared-kernel/usecase";

export namespace CreateUser {
  export type Request = { email: string; password: string };
  export type Response = void;
}

export class CreateUserUseCase
  implements UseCase<CreateUser.Request, CreateUser.Response>
{
  constructor(
    private uuidGenerator: UuidGenerator,
    private userRepository: UserRepository,
  ) {}

  async execute({ email, password }: CreateUser.Request) {
    if (!email) throw new Error("Email is required");

    const validEmail = z
      .string()
      .email({ message: "Email is invalid" })
      .parse(email);
    if (!password) throw new Error("Password is required");
    const validPassword = z
      .string()
      .min(12, "Password should be 12 or more characters")
      .parse(password);

    const userExistsWithEmail = !!(await this.userRepository.existsWithEmail(
      email,
    ));
    if (userExistsWithEmail) throw new Error("Given email already exists");

    this.userRepository.save({
      email: email,
      password: password,
      id: this.uuidGenerator.generate(),
    });
  }
}
