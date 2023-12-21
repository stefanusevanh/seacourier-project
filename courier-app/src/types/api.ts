import { cityMap } from "@/utils/cityMap";

export interface IUser {
  id: number;
  token: string;
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  photo: string;
  balance: number;
  refCode: string;
  refCodeFriend: string;
  countRefCode: number;
  completedShipments: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAdmin {
  id: number;
  token: string;
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPromo {
  id: number;
  promoCode: string;
  discount: number;
  quota: number;
  expiryDate: string;
  used: number;
  createdAt: string;
  updatedAt: string;
}

export interface IOriginAddress {
  id: number;
  branchName: string;
  city: keyof typeof cityMap | "";
  province: string;
  street: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDestinationAddressDetail {
  city: keyof typeof cityMap | "";
  province: string;
  street: string;
  receiverName: string;
  receiverPhone: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDestinationAddress {
  id: number;
  userId: number;
  addresses: IDestinationAddressDetail[];
}

export type TStatus = "PAID" | "ON SHIPPING" | "DELIVERED";
export type TShippingCategory = "OKE" | "REG" | "SPS" | "YES";
export type TAddOns = "0" | "1" | "2";
export type TReview = "" | "0" | "1" | "2" | "3" | "4" | "5";

export interface IShippingDetail {
  trackingNumber: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  originAddress: IOriginAddress;
  destinationAddress: IDestinationAddressDetail;
  cost: number;
  status: TStatus;
  promoUsed: IPromo | null;
  paidAmount: number;
  category: TShippingCategory;
  addOns: TAddOns;
  review: TReview;
  createdAt: string;
  updatedAt: string;
}

export interface IShippingList {
  id: number;
  userId: number;
  detail: IShippingDetail[];
}

//Cloudinary API
export interface ICloudinaryResponse {
  url: string;
  asset_id: string;
}

//RajaOngkir API
export interface IRajaOngkirResponse {
  rajaongkir: IRajaOngkir;
}
export interface IRajaOngkir {
  query: IQuery;
  status: IStatus;
  origin_details: CityDetails;
  destination_details: CityDetails;
  results: IResult[];
}

export interface IRajaOngkirResponseCity {
  rajaongkir: {
    query: { province: string };
    status: IStatus;
    results: IResultCity[];
  };
}

export interface IQuery {
  origin: string;
  destination: string;
  weight: number;
  courier: string;
}

export interface CityDetails {
  city_id: string;
  province_id: string;
  province: string;
  type: string;
  city_name: string;
  postal_code: string;
}

export interface IResult {
  code: string;
  name: string;
  costs: IResultCost[];
}

export interface IResultCity {
  city_id: string;
  province_id: string;
  province: string;
  type: string;
  city_name: string;
  postal_code: string;
}

export interface IResultCost {
  service: string;
  description: string;
  cost: ICostCost[];
}

export interface ICostCost {
  value: number;
  etd: string;
  note: string;
}

export interface IStatus {
  code: number;
  description: string;
}
