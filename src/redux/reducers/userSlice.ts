import { createSlice } from "@reduxjs/toolkit";
import type { UserModel } from "../../types/userModel";

const initialState: {
  currentUser: UserModel | null;
} = {
  currentUser: null,
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCurrentUser: (state, { payload }: { payload: UserModel | null }) => {
      state.currentUser = payload;
    },
  },
});

export const { setCurrentUser } = userSlice.actions;

export default userSlice.reducer;
