import { Button, ButtonBorderOnly } from "@/components/Button";
import { Card, OptionCard } from "@/components/Card/Card";
import DropdownMenuAddress from "@/components/DropdownMenuAddress";
import { FormInput } from "@/components/Form";
import { saveShipmentDetails } from "@/stores/shippingSlice/shippingSlice";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import {
  IDestinationAddressDetail,
  IOriginAddress,
  TAddOns,
  TShippingCategory,
} from "@/types/api";
import { addOnsMap, addOnsPriceMap } from "@/utils/addOnsMap";
import useDestinationAddress from "@/utils/api/useDestinationAddress";
import useOriginAddresses from "@/utils/api/useOriginAddresses";
import useShipping from "@/utils/api/useShipping";
import { cityMap } from "@/utils/cityMap";
import { currencyFormat } from "@/utils/currencyFormat";
import {
  isPackageDimensionValid,
  isPackageWeightValid,
  maxPackageDimension,
  maxPackageWeight,
} from "@/utils/formFieldValidation";
import { shippingCategoriesMap } from "@/utils/shippingCategoriesMap";
import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";

const NewShipmentStep1 = ({
  setStepNum,
}: {
  setStepNum: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const dispatch = useAppDispatch();
  const userID = useAppSelector((state) => state.roleID.user_id);
  const shipDetailsStore = useAppSelector((state) => state.shipping);

  const [packageWeight, setPackageWeight] = useState(shipDetailsStore.weight);
  const [packageWeightDebounced, setPackageWeightDebounced] =
    useState(packageWeight);
  const [timerDebounce, setTimerDebounce] = useState<NodeJS.Timeout>();
  const [packageLength, setPackageLength] = useState(shipDetailsStore.length);
  const [packageWidth, setPackageWidth] = useState(shipDetailsStore.width);
  const [packageHeight, setPackageHeight] = useState(shipDetailsStore.height);
  const [selectedCategory, setSelectedCategory] =
    useState<TShippingCategory | null>(shipDetailsStore.category);
  const [selectedCost, setSelectedCost] = useState(0);
  const [addOns, setAddOns] = useState<TAddOns>(shipDetailsStore.addOns);
  const [selectedOrigin, setSelectedOrigin] = useState<IOriginAddress | null>(
    shipDetailsStore.originAddress
  );
  const [selectedDestination, setSelectedDestination] =
    useState<IDestinationAddressDetail | null>(
      shipDetailsStore.destinationAddress
    );
  const {
    isLoading: isGetAvailableShippingLoading,
    availableCategories,
    availableCosts,
    getAvailableShipping,
  } = useShipping();

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
    clearTimeout(timerDebounce);
    if (isPackageWeightValid(packageWeight)) {
      setTimerDebounce(
        setTimeout(() => {
          setPackageWeightDebounced(packageWeight);
        }, 3000)
      );
    }
  }, [packageWeight]);

  useEffect(() => {
    if (
      selectedOrigin !== null &&
      selectedDestination !== null &&
      packageWeightDebounced !== 0 &&
      packageWeight === packageWeightDebounced &&
      isPackageWeightValid(packageWeightDebounced)
    ) {
      getAvailableShipping(
        selectedOrigin.city as keyof typeof cityMap,
        selectedDestination.city as keyof typeof cityMap,
        packageWeightDebounced
      );
    }
  }, [selectedOrigin, selectedDestination, packageWeightDebounced]);

  useEffect(() => {
    if (
      availableCategories &&
      !availableCategories.includes(selectedCategory as TShippingCategory) &&
      availableCosts
    ) {
      setSelectedCategory(availableCategories[0] as TShippingCategory);
      setSelectedCost(availableCosts[0]);
      return;
    }
    if (!availableCosts?.includes(selectedCost)) {
      const cost =
        availableCosts &&
        availableCategories &&
        availableCosts[
          availableCategories.findIndex(
            (category) => category === selectedCategory
          )
        ];
      if (cost) {
        setSelectedCost(cost);
        return;
      }
    }
  }, [availableCategories, availableCosts]);

  const handleFormSubmit = () => {
    if (
      isPackageDimensionValid(packageLength) &&
      isPackageDimensionValid(packageWidth) &&
      isPackageDimensionValid(packageHeight) &&
      isPackageWeightValid(packageWeightDebounced) &&
      packageWeight === packageWeightDebounced &&
      !isGetAvailableShippingLoading
    ) {
      dispatch(
        saveShipmentDetails({
          length: packageLength,
          width: packageWidth,
          height: packageHeight,
          weight: packageWeight,
          originAddress: selectedOrigin!,
          destinationAddress: selectedDestination!,
          cost: selectedCost,
          category: selectedCategory,
          addOns: addOns,
        })
      );
      setStepNum(2);
    }
  };
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 ">
        <div className="flex flex-col md:flex-row w-full gap-4">
          <div className="lg:w-3/5 min-w-[250px]">
            <Card>
              <h2>Package Details</h2>
              <FormInput
                type="text"
                titleText="Length"
                withSuffix={"cm"}
                errorText={
                  packageLength === 0
                    ? "This field must not be empty"
                    : `Max length: ${maxPackageDimension} cm`
                }
                isError={
                  (packageLength === 0 && isButtonSaveClicked) ||
                  (!isPackageDimensionValid(packageLength) &&
                    packageLength !== 0)
                }
                placeholder="Package length.."
                value={packageLength === 0 ? "" : packageLength}
                onChange={(e) => {
                  const inputValue = Number(
                    e.target.value.replace(/[^\d]/g, "")
                  );
                  if (
                    inputValue >= 0 &&
                    inputValue.toString().length <=
                      maxPackageDimension.toString().length
                  ) {
                    setPackageLength(inputValue);
                  }
                }}
              />
              <FormInput
                type="text"
                titleText="Width"
                withSuffix={"cm"}
                errorText={
                  packageWidth === 0
                    ? "This field must not be empty"
                    : `Max width: ${maxPackageDimension} cm`
                }
                isError={
                  (packageWidth === 0 && isButtonSaveClicked) ||
                  (!isPackageDimensionValid(packageWidth) && packageWidth !== 0)
                }
                placeholder="Package width.."
                value={packageWidth === 0 ? "" : packageWidth}
                onChange={(e) => {
                  const inputValue = Number(
                    e.target.value.replace(/[^\d]/g, "")
                  );
                  if (
                    inputValue >= 0 &&
                    inputValue.toString().length <=
                      maxPackageDimension.toString().length
                  ) {
                    setPackageWidth(inputValue);
                  }
                }}
              />
              <FormInput
                type="text"
                titleText="Height"
                withSuffix={"cm"}
                errorText={
                  packageHeight === 0
                    ? "This field must not be empty"
                    : `Max height: ${maxPackageDimension} cm`
                }
                isError={
                  (packageHeight === 0 && isButtonSaveClicked) ||
                  (!isPackageDimensionValid(packageHeight) &&
                    packageHeight !== 0)
                }
                placeholder="Package height.."
                value={packageHeight === 0 ? "" : packageHeight}
                onChange={(e) => {
                  const inputValue = Number(
                    e.target.value.replace(/[^\d]/g, "")
                  );
                  if (
                    inputValue >= 0 &&
                    inputValue.toString().length <=
                      maxPackageDimension.toString().length
                  ) {
                    setPackageHeight(inputValue);
                  }
                }}
              />
              <FormInput
                type="text"
                titleText="Weight"
                withSuffix={"gr"}
                errorText={
                  packageWeight === 0
                    ? "This field must not be empty"
                    : `Max weight: ${maxPackageWeight} gram`
                }
                isError={
                  (packageWeight === 0 && isButtonSaveClicked) ||
                  (!isPackageWeightValid(packageWeight) && packageWeight !== 0)
                }
                placeholder="Package weight.."
                value={packageWeight === 0 ? "" : packageWeight}
                onChange={(e) => {
                  const inputValue = Number(
                    e.target.value.replace(/[^\d]/g, "")
                  );
                  if (
                    inputValue >= 0 &&
                    inputValue.toString().length <=
                      maxPackageWeight.toString().length
                  ) {
                    setPackageWeight(inputValue);
                  }
                }}
              />
            </Card>
          </div>
          <Card>
            <div className="flex flex-col h-full items-center justify-evenly align-middle w-full gap-4">
              <div className="w-full">
                <h2>Origin</h2>
                <DropdownMenuAddress
                  type="origin"
                  placeholder="Select origin address"
                  addresses={originAddresses as IOriginAddress[]}
                  selectedAddress={selectedOrigin}
                  setSelectedAddressOrigin={setSelectedOrigin}
                />
              </div>
              <div className="w-full">
                <h2>Destination</h2>
                <DropdownMenuAddress
                  type="destination"
                  placeholder="Select destination address"
                  addresses={destinationAddresses}
                  selectedAddress={selectedDestination}
                  setSelectedAddressDestination={setSelectedDestination}
                />
              </div>
            </div>
          </Card>
        </div>
        <div className="flex ">
          <Card>
            <div className="flex flex-row gap-8">
              <div className="grid grid-cols-1  gap-2 justify-between w-40">
                Category
                {shippingCategories.map((category, idx) => {
                  const cost =
                    availableCosts &&
                    availableCategories &&
                    availableCosts[
                      availableCategories.findIndex((item) => item === category)
                    ];
                  return (
                    <OptionCard
                      key={idx}
                      optionName="CategoryOption"
                      defaultValue={category}
                      textMain={shippingCategoriesMap[category]}
                      textSecondary={
                        !isPackageWeightValid(packageWeightDebounced)
                          ? "Please input weight"
                          : selectedOrigin === null
                          ? "Please select origin"
                          : selectedDestination === null
                          ? "Please select destination"
                          : isGetAvailableShippingLoading ||
                            packageWeight !== packageWeightDebounced
                          ? "Estimating cost..."
                          : availableCategories?.includes(category) &&
                            availableCosts !== undefined &&
                            cost
                          ? `Cost: ${currencyFormat(cost)}`
                          : "Not available"
                      }
                      defaultChecked={
                        availableCategories && category === selectedCategory
                      }
                      checked={category === selectedCategory}
                      onChange={() => {
                        setSelectedCategory(category);
                        if (cost) {
                          setSelectedCost(cost);
                        }
                      }}
                      isDisabled={
                        !availableCategories?.includes(category) ||
                        packageWeight !== packageWeightDebounced ||
                        !isPackageWeightValid(packageWeightDebounced) ||
                        isGetAvailableShippingLoading
                      }
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
                      textSecondary={`+ ${currencyFormat(
                        addOnsPriceMap[addOn]
                      )}`}
                      defaultChecked={addOn === addOns}
                      onChange={() => setAddOns(addOn)}
                    />
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 my-4">
        <span className="font-bold text-primary_blue">
          Total: {currencyFormat(selectedCost + addOnsPriceMap[addOns])}
        </span>
        <div className="flex flex-row gap-2">
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
              <FaArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewShipmentStep1;
