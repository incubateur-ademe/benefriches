import type { LifecycleEmailsGateway } from "../../core/LifecycleEmailsGateway";

export class InMemoryLifecycleEmailsService implements LifecycleEmailsGateway {
  _unsubscribedTokens: string[] = [];

  private failureCode: string | undefined = undefined;

  _failWith(errorCode: string) {
    this.failureCode = errorCode;
  }

  async unsubscribe(token: string): Promise<void> {
    await Promise.resolve();
    if (this.failureCode) {
      throw new Error(this.failureCode);
    }
    this._unsubscribedTokens.push(token);
  }
}
