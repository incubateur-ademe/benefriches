import { UseCase } from "src/shared-kernel/usecase";
import { AccessTokenService } from "src/users/domain/gateways/AccessTokenService";
import { HashGenerator } from "src/users/domain/gateways/HashGenerator";
import { UserRepository } from "src/users/domain/gateways/UserRepository";

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

    const accessJwt = await this.accessTokenService.sign({
      sub: user.id,
      id: user.id,
      email: user.email,
    });
    return accessJwt;
  }
}
