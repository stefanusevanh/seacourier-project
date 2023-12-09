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

export interface IAddress {
  city: string;
  province: string;
  street: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOriginAddress {
  id: number;
  addresses: IAddress[];
}

export interface IDestinationAddress {
  id: number;
  userId: number;
  addresses: IAddress[];
}

export interface IShippingDetail {
  length: number;
  width: number;
  height: number;
  weight: number;
  origin: string;
  destination: string;
  receiverName: string;
  receiverPhone: string;
  cost: number;
  status: string;
  promoUsed: string;
  category: "OKE" | "REG" | "SPS" | "YES";
  addOns: "1" | "2";
  review: "" | "0" | "1" | "2" | "3" | "4" | "5";
  createdAt: string;
  updatedAt: string;
}

export interface IShippingList {
  id: number;
  userId: number;
  detail: IShippingDetail[];
}
