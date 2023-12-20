import { Button } from "@/components/Button";
import { Card } from "@/components/Card/Card";
import { FormSelect, SearchInput } from "@/components/Form";
import ShipmentNotFound from "@/components/ShipmentNotFound";
import { IShippingDetail, IShippingList } from "@/types/api";
import useShipping from "@/utils/api/useShipping";
import useShippingCity from "@/utils/api/useShippingCity";
import useShippingHistory from "@/utils/api/useShippingHistory";
import { cityMap } from "@/utils/cityMap";
import { currencyFormat } from "@/utils/currencyFormat";
import { maxTrackingNumberLength } from "@/utils/formFieldValidation";
import { provinceMap } from "@/utils/provinceMap";
import Image from "next/image";
import React, { ReactNode, useEffect, useState } from "react";
import { FaArrowRight, FaLocationDot } from "react-icons/fa6";
import { IoArrowDownCircle, IoArrowUpCircle } from "react-icons/io5";
import {
  TbSquareRoundedNumber1Filled,
  TbSquareRoundedNumber3Filled,
  TbTruckDelivery,
} from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import { MdShareLocation } from "react-icons/md";
import { BiSolidPhoneCall } from "react-icons/bi";

const Hero = () => {
  return (
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
  );
};

const Toolbar = ({
  isToolbarOpen,
  setIsToolbarOpen,
}: {
  isToolbarOpen: boolean;
  setIsToolbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
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
  const { shippings, isGetDataLoading, getShippingHistory } =
    useShippingHistory();

  const dummyWeight = 2000;

  const [isTracking, setIsTracking] = useState(false);
  const [isButtonTrackClicked, setIsButtonTrackClicked] = useState(false);
  const [shippingBeingSearched, setShippingBeingSearched] =
    useState<IShippingDetail>();

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
  const handleTrackShipping = () => {
    setIsToolbarOpen(true);
    setIsTracking(true);
    getShippingHistory();
    return;
  };

  useEffect(() => {
    if (searchTrackingNumberDebounced === "") {
      setIsTracking(false);
      return;
    }
    setIsButtonTrackClicked(false);
  }, [searchTrackingNumberDebounced]);

  useEffect(() => {
    if (shippings && isButtonTrackClicked) {
      const searchedShipping = (shippings as IShippingList[])
        .find((userShippings) =>
          userShippings.detail.find(
            (shipping) =>
              shipping.trackingNumber ===
              searchTrackingNumberDebounced.toUpperCase()
          )
        )
        ?.detail.find(
          (item) =>
            item.trackingNumber === searchTrackingNumberDebounced.toUpperCase()
        );
      setShippingBeingSearched(searchedShipping);
    }
  }, [shippings]);
  return (
    <div className="relative flex justify-center ">
      <div
        className={`absolute -top-10 bg-[#343d68] ${
          isToolbarOpen ? "h-fit pb-5" : "h-20"
        } w-4/5 rounded-2xl flex flex-col justify-center items-center gap-4  border-[white] border-2 `}
      >
        <div className="flex flex-row justify-center items-center gap-4 h-20">
          <div className="w-52 relative">
            <SearchInput
              placeholder="Tracking Number..."
              maxInputLength={maxTrackingNumberLength}
              setSearchInputDebounced={setSearchTrackingNumberDebounced}
            />
            {searchTrackingNumberDebounced && (
              <button
                className="bg-primary_orange py-0.5 px-2 rounded-badge absolute bottom-1/2 right-3 translate-y-1/2 text-md text-primary_blue cursor-pointer active:scale-90 font-medium"
                onClick={() => {
                  setIsButtonTrackClicked(true);
                  handleTrackShipping();
                }}
              >
                Track
              </button>
            )}
          </div>
          <div className="divider divider-horizontal text-[white]">OR</div>
          <div className="w-fit">
            <Button
              withoutHoverEffect
              onClick={() => {
                if (!isToolbarOpen) {
                  setIsToolbarOpen(true);
                }
                if (!isTracking) {
                  handleEstimateCost();
                } else {
                  setIsTracking(false);
                }
              }}
            >
              {!isToolbarOpen || isTracking ? "Estimate Cost" : "Estimate Now"}
            </Button>
          </div>
          <div
            className="absolute top-10 right-5 -translate-y-1/2 cursor-pointer hover:scale-125"
            onClick={() => {
              setIsToolbarOpen(!isToolbarOpen);
              if (searchTrackingNumberDebounced === "") {
                setIsTracking(false);
                return;
              }
            }}
          >
            {isToolbarOpen ? (
              <IoArrowUpCircle size={35} color={"#FEC33B"} />
            ) : (
              <IoArrowDownCircle size={35} color={"#FEC33B"} />
            )}
          </div>
        </div>
        {isToolbarOpen && !isTracking && (
          <div className="flex flew-row justify-center gap-6  ">
            <div className="flex flew-row justify-between gap-2">
              <div className="w-48 flex flex-col items-center gap-4">
                <h2 className="text-[white] text-lg font-medium">Origin</h2>
                <FormSelect
                  defaultValue={selectedProvinceOri}
                  optionPlaceholderText="Select province"
                  options={Object.keys(provinceMap)}
                  setSelectedOption={setSelectedProvinceOri}
                />
                <FormSelect
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
              <div className="w-48 flex flex-col items-center gap-4">
                <h2 className="text-[white] text-lg font-medium">
                  Destination
                </h2>
                <FormSelect
                  defaultValue={selectedProvinceDest}
                  optionPlaceholderText="Select province"
                  options={Object.keys(provinceMap)}
                  setSelectedOption={setSelectedProvinceDest}
                />
                <FormSelect
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
                  isDisabled={
                    iGetCitiesDestLoading || selectedProvinceDest === ""
                  }
                />
              </div>
            </div>
            <div className="self-end max-w-[250px]">
              <Card cardPadding="p-4">
                <span>Estimated Cost*</span>
                <span className="font-bold">
                  {availableCosts &&
                    !isGetAvailableShippingLoading &&
                    `${currencyFormat(
                      Math.min.apply(Math, availableCosts)
                    )} - ${currencyFormat(
                      Math.max.apply(Math, availableCosts)
                    )}`}
                  {availableCosts === undefined &&
                    selectedCityDest !== "" &&
                    selectedCityOri !== "" &&
                    "Click 'Estimate Now'"}
                  {isGetAvailableShippingLoading && (
                    <span className="loading loading-bars loading-sm"></span>
                  )}
                </span>
                <span className="text-[grey] text-xs self-end ">
                  *Estimated for package weight of {dummyWeight / 1000} kg with
                  no add ons
                </span>
              </Card>
            </div>
          </div>
        )}
        {isToolbarOpen && isTracking && shippings && isButtonTrackClicked && (
          <div className="flex w-[350px] h-[124px]">
            <Card
              cardPadding={`${shippingBeingSearched === undefined && "p-2"}`}
            >
              {shippingBeingSearched !== undefined && (
                <div className="flex flex-col gap-3 ">
                  <div className="flex flex-row justify-between">
                    <h3 className="font-bold">
                      {shippingBeingSearched?.trackingNumber}
                    </h3>
                    <span>
                      <p
                        className={`badge badge-lg ${
                          shippingBeingSearched?.status === "PAID"
                            ? "bg-primary_orange"
                            : shippingBeingSearched?.status === "ON SHIPPING"
                            ? "bg-primary_blue text-[white]"
                            : "bg-[#1DC009] text-[white]"
                        }`}
                      >
                        {shippingBeingSearched?.status}
                      </p>
                    </span>
                  </div>
                  <div className="flex flex-row items-center gap-4">
                    <span>{shippingBeingSearched?.originAddress.city}</span>
                    <FaArrowRight />
                    <span>
                      {shippingBeingSearched?.destinationAddress.city}
                    </span>
                  </div>
                </div>
              )}
              {shippingBeingSearched === undefined && (
                <div className="w-full h-full text-xs text-center">
                  <ShipmentNotFound
                    trackingNumber={searchTrackingNumberDebounced}
                  />
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

const OrderSteps = () => {
  const StepItem = ({
    height,
    children,
  }: {
    height?: string;
    children: ReactNode;
  }) => {
    return <li className={`h-[7rem] ${height}`}>{children}</li>;
  };

  return (
    <ul className="timeline timeline-vertical text-xl">
      <StepItem>
        <div className="timeline-start timeline-box">Register</div>
        <div className="timeline-middle px-2">
          <TbSquareRoundedNumber1Filled size={30} />
        </div>
        <hr />
      </StepItem>
      <StepItem>
        <hr />
        <div className="timeline-middle">
          <FaLocationDot size={70} color={"#273059"} />
        </div>
        <div className="timeline-end timeline-box">Order</div>
        <hr />
      </StepItem>
      <StepItem>
        <hr />
        <div className="timeline-start timeline-box">Track</div>
        <div className="timeline-middle px-2">
          <TbSquareRoundedNumber3Filled size={30} />
        </div>
        <hr />
      </StepItem>
      <StepItem>
        <hr />
        <div className="timeline-middle">
          <FaLocationDot size={70} color={"#e82d28"} />
        </div>
        <div className="timeline-end timeline-box">Receive</div>
        <hr />
      </StepItem>
      <StepItem height="h-[12rem]">
        <hr />
        <div className="timeline-middle">
          <div className="flex flex-row gap-2 p-2">
            <FaStar size={50} color={"#FEC33B"} />
            <FaStar size={50} color={"#FEC33B"} />
            <FaStar size={50} color={"#FEC33B"} />
            <FaStar size={50} color={"#FEC33B"} />
            <FaStar size={50} color={"#FEC33B"} />
          </div>
        </div>
      </StepItem>
    </ul>
  );
};

const SectionMid = () => {
  return (
    <div className="absolute h-[30rem] bg-primary_blue w-full left-0 ">
      <div className="h-full w-[90%] max-w-screen-2xl flex flex-col items-center justify-center gap-12 mx-auto">
        <h2 className="text-[white] text-3xl font-bold">
          No Need to Wait for Your{" "}
          <span className="text-primary_orange">Parcel</span>
        </h2>
        <div className="text-[white] whitespace-nowrap flex flex-row justify-center gap-6">
          <Card bgColor="bg-[#343d68] hover:border-primary_orange hover:scale-110">
            <h3>Live Product Track</h3>
            <MdShareLocation size={70} />
          </Card>{" "}
          <Card bgColor="bg-[#343d68] hover:border-primary_orange hover:scale-110">
            <h3>Call Center Support</h3>
            <BiSolidPhoneCall size={70} />
          </Card>{" "}
          <Card bgColor="bg-[#343d68] hover:border-primary_orange hover:scale-110">
            <h3>100% Safety Coverage</h3>
            <TbTruckDelivery size={70} />
          </Card>
        </div>
      </div>
    </div>
  );
};

const CustomerSection = () => {
  return (
    <div className="mt-[30rem] py-14">
      <div className="flex flex-col items-center justify-center gap-10">
        <h2 className="font-extrabold text-3xl w-80 text-center">
          What Our <span className="text-primary_red">Customer Says</span> About
          Us
        </h2>
        <div className="grid grid-cols-[0.8fr_0.2fr] gap-4 ">
          <Card bgColor="bg-primary_blue">
            <div className="flex flex-row gap-4 text-[white]">
              <div className="avatar">
                <div className="w-96 rounded-2xl">
                  <Image
                    src={"/img/sample_photo_user4.jpg"}
                    alt="Photo of User 1"
                    width={500}
                    height={500}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-2xl font-bold">Megan Cox</span>
                <div className="flex flex-row gap-1">
                  <FaStar size={15} color={"#FEC33B"} />
                  <FaStar size={15} color={"#FEC33B"} />
                  <FaStar size={15} color={"#FEC33B"} />
                  <FaStar size={15} color={"#FEC33B"} />
                  <FaStar size={15} color={"white"} />
                </div>
                <span>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Aspernatur, quos rerum magni illo, molestias velit harum
                  asperiores facilis nam tenetur eius veniam sed voluptatibus
                  mollitia, voluptatem reprehenderit ad quod debitis.
                </span>
              </div>
            </div>
          </Card>
          <div className="flex flex-col justify-center items-center">
            <span className="font-extrabold text-3xl text-center">
              Our Regular <span className="text-primary_red">Customers</span>
            </span>
            <span className="flex flex-row gap-2 items-center">
              <FaStar size={30} color={"#FEC33B"} />
              4.5 (1.6k reviews)
            </span>
            <div className="avatar-group -space-x-6 rtl:space-x-reverse">
              <div className="avatar">
                <div className="w-16">
                  <Image
                    src={"/img/sample_photo_user1.jpg"}
                    alt="Photo of User 1"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
              <div className="avatar">
                <div className="w-16">
                  <Image
                    src={"/img/sample_photo_user2.jpg"}
                    alt="Photo of User 2"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
              <div className="avatar">
                <div className="w-16">
                  <Image
                    src={"/img/sample_photo_user3.jpg"}
                    alt="Photo of User 3"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);

  return (
    <div className="">
      <Hero />
      <div className="pt-[30rem]">
        <Toolbar
          isToolbarOpen={isToolbarOpen}
          setIsToolbarOpen={setIsToolbarOpen}
        />
        <div
          className={`${
            isToolbarOpen ? "mt-72" : "mt-20"
          } flex flex-col justify-center items-center text-center`}
        >
          <h2 className="font-extrabold text-3xl w-80">
            We offer an <span className="text-primary_red">Outstanding</span>{" "}
            Service
          </h2>
          <OrderSteps />
        </div>
        <SectionMid />
        <CustomerSection />
      </div>
    </div>
  );
};

export default Home;
