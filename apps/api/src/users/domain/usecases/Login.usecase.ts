import { UseCase } from "../../../shared-kernel/usecase";
import { HashGenerator } from "../gateways/HashGenerator";
import { AccessTokenService } from "../gateways/AccessTokenService";
import { UserRepository } from "../gateways/UserRepository";

type Request = {
  email: string;
  password: string;
};

type Response = string;

export class LoginUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashGenerator: HashGenerator,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  async execute({ email, password }: Request): Promise<Response> {
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");

    const user = await this.userRepository.getWithEmail(email);
    if (!user) throw new Error("User not found");

    const isPasswordRight = await this.hashGenerator.compare(
      password,
      user.password,
    );
    if (!isPasswordRight) throw new Error("Wrong password");

    const accessJwt = await this.accessTokenService.sign(user.email);
    return accessJwt;
  }
}
