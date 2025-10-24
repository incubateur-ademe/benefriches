import { ZodError } from "zod";

import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { InMemoryEventPublisher } from "src/shared-kernel/adapters/events/publisher/InMemoryEventPublisher";
import { FailureResult } from "src/shared-kernel/result";

import { DeterministicUuidGenerator } from "../../shared-kernel/adapters/id-generator/DeterministicIdGenerator";
import {
  buildExhaustiveUserProps,
  buildMinimalUserProps,
  UserBuilder,
} from "../../users/core/model/user.mock";
import { InMemoryUserRepository } from "../adapters/user-repository/InMemoryAuthUserRepository";
import { CreateUserUseCase } from "./createUser.usecase";
import { User } from "./user";

describe("CreateUser Use Case", () => {
  let dateProvider: DateProvider;
  let userRepository: InMemoryUserRepository;
  let uuidGenerator: DeterministicUuidGenerator;
  let eventPublisher: InMemoryEventPublisher;
  const fakeNow = new Date("2024-01-05T13:00:00");

  const getZodIssues = (err: unknown) => {
    expect(err).toBeInstanceOf(ZodError);
    return (err as ZodError).issues;
  };

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    userRepository = new InMemoryUserRepository();
    uuidGenerator = new DeterministicUuidGenerator();
    uuidGenerator.nextUuids("a-fixed-uuid");
    eventPublisher = new InMemoryEventPublisher();
  });

  describe("Error cases", () => {
    describe("Mandatory input data", () => {
      it.each(["id", "email"])(
        "Cannot create an user without providing %s",
        async (mandatoryField) => {
          const userProps = buildMinimalUserProps(); // @ts-expect-error dynamic delete
          // oxlint-disable-next-line typescript/no-dynamic-delete
          delete userProps[mandatoryField];

          const usecase = new CreateUserUseCase(
            userRepository,
            dateProvider,
            uuidGenerator,
            eventPublisher,
          );

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

        const usecase = new CreateUserUseCase(
          userRepository,
          dateProvider,
          uuidGenerator,
          eventPublisher,
        );

        const result = await usecase.execute({
          user: { ...userProps, personalDataStorageConsented: false },
        });

        expect(result.isFailure()).toEqual(true);
        expect((result as FailureResult).getError()).toEqual("PersonalDataStorageNotConsented");
      });

      it("Cannot create an user when email is already taken", async () => {
        const email = "user@benefriches.ademe.fr";
        const userProps = { ...buildExhaustiveUserProps(), email };

        userRepository._setUsers([new UserBuilder().withEmail(email).build()]);

        const usecase = new CreateUserUseCase(
          userRepository,
          dateProvider,
          uuidGenerator,
          eventPublisher,
        );

        const result = await usecase.execute({
          user: userProps,
        });

        expect(result.isFailure()).toEqual(true);
        expect((result as FailureResult).getError()).toEqual("UserEmailAlreadyExists");
      });
    });
  });

  describe("Success cases", () => {
    it.each([
      { case: "with minimal data", props: buildMinimalUserProps() },
      { case: "with exhaustive data", props: buildExhaustiveUserProps() },
    ])("creates a user $case and emits an event", async ({ props }) => {
      uuidGenerator.nextUuids("my-event-uuid");

      const usecase = new CreateUserUseCase(
        userRepository,
        dateProvider,
        uuidGenerator,
        eventPublisher,
      );
      await usecase.execute({ user: props });

      const savedUser = userRepository._getUsers();

      expect(savedUser).toEqual<User[]>([
        {
          id: props.id,
          email: props.email,
          firstName: props.firstName,
          lastName: props.lastName,
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
          subscribedToNewsletter: props.subscribedToNewsletter,
        },
      ]);
      expect(eventPublisher.events).toEqual([
        {
          id: "my-event-uuid",
          name: "user.account-created",
          payload: {
            userId: props.id,
            userEmail: props.email,
            userFirstName: props.firstName,
            userLastName: props.lastName,
            subscribedToNewsletter: props.subscribedToNewsletter,
          },
        },
      ]);
    });
  });
});
