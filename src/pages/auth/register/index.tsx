import { Button, ButtonBorderOnly } from "@/components/Button";
import { Form, FormInput } from "@/components/Form";
import useAdmins from "@/utils/api/useAdmins";
import useRefCode from "@/utils/api/useRefCode";
import { useRegisterUser } from "@/utils/api/useRegisterUser";
import useUpdateUser from "@/utils/api/useUpdateUser";
import useUsers from "@/utils/api/useUsers";
import * as V from "@/utils/formFieldValidation";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

const BorderLoginOption = () => {
  return (
    <div className="flex flex-row justify-between my-2 ">
      <div className="w-full m-auto">
        <div className="border-solid border-[1px] border-[grey] w-full m-auto"></div>
      </div>
      <div className="mx-12 flex flex-row gap-4  ">
        <span>Or</span>
      </div>
      <div className="w-full m-auto">
        <div className="border-solid border-[1px] border-[grey] w-full m-auto"></div>
      </div>
    </div>
  );
};

const Register = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [refCodeFriend, setRefCodeFriend] = useState("");
  const isConfirmPasswordDoesNotMatch = confirmPassword !== password;

  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isButtonFirstClicked, setIsButtonFirstClicked] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [isRefCodeFriendExists, setIsRefCodeFriendExists] = useState(false);
  const {
    users,
    isLoading: isLoadingUser,
    isValidating: isValidatingUser,
    error: errorUser,
    getUsers,
  } = useUsers();
  const {
    admin,
    isLoading: isLoadingAdmin,
    isValidating: isValidatingAdmin,
    error: errorAdmin,
    getAdmins,
  } = useAdmins();
  const { registerError, registerUser } = useRegisterUser();
  const { referredUser, findRefCode } = useRefCode();
  const { updateUserData } = useUpdateUser();
  const handleErrorMessages = (
    inputType:
      | "email"
      | "fullname"
      | "phoneNum"
      | "refCodeFriend"
      | "password"
      | "confirmPassword"
  ) => {
    switch (inputType) {
      case "fullname":
        if (V.isFormFieldEmpty(fullName)) {
          return "Please enter your name";
        }
        if (!V.isNameValid(fullName)) {
          return "Name cannot contain any symbol or number";
        }
        break;
      case "email":
        if (V.isFormFieldEmpty(email)) {
          return "Please input email";
        }
        if (!V.isEmailValid(email)) {
          return "Wrong email format (ex: example@domain.com)";
        }
        if (isUserRegistered) {
          return "Account with same email is already registered";
        }
        break;
      case "phoneNum":
        if (V.isFormFieldEmpty(phoneNum)) {
          return "Please input phone number";
        }
        if (!V.isPhoneNumValid(phoneNum)) {
          return `Must be ${V.minPhoneNumDigit}-${V.maxPhoneNumDigit} digits and starts with "${V.phoneNumStartDigits}" `;
        }
        break;
      case "refCodeFriend":
        if (!V.isRefCodeLengthValid(refCodeFriend)) {
          return `Must be ${V.refCodeDigits} digits or empty`;
        }
        if (referredUser?.length === 0 && !V.isFormFieldEmpty(refCodeFriend)) {
          return "Invalid code";
        }
        break;
      case "password":
        if (V.isFormFieldEmpty(password)) {
          return "Please input password";
        }
        if (!V.isPasswordValid(password)) {
          return `Must be ${V.minPasswordLength}-${V.maxPasswordLength} characters long`;
        }
        break;
      case "confirmPassword":
        if (
          (isConfirmPasswordDoesNotMatch &&
            !V.isFormFieldEmpty(confirmPassword)) ||
          (V.isFormFieldEmpty(confirmPassword) && isButtonClicked)
        ) {
          return "Password does not match";
        }
        break;
    }

    return "This error is not shown";
  };

  useEffect(() => {
    setIsButtonFirstClicked(false);
  }, [email, password, refCodeFriend]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isAllFieldValid =
      V.isAllFieldFilled([
        fullName,
        email,
        phoneNum,
        password,
        confirmPassword,
      ]) &&
      V.isNameValid(fullName) &&
      V.isEmailValid(email) &&
      V.isPhoneNumValid(phoneNum) &&
      V.isRefCodeLengthValid(refCodeFriend) &&
      V.isPasswordValid(password) &&
      !isConfirmPasswordDoesNotMatch;

    if (!isAllFieldValid) {
      setIsButtonLoading(false);
      return;
    }
    getUsers();
    getAdmins();

    if (refCodeFriend.length === V.refCodeDigits) {
      findRefCode(refCodeFriend);
    } else {
      dataValidation();
    }
  };

  const dataValidation = () => {
    setTimeout(() => {
      const existingAdmin = admin?.find((person) => person.email === email);
      const existingUser = users?.find((person) => person.email === email);
      const isRefCodeFriendInvalid =
        referredUser?.length === 0 && !V.isFormFieldEmpty(refCodeFriend);
      if (
        existingAdmin === undefined &&
        existingUser === undefined &&
        !isRefCodeFriendInvalid
      ) {
        setIsUserRegistered(false);
        setIsRefCodeFriendExists(true);
        setIsButtonLoading(false);
        registerUser(email, password, fullName, phoneNum, refCodeFriend);
        if (referredUser?.length !== 0 && referredUser !== null) {
          updateUserData(referredUser![0].id, {
            countRefCode: referredUser![0].countRefCode + 1,
          });
        }
        toast.success(
          "Sign up successful. Please log in with the registered email.",
          {
            duration: 2000,
          }
        );
        setTimeout(() => {
          router.push("/auth/login");
        }, 1000);
        return;
      }
      if (existingAdmin !== undefined || existingUser !== undefined) {
        setIsUserRegistered(true);
      }
      if (isRefCodeFriendInvalid) {
        setIsRefCodeFriendExists(false);
      }
      setIsButtonLoading(false);
      return;
    }, 1000);
  };

  useEffect(() => {
    if (isButtonLoading && isButtonClicked && isButtonFirstClicked) {
      dataValidation();
    }
  }, [referredUser]);

  return (
    <>
      <Form onSubmit={handleFormSubmit} formnovalidate={true}>
        <FormInput
          type="text"
          placeholder="Input your full name.."
          titleText="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          errorText={handleErrorMessages("fullname")}
          isError={
            (V.isFormFieldEmpty(fullName) && isButtonClicked) ||
            !V.isNameValid(fullName)
          }
        />
        <FormInput
          type="email"
          titleText="Email address"
          placeholder="Input your email address.."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          errorText={handleErrorMessages("email")}
          isError={
            (V.isFormFieldEmpty(email) && isButtonClicked) ||
            (!V.isEmailValid(email) && !V.isFormFieldEmpty(email)) ||
            (isUserRegistered && isButtonFirstClicked && !isButtonLoading)
          }
        />
        <div className="grid grid-cols-[0.55fr_0.45fr] gap-4">
          <FormInput
            type="text"
            placeholder="Input your phone number.."
            titleText="Phone Number"
            value={phoneNum}
            onChange={(e) => {
              if (e.target.value.length <= V.maxPhoneNumDigit) {
                setPhoneNum(e.target.value.replace(/[^\d]/g, ""));
              }
            }}
            errorText={handleErrorMessages("phoneNum")}
            isError={
              (V.isFormFieldEmpty(phoneNum) && isButtonClicked) ||
              (!V.isPhoneNumValid(phoneNum) && !V.isFormFieldEmpty(phoneNum))
            }
          />
          <FormInput
            type="text"
            placeholder="Ex: uKZ9zv (optional)"
            titleText="Friend's Referral Code"
            value={refCodeFriend}
            onChange={(e) => {
              if (e.target.value.length <= V.refCodeDigits) {
                setRefCodeFriend(e.target.value.replace(/([^a-zA-Z0-9])/g, ""));
              }
            }}
            errorText={handleErrorMessages("refCodeFriend")}
            isError={
              !V.isRefCodeLengthValid(refCodeFriend) ||
              (referredUser?.length === 0 &&
                !V.isFormFieldEmpty(refCodeFriend) &&
                !isButtonLoading &&
                isButtonFirstClicked)
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            type="password"
            titleText="Password"
            placeholder="Input your password.."
            value={password}
            onChange={(e) => {
              if (e.target.value.length <= V.maxPasswordLength) {
                setPassword(e.target.value);
              }
            }}
            errorText={handleErrorMessages("password")}
            isError={
              (V.isFormFieldEmpty(password) && isButtonClicked) ||
              (!V.isPasswordValid(password) && !V.isFormFieldEmpty(password))
            }
          />{" "}
          <FormInput
            type="password"
            titleText="Confirmation Password"
            placeholder="Retype password.."
            value={confirmPassword}
            onChange={(e) => {
              if (e.target.value.length <= V.maxPasswordLength) {
                setConfirmPassword(e.target.value);
              }
            }}
            errorText={handleErrorMessages("confirmPassword")}
            isError={
              (isConfirmPasswordDoesNotMatch &&
                !V.isFormFieldEmpty(confirmPassword)) ||
              (V.isFormFieldEmpty(confirmPassword) && isButtonClicked)
            }
          />
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="form-control">
            <label className="label cursor-pointer flex flex-row gap-2">
              <input type="checkbox" className="checkbox" />
              <span className="label-text">
                I have read and agree to{" "}
                <span className="cursor-pointer text-primary_blue font-semibold">
                  Terms & Conditions
                </span>
              </span>
            </label>
          </div>
        </div>
        <Button
          onClick={() => {
            setIsButtonClicked(true);
            setIsButtonFirstClicked(true);
            setIsButtonLoading(true);
            setIsUserRegistered(false);
          }}
          type="submit"
          isLoading={isButtonLoading}
        >
          Register
        </Button>
      </Form>
      <BorderLoginOption />
      <ButtonBorderOnly>
        <div className="flex flex-row gap-4 mx-auto">
          <FcGoogle />
          <span>Sign up with Google</span>
        </div>
      </ButtonBorderOnly>
      <div>
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary_orange font-medium ">
          Sign in!
        </Link>
      </div>
    </>
  );
};

export default Register;
