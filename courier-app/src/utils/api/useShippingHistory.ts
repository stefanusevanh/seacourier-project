import { IShippingList } from "@/types/api";
import { SHIPPING_API_URL } from "./apiURL";
import { useFetch } from "@/hooks/useFetch";

function useShippingHistory() {
  const {
    data,
    isLoading: isGetDataLoading,
    error: errorGetData,
    fetchData,
  } = useFetch<IShippingList>();

  const getShippingHistory = (userId: number) => {
    const url = `${SHIPPING_API_URL}/${userId}`;
    const options: RequestInit = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetchData(url, options);
  };

  return {
    shippings: data?.detail,
    isGetDataLoading,
    errorGetData,
    getShippingHistory,
  };
}

export default useShippingHistory;
