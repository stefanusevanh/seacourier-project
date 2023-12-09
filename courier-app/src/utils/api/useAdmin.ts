import { IUser } from "@/types/api";
import useSWR from "swr";
import { ADMIN_API_URL } from "./apiURL";
import { fetcher } from "@/libs/fetcher";

function useAdmin() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<IUser[]>(
    ADMIN_API_URL,
    fetcher,
    { revalidateOnFocus: false, revalidateOnMount: true }
  );
  return {
    admin: data,
    isLoading,
    error,
    isValidating,
    getAdmin: mutate,
  };
}

export default useAdmin;
