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
 * Idempotent: the insert ignores an existing row, so concurrent runs are safe, and an existing
 * administrator is left unchanged.
 *
 * administrator.granted is published once per grant, tracked by a "granted event published"
 * marker on the administrators row: the row is inserted unmarked, the event is published, then
 * the row is marked. If publishing (or marking) fails, the error propagates and the script exits
 * 1; rerunning it finds the grant unmarked, publishes the missing event and marks it.
 *
 * Delivery is at-least-once: two concurrent first runs, or a crash between publishing and
 * marking, publish the event twice with different event ids, so subscribers must be idempotent
 * on payload.userId. Marking before publishing was rejected: a crash after the mark would lose
 * the event again.
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

    const now = this.dateProvider.now();
    const { created, grantedEventPublished } = await this.administratorRepository.grant(
      user.id,
      now,
    );
    if (!grantedEventPublished) {
      await this.eventPublisher.publish(
        createAdministratorGrantedEvent(this.uidGenerator.generate(), {
          userId: user.id,
          userEmail: user.email,
        }),
      );
      await this.administratorRepository.markGrantedEventPublished(user.id, now);
    }

    return success({ outcome: created ? "granted" : "alreadyAdministrator", user });
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
