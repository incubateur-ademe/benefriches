/* eslint-disable jest/no-conditional-expect */
import { z } from "zod";
import { InMemoryIdentityRepository } from "src/identities/adapters/secondary/identity-repository/InMemoryIdentityRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { buildExhaustiveIdentityProps, buildMinimalIdentityProps } from "../model/identity.mock";
import { CreateIdentityUseCase, DateProvider } from "./createIdentity.usecase";

describe("CreateIdentity Use Case", () => {
  let dateProvider: DateProvider;
  let identityRepository: InMemoryIdentityRepository;
  const fakeNow = new Date("2024-01-05T13:00:00");

  const getZodIssues = (err: unknown) => {
    if (err instanceof z.ZodError) {
      return err.issues;
    }
    throw new Error("Not a ZodError");
  };

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    identityRepository = new InMemoryIdentityRepository();
  });

  describe("Error cases", () => {
    describe("Mandatory input data", () => {
      it.each(["id", "email"])(
        "Cannot create an identity without providing %s",
        async (mandatoryField) => {
          const identityProps = buildMinimalIdentityProps(); // @ts-expect-error dynamic delete
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete identityProps[mandatoryField];

          const usecase = new CreateIdentityUseCase(identityRepository, dateProvider);

          expect.assertions(3);
          try {
            await usecase.execute({ identity: identityProps });
          } catch (err) {
            const zIssues = getZodIssues(err);
            expect(zIssues.length).toEqual(1);
            expect(zIssues[0].path).toEqual([mandatoryField]);
            expect(zIssues[0].code).toEqual("invalid_type");
          }
        },
      );

      it("Cannot create an identity without providing storage consentment", async () => {
        const identityProps = buildMinimalIdentityProps();

        const usecase = new CreateIdentityUseCase(identityRepository, dateProvider);

        await expect(async () =>
          usecase.execute({
            identity: { ...identityProps, personalDataStorageConsented: false },
          }),
        ).rejects.toThrow("Personal data storage consented field should be true");
      });
    });
  });

  describe("Success cases", () => {
    it.each([
      { case: "with minimal data", props: buildMinimalIdentityProps() },
      { case: "with exhaustive data", props: buildExhaustiveIdentityProps() },
    ])("Can create an identity $case", async ({ props }) => {
      const usecase = new CreateIdentityUseCase(identityRepository, dateProvider);
      await usecase.execute({ identity: props });

      const savedIdentity = identityRepository._getIdentities();

      expect(savedIdentity).toEqual([
        {
          id: props.id,
          email: props.email,
          firstname: props.firstname,
          lastname: props.lastname,
          structureType: props.structureType,
          structureName: props.structureName,
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
