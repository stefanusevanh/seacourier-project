import {
  IDestinationAddressDetail,
  IOriginAddress,
  IPromo,
  TAddOns,
  TShippingCategory,
} from "@/types/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IShippingState {
  length: number;
  width: number;
  height: number;
  weight: number;
  originAddress: IOriginAddress | null;
  destinationAddress: IDestinationAddressDetail | null;
  cost: number;
  promoUsed: IPromo | null;
  paidAmount: number;
  category: TShippingCategory | null;
  addOns: TAddOns;
  trackingNumber: string;
}

const shippingInitialState: IShippingState = {
  length: 0,
  width: 0,
  height: 0,
  weight: 0,
  originAddress: null,
  destinationAddress: null,
  cost: 0,
  promoUsed: null,
  paidAmount: 0,
  category: null,
  addOns: "0",
  trackingNumber: "",
};

const shippingSlice = createSlice({
  name: "shipping",
  initialState: shippingInitialState,
  reducers: {
    saveShipmentDetails(
      state,
      { payload }: PayloadAction<Partial<IShippingState>>
    ) {
      state.length = payload.length ? payload.length : state.length;
      state.width = payload.width ? payload.width : state.width;
      state.height = payload.height ? payload.height : state.height;
      state.weight = payload.weight ? payload.weight : state.weight;
      state.originAddress = payload.originAddress
        ? payload.originAddress
        : state.originAddress;
      state.destinationAddress = payload.destinationAddress
        ? payload.destinationAddress
        : state.destinationAddress;
      state.cost = payload.cost ? payload.cost : state.cost;
      state.promoUsed = payload.promoUsed ? payload.promoUsed : state.promoUsed;
      state.paidAmount = payload.paidAmount
        ? payload.paidAmount
        : state.paidAmount;
      state.category = payload.category ? payload.category : state.category;
      state.addOns = payload.addOns ? payload.addOns : state.addOns;
      state.trackingNumber =
        payload.trackingNumber !== undefined
          ? payload.trackingNumber
          : state.trackingNumber;
    },
    resetDetails(state) {
      Object.assign(state, {
        ...shippingInitialState,
      });
    },
  },
});

export const { saveShipmentDetails, resetDetails } = shippingSlice.actions;
export default shippingSlice.reducer;
