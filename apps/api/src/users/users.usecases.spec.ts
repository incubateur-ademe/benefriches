import { createUser } from "./users.usecases";

describe("Register", () => {
  test("User account creation", () => {
    expect(createUser("test@beta.gouv.fr", "mypassword")).toEqual({ "email": "test@beta.gouv.fr", "password": "mypassword"});
  });

  test("User account creation : check password", () => {
    //@ts-expect-error
    expect(() => createUser("test@beta.gouv.fr")).toThrowError("Password is required");
  });
});
