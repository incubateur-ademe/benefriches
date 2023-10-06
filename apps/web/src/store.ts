import { configureStore } from "@reduxjs/toolkit";

import fricheCreation from "@/features/create-site/application/createFriche.reducers";
import naturalAreaCreation from "@/features/create-site/application/createNaturalArea.reducers";
import siteCreation from "@/features/create-site/application/createSite.reducers";

export const store = configureStore({
  reducer: {
    siteCreation,
    fricheCreation,
    naturalAreaCreation,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
