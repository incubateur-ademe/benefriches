import { Crisp } from "crisp-sdk-web";

import type { SupportChatGateway } from "@/features/support/core/gateways/SupportChatGateway";

export class CrispSupportChatService implements SupportChatGateway {
  constructor(websiteId: string) {
    Crisp.configure(websiteId, { autoload: false });
  }

  setUserEmail(email: string): void {
    Crisp.load();
    Crisp.user.setEmail(email);
  }

  unsetUserEmail(): void {
    if (!Crisp.isCrispInjected()) return;
    Crisp.session.reset();
  }

  openWithMessage(message: string): void {
    if (!Crisp.isCrispInjected()) return;
    Crisp.load();

    Crisp.chat.open();

    Crisp.message.sendText(message);
  }
}
