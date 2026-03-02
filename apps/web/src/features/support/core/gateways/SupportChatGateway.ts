export type SupportChatGateway = {
  setUserEmail(email: string): void;
  unsetUserEmail(): void;
  openWithMessage(message: string): void;
};
