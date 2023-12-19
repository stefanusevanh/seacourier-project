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
import { BigCard, OptionCard, SmallCard } from "@/components/Card/Card";

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
      <div className="my-8 relative">
        <BigCard>
          {user !== null && (
            <div className="absolute top-4 right-4 flex flex-row-reverse w-full h-fit text-center ">
              <div className="flex flex-row gap-2 h-fit rounded-full border-[grey] border-[1px] px-4 py-1 bg-primary_blue text-[white]">
                <span>Your Balance:</span>
                <span>
                  {currencyFormat(
                    updatedUser === null ? user.balance : updatedUser.balance
                  )}
                </span>
              </div>
            </div>
          )}
          <div>
            <h2 className="mb-2">Methods</h2>
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
            <h2 className="mb-2">Top Up Amount</h2>
            <div
              className="grid grid-cols-2  sm:grid-cols-3 lg:grid-cols-4  gap-4 justify-between w-full"
              onClick={() => setIsButtonClicked(false)}
            >
              {optionTopupAmount.map((amount, idx) => {
                return (
                  <OptionCard
                    key={idx}
                    optionName="TopupOption"
                    defaultValue={amount.toString()}
                    textMain={currencyFormat(amount)}
                    defaultChecked={false}
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
