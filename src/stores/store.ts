import { combineReducers, configureStore } from "@reduxjs/toolkit";
import roleIDReducer from "./roleIDSlice/roleIDSlice";
import shippingReducer from "./shippingSlice/shippingSlice";
import { createWrapper } from "next-redux-wrapper";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["shipping"],
};

const makeStore = () =>
  configureStore({
    reducer: {
      roleID: roleIDReducer,
      shipping: shippingReducer,
    },
    devTools: true,
  });

const rootReducer = combineReducers({
  roleID: roleIDReducer,
  shipping: shippingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const wrapper = createWrapper<AppStore>(makeStore);

const persistor = persistStore(store);
export { store, persistor };
