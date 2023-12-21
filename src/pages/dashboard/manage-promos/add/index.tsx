import { Form, FormInput } from "@/components/Form";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import * as V from "@/utils/formFieldValidation";
import usePromoCode from "@/utils/api/usePromoCode";
import { Button } from "@/components/Button";
import DateInput from "@/components/Form/DateInput";
import useUpdatePromoCode from "@/utils/api/useUpdatePromoCode";
import { toast } from "sonner";
import { dashboardPromosRoute } from "@/routes";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IPromo } from "@/types/api";
import { MdSave } from "react-icons/md";

const PromoDetail = ({
  isEditing,
  initialPromoData = {
    promoCode: "",
    discount: 0,
    quota: 0,
    expiryDate: "",
  },
  promoCodeId,
}: {
  isEditing?: boolean;
  initialPromoData?: Partial<IPromo>;
  promoCodeId?: number;
}) => {
  const router = useRouter();
  const [promoCode, setPromoCode] = useState(initialPromoData.promoCode!);
  const [discount, setDiscount] = useState(initialPromoData.discount!);
  const [quota, setQuota] = useState(initialPromoData.quota!);
  const [expiryDate, setExpiryDate] = useState(initialPromoData.expiryDate!);
  const [isButtonSaveClicked, setIsButtonSaveClicked] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const {
    availablePromoCode,
    isLoading: isFindingAvailablePromoCode,
    findPromoCode,
  } = usePromoCode();
  const { updatePromoCode } = useUpdatePromoCode();

  const handleAddPromo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsButtonSaveClicked(true);
    setIsButtonLoading(true);
    if (
      !V.isFormFieldEmpty(promoCode) &&
      V.isPromoCodeLengthValid(promoCode) &&
      V.isPromoDiscountValid(discount) &&
      V.isPromoQuotaValid(quota) &&
      !V.isFormFieldEmpty(expiryDate)
    ) {
      findPromoCode(promoCode.toUpperCase());
      return;
    }
    setIsButtonLoading(false);
  };

  useEffect(() => {
    const isPromoCodeExists =
      availablePromoCode !== undefined &&
      availablePromoCode !== null &&
      availablePromoCode.promoCode.toUpperCase() === promoCode.toUpperCase() &&
      availablePromoCode.promoCode.toUpperCase() !== initialPromoData.promoCode;

    const isPromoValidToBeAdded =
      !V.isFormFieldEmpty(promoCode) &&
      V.isPromoCodeLengthValid(promoCode) &&
      V.isPromoDiscountValid(discount) &&
      V.isPromoQuotaValid(quota) &&
      !isPromoCodeExists;

    if (
      isPromoValidToBeAdded &&
      isButtonSaveClicked &&
      !isFindingAvailablePromoCode
    ) {
      setIsButtonLoading(true);
      if (isEditing) {
        updatePromoCode("EDIT", promoCodeId, {
          promoCode: promoCode,
          discount: discount,
          quota: quota,
          expiryDate: expiryDate,
        });
      } else {
        updatePromoCode("ADD", undefined, {
          promoCode: promoCode,
          discount: discount,
          quota: quota,
          expiryDate: expiryDate,
          used: 0,
        });
      }
      setTimeout(() => {
        toast.success(
          isEditing ? `Edit promo successful` : "New promo has been added",
          { duration: 1500 }
        );
        router.push(dashboardPromosRoute);
        setIsButtonLoading(false);
      }, 1000);
      return;
    }
    if (availablePromoCode !== null) {
      setIsButtonLoading(false);
    }
  }, [availablePromoCode]);

  useEffect(() => {
    setIsButtonSaveClicked(false);
  }, [promoCode, discount, quota, expiryDate]);

  const handleErrorPromo = (promoInput: string) => {
    if (V.isFormFieldEmpty(promoInput)) {
      return "This field must not be empty";
    }
    if (!V.isPromoCodeLengthValid(promoInput)) {
      return `Please input max ${V.maxPromoCodeDigits} digits`;
    }
    if (
      availablePromoCode !== undefined &&
      availablePromoCode !== null &&
      availablePromoCode.promoCode.toUpperCase() === promoCode.toUpperCase() &&
      availablePromoCode.promoCode.toUpperCase() !== initialPromoData.promoCode
    ) {
      return "This promo code already exists";
    }

    return "This error is not shown";
  };
  return (
    <div className="">
      <div className="flex flex-row-reverse justify-between gap-4 items-center"></div>
      <div className="w-80">
        <Form onSubmit={handleAddPromo} formnovalidate>
          <FormInput
            type="string"
            placeholder="Input promo code"
            titleText="Promo Code:"
            value={promoCode}
            onChange={(e) => {
              if (e.target.value.length <= V.maxPromoCodeDigits) {
                setPromoCode(
                  e.target.value.replace(/([^a-zA-Z0-9])/g, "").toUpperCase()
                );
              }
            }}
            errorText={handleErrorPromo(promoCode)}
            isError={
              (V.isFormFieldEmpty(promoCode) && isButtonSaveClicked) ||
              !V.isPromoCodeLengthValid(promoCode) ||
              (availablePromoCode !== undefined &&
                availablePromoCode !== null &&
                availablePromoCode.promoCode.toUpperCase() ===
                  promoCode.toUpperCase() &&
                availablePromoCode.promoCode.toUpperCase() !==
                  initialPromoData.promoCode &&
                isButtonSaveClicked)
            }
          />
          <FormInput
            type="text"
            titleText="Discount"
            withSuffix={"%"}
            errorText={
              discount === 0
                ? "This field must not be empty"
                : `Max promo: ${V.maxPromoDiscount} `
            }
            isError={
              (discount === 0 && isButtonSaveClicked) ||
              (!V.isPromoDiscountValid(discount) && discount !== 0)
            }
            placeholder="Input promo discount.."
            value={discount === 0 ? "" : discount}
            onChange={(e) => {
              const inputValue = Number(e.target.value.replace(/[^\d]/g, ""));
              if (
                inputValue >= 0 &&
                inputValue.toString().length <=
                  V.maxPromoDiscount.toString().length
              ) {
                setDiscount(inputValue);
              }
            }}
          />
          <FormInput
            type="text"
            titleText="Quota"
            errorText={
              quota === 0
                ? "This field must not be empty"
                : `Max promo: ${V.maxPromoQuota} `
            }
            isError={
              (quota === 0 && isButtonSaveClicked) ||
              (!V.isPromoQuotaValid(quota) && quota !== 0)
            }
            placeholder="Input promo quota.."
            value={quota === 0 ? "" : quota}
            onChange={(e) => {
              const inputValue = Number(e.target.value.replace(/[^\d]/g, ""));
              if (
                inputValue >= 0 &&
                inputValue.toString().length <=
                  V.maxPromoQuota.toString().length + 1
              ) {
                setQuota(inputValue);
              }
            }}
          />
          <DateInput
            placeholder="Select expiry date"
            errorText={"This field must not be empty"}
            isError={V.isFormFieldEmpty(expiryDate) && isButtonSaveClicked}
            titleText="Expiry Date"
            setDate={setExpiryDate}
            isPastDateDisabled={true}
            defaultValue={expiryDate.split("T")[0]}
          />
          <div className="w-[160px] flex flex-row">
            <Button
              type="submit"
              withoutHoverEffect={true}
              isLoading={isButtonLoading}
            >
              {!isEditing ? "Add Promo" : "Save "}
              <div className={`${isButtonLoading ? "invisible" : "block"}`}>
                {!isEditing ? (
                  <IoMdAddCircleOutline size={20} />
                ) : (
                  <MdSave size={20} />
                )}
              </div>
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PromoDetail;
