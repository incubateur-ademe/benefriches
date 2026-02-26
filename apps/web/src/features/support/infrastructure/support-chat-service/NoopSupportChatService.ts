import type { SupportChatGateway } from "@/features/support/core/gateways/SupportChatGateway";

export class NoopSupportChatService implements SupportChatGateway {
  setUserEmail(): void {
    // No-op: support chat is not configured
  }

  openWithMessage(): void {
    // No-op: support chat is not configured
  }
}
