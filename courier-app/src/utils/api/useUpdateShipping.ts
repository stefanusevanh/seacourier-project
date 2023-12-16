import { IShippingDetail, IShippingList } from "@/types/api";
import { SHIPPING_API_URL } from "./apiURL";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";

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
    dataToBeUpdated: Partial<IShippingDetail>
  ) => {
    if (dataToBeUpdated.createdAt) {
      //this data can not be updated
      return;
    }
    switch (type) {
      case "ADD":
        dataToBeUpdated = {
          ...dataToBeUpdated,
          status: "PAID",
          review: "",
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        break;
      case "EDIT":
        dataToBeUpdated = {
          ...dataToBeUpdated,
          updatedAt: new Date().toISOString(),
        };
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
          userShippingData.detail.push(dataToBeUpdated as IShippingDetail);
        case "EDIT":
          // TODO: add EDIT methods
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
  }, [userShippingData, userId]);

  return {
    shippings: userShippingData?.detail,
    isLoading: isUpdateDataLoading,
    error: errorUpdateData,
    updateShippingData,
  };
}

export default useUpdateShipping;
