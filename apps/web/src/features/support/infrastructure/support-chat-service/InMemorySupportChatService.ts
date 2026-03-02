import type { SupportChatGateway } from "@/features/support/core/gateways/SupportChatGateway";

export class InMemorySupportChatService implements SupportChatGateway {
  _userEmail: string | undefined;
  _messages: string[] = [];

  setUserEmail(email: string): void {
    this._userEmail = email;
  }

  unsetUserEmail(): void {
    this._userEmail = undefined;
  }

  openWithMessage(message: string): void {
    this._messages.push(message);
  }
}
