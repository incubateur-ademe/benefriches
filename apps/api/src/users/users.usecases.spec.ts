import { createUser } from "./users.usecases";

describe("Register", () => {
  test("User account creation", () => {
    expect(createUser("test@beta.gouv.fr", "mypassword123456789")).toEqual({
      email: "test@beta.gouv.fr",
      password: "mypassword123456789",
    });
  });

  test("User account creation : check password", () => {
    //@ts-expect-error
    expect(() => createUser("test@beta.gouv.fr")).toThrowError(
      "Password is required",
    );
  });

  test("Cannot create account without email", () => {
    //@ts-expect-error
    expect(() => createUser(null)).toThrowError("Email is required");
  });

  test("Cannot create account with invalid email", () => {
    expect(() => createUser("invalid-email", "mypasword")).toThrowError(
      "Email is invalid",
    );
  });

  test("Cannot create account with password too short", () => {
    expect(() => createUser("test@beta.gouv.fr", "mypasword")).toThrowError(
      "Password should be 12 or more characters",
    );
  });
});
