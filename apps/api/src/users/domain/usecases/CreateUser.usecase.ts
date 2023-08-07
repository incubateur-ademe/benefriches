import z from "zod";
import { UuidGenerator } from "../gateways/UuidGenerator";
import { UserRepository } from "../gateways/UserRepository";
import { UseCase } from "../../../shared-kernel/usecase";
import { HashGenerator } from "../gateways/HashGenerator";

type Request = {
  email: string;
  password: string;
};

const PASSWORD_MIN_LENGTH = 12;

export class CreateUserUseCase implements UseCase<Request, void> {
  constructor(
    private readonly uuidGenerator: UuidGenerator,
    private readonly userRepository: UserRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({ email, password }: Request) {
    if (!email) throw new Error("Email is required");

    z.string().email({ message: "Email is invalid" }).parse(email);
    if (!password) throw new Error("Password is required");
    z.string()
      .min(PASSWORD_MIN_LENGTH, "Password should be 12 or more characters")
      .parse(password);

    const userExistsWithEmail = !!(await this.userRepository.existsWithEmail(
      email,
    ));
    if (userExistsWithEmail) throw new Error("Given email already exists");

    await this.userRepository.save({
      email: email,
      password: await this.hashGenerator.generate(password),
      id: this.uuidGenerator.generate(),
    });
  }
}
