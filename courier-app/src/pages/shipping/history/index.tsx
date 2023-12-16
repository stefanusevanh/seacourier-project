import { Card } from "@/components/Card/Card";
import RatingStars from "@/components/RatingStars";
import { useAppSelector } from "@/stores/store";
import { IShippingDetail, TReview } from "@/types/api";
import { addOnsMap, addOnsPriceMap } from "@/utils/addOnsMap";
import useShippingHistory from "@/utils/api/useShippingHistory";
import useUpdateShipping from "@/utils/api/useUpdateShipping";
import { currencyFormat } from "@/utils/currencyFormat";
import React, { ReactNode, useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const ShippingHistoryTabContent = ({
  tabTitle,
  isOpen,
  children,
}: {
  tabTitle: string;
  isOpen: boolean;
  children?: ReactNode;
}) => {
  return (
    <>
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab whitespace-nowrap"
        aria-label={tabTitle}
        defaultChecked={isOpen}
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6 shadow-md"
      >
        {children}
      </div>
    </>
  );
};

const ShippingHistoryTab = ({ children }: { children: ReactNode }) => {
  return (
    <div
      role="tablist"
      className="tabs tabs-lifted tabs-md text-primary_blue rounded-b-2xl rounded-t-2xl"
    >
      {children}
    </div>
  );
};

const PaymentDetailTable = ({ item }: { item: IShippingDetail }) => {
  const LeftCol = ({
    mainText,
    secondaryText,
  }: {
    mainText: string;
    secondaryText?: string;
  }) => {
    return (
      <td className="flex flex-col">
        <span>{mainText}</span>
        {secondaryText && (
          <span className="text-[0.6rem] whitespace-nowrap ">
            ({secondaryText})
          </span>
        )}
      </td>
    );
  };
  const RightCol = ({ value }: { value: string }) => {
    return <td className="text-right">{value}</td>;
  };
  return (
    <div className="overflow-x-auto flex flex-col">
      <span className=" font-bold text-xs text-left self-end w-full">
        Payment Details
      </span>
      <table className="table table-sm">
        <tbody>
          <tr>
            <LeftCol mainText="Shipping" secondaryText={item.category} />
            <RightCol value={currencyFormat(item.cost)} />
          </tr>
          {item.addOns !== "0" && (
            <tr>
              <LeftCol
                mainText="Add Ons"
                secondaryText={addOnsMap[item.addOns]}
              />
              <RightCol value={currencyFormat(addOnsPriceMap[item.addOns])} />
            </tr>
          )}
          {item.promoUsed !== "" && item.addOns !== "0" && (
            <tr className="bg-base-200">
              <LeftCol mainText="Sub Total" />
              <RightCol
                value={currencyFormat(item.cost + addOnsPriceMap[item.addOns])}
              />
            </tr>
          )}
          {item.promoUsed !== "" && (
            <tr>
              <LeftCol mainText={item.promoUsed} />
              <RightCol
                value={currencyFormat(
                  item.paidAmount - (item.cost + addOnsPriceMap[item.addOns])
                )}
              />
            </tr>
          )}
          <tr className="bg-base-200">
            <LeftCol mainText="Total" />
            <RightCol value={currencyFormat(item.paidAmount)} />
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const ShippingHistoryCard = ({
  item,
  setRating,
  setTrackingNumberToBeUpdated,
}: {
  item: IShippingDetail;
  setRating: React.Dispatch<React.SetStateAction<number | undefined>>;
  setTrackingNumberToBeUpdated: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [isDetailsShown, setIsDetailsShown] = useState(false);
  return (
    <Card withShadow={false} cardPadding={"p-6"}>
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-row gap-3">
          <h3 className="font-bold">{item.trackingNumber}</h3>
          <p
            className={`badge badge-lg ${
              item.status === "PAID"
                ? "bg-primary_orange"
                : item.status === "ON SHIPPING"
                ? "bg-primary_blue text-[white]"
                : "bg-[#1DC009] text-[white]"
            }`}
          >
            {item.status}
          </p>
        </div>
        <div
          className={
            "flex flex-row items-center gap-1 p-2 rounded-md hover:bg-[#ebebeb]"
          }
          onClick={() => {
            setIsDetailsShown(!isDetailsShown);
          }}
        >
          <span>Details</span>
          {isDetailsShown ? (
            <FaChevronUp size={18} />
          ) : (
            <FaChevronDown size={18} />
          )}
        </div>
      </div>
      <table className="w-full ">
        <tbody>
          <tr>
            <td>
              <FaLocationDot size={25} color={"#273059"} />
            </td>
            <td>Origin:</td>
            <td>
              <p>{item.originAddress.branchName}</p>
              <p>{`${item.originAddress.street}, ${item.originAddress.city}, ${item.originAddress.province}`}</p>
            </td>
          </tr>
          <tr>
            <td>
              <FaLocationDot size={25} color={"e82d28"} />
            </td>
            <td>Destination:</td>
            <td>
              <p>{`${item.destinationAddress.receiverName} (${item.destinationAddress.receiverPhone})`}</p>
              <p>{`${item.destinationAddress.street}, ${item.destinationAddress.city}, ${item.destinationAddress.province}`}</p>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-5 w-full text-[grey]  text-sm mt-3 ">
        <div className="flex flex-col w-fit self-center">
          {isDetailsShown && (
            <>
              <span className="font-bold text-xs">Package Details</span>
              <table className="table table-sm">
                <tbody>
                  <tr>
                    <td>{`Dimension`}</td>
                    <td>{`${item.length} cm x ${item.width} cm x ${item.height} cm`}</td>
                  </tr>
                  <tr>
                    <td>{`Weight `}</td>
                    <td>{`${item.weight} kg`}</td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
        <div
          className={`w-fit ${
            isDetailsShown && item.status === "DELIVERED"
              ? "grid md:grid-cols-[1fr_minmax(140px,0.3fr)] w-[350px] mt-4"
              : item.status === "DELIVERED"
              ? "grid md:grid-cols-2 w-[280px]"
              : "flex"
          } self-center justify-center auto-cols-min gap-3 md:gap-0`}
        >
          <div
            className={`text-center md:text-right  ${
              item.status === "DELIVERED"
                ? "md:border-r-2 md:mr-2 md:pr-2 h-fit self-end"
                : ""
            }`}
          >
            {!isDetailsShown && <p>{currencyFormat(item.paidAmount)}</p>}
            {isDetailsShown && <PaymentDetailTable item={item} />}
          </div>
          <div className="self-end">
            {item.status === "DELIVERED" && (
              <RatingStars
                ratingValue={item.review === "" ? 0 : Number(item.review)}
                setRating={setRating}
                setTrackingNumber={() =>
                  setTrackingNumberToBeUpdated(item.trackingNumber)
                }
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const ShippingHistory = () => {
  const userId = useAppSelector((state) => state.roleID.user_id);
  const { shippings, isGetDataLoading, getShippingHistory } =
    useShippingHistory();
  const { updatedShippings, updateShippingData } = useUpdateShipping();
  const [rating, setRating] = useState<number>();
  const [trackingNumberToBeUpdated, setTrackingNumberToBeUpdated] =
    useState("");

  useEffect(() => {
    if (userId !== 0) {
      getShippingHistory(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (rating && rating > 0 && trackingNumberToBeUpdated !== "") {
      updateShippingData(
        "EDIT",
        userId,
        {
          review: rating.toString() as TReview,
        },
        trackingNumberToBeUpdated
      );
    }
  }, [rating, trackingNumberToBeUpdated]);

  useEffect(() => {
    getShippingHistory(userId);
  }, [updatedShippings]);

  const tabs = ["My Active Orders", "My Completed Orders", "All Orders"];
  const statusMap = {
    "My Active Orders": ["PAID", "ON SHIPPING"],
    "My Completed Orders": ["DELIVERED"],
    "All Orders": ["PAID", "ON SHIPPING", "DELIVERED"],
  };
  const sortShippingHistory = (a: IShippingDetail, b: IShippingDetail) => {
    if (a.createdAt < b.createdAt) {
      return 1;
    }
    if (a.createdAt > b.createdAt) {
      return -1;
    }

    return 0;
  };
  return (
    <div className="my-4">
      <ShippingHistoryTab>
        {tabs.map((tab, idx) => {
          return (
            <ShippingHistoryTabContent
              tabTitle={tab}
              isOpen={tab === tabs[0]}
              key={idx}
            >
              <div className="flex flex-col gap-4">
                {shippings
                  ?.sort(sortShippingHistory)
                  ?.filter((item) =>
                    statusMap[tab as keyof typeof statusMap].includes(
                      item.status
                    )
                  )
                  .map((item, idx2) => {
                    return (
                      <ShippingHistoryCard
                        key={idx * 10 + idx2}
                        item={item}
                        setRating={setRating}
                        setTrackingNumberToBeUpdated={
                          setTrackingNumberToBeUpdated
                        }
                      />
                    );
                  })}
              </div>
            </ShippingHistoryTabContent>
          );
        })}
      </ShippingHistoryTab>
    </div>
  );
};

export default ShippingHistory;
