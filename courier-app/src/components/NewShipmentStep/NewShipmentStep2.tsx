import { useAppDispatch, useAppSelector } from "@/stores/store";
import React, { useEffect, useState } from "react";
import { Card } from "../Card/Card";
import { addOnsMap, addOnsPriceMap } from "@/utils/addOnsMap";
import { saveShipmentDetails } from "@/stores/shippingSlice/shippingSlice";
import { Button, ButtonBorderOnly } from "../Button";
import { FormInput } from "../Form";
import {
  isFormFieldEmpty,
  isPromoCodeLengthValid,
  maxPromoCodeDigits,
} from "@/utils/formFieldValidation";
import usePromoCode from "@/utils/api/usePromoCode";
import { IUser } from "@/types/api";
import { currencyFormat } from "@/utils/currencyFormat";
import { PaymentDetail } from "../Modal";

const NewShipmentStep2 = ({
  user,
  paidAmount,
  setPaidAmount,
  setIsModalShown,
}: {
  user: IUser | null;
  paidAmount: number;
  setPaidAmount: React.Dispatch<React.SetStateAction<number>>;
  setIsModalShown: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();
  const shipmentDetails = useAppSelector((state) => state.shipping);
  const [promoInput, setPromoInput] = useState("");
  const [isPromoShown, setIsPromoShown] = useState(false);
  const [isButtonCheckClicked, setIsButtonCheckClicked] = useState(false);
  const [isButtonCheckFirstClicked, setIsButtonCheckFirstClicked] =
    useState(false);
  const {
    availablePromoCode,
    isLoading: isLoadingPromoCode,
    findPromoCode,
  } = usePromoCode();

  const isPromoCodeExists =
    availablePromoCode !== undefined &&
    availablePromoCode !== null &&
    availablePromoCode.promoCode === promoInput;
  const isPromoCodeQuotaOK =
    availablePromoCode !== undefined &&
    availablePromoCode !== null &&
    availablePromoCode.quota > availablePromoCode.used;
  const isPromoCodeExpired =
    availablePromoCode !== undefined &&
    availablePromoCode !== null &&
    availablePromoCode.expiryDate < new Date().toISOString();
  const isPromoCodeEligible =
    isPromoCodeExists && isPromoCodeQuotaOK && !isPromoCodeExpired;

  const PaymentTable = () => {
    const subTotal =
      shipmentDetails.cost! + addOnsPriceMap[shipmentDetails.addOns];
    useEffect(() => {
      if (
        isPromoCodeEligible &&
        !isFormFieldEmpty(promoInput) &&
        isButtonCheckFirstClicked
      ) {
        setPaidAmount((subTotal * (100 - availablePromoCode.discount)) / 100);
        return;
      }
      setPaidAmount(subTotal);
    }, [shipmentDetails.cost, availablePromoCode]);

    return (
      <div className="overflow-x-auto">
        <table className="table">
          <tbody>
            <tr>
              <td>Shipping</td>
              <td>
                {shipmentDetails.cost !== undefined &&
                  currencyFormat(shipmentDetails.cost)}
              </td>
            </tr>
            {shipmentDetails.addOns !== "0" && (
              <tr>
                <td>Add Ons</td>
                <td>
                  {currencyFormat(addOnsPriceMap[shipmentDetails.addOns])}
                </td>
              </tr>
            )}
            {isPromoCodeEligible &&
              !isFormFieldEmpty(promoInput) &&
              shipmentDetails.addOns !== "0" &&
              isButtonCheckFirstClicked && (
                <tr className="bg-base-200">
                  <td>Sub Total</td>
                  <td>{currencyFormat(subTotal)}</td>
                </tr>
              )}
            {isPromoCodeEligible &&
              !isFormFieldEmpty(promoInput) &&
              isButtonCheckFirstClicked && (
                <tr>
                  <td>{availablePromoCode.promoCode}</td>
                  <td>
                    {currencyFormat(
                      -(availablePromoCode.discount * subTotal) / 100
                    )}
                  </td>
                </tr>
              )}
            <tr className="bg-base-200">
              <td>Total</td>
              <td>{currencyFormat(paidAmount)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  const handleErrorPromo = (promoInput: string) => {
    if (isFormFieldEmpty(promoInput) && isButtonCheckClicked) {
      return "Please input your promo code";
    }
    if (
      !isPromoCodeLengthValid(promoInput) ||
      (!isPromoCodeExists && isButtonCheckFirstClicked)
    ) {
      return "Seems like this code is invalid. Try again!";
    }
    if (isPromoCodeExpired) {
      return "Oops! This promo has expired";
    }
    if (!isPromoCodeQuotaOK) {
      return "Oops! This promo has reached the usage limit";
    }
    return "This error is not shown";
  };
  const handleCheckPromo = (promoInput: string) => {
    if (!isFormFieldEmpty(promoInput)) {
      findPromoCode(promoInput);
      return;
    }
    return;
  };

  const handlePayment = () => {
    if (
      isFormFieldEmpty(promoInput) ||
      (isPromoCodeLengthValid(promoInput) &&
        isPromoCodeEligible &&
        !isLoadingPromoCode)
    ) {
      if (user !== undefined && user !== null && user.balance > paidAmount) {
        dispatch(
          saveShipmentDetails({
            promoUsed: availablePromoCode,
            paidAmount: paidAmount,
          })
        );
      }
      setIsModalShown(true);
    }
  };

  useEffect(() => {
    setIsButtonCheckFirstClicked(false);
  }, [promoInput]);

  return (
    <div className="flex flex-row gap-6 justify-center">
      <div className="w-6/12">
        <Card>
          <table className="table">
            <tbody>
              <tr>
                <td>Package Length</td>
                <td>{shipmentDetails.length} cm</td>
              </tr>
              <tr>
                <td>Package Width</td>
                <td>{shipmentDetails.width} cm</td>
              </tr>
              <tr>
                <td>Package Height</td>
                <td>{shipmentDetails.height} cm</td>
              </tr>
              <tr>
                <td>Package Weight</td>
                <td>{shipmentDetails.weight} gram</td>
              </tr>
              <tr>
                <td>Origin</td>
                <td>
                  <div>
                    <p>{shipmentDetails.originAddress?.branchName}</p>
                    <p>{`${shipmentDetails.originAddress?.street}`}</p>
                    <p>{`${shipmentDetails.originAddress?.city}, ${shipmentDetails.originAddress?.province}`}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Destination</td>
                <td>
                  <div>
                    <p>{`${shipmentDetails.destinationAddress?.receiverName} (${shipmentDetails.destinationAddress?.receiverPhone})`}</p>
                    <p>{`${shipmentDetails.destinationAddress?.street}`}</p>
                    <p>{`${shipmentDetails.destinationAddress?.city}, ${shipmentDetails.destinationAddress?.province}`}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Category</td>
                <td>{shipmentDetails.category}</td>
              </tr>
              <tr>
                <td>Add Ons</td>
                <td>{addOnsMap[shipmentDetails.addOns]}</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
      <div className="w-3/12">
        <div className="flex flex-col gap-2">
          {!isPromoShown ? (
            <ButtonBorderOnly onClick={() => setIsPromoShown(true)}>
              Use Promo
            </ButtonBorderOnly>
          ) : (
            <FormInput
              type="string"
              placeholder="Ex: PROMO45"
              titleText="Promo Code:"
              value={promoInput}
              onChange={(e) => {
                if (e.target.value.length <= maxPromoCodeDigits) {
                  setPromoInput(
                    e.target.value.replace(/([^a-zA-Z0-9])/g, "").toUpperCase()
                  );
                }
              }}
              errorText={handleErrorPromo(promoInput)}
              isError={
                !isPromoCodeLengthValid(promoInput) ||
                (!isPromoCodeEligible &&
                  !isLoadingPromoCode &&
                  isButtonCheckFirstClicked)
              }
              correctText={`Yay! You got promo: ${availablePromoCode?.discount}% off`}
              isCorrect={isPromoCodeEligible && !isLoadingPromoCode}
              withElementAtRight={
                <div className="self-end">
                  <Button
                    withoutHoverEffect
                    onClick={() => {
                      setIsButtonCheckClicked(true);
                      setIsButtonCheckFirstClicked(true);
                      handleCheckPromo(promoInput);
                    }}
                  >
                    Check
                  </Button>
                </div>
              }
            />
          )}
          <Card cardPadding="py-4">
            <h2>Payment Summary</h2>
            <PaymentTable />
          </Card>
          <Card cardPadding="py-4">
            <h2>Payment</h2>
            <div className="overflow-x-auto">
              <PaymentDetail paidAmount={paidAmount} user={user} />
            </div>
            <Button withoutHoverEffect onClick={() => handlePayment()}>
              Order Shipment
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewShipmentStep2;
