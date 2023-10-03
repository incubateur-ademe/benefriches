import { configureStore } from "@reduxjs/toolkit";
import fricheCreation from "./features/friche-creation/fricheCreation";
import naturalAreaCreation from "./features/naturalAreaCreation";
import siteCreation from "./features/siteCreation";

export const store = configureStore({
  reducer: {
    siteCreation,
    fricheCreation,
    naturalAreaCreation,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
