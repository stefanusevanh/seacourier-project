import {
  IDestinationAddressDetail,
  IOriginAddress,
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
  receiverName: string;
  receiverPhone: string;
  cost: number;
  status: string;
  promoUsed: string;
  category: TShippingCategory;
  addOns: TAddOns;
}

const shippingInitialState: IShippingState = {
  length: 0,
  width: 0,
  height: 0,
  weight: 0,
  originAddress: null,
  destinationAddress: null,
  receiverName: "",
  receiverPhone: "",
  cost: 0,
  status: "",
  promoUsed: "",
  category: "OKE",
  addOns: "0",
};

const shippingSlice = createSlice({
  name: "shipping",
  initialState: shippingInitialState,
  reducers: {
    saveShipmentDetails(
      state,
      { payload }: PayloadAction<Partial<IShippingState>>
    ) {
      state.length = payload.length!;
      state.width = payload.width!;
      state.height = payload.height!;
      state.weight = payload.weight!;
      state.originAddress = payload.originAddress!;
      state.destinationAddress = payload.destinationAddress!;
      state.receiverName = payload.receiverName!;
      state.receiverPhone = payload.receiverPhone!;
      state.cost = payload.cost!;
      state.status = payload.status!;
      state.promoUsed = payload.promoUsed!;
      state.category = payload.category!;
      state.addOns = payload.addOns!;
    },
  },
});

export const { saveShipmentDetails } = shippingSlice.actions;
export default shippingSlice.reducer;
