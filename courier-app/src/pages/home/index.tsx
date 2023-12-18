import { Button } from "@/components/Button";
import { Card } from "@/components/Card/Card";
import { FormSelect, SearchInput } from "@/components/Form";
import useShipping from "@/utils/api/useShipping";
import useShippingCity from "@/utils/api/useShippingCity";
import { cityMap } from "@/utils/cityMap";
import { currencyFormat } from "@/utils/currencyFormat";
import { maxTrackingNumberLength } from "@/utils/formFieldValidation";
import { provinceMap } from "@/utils/provinceMap";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoArrowDownCircle, IoArrowUpCircle } from "react-icons/io5";

const Home = () => {
  const [searchTrackingNumberDebounced, setSearchTrackingNumberDebounced] =
    useState("");
  const [selectedProvinceOri, setSelectedProvinceOri] = useState("");
  const [selectedProvinceDest, setSelectedProvinceDest] = useState("");
  const [selectedCityOri, setSelectedCityOri] = useState("");
  const [selectedCityDest, setSelectedCityDest] = useState("");
  const {
    cities: citiesOri,
    isLoading: iGetCitiesOriLoading,
    getCities: getCitiesOri,
  } = useShippingCity();
  const {
    cities: citiesDest,
    isLoading: iGetCitiesDestLoading,
    getCities: getCitiesDest,
  } = useShippingCity();
  const {
    isLoading: isGetAvailableShippingLoading,
    availableCosts,
    getAvailableShipping,
  } = useShipping();
  const dummyWeight = 2000;

  const [isToolbarOpen, setIsToolbarOpen] = useState(false);

  useEffect(() => {
    if (selectedProvinceOri !== "") {
      getCitiesOri(selectedProvinceOri as keyof typeof provinceMap);
    }
  }, [selectedProvinceOri]);

  useEffect(() => {
    if (selectedProvinceDest !== "") {
      getCitiesDest(selectedProvinceDest as keyof typeof provinceMap);
    }
  }, [selectedProvinceDest]);

  const handleEstimateCost = () => {
    if (selectedCityOri !== null && selectedCityDest !== null) {
      getAvailableShipping(
        selectedCityOri as keyof typeof cityMap,
        selectedCityDest as keyof typeof cityMap,
        dummyWeight
      );
      return;
    }
  };

  return (
    <div>
      <div className="absolute h-[30rem] bg-primary_blue w-full left-0 ">
        <div className="h-full w-[90%] max-w-screen-2xl flex flex-row items-center justify-center gap-28 mx-auto">
          <div className="flex flex-col gap-8 w-1/2">
            <span className="text-primary_orange">
              Shipping your deliveries since 2023
            </span>
            <h1 className="text-[white] text-6xl font-bold">
              We are the Top{" "}
              <span className="text-primary_orange">Courier Service</span> In
              Indonesia
            </h1>
            <div className="w-fit">
              <Button withoutHoverEffect>Our Solutions</Button>
            </div>
          </div>
          <div className="h-full relative">
            <div className="h-full relative z-0 w-[500px]">
              <div className="absolute  bg-primary_blue/50  backdrop-blur-lg z-20 top-[8%] h-[250px] w-full  border-t-2 border-r-2 border-primary_orange rounded-tl-[3rem] rounded-br-[3rem] overflow-hidden"></div>
              <div className="relative z-0 bg-primary_orange h-full w-[350px] rounded-tr-[3rem]  mx-auto"></div>
            </div>
            <div className="absolute z-40 my-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]">
              <Image
                src={"/img/login-register-cover.png"}
                alt="courier driver ilustration"
                width={"400"}
                height={"400"}
              />
            </div>
            <div className="absolute z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-full flex justify-center items-center bg-gradient-to-br from-primary_blue  to-primary_red/80 w-[290px] h-[290px] opacity-80"></div>
          </div>
        </div>
      </div>
      <div className="pt-[30rem]">
        <div className="relative flex justify-center ">
          <div
            className={`absolute -top-10 bg-[#343d68] ${
              isToolbarOpen ? "h-fit" : "h-20"
            } w-4/5 rounded-2xl flex flex-col justify-center items-center gap-4 p-3 border-[white] border-2`}
          >
            <div className="flex flex-row justify-center items-center gap-4">
              <div className="w-52 ">
                <SearchInput
                  placeholder="Tracking Number..."
                  maxInputLength={maxTrackingNumberLength}
                  setSearchInputDebounced={setSearchTrackingNumberDebounced}
                />
              </div>
              <div className="divider divider-horizontal text-[white]">OR</div>
              <div className="w-fit">
                <Button
                  withoutHoverEffect
                  onClick={() => {
                    if (!isToolbarOpen) {
                      setIsToolbarOpen(true);
                      return;
                    }
                    handleEstimateCost();
                  }}
                >
                  {!isToolbarOpen ? "Estimate Shipping Cost" : "Estimate Now"}
                </Button>
              </div>
              <div
                className="absolute top-10 right-5 -translate-y-1/2 cursor-pointer hover:scale-125"
                onClick={() => setIsToolbarOpen(!isToolbarOpen)}
              >
                {isToolbarOpen ? (
                  <IoArrowUpCircle size={35} color={"#FEC33B"} />
                ) : (
                  <IoArrowDownCircle size={35} color={"#FEC33B"} />
                )}
              </div>
            </div>
            {isToolbarOpen && (
              <div className="flex flew-row justify-center gap-6 ">
                <div className="flex flew-row justify-between gap-2">
                  <div className="w-48">
                    <h2>Origin</h2>
                    <FormSelect
                      // titleText="Province"
                      defaultValue={selectedProvinceOri}
                      optionPlaceholderText="Select province"
                      options={Object.keys(provinceMap)}
                      setSelectedOption={setSelectedProvinceOri}
                    />
                    <FormSelect
                      // titleText="City"
                      defaultValue={selectedCityOri}
                      optionPlaceholderText="Select city"
                      options={
                        citiesOri
                          ? citiesOri?.map((item) => item.city_name)
                          : ["Select city"]
                      }
                      setSelectedOption={
                        setSelectedCityOri as React.Dispatch<
                          React.SetStateAction<string>
                        >
                      }
                      isDisabled={
                        iGetCitiesOriLoading || selectedProvinceOri === ""
                      }
                    />
                  </div>
                  <div className="w-48">
                    <h2>Destination</h2>
                    <FormSelect
                      // titleText="Province"
                      defaultValue={selectedProvinceDest}
                      optionPlaceholderText="Select province"
                      options={Object.keys(provinceMap)}
                      setSelectedOption={setSelectedProvinceDest}
                      // errorText="Please select province"
                      // isError={selectedProvinceDest === "" && isButtonSaveClicked}
                    />
                    <FormSelect
                      // titleText="City"
                      defaultValue={selectedCityDest}
                      optionPlaceholderText="Select city"
                      options={
                        citiesDest
                          ? citiesDest?.map((item) => item.city_name)
                          : ["Select city"]
                      }
                      setSelectedOption={
                        setSelectedCityDest as React.Dispatch<
                          React.SetStateAction<string>
                        >
                      }
                      // errorText="Please select city"
                      // isError={selectedCityDest === "" && isButtonSaveClicked}
                      isDisabled={
                        iGetCitiesDestLoading || selectedProvinceDest === ""
                      }
                    />
                  </div>
                </div>
                <div className="self-center">
                  <Card cardPadding="p-4">
                    <span>Estimated Cost*</span>
                    <span>
                      {availableCosts &&
                        `${currencyFormat(
                          Math.min.apply(Math, availableCosts)
                        )} - ${currencyFormat(
                          Math.max.apply(Math, availableCosts)
                        )}`}
                      {availableCosts === undefined &&
                        selectedCityDest !== "" &&
                        selectedCityOri !== "" &&
                        "Click 'Estimate Now'"}
                    </span>
                    <span className="text-[grey] text-xs self-end">
                      *Estimated for package weight of {dummyWeight / 1000} kg
                    </span>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
        main
      </div>
    </div>
  );
};

export default Home;
