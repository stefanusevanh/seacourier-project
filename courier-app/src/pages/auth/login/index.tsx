import { Button, ButtonBorderOnly } from "@/components/Button";
import { Form, FormInput } from "@/components/Form";
import useAdmin from "@/utils/api/useAdmin";
import useUsers from "@/utils/api/useUsers";
import { setCookie } from "@/utils/cookies";
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

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isButtonFirstClicked, setIsButtonFirstClicked] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
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
    getAdmin,
  } = useAdmin();

  const handleErrorMessages = (
    inputType: "email" | "fullname" | "password" | "confirmPassword"
  ) => {
    switch (inputType) {
      case "email":
        if (V.isFormFieldEmpty(email)) {
          return "Please input email";
        }
        if (!V.isEmailValid(email)) {
          return "Wrong email format (ex: example@domain.com)";
        }
        break;
      case "password":
        if (V.isFormFieldEmpty(password)) {
          return "Please input password";
        }
        if (!V.isPasswordValid(password)) {
          return `Password must be ${V.minPasswordLength} characters long or more`;
        }
        break;
    }
    if (!isUserRegistered) {
      return "Invalid email or password";
    }

    return "This error is not shown";
  };

  useEffect(() => {
    //to set off the error "Invalid email or password" after the user changes the email or password
    setIsButtonFirstClicked(false);
  }, [email, password]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !V.isAllFieldFilled([email, password]) ||
      !V.isEmailValid(email) ||
      !V.isPasswordValid(password)
    ) {
      setIsButtonLoading(false);
      return;
    }

    setTimeout(() => {
      const registeredAdmin = admin?.find(
        (person) => person.email === email && person.password === password
      );
      const registeredUser = users?.find(
        (person) => person.email === email && person.password === password
      );

      if (registeredAdmin !== undefined || registeredUser !== undefined) {
        setIsUserRegistered(true);
        if (registeredAdmin !== undefined) {
          setCookie("token", registeredAdmin.token, 1);
        } else if (registeredUser !== undefined) {
          setCookie("token", registeredUser.token, 1);
        }
        toast.success(
          `Log in successful. Welcome, ${
            registeredAdmin !== undefined
              ? `${registeredAdmin.name} (Admin #${registeredAdmin?.id})`
              : ""
          }${registeredUser !== undefined ? registeredUser.name : ""}! `,
          {
            duration: 2000,
          }
        );
        setTimeout(() => {
          router.push("/home");
        }, 1200);
      }
      setIsButtonLoading(false);
    }, 1000);
  };

  return (
    <>
      <Form onSubmit={handleFormSubmit} formnovalidate={true}>
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
            (!isUserRegistered &&
              !isLoadingUser &&
              !isLoadingAdmin &&
              isButtonFirstClicked &&
              !isButtonLoading)
          }
        />
        <FormInput
          type="password"
          titleText="Password"
          placeholder="Input your password.."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          errorText={handleErrorMessages("password")}
          isError={
            (V.isFormFieldEmpty(password) && isButtonClicked) ||
            (!V.isPasswordValid(password) && !V.isFormFieldEmpty(password)) ||
            (!isUserRegistered &&
              !isLoadingUser &&
              !isLoadingAdmin &&
              isButtonFirstClicked &&
              !isButtonLoading)
          }
        />
        <div className="flex flex-row justify-between items-center">
          <div className="form-control">
            <label className="label cursor-pointer flex flex-row gap-2">
              <input type="checkbox" className="checkbox " />
              <span className="label-text">Remember me?</span>
            </label>
          </div>
          <span className="label-text cursor-pointer text-primary_red">
            Forgot password?
          </span>
        </div>
        <Button
          onClick={() => {
            setIsButtonClicked(true);
            setIsButtonFirstClicked(true);
            setIsButtonLoading(true);
          }}
          type="submit"
          isLoading={isButtonLoading}
        >
          Log In
        </Button>
      </Form>
      <BorderLoginOption />
      <ButtonBorderOnly>
        <div className="flex flex-row gap-4 mx-auto">
          <FcGoogle />
          <span>Log in with Google</span>
        </div>
      </ButtonBorderOnly>
      <div>
        Don&apos;t have account?{" "}
        <Link href="/auth/register" className="text-primary_orange font-medium">
          Create a new account!
        </Link>
      </div>
    </>
  );
};

export default Login;
