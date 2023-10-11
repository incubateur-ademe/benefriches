import { configureStore } from "@reduxjs/toolkit";

import fricheCreation from "@/features/create-site/application/createFriche.reducer";
import naturalAreaCreation from "@/features/create-site/application/createNaturalArea.reducer";
import siteCreation from "@/features/create-site/application/createSite.reducer";

export const store = configureStore({
  reducer: {
    siteCreation,
    fricheCreation,
    naturalAreaCreation,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
