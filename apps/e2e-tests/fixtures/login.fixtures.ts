import { test as base, request } from "@playwright/test";

import { HomePage } from "../pages/HomePage";
import { AccessBenefrichesPage } from "../pages/AccessBenefrichesPage";
import { LoginModal } from "../pages/LoginPage";
import { MAIL_CATCHER_URL } from "../playwright.config";

export type TestUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  structureType: string;
  structureActivity: string;
  structureName: string;
};

type Fixtures = {
  testUser: TestUser;
  homePage: HomePage;
  accessBenefrichesPage: AccessBenefrichesPage;
  loginPage: LoginModal;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  accessBenefrichesPage: async ({ page }, use) => {
    await use(new AccessBenefrichesPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginModal(page));
  },
  testUser: async ({ baseURL }, use) => {
    const userId = crypto.randomUUID();
    const user: TestUser = {
      id: userId,
      email: `e2e-login-test-${Date.now()}@mail.com`,
      firstName: "Jean",
      lastName: "Dupont",
      structureType: "other",
      structureActivity: "other",
      structureName: "ADEME",
    };

    // Create user via API
    const apiContext = await request.newContext({ baseURL });
    const response = await apiContext.post("/api/auth/register", {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        id: user.id,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
        structureType: user.structureType,
        structureActivity: user.structureActivity,
        structureName: user.structureName,
        personalDataStorageConsented: true,
        personalDataAnalyticsUseConsented: false,
        personalDataCommunicationUseConsented: false,
        subscribedToNewsletter: false,
      },
    });

    if (!response.ok()) {
      throw new Error(`Failed to create test user: ${response.status()} ${await response.text()}`);
    }

    await use(user);
    await apiContext.dispose();
  },
});

export async function getMailCatcherMessages(): Promise<MailCatcherMessageList> {
  const apiContext = await request.newContext({ baseURL: MAIL_CATCHER_URL });
  const response = await apiContext.get("/messages");
  const messages = await response.json();
  await apiContext.dispose();
  return messages;
}

export async function getMailCatcherMessagePlainText(messageId: number): Promise<string> {
  const apiContext = await request.newContext({ baseURL: MAIL_CATCHER_URL });
  const response = await apiContext.get(`/messages/${messageId}.plain`);
  const messageDetails = await response.text();
  await apiContext.dispose();
  return messageDetails;
}

type MailCatcherMessageList = {
  id: number;
  sender: string;
  recipients: string[];
  subject: string;
  size: string;
  created_at: string;
}[];

export { expect } from "@playwright/test";
