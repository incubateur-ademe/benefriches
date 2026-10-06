import { useEffect, useRef } from "react";

import { BENEFRICHES_ENV } from "@/app/envVars";
import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { routes, useRoute } from "@/app/router";
import { unsubscribeLinkInvalidHelpRequested } from "@/features/support/core/unsubscribeLinkInvalidHelpRequested.action";

import { selectLifecycleEmailsUnsubscribeViewData } from "../../core/lifecycleEmailsUnsubscribe.selectors";
import { unsubscribeLinkOpened } from "../../core/unsubscribeLinkOpened.action";
import UnsubscribePage from "./UnsubscribePage";

const MISSING_TOKEN_VIEW_DATA = { status: "error", reason: "invalid-link" } as const;

function UnsubscribePageContainer() {
  const route = useRoute();
  const token =
    route.name === routes.lifecycleEmailsUnsubscribe.name ? route.params.token : undefined;
  const dispatch = useAppDispatch();
  const viewData = useAppSelector(selectLifecycleEmailsUnsubscribeViewData);
  // Guards against the double effect run of React StrictMode: one click, one request.
  const hasRequestedUnsubscribe = useRef(false);

  useEffect(() => {
    if (!token || hasRequestedUnsubscribe.current) return;
    hasRequestedUnsubscribe.current = true;
    void dispatch(unsubscribeLinkOpened({ token }));
  }, [dispatch, token]);

  return (
    <UnsubscribePage
      viewData={token ? viewData : MISSING_TOKEN_VIEW_DATA}
      onRetry={() => {
        if (token) void dispatch(unsubscribeLinkOpened({ token }));
      }}
      onContactSupport={
        BENEFRICHES_ENV.crispEnabled
          ? () => {
              void dispatch(unsubscribeLinkInvalidHelpRequested());
            }
          : undefined
      }
    />
  );
}

export default UnsubscribePageContainer;
