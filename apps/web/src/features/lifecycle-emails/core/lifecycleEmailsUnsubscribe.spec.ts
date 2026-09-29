import { describe, expect, it } from "vitest";

import { createStore } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { InMemoryLifecycleEmailsService } from "../infrastructure/lifecycle-emails-service/InMemoryLifecycleEmailsService";
import { selectLifecycleEmailsUnsubscribeViewData } from "./lifecycleEmailsUnsubscribe.selectors";
import { unsubscribeLinkOpened } from "./unsubscribeLinkOpened.action";

describe("Lifecycle emails unsubscribe", () => {
  it("shows the confirmation once the unsubscribe succeeds", async () => {
    const lifecycleEmailsService = new InMemoryLifecycleEmailsService();
    const store = createStore(getTestAppDependencies({ lifecycleEmailsService }));

    await store.dispatch(unsubscribeLinkOpened({ token: "v1.abc.def" }));

    expect(selectLifecycleEmailsUnsubscribeViewData(store.getState())).toEqual({
      status: "success",
    });
    expect(lifecycleEmailsService._unsubscribedTokens).toEqual(["v1.abc.def"]);
  });

  it("shows the invalid-link error when the API rejects the token", async () => {
    const lifecycleEmailsService = new InMemoryLifecycleEmailsService();
    lifecycleEmailsService._failWith("INVALID_UNSUBSCRIBE_TOKEN");
    const store = createStore(getTestAppDependencies({ lifecycleEmailsService }));

    await store.dispatch(unsubscribeLinkOpened({ token: "v1.abc.def" }));

    expect(selectLifecycleEmailsUnsubscribeViewData(store.getState())).toEqual({
      status: "error",
      reason: "invalid-link",
    });
  });

  it("shows a technical error for any other failure", async () => {
    const lifecycleEmailsService = new InMemoryLifecycleEmailsService();
    lifecycleEmailsService._failWith("UNKNOWN_ERROR");
    const store = createStore(getTestAppDependencies({ lifecycleEmailsService }));

    await store.dispatch(unsubscribeLinkOpened({ token: "v1.abc.def" }));

    expect(selectLifecycleEmailsUnsubscribeViewData(store.getState())).toEqual({
      status: "error",
      reason: "technical",
    });
  });

  it("is loading before the request settles", () => {
    const lifecycleEmailsService = new InMemoryLifecycleEmailsService();
    const store = createStore(getTestAppDependencies({ lifecycleEmailsService }));

    void store.dispatch(unsubscribeLinkOpened({ token: "v1.abc.def" }));

    expect(selectLifecycleEmailsUnsubscribeViewData(store.getState())).toEqual({
      status: "loading",
    });
  });
});
