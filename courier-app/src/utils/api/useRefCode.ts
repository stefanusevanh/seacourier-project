import { useFetch } from "@/hooks/useFetch";
import { USERS_API_URL } from "./apiURL";
import { IUser } from "@/types/api";

export const useRefCode = () => {
  const {
    data: referredUser,
    isLoading,
    error,
    fetchData,
  } = useFetch<IUser[]>();

  const findRefCode = (refCodeFriend: string) => {
    const url = `${USERS_API_URL}?refCode=${refCodeFriend}`;
    const options: RequestInit = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetchData(url, options);
  };

  return {
    referredUser,
    isLoading,
    error,
    findRefCode,
  };
};

export default useRefCode;
