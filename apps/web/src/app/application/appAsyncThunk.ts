import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDependencies, AppDispatch, RootState } from "./store";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  extra: AppDependencies;
}>();
