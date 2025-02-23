import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authslice.js";
import jobSlice from "./jobslice.js";
const store = configureStore({
  reducer: {
    auth: authSlice,
    job: jobSlice,
  },
});
export default store;
