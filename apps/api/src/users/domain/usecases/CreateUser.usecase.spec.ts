import { DeterministicHashGenerator } from "src/users/adapters/secondary/hash-generator/DeterministicHashGenerator";
import { InMemoryUserRepository } from "src/users/adapters/secondary/user-repository/InMemoryUserRepository";
import { DeterministicUiidGenerator } from "src/users/adapters/secondary/uuid-generator/DeterministicUuidGenerator";
import { HashGenerator } from "src/users/domain/gateways/HashGenerator";
import { UuidGenerator } from "src/users/domain/gateways/UuidGenerator";
import { CreateUserUseCase } from "./CreateUser.usecase";

describe("Register", () => {
  let uuidGenerator: UuidGenerator;
  let inMemoryUserRepository: InMemoryUserRepository;
  let hashGenerator: HashGenerator;
  const fakeUuid = "608fb1d0-23be-4885-a0e7-b02e3c8c796f";

  beforeEach(() => {
    uuidGenerator = new DeterministicUiidGenerator(fakeUuid);
    inMemoryUserRepository = new InMemoryUserRepository();
    hashGenerator = new DeterministicHashGenerator("hashed");
  });

  test("User account creation : check password", async () => {
    const usecase = new CreateUserUseCase(uuidGenerator, inMemoryUserRepository, hashGenerator);
    await expect(() =>
      //@ts-expect-error password is not passed to execute()
      usecase.execute({ email: "test@beta.gouv.fr" }),
    ).rejects.toThrow("Password is required");
  });

  test("Cannot create account without email", async () => {
    const usecase = new CreateUserUseCase(uuidGenerator, inMemoryUserRepository, hashGenerator);
    //@ts-expect-error nothing passed to execute()
    await expect(usecase.execute({})).rejects.toThrow("Email is required");
  });

  test("Cannot create account with invalid email", async () => {
    const usecase = new CreateUserUseCase(uuidGenerator, inMemoryUserRepository, hashGenerator);
    await expect(
      usecase.execute({ email: "invalid-email", password: "mypasword" }),
    ).rejects.toThrow("Email is invalid");
  });

  test("Cannot create account with password too short", async () => {
    const usecase = new CreateUserUseCase(uuidGenerator, inMemoryUserRepository, hashGenerator);
    await expect(
      usecase.execute({ email: "test@beta.gouv.fr", password: "mypasword" }),
    ).rejects.toThrow("Password should be 12 or more characters");
  });

  test("Cannot create account when email already exists", async () => {
    const email = "user@beta.gouv.fr";
    const user = { email, password: "mypassword123456789", id: fakeUuid };
    inMemoryUserRepository._setUsers([user]);
    const usecase = new CreateUserUseCase(uuidGenerator, inMemoryUserRepository, hashGenerator);
    await expect(usecase.execute({ email, password: "mypassword123456789" })).rejects.toThrow(
      "Given email already exists",
    );
  });

  test("User is persisted when create user is successful", async () => {
    const email = "user@beta.gouv.fr";
    const password = "mypassword123456789";
    const usecase = new CreateUserUseCase(uuidGenerator, inMemoryUserRepository, hashGenerator);
    await usecase.execute({ email, password });
    const [savedUser] = inMemoryUserRepository._getUsers();

    expect(savedUser.email).toEqual(email);
    expect(savedUser.id).toEqual(fakeUuid);
  });

  test("Should not store user's password", async () => {
    const email = "user@beta.gouv.fr";
    const password = "my-strong-password";
    const usecase = new CreateUserUseCase(uuidGenerator, inMemoryUserRepository, hashGenerator);
    await usecase.execute({ email, password });
    const [savedUser] = inMemoryUserRepository._getUsers();
    expect(savedUser.password).not.toEqual(password);
  });
});
