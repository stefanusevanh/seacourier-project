import { IUser } from "@/types/api";
import useSWR from "swr";
import { USERS_API_URL } from "./apiURL";
import { fetcher } from "@/libs/fetcher";

function useUsers() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<IUser[]>(
    USERS_API_URL,
    fetcher,
    { revalidateOnFocus: false, revalidateOnMount: true }
  );
  return {
    users: data,
    isLoading,
    error,
    isValidating,
    getUsers: mutate,
  };
}

export default useUsers;
