import { IShippingDetail, IUser } from "@/types/api";
import useUpdateUser from "@/utils/api/useUpdateUser";
import {
  isFormFieldEmpty,
  isPasswordValid,
  minPasswordLength,
} from "@/utils/formFieldValidation";
import { useEffect, useState } from "react";
import { Modal } from ".";
import { currencyFormat } from "@/utils/currencyFormat";
import { Form, FormInput } from "../Form";
import { Button, ButtonBorderOnly } from "../Button";
import { RiShieldCheckFill } from "react-icons/ri";
import useUpdateShipping from "@/utils/api/useUpdateShipping";
import { useAppSelector } from "@/stores/store";

export const PaymentDetail = ({
  paidAmount,
  user,
}: {
  paidAmount: number;
  user: IUser | null;
}) => {
  return (
    <table className="table">
      <tbody>
        <tr>
          <td>Amount to pay:</td>
          <td>{currencyFormat(paidAmount)}</td>
        </tr>
        <tr>
          <td>Your balance:</td>
          <td>
            {user !== undefined &&
              user !== null &&
              currencyFormat(user.balance)}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export const PaymentModal = ({
  user,
  paidAmount,
  isModalShown,
  setIsModalShown,
  stepNum,
  setStepNum,
}: {
  user: IUser | null;
  paidAmount: number;
  isModalShown: boolean;
  setIsModalShown: React.Dispatch<React.SetStateAction<boolean>>;
  stepNum: number;
  setStepNum: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [password, setPassword] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const {
    user: updatedUser,
    isLoading: isUpdatingUserData,
    updateUserData,
  } = useUpdateUser();
  const { updateShippingData } = useUpdateShipping();
  const shippingDetails = useAppSelector((state) => state.shipping);

  const handleErrorMessages = (inputType: "password") => {
    switch (inputType) {
      case "password":
        if (isFormFieldEmpty(password)) {
          return "Please input password";
        }
        if (!isPasswordValid(password)) {
          return `Password must be ${minPasswordLength} characters long or more`;
        }
        if (user !== null && user.password !== password) {
          return "Wrong password";
        }
        break;
    }
    return "This error is not shown";
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      isPasswordValid(password) &&
      user !== null &&
      user.password === password
    ) {
      setIsPaymentLoading(true);
      updateUserData(user.id, { balance: user.balance - paidAmount });
      updateShippingData(
        "ADD",
        user.id,
        shippingDetails as Partial<IShippingDetail>
      );
    }
  };

  useEffect(() => {
    if (updatedUser !== null && user !== null && updatedUser.id === user.id) {
      setIsPaymentSuccess(true);
    }
  }, [updatedUser]);

  useEffect(() => {
    if (isPaymentSuccess) {
      setTimeout(() => {
        setStepNum(stepNum + 1);
      }, 2000);
      setTimeout(() => {
        setIsPaymentLoading(false);
      }, 1500);
    }
  }, [isPaymentSuccess, isModalShown]);

  return (
    <Modal isModalShown={isModalShown} setIsModalShown={setIsModalShown}>
      <div className="p-4 md:p-5 text-center flex flex-col gap-4 justify-center">
        {(!isPaymentSuccess || isPaymentLoading) && (
          <>
            <div className="">
              <svg
                className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3 className="text-lg font-normal text-gray-500 dark:text-gray-400">
                Payment Confirmation
              </h3>
            </div>
            <div>
              <PaymentDetail paidAmount={paidAmount} user={user} />
              <Form onSubmit={handleSubmit}>
                <FormInput
                  type="password"
                  titleText="Password"
                  placeholder="Input your password.."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  errorText={handleErrorMessages("password")}
                  isError={
                    (isFormFieldEmpty(password) && isButtonClicked) ||
                    (!isPasswordValid(password) &&
                      !isFormFieldEmpty(password)) ||
                    (user !== null &&
                      user.password !== password &&
                      isButtonClicked)
                  }
                />
                <div className="flex flex-row gap-2 justify-center">
                  <div className="w-48">
                    <Button
                      type="submit"
                      withoutHoverEffect
                      onClick={() => {
                        setIsButtonClicked(true);
                      }}
                      isLoading={isPaymentLoading}
                    >
                      Order Shipment
                    </Button>
                  </div>
                  <div>
                    <ButtonBorderOnly onClick={() => setIsModalShown(false)}>
                      Cancel
                    </ButtonBorderOnly>
                  </div>
                </div>
              </Form>
            </div>
          </>
        )}
        {isPaymentSuccess && !isPaymentLoading && (
          <>
            <div className="flex justify-center">
              <RiShieldCheckFill size={100} color={"#1dc009"} />
            </div>
            <span>Payment Successful</span>
          </>
        )}
      </div>
    </Modal>
  );
};
