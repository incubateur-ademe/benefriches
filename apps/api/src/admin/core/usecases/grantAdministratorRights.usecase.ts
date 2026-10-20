import { createAdministratorGrantedEvent } from "src/admin/core/events/administratorGranted.event";
import type { AdministratorRepository } from "src/admin/core/gateways/AdministratorRepository";
import type { AdministratorCandidate } from "src/admin/core/models/administratorCandidate";
import type { DateProvider } from "src/shared-kernel/dateProvider";
import type { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { fail, success, type TResult } from "src/shared-kernel/result";
import type { UidGenerator } from "src/shared-kernel/uidGenerator";
import type { UseCase } from "src/shared-kernel/usecase";

type Request =
  { identifiedBy: "email"; email: string } | { identifiedBy: "userId"; userId: string };

type GrantAdministratorRightsResult = TResult<
  { outcome: "granted" | "alreadyAdministrator"; user: AdministratorCandidate },
  "UserNotFound" | "AmbiguousEmail",
  { matchingUsers: AdministratorCandidate[] } | undefined
>;

type ResolveUserResult = TResult<
  AdministratorCandidate,
  "UserNotFound" | "AmbiguousEmail",
  { matchingUsers: AdministratorCandidate[] } | undefined
>;

/**
 * Makes an existing user an administrator. Run from the grantAdministratorRights script.
 *
 * The email is trimmed and matched case-insensitively. users.email is not unique, so several
 * matches fail with AmbiguousEmail rather than granting rights to an arbitrary user.
 *
 * Idempotent: an existing administrator is left unchanged and no event is published.
 * Publishes administrator.granted on a real grant only.
 */
export class GrantAdministratorRightsUseCase implements UseCase<
  Request,
  GrantAdministratorRightsResult
> {
  private readonly administratorRepository: AdministratorRepository;
  private readonly dateProvider: DateProvider;
  private readonly uidGenerator: UidGenerator;
  private readonly eventPublisher: DomainEventPublisher;

  constructor(
    administratorRepository: AdministratorRepository,
    dateProvider: DateProvider,
    uidGenerator: UidGenerator,
    eventPublisher: DomainEventPublisher,
  ) {
    this.administratorRepository = administratorRepository;
    this.dateProvider = dateProvider;
    this.uidGenerator = uidGenerator;
    this.eventPublisher = eventPublisher;
  }

  async execute(request: Request): Promise<GrantAdministratorRightsResult> {
    const userResult = await this.resolveUser(request);
    if (userResult.isFailure()) {
      return fail(userResult.getError(), userResult.getIssues());
    }
    const user = userResult.getData();

    if (await this.administratorRepository.isAdministrator(user.id)) {
      return success({ outcome: "alreadyAdministrator", user });
    }

    await this.administratorRepository.grant(user.id, this.dateProvider.now());
    await this.eventPublisher.publish(
      createAdministratorGrantedEvent(this.uidGenerator.generate(), {
        userId: user.id,
        userEmail: user.email,
      }),
    );

    return success({ outcome: "granted", user });
  }

  private async resolveUser(request: Request): Promise<ResolveUserResult> {
    if (request.identifiedBy === "userId") {
      const user = await this.administratorRepository.getUserById(request.userId);
      return user ? success(user) : fail("UserNotFound");
    }

    const matchingUsers = await this.administratorRepository.getUsersByEmail(
      request.email.trim().toLowerCase(),
    );
    const [firstUser] = matchingUsers;
    if (!firstUser) {
      return fail("UserNotFound");
    }
    if (matchingUsers.length > 1) {
      return fail("AmbiguousEmail", { matchingUsers });
    }
    return success(firstUser);
  }
}
