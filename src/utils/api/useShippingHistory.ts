import { IShippingList } from "@/types/api";
import { SHIPPING_API_URL } from "./apiURL";
import { useFetch } from "@/hooks/useFetch";
import { useState } from "react";

function useShippingHistory() {
  const {
    data,
    isLoading: isGetDataLoading,
    error: errorGetData,
    fetchData,
  } = useFetch<IShippingList | IShippingList[]>();

  const [userId, setUserId] = useState<number | null>(null);

  const getShippingHistory = (userId?: number) => {
    const url = `${SHIPPING_API_URL}/${userId ? userId : ""}`;
    const options: RequestInit = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    if (userId !== null && userId) {
      setUserId(userId);
    }
    fetchData(url, options);
  };
  const shippings =
    data === null
      ? null
      : userId && userId !== null
      ? (data as IShippingList).detail
      : (data as IShippingList[]);

  return {
    shippings,
    isGetDataLoading,
    errorGetData,
    getShippingHistory,
  };
}

export default useShippingHistory;
