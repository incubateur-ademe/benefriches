import { UseCase } from "../../../shared-kernel/usecase";
import { HashGenerator } from "../gateways/HashGenerator";
import { UserRepository } from "../gateways/UserRepository";
import { UuidGenerator } from "../gateways/UuidGenerator";
import { EmailAddress } from "../models/emailAddress";
import { Password } from "../models/password";
import { User } from "../models/user";

type Request = {
  email: string;
  password: string;
};

export class CreateUserUseCase implements UseCase<Request, void> {
  constructor(
    private readonly uuidGenerator: UuidGenerator,
    private readonly userRepository: UserRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute(userProps: Request) {
    if (!userProps.email) throw new Error("Email is required");
    if (!userProps.password) throw new Error("Password is required");

    const email = EmailAddress.create(userProps.email);
    const password = Password.create(userProps.password);
    const passwordHash = await this.hashGenerator.generate(password.getValue());
    const user = User.create({
      id: this.uuidGenerator.generate(),
      email,
      password: passwordHash,
    });

    const userExistsWithEmail = !!(await this.userRepository.existsWithEmail(
      email.getValue(),
    ));
    if (userExistsWithEmail) throw new Error("Given email already exists");

    await this.userRepository.save(user);
  }
}
