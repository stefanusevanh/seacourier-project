import { IUser } from "@/types/api";
import { USERS_API_URL } from "./apiURL";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";

function useUser() {
  const { data: users, isLoading, error, fetchData } = useFetch<IUser[]>();
  const getUser = (userId: number) => {
    const url = `${USERS_API_URL}?id=${userId}`;
    const options: RequestInit = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetchData(url, options);
  };

  const [user, setUser] = useState<IUser | null>(null);
  useEffect(() => {
    if (users !== null) {
      setUser(users[0]);
    }
  }, [users]);

  return {
    user,
    isLoading,
    error,
    getUser,
  };
}

export default useUser;
