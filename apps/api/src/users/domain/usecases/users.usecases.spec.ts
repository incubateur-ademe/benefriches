import { InMemoryUserRepository } from "../../adapters/user-repository/InMemoryUserRepository";
import { DeterministicUiidGenerator } from "../../adapters/uuid-generator/DeterministicUuidGenerator";
import { UuidGenerator } from "../gateways/UuidGenerator";
import { CreateUserUseCase } from "./users.usecases";

describe("Register", () => {
  let uuidGenerator: UuidGenerator;
  let inMemoryUserRepository: InMemoryUserRepository;
  const fakeUuid = "608fb1d0-23be-4885-a0e7-b02e3c8c796f";

  beforeEach(() => {
    uuidGenerator = new DeterministicUiidGenerator(fakeUuid);
    inMemoryUserRepository = new InMemoryUserRepository();
  });

  test("User account creation : check password", async () => {
    const usecase = new CreateUserUseCase(
      uuidGenerator,
      inMemoryUserRepository,
    );
    expect(() =>
      //@ts-expect-error
      usecase.execute({ email: "test@beta.gouv.fr" }),
    ).rejects.toThrow("Password is required");
  });

  test("Cannot create account without email", async () => {
    const usecase = new CreateUserUseCase(
      uuidGenerator,
      inMemoryUserRepository,
    );
    //@ts-expect-error
    expect(() => usecase.execute({})).rejects.toThrow("Email is required");
  });

  test("Cannot create account with invalid email", async () => {
    const usecase = new CreateUserUseCase(
      uuidGenerator,
      inMemoryUserRepository,
    );
    expect(() =>
      usecase.execute({ email: "invalid-email", password: "mypasword" }),
    ).rejects.toThrow("Email is invalid");
  });

  test("Cannot create account with password too short", async () => {
    const usecase = new CreateUserUseCase(
      uuidGenerator,
      inMemoryUserRepository,
    );
    expect(() =>
      usecase.execute({ email: "test@beta.gouv.fr", password: "mypasword" }),
    ).rejects.toThrow("Password should be 12 or more characters");
  });

  test("Cannot create account when email already exists", async () => {
    const email = "user@beta.gouv.fr";
    const user = { email, password: "mypassword123456789", id: fakeUuid };
    inMemoryUserRepository._setUsers([user]);
    const usecase = new CreateUserUseCase(
      uuidGenerator,
      inMemoryUserRepository,
    );
    expect(() =>
      usecase.execute({ email, password: "mypassword123456789" }),
    ).rejects.toThrow("Given email already exists");
  });

  test("User is persisted when create user is successful", async () => {
    const email = "user@beta.gouv.fr";
    const usecase = new CreateUserUseCase(
      uuidGenerator,
      inMemoryUserRepository,
    );
    await usecase.execute({ email, password: "mypassword123456789" });
    expect(inMemoryUserRepository._getUsers()).toEqual([
      {
        email: "user@beta.gouv.fr",
        password: "mypassword123456789",
        id: fakeUuid,
      },
    ]);
  });
});
