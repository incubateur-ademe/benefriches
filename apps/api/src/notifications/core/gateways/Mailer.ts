export type LifecycleEmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export interface Mailer {
  send(message: LifecycleEmailMessage): Promise<void>;
}
