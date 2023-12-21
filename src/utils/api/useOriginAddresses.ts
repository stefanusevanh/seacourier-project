import { IOriginAddress } from "@/types/api";
import { ORI_API_URL } from "./apiURL";
import useSWR from "swr";
import { fetcher } from "@/libs/fetcher";
import { useFetch } from "@/hooks/useFetch";

function useOriginAddresses() {
  const { data, isLoading, error, fetchData } = useFetch<
    IOriginAddress | IOriginAddress[]
  >();

  const getOriginAddresses = (originAddressId?: number) => {
    let url;
    if (originAddressId) {
      url = `${ORI_API_URL}/${originAddressId}`;
    } else {
      url = `${ORI_API_URL}`;
    }
    const options: RequestInit = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetchData(url, options);
  };

  return {
    originAddresses: data,
    isLoading,
    error,
    getOriginAddresses,
  };
}

export default useOriginAddresses;
