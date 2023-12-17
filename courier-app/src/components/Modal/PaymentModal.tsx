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
import { PiWarningCircleBold } from "react-icons/pi";
import Link from "next/link";
import { topupRoute } from "@/routes";
import useUpdatePromoCode from "@/utils/api/useUpdatePromoCode";

export const PaymentDetail = ({
  paidAmount,
  user,
}: {
  paidAmount: number;
  user: IUser | null;
}) => {
  const isBalanceSufficient = user !== null && user.balance >= paidAmount;
  return (
    <table className="table">
      <tbody>
        <tr>
          <td>Amount to pay:</td>
          <td>{currencyFormat(paidAmount)}</td>
        </tr>
        <tr>
          <td>Your balance:</td>
          <td className={`${!isBalanceSufficient ? "text-primary_red" : ""}`}>
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
  const { isLoading: isUpdatingShippingData, updateShippingData } =
    useUpdateShipping();
  const { isUpdatingPromoCode, updatePromoCode } = useUpdatePromoCode();
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
      user.password === password &&
      user.balance > paidAmount &&
      isButtonClicked
    ) {
      setIsPaymentLoading(true);
      updateUserData(user.id, { balance: user.balance - paidAmount });
      updateShippingData(
        "ADD",
        user.id,
        shippingDetails as Partial<IShippingDetail>
      );
      if (
        shippingDetails.promoUsed !== undefined &&
        shippingDetails.promoUsed?.promoCode !== undefined &&
        shippingDetails.promoUsed?.promoCode !== ""
      ) {
        updatePromoCode(shippingDetails.promoUsed.id, {
          used: shippingDetails.promoUsed.used + 1,
        });
      }
    }
  };

  useEffect(() => {
    if (
      updatedUser !== null &&
      user !== null &&
      updatedUser.id === user.id &&
      !isUpdatingUserData &&
      !isUpdatingShippingData &&
      !isUpdatingPromoCode
    ) {
      setIsPaymentSuccess(true);
    }
  }, [
    updatedUser,
    isUpdatingUserData,
    isUpdatingShippingData,
    isUpdatingPromoCode,
  ]);

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

  const isBalanceSufficient =
    user !== null && user !== undefined && user.balance > paidAmount;

  return (
    <Modal isModalShown={isModalShown} setIsModalShown={setIsModalShown}>
      <div className="p-4 md:p-5 text-center flex flex-col gap-4 justify-center">
        {(!isPaymentSuccess || isPaymentLoading) && (
          <>
            <div className="flex flex-col">
              <div className="mx-auto mb-2">
                <PiWarningCircleBold
                  size={60}
                  color={`${isBalanceSufficient ? "black" : "red"}`}
                />
              </div>
              {isBalanceSufficient ? (
                <h3 className="text-lg font-normal text-gray-500 dark:text-gray-400">
                  Payment Confirmation
                </h3>
              ) : (
                <h3 className="text-lg font-normal text-primary_red dark:text-gray-400">
                  <span>Insufficient Balance</span>
                </h3>
              )}
            </div>
            <div>
              <div className="w-4/5 mx-auto">
                <PaymentDetail paidAmount={paidAmount} user={user} />
              </div>
              <Form onSubmit={handleSubmit}>
                {isBalanceSufficient && (
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
                )}
                <div className="flex flex-row gap-2 justify-center my-2">
                  <div className="w-48">
                    {isBalanceSufficient ? (
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
                    ) : (
                      <Link href={topupRoute}>
                        <Button type="button" withoutHoverEffect>
                          Top Up
                        </Button>
                      </Link>
                    )}
                  </div>
                  <div>
                    <ButtonBorderOnly
                      onClick={() => {
                        setIsButtonClicked(false);
                        setIsModalShown(false);
                      }}
                    >
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
