import { Button, ButtonBorderOnly } from "@/components/Button";
import { Card, OptionCard } from "@/components/Card/Card";
import DropdownMenuAddress from "@/components/DropdownMenuAddress/DropdownMenuAddress";
import { FormInput } from "@/components/Form";
import { saveShipmentDetails } from "@/stores/shippingSlice/shippingSlice";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import {
  IDestinationAddressDetail,
  IOriginAddress,
  TAddOns,
  TShippingCategory,
} from "@/types/api";
import { addOnsMap } from "@/utils/addOnsMap";
import useDestinationAddress from "@/utils/api/useDestinationAddress";
import useOriginAddresses from "@/utils/api/useOriginAddresses";
import useShipping from "@/utils/api/useShipping";
import { shippingCategoriesMap } from "@/utils/shippingCategoriesMap";
import React, { useEffect, useState } from "react";

const NewShipmentStep1 = ({
  setStepNum,
}: {
  setStepNum: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const dispatch = useAppDispatch();
  const userID = useAppSelector((state) => state.roleID.user_id);
  const shipDetailsStore = useAppSelector((state) => state.shipping);

  const [packageWeight, setPackageWeight] = useState(shipDetailsStore.weight);
  const [packageLength, setPackageLength] = useState(shipDetailsStore.length);
  const [packageWidth, setPackageWidth] = useState(shipDetailsStore.width);
  const [packageHeight, setPackageHeight] = useState(shipDetailsStore.height);
  const [shippingCategory, setShippingCategory] = useState<TShippingCategory>(
    shipDetailsStore.category
  );
  const [addOns, setAddOns] = useState<TAddOns>(shipDetailsStore.addOns);
  const [selectedOrigin, setSelectedOrigin] = useState<IOriginAddress | null>(
    shipDetailsStore.originAddress
  );
  const [selectedDestination, setSelectedDestination] =
    useState<IDestinationAddressDetail | null>(
      shipDetailsStore.destinationAddress
    );
  const { availableCategories, getAvailableShipping } = useShipping();

  const [isButtonSaveClicked, setIsButtonSaveClicked] = useState(false);
  const shippingCategories: TShippingCategory[] = ["OKE", "REG", "SPS", "YES"];
  const addOnsOption: Partial<TAddOns>[] = ["0", "1", "2"];

  const { originAddresses, getOriginAddresses } = useOriginAddresses();
  const { destinationAddresses, getDestinationAddresses } =
    useDestinationAddress();

  useEffect(() => {
    getOriginAddresses();
    getDestinationAddresses(userID);
  }, []);

  useEffect(() => {
    if (selectedOrigin !== null && selectedDestination !== null) {
      getAvailableShipping(selectedOrigin.city, selectedDestination.city, 1);
    }
  }, [selectedOrigin, selectedDestination]);

  useEffect(() => {
    if (availableCategories && shippingCategory !== availableCategories[0]) {
      setShippingCategory(availableCategories[0] as TShippingCategory);
    }
  }, [availableCategories]);

  const handleFormSubmit = () => {
    if (
      packageLength > 0 &&
      packageWidth > 0 &&
      packageHeight > 0 &&
      packageWeight > 0
    ) {
      dispatch(
        saveShipmentDetails({
          length: packageLength,
          width: packageWidth,
          height: packageHeight,
          weight: packageWeight,
          originAddress: selectedOrigin!,
          destinationAddress: selectedDestination!,
          category: shippingCategory,
          addOns: addOns,
        })
      );
      setStepNum(2);
    }
  };

  return (
    <>
      <div className="flex flex-row gap-4">
        <Card>
          <FormInput
            type="text"
            titleText="Length"
            errorText="This field must not be empty"
            isError={Number(packageLength) === 0 && isButtonSaveClicked}
            placeholder="Input package length.."
            value={packageLength === 0 ? "" : packageLength}
            onChange={(e) => {
              const inputValue = Number(e.target.value.replace(/[^\d]/g, ""));
              if (inputValue >= 0) {
                setPackageLength(inputValue);
              }
            }}
          />
          <FormInput
            type="text"
            titleText="Width"
            errorText="This field must not be empty"
            isError={Number(packageWidth) === 0 && isButtonSaveClicked}
            placeholder="Input package width.."
            value={packageWidth === 0 ? "" : packageWidth}
            onChange={(e) => {
              const inputValue = Number(e.target.value.replace(/[^\d]/g, ""));
              if (inputValue >= 0) {
                setPackageWidth(inputValue);
              }
            }}
          />
          <FormInput
            type="text"
            titleText="Height"
            errorText="This field must not be empty"
            isError={Number(packageHeight) === 0 && isButtonSaveClicked}
            placeholder="Input package height.."
            value={packageHeight === 0 ? "" : packageHeight}
            onChange={(e) => {
              const inputValue = Number(e.target.value.replace(/[^\d]/g, ""));
              if (inputValue >= 0) {
                setPackageHeight(inputValue);
              }
            }}
          />
          <FormInput
            type="text"
            titleText="Weight"
            errorText="This field must not be empty"
            isError={Number(packageWeight) === 0 && isButtonSaveClicked}
            placeholder="Input package weight.."
            value={packageWeight === 0 ? "" : packageWeight}
            onChange={(e) => {
              const inputValue = Number(e.target.value.replace(/[^\d]/g, ""));
              if (inputValue >= 0) {
                setPackageWeight(inputValue);
              }
            }}
          />
        </Card>
        <Card>
          <h2>Origin</h2>
          <DropdownMenuAddress
            type="origin"
            placeholder="Select origin address"
            addresses={originAddresses}
            selectedAddress={selectedOrigin}
            setSelectedAddressOrigin={setSelectedOrigin}
          />
          <h2>Destination</h2>
          <DropdownMenuAddress
            type="destination"
            placeholder="Select destination address"
            addresses={destinationAddresses}
            selectedAddress={selectedDestination}
            setSelectedAddressDestination={setSelectedDestination}
          />
        </Card>
      </div>
      <div className="flex flex-row gap-2">
        <div className="grid grid-cols-1  gap-2 justify-between w-40">
          Category
          {shippingCategories.map((category, idx) => {
            return (
              <OptionCard
                key={idx}
                optionName="CategoryOption"
                defaultValue={category}
                textMain={shippingCategoriesMap[category]}
                defaultChecked={
                  availableCategories && category === availableCategories[0]
                }
                checked={category === shippingCategory}
                onChange={() => setShippingCategory(category)}
                isDisabled={!availableCategories?.includes(category)}
              />
            );
          })}
        </div>
        <div className="grid grid-cols-1  gap-2 justify-between w-40">
          Add Ons
          {addOnsOption.map((addOn, idx) => {
            return (
              <OptionCard
                key={idx}
                optionName="AddOnsOption"
                defaultValue={addOn}
                textMain={addOnsMap[addOn]}
                textSecondary={addOn === "2" ? "Bubble wrap is included" : ""}
                defaultChecked={addOn === addOns}
                onChange={() => setAddOns(addOn)}
              />
            );
          })}
        </div>
      </div>
      <div className="flex flex-row justify-end gap-2">
        <div>
          <ButtonBorderOnly>Cancel</ButtonBorderOnly>
        </div>
        <div>
          <Button
            withoutHoverEffect={true}
            onClick={() => {
              setIsButtonSaveClicked(true);
              handleFormSubmit();
            }}
          >
            Save & Proceed
          </Button>
        </div>
      </div>
    </>
  );
};

export default NewShipmentStep1;
