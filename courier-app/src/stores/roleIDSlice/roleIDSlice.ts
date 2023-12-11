import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IRoleIDState {
  user_id: number;
  admin_id: number;
}

const roleIDInitialState: IRoleIDState = {
  user_id: 0,
  admin_id: 0,
};

const roleIDSlice = createSlice({
  name: "roleID",
  initialState: roleIDInitialState,
  reducers: {
    storeUserID(state, { payload }: PayloadAction<number>) {
      state.user_id = payload;
    },
    storeAdminID(state, { payload }: PayloadAction<number>) {
      state.admin_id = payload;
    },
  },
});

export const { storeUserID, storeAdminID } = roleIDSlice.actions;
export default roleIDSlice.reducer;
