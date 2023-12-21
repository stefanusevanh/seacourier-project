import { IShippingDetail, IShippingList } from "@/types/api";
import { SHIPPING_API_URL } from "./apiURL";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/stores/store";
import { saveShipmentDetails } from "@/stores/shippingSlice/shippingSlice";

function useUpdateShipping() {
  const {
    data: userShippingData,
    isLoading: isGetDataLoading,
    error: errorGetData,
    fetchData: getData,
  } = useFetch<IShippingList>();
  const {
    data: updatedUserShippingData,
    isLoading: isUpdateDataLoading,
    error: errorUpdateData,
    fetchData: updateData,
  } = useFetch<IShippingList>();

  const [userId, setUserId] = useState(0);
  const [typeOfUpdate, setTypeOfUpdate] = useState<"ADD" | "EDIT">("ADD");
  const [dataToBeUpdated, setDataToBeUpdated] =
    useState<Partial<IShippingDetail>>();
  const [trackingNumber, setTrackingNumber] = useState("");
  const dispatch = useAppDispatch();

  const getCurrentData = (userId: number) => {
    const url = `${SHIPPING_API_URL}/${userId}`;
    const options: RequestInit = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    getData(url, options);
  };

  const updateShippingData = (
    type: "ADD" | "EDIT",
    userId: number,
    dataToBeUpdated: Partial<IShippingDetail>,
    trackingNumber?: string
  ) => {
    if (dataToBeUpdated.createdAt) {
      return;
    }
    switch (type) {
      case "ADD":
        dataToBeUpdated = {
          ...dataToBeUpdated,
          trackingNumber: `${userId}XXX${dataToBeUpdated.category}`,
          status: "PAID",
          review: "",
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        break;
      case "EDIT":
        if (trackingNumber !== "" && trackingNumber !== undefined) {
          dataToBeUpdated = {
            ...dataToBeUpdated,
            updatedAt: new Date().toISOString(),
          };
          setTrackingNumber(trackingNumber);
        }
        break;
    }

    setUserId(userId);
    setTypeOfUpdate(type);
    setDataToBeUpdated(dataToBeUpdated);
    getCurrentData(userId);
  };

  useEffect(() => {
    if (
      userShippingData !== null &&
      userId !== 0 &&
      dataToBeUpdated !== undefined
    ) {
      switch (typeOfUpdate) {
        case "ADD":
          dataToBeUpdated.trackingNumber =
            dataToBeUpdated.trackingNumber?.replace(
              "XXX",
              (userShippingData.detail.length + 1).toString().padStart(3, "0")
            );
          userShippingData.detail.push(dataToBeUpdated as IShippingDetail);
          dispatch(saveShipmentDetails(dataToBeUpdated));
          break;
        case "EDIT":
          if (trackingNumber !== undefined) {
            const updatedShippingOrderItem = userShippingData.detail.find(
              (item) => item.trackingNumber === trackingNumber
            );
            if (!updatedShippingOrderItem) {
              return;
            }
            Object.assign(updatedShippingOrderItem, { ...dataToBeUpdated });
          }
          break;
      }
      const url = `${SHIPPING_API_URL}/${userId}`;
      const options: RequestInit = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userShippingData),
      };
      updateData(url, options);
    }
  }, [userShippingData, userId, dataToBeUpdated]);

  return {
    shippings: userShippingData?.detail,
    updatedShippings: updatedUserShippingData?.detail,
    isLoading: isUpdateDataLoading,
    error: errorUpdateData,
    updateShippingData,
  };
}

export default useUpdateShipping;
