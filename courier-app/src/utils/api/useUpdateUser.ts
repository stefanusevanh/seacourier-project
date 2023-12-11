import { IUser } from "@/types/api";
import { USERS_API_URL } from "./apiURL";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";

function useUpdateUser() {
  const { data: users, isLoading, error, fetchData } = useFetch<IUser[]>();
  const updateUserData = (userId: number, dataToBeUpdated: Partial<IUser>) => {
    if (
      dataToBeUpdated.id ||
      dataToBeUpdated.token ||
      dataToBeUpdated.refCode ||
      dataToBeUpdated.refCodeFriend ||
      dataToBeUpdated.createdAt
    ) {
      //these data can not be updated
      return;
    }
    const url = `${USERS_API_URL}/${userId}`;
    const options: RequestInit = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToBeUpdated),
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
    updateUserData,
  };
}

export default useUpdateUser;
