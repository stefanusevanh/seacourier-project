import { IDestinationAddressDetail, IDestinationAddress } from "@/types/api";
import { DEST_API_URL } from "./apiURL";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";

function useDestinationAddress() {
  const { data, isLoading, error, fetchData } =
    useFetch<IDestinationAddress[]>();

  const getDestinationAddresses = (userId: number) => {
    const url = `${DEST_API_URL}?userId=${userId}`;
    const options: RequestInit = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetchData(url, options);
  };

  const [addresses, setAddresses] = useState<IDestinationAddressDetail[]>();
  useEffect(() => {
    if (data !== null && data.length > 0) {
      setAddresses(data[0].addresses);
    }
  }, [data]);

  return {
    destinationAddresses: addresses,
    isLoading,
    error,
    getDestinationAddresses,
  };
}

export default useDestinationAddress;
