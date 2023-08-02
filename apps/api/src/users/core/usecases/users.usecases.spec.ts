import { InMemoryUserRepository } from "../../adapters/user-repository/InMemoryUserRepository";
import { DeterministicUiidGenerator } from "../../adapters/uuid-generator/DeterministicUuidGenerator";
import { CreateUser } from "./users.usecases";

describe("Register", () => {
  const fakeUuid = "608fb1d0-23be-4885-a0e7-b02e3c8c796f";
  const uuidGenerator = new DeterministicUiidGenerator(fakeUuid);
  const inMemoryUserRepository = new InMemoryUserRepository();

  test("User account creation", async () => {
    const usecase = new CreateUser(uuidGenerator, inMemoryUserRepository);
    expect(
      await usecase.execute("test@beta.gouv.fr", "mypassword123456789"),
    ).toEqual({
      email: "test@beta.gouv.fr",
      password: "mypassword123456789",
      id: fakeUuid,
    });
  });

  test("User account creation : check password", async () => {
    const usecase = new CreateUser(uuidGenerator, inMemoryUserRepository);
    //@ts-expect-error
    expect(() => usecase.execute("test@beta.gouv.fr")).rejects.toThrow(
      "Password is required",
    );
  });

  test("Cannot create account without email", async () => {
    const usecase = new CreateUser(uuidGenerator, inMemoryUserRepository);
    //@ts-expect-error
    expect(() => usecase.execute(null)).rejects.toThrow("Email is required");
  });

  test("Cannot create account with invalid email", async () => {
    const usecase = new CreateUser(uuidGenerator, inMemoryUserRepository);
    expect(() => usecase.execute("invalid-email", "mypasword")).rejects.toThrow(
      "Email is invalid",
    );
  });

  test("Cannot create account with password too short", async () => {
    const usecase = new CreateUser(uuidGenerator, inMemoryUserRepository);
    expect(() =>
      usecase.execute("test@beta.gouv.fr", "mypasword"),
    ).rejects.toThrow("Password should be 12 or more characters");
  });

  test("Cannot create account when email already exists", async () => {
    const email = "user@beta.gouv.fr";
    const user = { email, password: "mypassword123456789", id: fakeUuid };
    inMemoryUserRepository._setUsers([user]);
    const usecase = new CreateUser(uuidGenerator, inMemoryUserRepository);
    expect(() => usecase.execute(email, "mypassword123456789")).rejects.toThrow(
      "Given email already exists",
    );
  });
});
