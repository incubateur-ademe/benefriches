import { initCurrentUser } from "@/features/onboarding/core/initCurrentUser.action";
import type { AppStartListening } from "@/shared/core/store-config/listenerMiddleware";

export const setupSupportChatListeners = (startAppListening: AppStartListening) => {
  startAppListening({
    actionCreator: initCurrentUser.fulfilled,
    effect: (action, listenerApi) => {
      const user = action.payload;
      if (user?.email) {
        listenerApi.extra.supportChatService.setUserEmail(user.email);
      }
    },
  });

  startAppListening({
    actionCreator: initCurrentUser.rejected,
    effect: (_action, listenerApi) => {
      listenerApi.extra.supportChatService.unsetUserEmail();
    },
  });
};
