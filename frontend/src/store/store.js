import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./authSlice";
import uiSlice from "./uiSlice";
import videoSlice from "./videoSlice";
import channelSlice from "./channelSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    video: videoSlice,
    channel: channelSlice,
  },
  devTools: false,
});

export default store;