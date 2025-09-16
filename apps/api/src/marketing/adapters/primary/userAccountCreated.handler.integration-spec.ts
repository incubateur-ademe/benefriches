import { INestApplication } from "@nestjs/common";
import { Server } from "node:net";
import { createTestApp } from "test/testApp";

import { createUserAccountCreatedEvent } from "src/auth/core/events/userAccountCreated.event";
import { RealEventPublisher } from "src/shared-kernel/adapters/events/publisher/RealEventPublisher";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";

import { ConnectCrm } from "../secondary/ConnectCrm";
import { FakeCrm } from "../secondary/FakeCrm";

describe("UserAccountCreatedHandler integration test", () => {
  let app: INestApplication<Server>;
  let eventPublisher: DomainEventPublisher;
  let fakeCrm: FakeCrm;

  beforeEach(async () => {
    fakeCrm = new FakeCrm();

    app = await createTestApp({
      providerOverrides: [{ token: ConnectCrm, useValue: fakeCrm }],
    });
    await app.init();

    eventPublisher = app.get(RealEventPublisher);
  });

  afterEach(async () => {
    await app.close();
  });

  it("should create contact in CRM when UserAccountCreated event", async () => {
    const event = createUserAccountCreatedEvent("event-123", {
      userId: "user-123",
      userEmail: "john.doe@example.com",
      userFirstName: "John",
      userLastName: "Doe",
      subscribedToNewsletter: false,
    });

    await eventPublisher.publish(event);

    expect(fakeCrm._newContacts).toEqual([
      {
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        subscribedToNewsletter: false,
      },
    ]);
  });
});
