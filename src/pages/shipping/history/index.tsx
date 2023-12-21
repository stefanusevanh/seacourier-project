import { Card } from "@/components/Card/Card";
import { SearchInput } from "@/components/Form";
import {
  PageTab,
  PageTabContent,
  PageTabContentHidden,
} from "@/components/PageTab";
import RatingStars from "@/components/RatingStars";
import ShipmentNotFound from "@/components/ShipmentNotFound";
import { PaymentDetailTable } from "@/components/Table";
import { useAppSelector } from "@/stores/store";
import { IShippingDetail, TReview } from "@/types/api";
import useShippingHistory from "@/utils/api/useShippingHistory";
import useUpdateShipping from "@/utils/api/useUpdateShipping";
import { currencyFormat } from "@/utils/currencyFormat";
import { maxTrackingNumberLength } from "@/utils/formFieldValidation";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

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

      <div className="grid grid-cols-[0.2fr_1fr] grid-rows-[1fr_1fr] gap-y-6 self-start w-11/12">
        <div className="col-start-1 row-start-1 flex flex-row gap-2">
          <FaLocationDot size={25} color={"#273059"} />
          Origin:
        </div>
        <div className="col-start-2 row-start-1">
          <p>{item.originAddress.branchName}</p>
          <p>{`${item.originAddress.street}, ${item.originAddress.city}, ${item.originAddress.province}`}</p>
        </div>
        <div className="col-start-1 row-start-2  flex flex-row gap-2">
          <FaLocationDot size={25} color={"e82d28"} />
          Destination:
        </div>
        <div className="col-start-2 row-start-2">
          <p>{`${item.destinationAddress.receiverName} (${item.destinationAddress.receiverPhone})`}</p>
          <p>{`${item.destinationAddress.street}, ${item.destinationAddress.city}, ${item.destinationAddress.province}`}</p>
        </div>
      </div>
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
  const [openedTab, setOpenedTab] = useState("My Active Orders");
  const [searchTrackingNumberDebounced, setSearchTrackingNumberDebounced] =
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
  useEffect(() => {
    if (searchTrackingNumberDebounced !== "") {
      setOpenedTab(tabs[2]);
      return;
    }
    setOpenedTab(tabs[0]);
  }, [searchTrackingNumberDebounced]);

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
      <div className="w-52 mb-3 mx-auto">
        <SearchInput
          placeholder="Tracking Number..."
          maxInputLength={maxTrackingNumberLength}
          setSearchInputDebounced={setSearchTrackingNumberDebounced}
        />
      </div>
      <PageTab>
        <PageTabContentHidden />
        {tabs.map((tab, idx) => {
          const filteredShippings = (shippings as IShippingDetail[])
            ?.sort(sortShippingHistory)
            ?.filter((item) =>
              statusMap[tab as keyof typeof statusMap].includes(item.status)
            )
            .filter((item) => {
              if (searchTrackingNumberDebounced !== "") {
                return item.trackingNumber.includes(
                  searchTrackingNumberDebounced.toUpperCase()
                );
              }
              return true;
            });

          return (
            <PageTabContent
              key={idx}
              tabTitle={tab}
              isOpen={tab === openedTab}
              onChange={() => setOpenedTab(tab)}
            >
              <div className="flex flex-col gap-4">
                {filteredShippings !== undefined &&
                  filteredShippings.length > 0 &&
                  filteredShippings.map((item, idx2) => {
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
                {filteredShippings?.length === 0 && (
                  <ShipmentNotFound
                    trackingNumber={searchTrackingNumberDebounced}
                    isInHistory={true}
                  />
                )}
              </div>
            </PageTabContent>
          );
        })}
        <PageTabContentHidden />
      </PageTab>
    </div>
  );
};

export default ShippingHistory;
