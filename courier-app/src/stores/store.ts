import { configureStore } from "@reduxjs/toolkit";
import roleIDReducer from "./roleIDSlice/roleIDSlice";
import shippingReducer from "./shippingSlice/shippingSlice";
import { createWrapper } from "next-redux-wrapper";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const makeStore = () =>
  configureStore({
    reducer: {
      roleID: roleIDReducer,
      shipping: shippingReducer,
    },
    devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const wrapper = createWrapper<AppStore>(makeStore);
