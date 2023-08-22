import { DeterministicHashGenerator } from "src/users/adapters/secondary/hash-generator/DeterministicHashGenerator";
import { InMemoryUserRepository } from "src/users/adapters/secondary/user-repository/InMemoryUserRepository";
import { AccessTokenService } from "src/users/domain/gateways/AccessTokenService";
import { EmailAddress } from "src/users/domain/models/emailAddress";
import { User } from "src/users/domain/models/user";
import { LoginUseCase } from "./Login.usecase";

describe("Login Use Case", () => {
  let userRepository: InMemoryUserRepository;
  let hashGenerator: DeterministicHashGenerator;
  let accessTokenService: AccessTokenService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    hashGenerator = new DeterministicHashGenerator("hashed");
    accessTokenService = {
      sign() {
        return Promise.resolve("signed-jwt-token");
      },
    };
  });

  test("Cannot login without email", async () => {
    const usecase = new LoginUseCase(
      userRepository,
      hashGenerator,
      accessTokenService,
    );
    //@ts-expect-error nothing passed to execute
    await expect(usecase.execute({})).rejects.toThrow("Email is required");
  });

  test("Cannot login without password", async () => {
    const usecase = new LoginUseCase(
      userRepository,
      hashGenerator,
      accessTokenService,
    );
    const email = "user@beta.gouv.fr";
    //@ts-expect-error no password passed to execute
    await expect(usecase.execute({ email })).rejects.toThrow(
      "Password is required",
    );
  });

  test("Cannot login if user does not exist", async () => {
    const usecase = new LoginUseCase(
      userRepository,
      hashGenerator,
      accessTokenService,
    );
    const userCredentials = {
      email: "user@beta.gouv.fr",
      password: "my-strong-passw0rd",
    };
    await expect(usecase.execute(userCredentials)).rejects.toThrow(
      "User not found",
    );
  });

  test("Cannot login if password is wrong", async () => {
    const user = User.create({
      id: "608fb1d0-23be-4885-a0e7-b02e3c8c796f",
      email: EmailAddress.create("user@beta.gouv.fr"),
      password: "hashed:my-strong-passw0rd",
    });
    userRepository._setUsers([user]);

    const loginRequest = {
      email: "user@beta.gouv.fr",
      password: "another-password",
    };
    const usecase = new LoginUseCase(
      userRepository,
      hashGenerator,
      accessTokenService,
    );
    await expect(usecase.execute(loginRequest)).rejects.toThrow(
      "Wrong password",
    );
  });

  test("Can login", async () => {
    const password = "my-strong-passw0rd";
    const hashedPassword = await hashGenerator.generate(password);
    const user = User.create({
      id: "608fb1d0-23be-4885-a0e7-b02e3c8c796f",
      email: EmailAddress.create("user@beta.gouv.fr"),
      password: hashedPassword,
    });
    userRepository._setUsers([user]);

    const loginRequest = { email: "user@beta.gouv.fr", password };
    const usecase = new LoginUseCase(
      userRepository,
      hashGenerator,
      accessTokenService,
    );
    const accessJwt = await usecase.execute(loginRequest);
    expect(accessJwt).toEqual("signed-jwt-token");
  });
});
