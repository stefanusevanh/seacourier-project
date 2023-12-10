import { IUser } from "@/types/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const userInitialState: Partial<IUser> = {
  id: 0,
  email: "",
  name: "",
  phoneNumber: "",
  photo: "",
  balance: 0,
  refCode: "",
  refCodeFriend: "",
  countRefCode: 0,
  completedShipments: 0,
  totalSpent: 0,
  updatedAt: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    storeUser(state, { payload }: PayloadAction<IUser>) {
      state.id = payload.id;
      state.email = payload.email;
      state.name = payload.name;
      state.phoneNumber = payload.phoneNumber;
      state.photo = payload.photo;
      state.balance = payload.balance;
      state.refCode = payload.refCode;
      state.refCodeFriend = payload.refCodeFriend;
      state.countRefCode = payload.countRefCode;
      state.completedShipments = payload.completedShipments;
      state.totalSpent = payload.totalSpent;
      state.updatedAt = payload.updatedAt;
    },
  },
});

export const { storeUser } = userSlice.actions;
export default userSlice.reducer;
