import { IAdmin } from "@/types/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const adminInitialState: Partial<IAdmin> = {
  id: 0,
  token: "",
  email: "",
  name: "",
  phoneNumber: "",
  photo: "",
  updatedAt: "",
};

const adminSlice = createSlice({
  name: "admin",
  initialState: adminInitialState,
  reducers: {
    storeAdmin(state, { payload }: PayloadAction<IAdmin>) {
      state.id = payload.id;
      state.token = payload.token;
      state.email = payload.email;
      state.name = payload.name;
      state.phoneNumber = payload.phoneNumber;
      state.photo = payload.photo;
      state.updatedAt = payload.updatedAt;
    },
  },
});

export const { storeAdmin } = adminSlice.actions;
export default adminSlice.reducer;
