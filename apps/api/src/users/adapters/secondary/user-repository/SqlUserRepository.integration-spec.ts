import knex, { Knex } from "knex";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { EmailAddress } from "src/users/domain/models/emailAddress";
import { User } from "src/users/domain/models/user";
import { SqlUserRepository } from "./SqlUserRepository";

describe("SqlUserRepository integration", () => {
  let sqlConnection: Knex;
  let sqlUserRepository: SqlUserRepository;

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    sqlUserRepository = new SqlUserRepository(sqlConnection);
    await sqlConnection("users").truncate();
  });

  test("Can save a user", async () => {
    const user = User.create({
      id: "b1667568-33ad-4755-9c59-a704d1124994",
      email: EmailAddress.create("user1@mail.com"),
      password: "super-strong-hashed-password",
    });

    await sqlUserRepository.save(user);

    const result = await sqlConnection<User[]>("users").select("id", "email", "password");
    expect(result).toEqual([
      {
        id: user.id,
        email: user.email,
        password: user.password,
      },
    ]);
  });

  test("Tells when user exists with email", async () => {
    const userProps = {
      id: "b1667568-33ad-4755-9c59-a704d1124994",
      email: "user1@mail.com",
      password: "super-strong-hashed-password",
    };
    await sqlConnection("users").insert(userProps);
    const result = await sqlUserRepository.existsWithEmail(userProps.email);
    expect(result).toEqual(true);
  });

  test("Tells if user does not exists with email", async () => {
    const userProps = {
      id: "b1667568-33ad-4755-9c59-a704d1124994",
      email: "user1@mail.com",
      password: "super-strong-hashed-password",
    };
    await sqlConnection("users").insert(userProps);
    const result = await sqlUserRepository.existsWithEmail("another-user@mail.com");
    expect(result).toEqual(false);
  });

  test("Gets user with email", async () => {
    const userProps = {
      id: "b1667568-33ad-4755-9c59-a704d1124994",
      email: "user1@mail.com",
      password: "super-strong-hashed-password",
    };
    await sqlConnection("users").insert(userProps);
    const result = await sqlUserRepository.getWithEmail(userProps.email);
    expect(result).toEqual(userProps);
  });

  test("Does not get user with non existing email", async () => {
    const userProps = {
      id: "b1667568-33ad-4755-9c59-a704d1124994",
      email: "user1@mail.com",
      password: "super-strong-hashed-password",
    };
    await sqlConnection("users").insert(userProps);
    const result = await sqlUserRepository.getWithEmail("wrong");
    expect(result).toEqual(undefined);
  });
});
