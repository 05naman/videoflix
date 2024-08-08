import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  video: null,
  editVideo: false,
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideo: (state, action) => {
      state.video = action.payload;
    },
    setEditVideo: (state, action) => {
      state.editVideo = action.payload;
    },
  },
});

export const { setVideo, setEditVideo } = videoSlice.actions;

export default videoSlice.reducer;