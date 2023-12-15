import { IOriginAddress } from "@/types/api";
import { ORI_API_URL } from "./apiURL";
import useSWR from "swr";
import { fetcher } from "@/libs/fetcher";

function useOriginAddresses() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    IOriginAddress[]
  >(ORI_API_URL, fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
  });

  return {
    originAddresses: data,
    isLoading,
    error,
    getOriginAddresses: mutate,
  };
}

export default useOriginAddresses;
