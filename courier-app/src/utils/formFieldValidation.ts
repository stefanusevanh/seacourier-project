export const minTopupAmount = 10000;
export const maxTopupAmount = 10000000;
export const minPasswordLength = 8;
export const maxPasswordLength = 15;
export const minPhoneNumDigit = 10;
export const maxPhoneNumDigit = 12;
export const phoneNumStartDigits = "08";
export const refCodeDigits = 6;
export const maxPromoCodeDigits = 10;
export const maxTrackingNumberLength = 7;
export const maxPackageDimension = 1000; //cm
export const maxPackageWeight = 30000; //gram
export const maxStreetNameCharacter = 100;
export const maxBranchNameCharacter = 50;
export const maxPromoDiscount = 100; //%
export const maxPromoQuota = 999;

export const isFormFieldEmpty = (field: string) => field === "";

export const isAllFieldFilled = (fields: string[]) => {
  for (const field of fields) {
    if (isFormFieldEmpty(field)) {
      return false;
    }
  }
  return true;
};

export const isEmailValid = (email: string) => {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(email);
};

export const isPasswordValid = (password: string) =>
  password.length >= minPasswordLength;

export const isNameValid = (name: string) => {
  return name.match(/([^ a-zA-Z])/g) === null;
};

export const isBranchNameValid = (name: string) => {
  return name.match(/([^ a-zA-Z\d])/g) === null;
};

export const isPhoneNumValid = (phoneNum: string) =>
  phoneNum.length >= minPhoneNumDigit &&
  phoneNum.length <= maxPhoneNumDigit &&
  phoneNum.startsWith(phoneNumStartDigits);

export const isRefCodeLengthValid = (refCode: string) =>
  refCode.length === refCodeDigits || refCode.length === 0;

export const isTopupAmountValid = (amount: number) =>
  amount >= minTopupAmount && amount <= maxTopupAmount;

export const isPromoCodeLengthValid = (promoCode: string) =>
  promoCode.length >= 0 && promoCode.length <= maxPromoCodeDigits;

export const isPromoDiscountValid = (discount: number) =>
  discount > 0 && discount <= maxPromoDiscount;

export const isPromoQuotaValid = (quota: number) =>
  quota > 0 && quota <= maxPromoQuota;

export const isPackageDimensionValid = (dimension: number) =>
  dimension > 0 && dimension <= maxPackageDimension;

export const isPackageWeightValid = (weight: number) =>
  weight > 0 && weight <= maxPackageWeight;
