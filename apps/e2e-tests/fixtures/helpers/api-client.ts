/**
 * Pre-configured API client for E2E tests.
 * Wraps Playwright's APIRequestContext with baseURL and authentication cookies.
 */

import { request, type APIRequestContext, type APIResponse } from "@playwright/test";

export class ApiClient {
  private apiContext: APIRequestContext | null = null;

  constructor(
    private readonly baseURL: string,
    private readonly cookieHeader: string,
  ) {}

  private async getContext(): Promise<APIRequestContext> {
    if (!this.apiContext) {
      this.apiContext = await request.newContext({
        baseURL: this.baseURL,
        extraHTTPHeaders: { Cookie: this.cookieHeader },
      });
    }
    return this.apiContext;
  }

  async post<T>(endpoint: string, data: T): Promise<APIResponse> {
    const ctx = await this.getContext();
    return ctx.post(endpoint, {
      headers: { "Content-Type": "application/json" },
      data,
    });
  }

  async get(endpoint: string): Promise<APIResponse> {
    const ctx = await this.getContext();
    return ctx.get(endpoint);
  }

  async dispose(): Promise<void> {
    if (this.apiContext) {
      await this.apiContext.dispose();
      this.apiContext = null;
    }
  }
}
