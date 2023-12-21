import { Form, FormInput, FormSelect } from "@/components/Form";
import React, { useEffect, useState } from "react";
import * as V from "@/utils/formFieldValidation";
import { Button, ButtonBorderOnly } from "@/components/Button";
import { MdSave } from "react-icons/md";
import { provinceMap } from "@/utils/provinceMap";
import useShippingCity from "@/utils/api/useShippingCity";
import { useRouter } from "next/router";
import { dashboardAddressRoute } from "@/routes";
import useUpdateOriginAddress from "@/utils/api/useUpdateOriginAddress";
import { cityMap } from "@/utils/cityMap";
import { toast } from "sonner";
import { IOriginAddress } from "@/types/api";

const AddOriginAddress = ({
  title = "New Address",
  initialAddressData = {
    branchName: "",
    city: "",
    province: "",
    street: "",
  },
  isEditing,
  originAddressId,
}: {
  title: string;
  initialAddressData?: Partial<IOriginAddress>;
  isEditing?: boolean;
  originAddressId?: number;
}) => {
  const router = useRouter();
  const [branchName, setReceiverName] = useState(
    initialAddressData.branchName!
  );
  const [street, setStreet] = useState(initialAddressData.street!);
  const [selectedProvince, setSelectedProvince] = useState(
    initialAddressData.province!
  );
  const [selectedCity, setSelectedCity] = useState(initialAddressData.city!);
  const [isButtonSaveClicked, setIsButtonSaveClicked] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const { cities, isLoading: iGetCitiesLoading, getCities } = useShippingCity();
  const { updateOriginAddress } = useUpdateOriginAddress();

  useEffect(() => {
    if (selectedProvince !== "") {
      getCities(selectedProvince as keyof typeof provinceMap);
    }
  }, [selectedProvince]);

  const handleErrorMessages = (
    inputType: "branchName" | "receiverPhone" | "street"
  ) => {
    switch (inputType) {
      case "branchName":
        if (V.isFormFieldEmpty(branchName)) {
          return "Please enter Branch name";
        }
        if (!V.isBranchNameValid(branchName)) {
          return "Name cannot contain any symbol";
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
      V.isBranchNameValid(branchName) &&
      !V.isFormFieldEmpty(street) &&
      street.length <= V.maxStreetNameCharacter &&
      selectedProvince !== "" &&
      selectedCity !== "" &&
      isButtonSaveClicked
    ) {
      if (isEditing) {
        updateOriginAddress("EDIT", originAddressId, {
          city: selectedCity as keyof typeof cityMap,
          province: selectedProvince,
          street: street,
          branchName: branchName,
        });
      } else {
        updateOriginAddress("ADD", undefined, {
          branchName: branchName,
          city: selectedCity as keyof typeof cityMap,
          province: selectedProvince,
          street: street,
        });
      }
      setTimeout(() => {
        toast.success(
          isEditing && originAddressId !== undefined
            ? `Edit Address #${originAddressId + 1} successful`
            : "New address has been added",
          { duration: 1500 }
        );
        router.push(dashboardAddressRoute);
        setIsButtonLoading(false);
      }, 1000);
      return;
    }
    setIsButtonLoading(false);
    return;
  };

  return (
    <div className="max-w-3xl">
      <h1 className="mt-4  mb-3 text-lg font-bold">{title}</h1>

      <Form formnovalidate={true} onSubmit={handleFormSubmit}>
        <FormInput
          type="text"
          placeholder="Input full name.."
          titleText="Branch Name"
          value={branchName}
          onChange={(e) => setReceiverName(e.target.value)}
          errorText={handleErrorMessages("branchName")}
          isError={
            !V.isBranchNameValid(branchName) ||
            (V.isFormFieldEmpty(branchName) && isButtonSaveClicked)
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
                router.push(dashboardAddressRoute);
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
    </div>
  );
};

export default AddOriginAddress;
