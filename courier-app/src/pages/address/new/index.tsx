import { Card } from "@/components/Card/Card";
import { Form, FormInput, FormSelect } from "@/components/Form";
import React, { useEffect, useState } from "react";
import * as V from "@/utils/formFieldValidation";
import { Button, ButtonBorderOnly } from "@/components/Button";
import { MdSave } from "react-icons/md";
import { provinceMap } from "@/utils/provinceMap";
import useShippingCity from "@/utils/api/useShippingCity";
import { useRouter } from "next/router";
import { addressRoute } from "@/routes";
import useUpdateDestinationAddress from "@/utils/api/useUpdateDestinationAddress";
import { useAppSelector } from "@/stores/store";
import { cityMap } from "@/utils/cityMap";
import { toast } from "sonner";
import { IDestinationAddressDetail } from "@/types/api";

const AddressNew = ({
  title = "New Address",
  initialAddressData = {
    city: "",
    province: "",
    street: "",
    receiverName: "",
    receiverPhone: "",
  },
  isEditing,
  editAddressIndex,
}: {
  title: string;
  initialAddressData?: Partial<IDestinationAddressDetail>;
  isEditing?: boolean;
  editAddressIndex?: number;
}) => {
  const router = useRouter();
  const userId = useAppSelector((state) => state.roleID.user_id);
  const [receiverName, setReceiverName] = useState(
    initialAddressData.receiverName!
  );
  const [receiverPhone, setReceiverPhone] = useState(
    initialAddressData.receiverPhone!
  );
  const [street, setStreet] = useState(initialAddressData.street!);
  const [selectedProvince, setSelectedProvince] = useState(
    initialAddressData.province!
  );
  const [selectedCity, setSelectedCity] = useState(initialAddressData.city!);
  const [isButtonSaveClicked, setIsButtonSaveClicked] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const { cities, isLoading: iGetCitiesLoading, getCities } = useShippingCity();
  const { updateDestinationAddress } = useUpdateDestinationAddress();

  useEffect(() => {
    if (selectedProvince !== "") {
      getCities(selectedProvince as keyof typeof provinceMap);
    }
  }, [selectedProvince]);

  const handleErrorMessages = (
    inputType: "receiverName" | "receiverPhone" | "street"
  ) => {
    switch (inputType) {
      case "receiverName":
        if (V.isFormFieldEmpty(receiverName)) {
          return "Please enter receiver name";
        }
        if (!V.isNameValid(receiverName)) {
          return "Name cannot contain any symbol or number";
        }
        break;

      case "receiverPhone":
        if (V.isFormFieldEmpty(receiverPhone)) {
          return "Please input phone number";
        }
        if (!V.isPhoneNumValid(receiverPhone)) {
          return `Must be ${V.minPhoneNumDigit}-${V.maxPhoneNumDigit} digits and starts with "${V.phoneNumStartDigits}" `;
        }
        break;
      case "street":
        if (V.isFormFieldEmpty(street)) {
          return "Please input street name";
        }
        break;
    }
    return "This error is not shown";
  };
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      V.isNameValid(receiverName) &&
      V.isPhoneNumValid(receiverPhone) &&
      !V.isFormFieldEmpty(street) &&
      street.length <= V.maxStreetNameCharacter &&
      selectedProvince !== "" &&
      selectedCity !== "" &&
      isButtonSaveClicked
    ) {
      if (isEditing) {
        updateDestinationAddress(
          "EDIT",
          userId,
          {
            city: selectedCity as keyof typeof cityMap,
            province: selectedProvince,
            street: street,
            receiverName: receiverName,
            receiverPhone: receiverPhone,
          },
          editAddressIndex
        );
      } else {
        updateDestinationAddress("ADD", userId, {
          city: selectedCity as keyof typeof cityMap,
          province: selectedProvince,
          street: street,
          receiverName: receiverName,
          receiverPhone: receiverPhone,
        });
      }
      setTimeout(() => {
        toast.success(
          isEditing && editAddressIndex !== undefined
            ? `Edit Address #${editAddressIndex + 1} successful`
            : "New address has been added",
          { duration: 1500 }
        );
        router.push(addressRoute);
        setIsButtonLoading(false);
      }, 1000);
      return;
    }
    setIsButtonLoading(false);
    return;
  };

  return (
    <div>
      <h1 className="mt-4  mb-3 text-lg font-bold">{title}</h1>

      <Card>
        <Form formnovalidate={true} onSubmit={handleFormSubmit}>
          <FormInput
            type="text"
            placeholder="Input full name.."
            titleText="Receiver Name"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            errorText={handleErrorMessages("receiverName")}
            isError={
              !V.isNameValid(receiverName) ||
              (V.isFormFieldEmpty(receiverName) && isButtonSaveClicked)
            }
          />

          <FormInput
            type="string"
            placeholder="Input phone number.."
            titleText="Phone Number"
            value={receiverPhone}
            onChange={(e) => {
              if (e.target.value.length <= V.maxPhoneNumDigit) {
                setReceiverPhone(e.target.value.replace(/[^\d]/g, ""));
              }
            }}
            errorText={handleErrorMessages("receiverPhone")}
            isError={
              (!V.isPhoneNumValid(receiverPhone) &&
                !V.isFormFieldEmpty(receiverPhone)) ||
              (V.isFormFieldEmpty(receiverPhone) && isButtonSaveClicked)
            }
          />
          <FormInput
            type="string"
            placeholder="Input street name.."
            titleText="Street Name"
            value={street}
            errorText={handleErrorMessages("street")}
            isError={V.isFormFieldEmpty(street) && isButtonSaveClicked}
            onChange={(e) => {
              if (e.target.value.length <= V.maxStreetNameCharacter) {
                setStreet(e.target.value);
              }
            }}
          />
          <FormSelect
            titleText="Province"
            defaultValue={selectedProvince}
            optionPlaceholderText="Select province"
            options={Object.keys(provinceMap)}
            setSelectedOption={setSelectedProvince}
            errorText="Please select province"
            isError={selectedProvince === "" && isButtonSaveClicked}
          />
          <FormSelect
            titleText="City"
            defaultValue={selectedCity}
            optionPlaceholderText="Select city"
            options={
              cities ? cities?.map((item) => item.city_name) : ["Select city"]
            }
            setSelectedOption={
              setSelectedCity as React.Dispatch<React.SetStateAction<string>>
            }
            errorText="Please select city"
            isError={selectedCity === "" && isButtonSaveClicked}
            isDisabled={iGetCitiesLoading || selectedProvince === ""}
          />
          <div className="flex flex-row self-end gap-2 mt-6">
            <div>
              <ButtonBorderOnly
                onClick={() => {
                  if (isButtonLoading) {
                    return;
                  }
                  router.push(addressRoute);
                }}
              >
                Cancel
              </ButtonBorderOnly>
            </div>
            <div className="w-[160px] flex flex-row">
              <Button
                withoutHoverEffect={true}
                type={"submit"}
                isLoading={isButtonLoading}
                onClick={() => {
                  setIsButtonSaveClicked(true);
                  setIsButtonLoading(true);
                }}
              >
                Save Address
                <div className={`${isButtonLoading ? "invisible" : "block"}`}>
                  <MdSave size={20} />
                </div>
              </Button>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddressNew;
