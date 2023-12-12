import React, { ReactNode, useEffect, useState } from "react";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { BsWallet } from "react-icons/bs";
import { RiStore3Fill } from "react-icons/ri";
import { BiWallet } from "react-icons/bi";
import { FormInput } from "@/components/Form";
import { currencyFormat } from "@/utils/currencyFormat";
import {
  isTopupAmountValid,
  maxTopupAmount,
  minTopupAmount,
} from "@/utils/formFieldValidation";
import { Button } from "@/components/Button";
import useUpdateUser from "@/utils/api/useUpdateUser";
import { useAppSelector } from "@/stores/store";
import useUser from "@/utils/api/useUser";
import { toast } from "sonner";

const SmallCard = ({ children }: { children: ReactNode }) => {
  return (
    <div className="card w-full max-w-52 bg-base-100  items-center border-[grey] border-[1px] cursor-pointer">
      <div className="card-body items-center">{children}</div>
    </div>
  );
};
const BigCard = ({ children }: { children: ReactNode }) => {
  return (
    <div className="card w-full bg-base-100 shadow-2xl items-center mx-auto">
      <div className="card-body items-center w-full">{children}</div>
    </div>
  );
};

const OptionCard = ({
  textMain,
  textSecondary,
  defaultValue,
  defaultChecked,
  checked,
  onChange,
  onClick,
}: {
  textMain: string;
  textSecondary?: string;
  defaultValue: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: () => void;
  onClick?: (e: any) => void;
}) => {
  return (
    <div>
      <input
        type="radio"
        name="OptionCard"
        defaultValue={defaultValue}
        id={defaultValue}
        className="peer hidden [&:checked_+_label_svg]:block"
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange}
      />
      <label
        id={defaultValue}
        htmlFor={defaultValue}
        onClick={onClick}
        className="block cursor-pointer rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 peer-checked:border-blue-500 peer-checked:ring-1 peer-checked:ring-blue-500"
      >
        <div className="flex items-center justify-between">
          <p className="text-gray-700">{textMain}</p>
          <svg
            className="hidden h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        {textSecondary && <p className="mt-1 text-gray-900">{textSecondary}</p>}
      </label>
    </div>
  );
};

const Topup = () => {
  const [topupAmount, setTopupAmount] = useState(0);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const optionTopupAmount = [
    25000, 50000, 100000, 500000, 1000000, 2500000, 5000000, 10000000,
  ];
  const userID = useAppSelector((state) => state.roleID.user_id);
  const { user, getUser } = useUser();
  const {
    user: updatedUser,
    isLoading: isUpdatingUserData,
    updateUserData,
  } = useUpdateUser();

  useEffect(() => {
    getUser(userID);
  }, [userID]);

  const handleTopupBalance = () => {
    if (isTopupAmountValid(topupAmount) && user !== null) {
      updateUserData(userID, { balance: user.balance + topupAmount });
      console.log("update");
    }
  };
  useEffect(() => {
    if (!isUpdatingUserData && updatedUser !== null) {
      toast.success("Top up succesful", { duration: 1500 });
      setTopupAmount(0);
      setIsButtonClicked(false);
      getUser(userID);
    }
  }, [isUpdatingUserData, updatedUser]);

  return (
    <div className="w-full max-w-[800px] mx-auto">
      Topup
      {user !== null && (
        <p>
          Balance: {updatedUser === null ? user.balance : updatedUser.balance}
        </p>
      )}
      <div className="mb-8">
        <BigCard>
          <div>
            <h2>Methods</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center mb-6">
              <SmallCard>
                <FaMoneyBillTransfer size={50} />
                <span>Bank Transfer</span>
              </SmallCard>
              <SmallCard>
                <BsWallet size={50} />
                <span>Virtual Account</span>
              </SmallCard>
              <SmallCard>
                <RiStore3Fill size={50} />
                <span>Merchant</span>
              </SmallCard>
              <SmallCard>
                <BiWallet size={50} />
                <span>E-Wallet</span>
              </SmallCard>
            </div>
          </div>
          <div className="w-full">
            <h2>Top Up Amount</h2>
            <div
              className="grid grid-cols-2  sm:grid-cols-3 lg:grid-cols-4  gap-4 justify-between w-full"
              onClick={() => setIsButtonClicked(false)}
            >
              {optionTopupAmount.map((amount, idx) => {
                return (
                  <OptionCard
                    key={idx}
                    defaultValue={amount.toString()}
                    textMain={currencyFormat(amount)}
                    defaultChecked={idx === 1}
                    checked={amount === topupAmount}
                    onChange={() => setTopupAmount(amount)}
                  />
                );
              })}
            </div>
            <div className="divider my-8 mb-5">OR</div>
            <div className="w-full max-w-xs mx-auto flex flex-col gap-2">
              <div onClick={() => setTopupAmount(0)}>
                <FormInput
                  type="text"
                  withPrefix="Rp"
                  placeholder="Input your top up amount.."
                  value={
                    topupAmount === 0 ? "" : topupAmount.toLocaleString("id-ID")
                  }
                  errorText={`Price must be between ${currencyFormat(
                    minTopupAmount
                  )} - ${currencyFormat(maxTopupAmount)}`}
                  isError={
                    (!isTopupAmountValid(topupAmount) && topupAmount !== 0) ||
                    (topupAmount === 0 && isButtonClicked)
                  }
                  onChange={(e) => {
                    if (
                      e.target.value.replace(/[^\d]/g, "").length <=
                      maxTopupAmount.toString().length
                    ) {
                      setTopupAmount(
                        Number(e.target.value.replace(/[^\d]/g, ""))
                      );
                    }
                  }}
                />
              </div>
              <Button
                type="submit"
                onClick={() => {
                  setIsButtonClicked(true);
                  handleTopupBalance();
                }}
              >
                Top Up
              </Button>
            </div>
          </div>
        </BigCard>
      </div>
    </div>
  );
};

export default Topup;
