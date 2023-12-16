import { useAppDispatch, useAppSelector } from "@/stores/store";
import React, { useEffect, useState } from "react";
import { Card } from "../Card/Card";
import { FaArrowCircleDown } from "react-icons/fa";
import useShipping from "@/utils/api/useShipping";
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
import { IUser, TShippingCategory } from "@/types/api";
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
  const { cost, getAvailableShipping: getCost } = useShipping();
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

  useEffect(() => {
    getCost(
      shipmentDetails.originAddress?.city!,
      shipmentDetails.destinationAddress?.city!,
      shipmentDetails.weight,
      shipmentDetails.category as TShippingCategory
    );
  }, []);

  useEffect(() => {
    if (cost !== undefined) {
      dispatch(saveShipmentDetails({ cost: cost }));
    }
  }, [cost]);

  const PaymentTable = () => {
    const subTotal = cost! + addOnsPriceMap[shipmentDetails.addOns];
    useEffect(() => {
      if (
        availablePromoCode !== null &&
        availablePromoCode.quota > availablePromoCode.used &&
        !isFormFieldEmpty(promoInput) &&
        isButtonCheckFirstClicked
      ) {
        setPaidAmount((subTotal * (100 - availablePromoCode.discount)) / 100);
        return;
      }
      setPaidAmount(subTotal);
    }, [cost, availablePromoCode]);

    return (
      <div className="overflow-x-auto">
        <table className="table">
          <tbody>
            <tr>
              <td>Shipping</td>
              <td>{cost !== undefined && currencyFormat(cost)}</td>
            </tr>
            <tr>
              <td>Add Ons</td>
              <td>{currencyFormat(addOnsPriceMap[shipmentDetails.addOns])}</td>
            </tr>
            {availablePromoCode !== null &&
              availablePromoCode.quota > availablePromoCode.used &&
              !isFormFieldEmpty(promoInput) &&
              isButtonCheckFirstClicked && (
                <>
                  <tr>
                    <td>Sub Total</td>
                    <td>{currencyFormat(subTotal)}</td>
                  </tr>
                  <tr>
                    <td>{availablePromoCode.promoCode}</td>
                    <td>
                      -
                      {currencyFormat(
                        (availablePromoCode.discount * subTotal) / 100
                      )}
                    </td>
                  </tr>
                </>
              )}
            <tr>
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
      availablePromoCode === null ||
      (availablePromoCode.promoCode !== promoInput && isButtonCheckFirstClicked)
    ) {
      return "Seems like this code is invalid. Try again!";
    }
    if (
      availablePromoCode !== null &&
      availablePromoCode?.quota === availablePromoCode.used
    ) {
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
        availablePromoCode !== null &&
        availablePromoCode.promoCode === promoInput &&
        availablePromoCode?.quota > availablePromoCode.used &&
        !isLoadingPromoCode)
    ) {
      dispatch(
        saveShipmentDetails({
          promoUsed: promoInput,
          paidAmount: paidAmount,
        })
      );
      setIsModalShown(true);
    }
  };

  useEffect(() => {
    setIsButtonCheckFirstClicked(false);
  }, [promoInput]);

  return (
    <div className="flex flex-row gap-4">
      <div className="w-9/12">
        <Card>
          <h2>Package Details</h2>
          <p>Package Length: {shipmentDetails.length} cm</p>
          <p>Package Width: {shipmentDetails.width} cm</p>
          <p>Package Height: {shipmentDetails.height} cm</p>
          <p>Package Weight: {shipmentDetails.weight} kg</p>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-6">
              <div className="w-full">
                <p>Origin:</p>
                <div>
                  <p>{shipmentDetails.originAddress?.branchName}</p>
                  <p>{`${shipmentDetails.originAddress?.street}`}</p>
                  <p>{`${shipmentDetails.originAddress?.city}, ${shipmentDetails.originAddress?.province}`}</p>
                </div>
              </div>
              <div className="pl-10">
                <FaArrowCircleDown size={30} />
              </div>
              <div className="w-full">
                <p>Destination:</p>
                <div>
                  <p>{`${shipmentDetails.destinationAddress?.receiverName} (${shipmentDetails.destinationAddress?.receiverPhone})`}</p>
                  <p>{`${shipmentDetails.destinationAddress?.street}`}</p>
                  <p>{`${shipmentDetails.destinationAddress?.city}, ${shipmentDetails.destinationAddress?.province}`}</p>
                </div>
              </div>
            </div>
            <div>
              <p>Category: {shipmentDetails.category}</p>
              <p>Shipping Cost:{cost}</p>
              <p>Add Ons: {addOnsMap[shipmentDetails.addOns]}</p>
            </div>
          </div>
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
                  setPromoInput(e.target.value.replace(/([^a-zA-Z0-9])/g, ""));
                }
              }}
              errorText={handleErrorPromo(promoInput)}
              isError={
                !isPromoCodeLengthValid(promoInput) ||
                ((availablePromoCode?.promoCode !== promoInput ||
                  availablePromoCode.quota === availablePromoCode.used) &&
                  !isLoadingPromoCode &&
                  isButtonCheckFirstClicked)
              }
              correctText={`Yay! You got promo: ${availablePromoCode?.discount}% off`}
              isCorrect={
                availablePromoCode !== null &&
                availablePromoCode.promoCode === promoInput &&
                availablePromoCode?.quota > availablePromoCode.used &&
                !isLoadingPromoCode
              }
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
          <Card>
            <h2>Payment Summary</h2>
            <PaymentTable />
          </Card>
          <Card>
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
