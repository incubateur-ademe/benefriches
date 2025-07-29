/* eslint-disable jest/no-conditional-expect */
import { ZodError } from "zod";

import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { InMemoryUserRepository } from "src/users/adapters/secondary/user-repository/InMemoryUserRepository";

import { User } from "../model/user";
import { buildExhaustiveUserProps, buildMinimalUserProps } from "../model/user.mock";
import { CreateUserUseCase } from "./createUser.usecase";

describe("CreateUser Use Case", () => {
  let dateProvider: DateProvider;
  let userRepository: InMemoryUserRepository;
  const fakeNow = new Date("2024-01-05T13:00:00");

  const getZodIssues = (err: unknown) => {
    expect(err).toBeInstanceOf(ZodError);
    return (err as ZodError).issues;
  };

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    userRepository = new InMemoryUserRepository();
  });

  describe("Error cases", () => {
    describe("Mandatory input data", () => {
      it.each(["id", "email"])(
        "Cannot create an user without providing %s",
        async (mandatoryField) => {
          const userProps = buildMinimalUserProps(); // @ts-expect-error dynamic delete
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete userProps[mandatoryField];

          const usecase = new CreateUserUseCase(userRepository, dateProvider);

          expect.assertions(4);
          try {
            await usecase.execute({ user: userProps });
          } catch (err) {
            const zIssues = getZodIssues(err);
            expect(zIssues.length).toEqual(1);
            expect(zIssues[0]?.path).toEqual([mandatoryField]);
            expect(zIssues[0]?.code).toEqual("invalid_type");
          }
        },
      );

      it("Cannot create an user without providing storage consentment", async () => {
        const userProps = buildMinimalUserProps();

        const usecase = new CreateUserUseCase(userRepository, dateProvider);

        await expect(async () =>
          usecase.execute({
            user: { ...userProps, personalDataStorageConsented: false },
          }),
        ).rejects.toThrow("Personal data storage consented field should be true");
      });
    });
  });

  describe("Success cases", () => {
    it.each([
      { case: "with minimal data", props: buildMinimalUserProps() },
      { case: "with exhaustive data", props: buildExhaustiveUserProps() },
    ])("Can create an user $case", async ({ props }) => {
      const usecase = new CreateUserUseCase(userRepository, dateProvider);
      await usecase.execute({ user: props });

      const savedUser = userRepository._getUsers();

      expect(savedUser).toEqual<User[]>([
        {
          id: props.id,
          email: props.email,
          firstname: props.firstname,
          lastname: props.lastname,
          structureType: props.structureType,
          structureName: props.structureName,
          structureActivity: props.structureActivity,
          createdAt: fakeNow,
          personalDataStorageConsentedAt: fakeNow,
          personalDataAnalyticsUseConsentedAt: props.personalDataAnalyticsUseConsented
            ? fakeNow
            : undefined,
          personalDataCommunicationUseConsentedAt: props.personalDataCommunicationUseConsented
            ? fakeNow
            : undefined,
        },
      ]);
    });
  });
});
