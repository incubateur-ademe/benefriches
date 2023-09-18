import { configureStore } from "@reduxjs/toolkit";
import fricheCreation from "./features/fricheCreation";
import siteCreation from "./features/siteCreation";

export const store = configureStore({
  reducer: {
    siteCreation,
    fricheCreation,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
