export const minPasswordLength = 8;
export const maxPasswordLength = 15;
export const minPhoneNumDigit = 10;
export const maxPhoneNumDigit = 12;
export const phoneNumStartDigits = "08";
export const refCodeDigits = 6;

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

export const isPhoneNumValid = (phoneNum: string) =>
  phoneNum.length >= minPhoneNumDigit &&
  phoneNum.length <= maxPhoneNumDigit &&
  phoneNum.startsWith(phoneNumStartDigits);

export const isRefCodeLengthValid = (refCode: string) =>
  refCode.length === refCodeDigits || refCode.length === 0;
