import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    status:false,
    user:null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        setUser: (state, action) => {
            if (!action.payload) {
              state.authStatus = false;
              state.user = null;
            } else {
              state.authStatus = true;
              state.user = action.payload;
            }
          },
          unSetUser: (state) => {
            state.status = false;
            state.user = null;
          }
    }

})

export const { setUser, unSetUser } = authSlice.actions;
export default authSlice.reducer;