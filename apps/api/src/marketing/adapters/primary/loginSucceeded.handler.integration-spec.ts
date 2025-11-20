import { NestExpressApplication } from "@nestjs/platform-express";
import { createTestApp } from "test/testApp";

import { createLoginSucceededEvent } from "src/auth/core/events/loginSucceeded.event";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { RealEventPublisher } from "src/shared-kernel/adapters/events/publisher/RealEventPublisher";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";

import { ConnectCrm } from "../secondary/ConnectCrm";
import { FakeCrm } from "../secondary/FakeCrm";

describe("LoginSucceededHandler integration test", () => {
  let eventPublisher: DomainEventPublisher;
  let fakeCrm: FakeCrm;
  let app: NestExpressApplication;
  const fakeNow = new Date("2024-01-15T10:30:00");
  let dateProvider: DateProvider;

  beforeEach(async () => {
    fakeCrm = new FakeCrm();
    dateProvider = new DeterministicDateProvider(fakeNow);

    app = await createTestApp({
      providerOverrides: [
        { token: ConnectCrm, useValue: fakeCrm },
        { token: RealDateProvider, useValue: dateProvider },
      ],
    });
    await app.init();

    eventPublisher = app.get(RealEventPublisher);
  });

  afterEach(async () => {
    await app.close();
  });

  it("should update contact last login date in CRM when LoginSucceeded event from pro-connect", async () => {
    const event = createLoginSucceededEvent("event-123", {
      userId: "user-123",
      userEmail: "john.doe@example.com",
      method: "pro-connect",
    });

    await eventPublisher.publish(event);

    expect(fakeCrm._loginUpdates).toHaveLength(1);
    const loginUpdate = fakeCrm._loginUpdates[0];
    expect(loginUpdate).toEqual({
      email: "john.doe@example.com",
      loginDate: fakeNow,
    });
  });

  it("should update contact last login date in CRM when LoginSucceeded event from email-link", async () => {
    const event = createLoginSucceededEvent("event-456", {
      userId: "user-456",
      userEmail: "jane.smith@example.com",
      method: "email-link",
    });

    await eventPublisher.publish(event);

    expect(fakeCrm._loginUpdates).toHaveLength(1);
    const loginUpdate = fakeCrm._loginUpdates[0];
    expect(loginUpdate).toEqual({
      email: "jane.smith@example.com",
      loginDate: fakeNow,
    });
  });
});
