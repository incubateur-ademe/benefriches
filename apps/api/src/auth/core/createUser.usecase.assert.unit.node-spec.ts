import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
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

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    userRepository = new InMemoryUserRepository();
    uuidGenerator = new DeterministicUuidGenerator();
    uuidGenerator.nextUuids("a-fixed-uuid");
    eventPublisher = new InMemoryEventPublisher();
  });

  describe("Error cases", () => {
    describe("Mandatory input data", () => {
      for (const mandatoryField of ["id", "email"]) {
        // NOTE: `{ plan: 4 }` was dropped — node:test `plan` counts TestContext assertions
        // (t.assert.*), not standalone node:assert calls, so it always reported 0.
        // The original try/catch + getZodIssues helper is rewritten as assert.rejects
        // with an inline inspector to keep assertion parity without plan.
        it(`Cannot create an user without providing ${mandatoryField}`, async () => {
          const userProps = buildMinimalUserProps(); // @ts-expect-error dynamic delete
          // oxlint-disable-next-line typescript/no-dynamic-delete
          delete userProps[mandatoryField];

          const usecase = new CreateUserUseCase(
            userRepository,
            dateProvider,
            uuidGenerator,
            eventPublisher,
          );

          await assert.rejects(
            () => usecase.execute({ user: userProps }),
            (err: unknown) => {
              assert.ok(err instanceof ZodError);
              // After assert.ok(err instanceof ZodError), TS narrows err to ZodError — no cast needed.
              const zIssues = err.issues;
              assert.deepStrictEqual(zIssues.length, 1);
              assert.deepStrictEqual(zIssues[0]?.path, [mandatoryField]);
              assert.deepStrictEqual(zIssues[0]?.code, "invalid_type");
              return true;
            },
          );
        });
      }

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

        assert.deepStrictEqual(result.isFailure(), true);
        assert.deepStrictEqual(
          (result as FailureResult).getError(),
          "PersonalDataStorageNotConsented",
        );
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

        assert.deepStrictEqual(result.isFailure(), true);
        assert.deepStrictEqual((result as FailureResult).getError(), "UserEmailAlreadyExists");
      });
    });
  });

  describe("Success cases", () => {
    for (const { case: label, props } of [
      { case: "with minimal data", props: buildMinimalUserProps() },
      { case: "with exhaustive data", props: buildExhaustiveUserProps() },
    ]) {
      it(`creates a user ${label} and emits an event`, async () => {
        uuidGenerator.nextUuids("my-event-uuid");

        const usecase = new CreateUserUseCase(
          userRepository,
          dateProvider,
          uuidGenerator,
          eventPublisher,
        );
        await usecase.execute({ user: props });

        const savedUser = userRepository._getUsers();

        // NOTE: node:assert deepStrictEqual treats {k: undefined} as different from {} (missing key).
        // Vitest's toEqual considers them equal. Two distinct behaviors require different handling:
        //
        // 1. `structureName`: Zod strips optional fields that are absent from the input, so the
        //    actual saved object has no `structureName` key when it was not provided. We use a
        //    conditional spread to omit it from the expected when undefined.
        //
        // 2. `personalData*ConsentedAt`: the usecase explicitly assigns these as `undefined`
        //    when not consented (e.g., `... ? fakeNow : undefined`), so the actual object DOES
        //    have the key present with value `undefined`. We include them directly.
        assert.deepStrictEqual(savedUser, [
          {
            id: props.id,
            email: props.email,
            firstName: props.firstName,
            lastName: props.lastName,
            structureType: props.structureType,
            ...(props.structureName !== undefined ? { structureName: props.structureName } : {}),
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
          } as User,
        ] as User[]);
        assert.deepStrictEqual(eventPublisher.events, [
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
    }
  });
});
