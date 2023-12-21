import { generateToken } from "../generateToken";
import { DEST_API_URL, SHIPPING_API_URL, USERS_API_URL } from "./apiURL";
import { generateRefCode } from "../generateRefCode";
import { defaultPhotoURL } from "../defaultPhotoURL";
import { useFetch } from "@/hooks/useFetch";
import { IUser } from "@/types/api";
import { useEffect } from "react";

export const useRegisterUser = () => {
  const { data, isLoading, error, fetchData: fetchUser } = useFetch<IUser>();
  const { fetchData: fetchShipping } = useFetch<IUser>();
  const { fetchData: fetchDestination } = useFetch<IUser>();

  const registerUser = (
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
    refCodeFriend: string
  ) => {
    const url = USERS_API_URL;
    const optionsUser: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: generateToken("USER"),
        email: email,
        password: password,
        name: name,
        phoneNumber: phoneNumber,
        photo: defaultPhotoURL,
        balance: 0,
        refCode: generateRefCode(),
        refCodeFriend: refCodeFriend,
        countRefCode: 0,
        completedShipments: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    };
    fetchUser(url, optionsUser);
  };

  const initializeShipping = (userId: number) => {
    const optionsUser: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId,
        detail: [],
      }),
    };
    fetchShipping(SHIPPING_API_URL, optionsUser);
  };
  const initializeDestination = (userId: number) => {
    const optionsUser: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId,
        addresses: [],
      }),
    };
    fetchDestination(DEST_API_URL, optionsUser);
  };

  useEffect(() => {
    if (data !== null) {
      initializeShipping(data.id);
      initializeDestination(data.id);
    }
  }, [data]);

  return {
    data,
    registerIsLoading: isLoading,
    registerError: error,
    registerUser,
  };
};
export default useRegisterUser;
