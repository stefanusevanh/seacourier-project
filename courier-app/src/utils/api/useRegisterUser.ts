import { generateToken } from "../generateToken";
import { USERS_API_URL } from "./apiURL";
import { generateRefCode } from "../generateRefCode";
import { defaultPhotoURL } from "../defaultPhotoURL";
import { useFetch } from "@/hooks/useFetch";
import { IUser } from "@/types/api";

export const useRegisterUser = () => {
  const { data, isLoading, error, fetchData } = useFetch<IUser>();

  const registerUser = (
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
    refCodeFriend: string
  ) => {
    const url = USERS_API_URL;
    const options: RequestInit = {
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
    fetchData(url, options);
  };
  return {
    data,
    registerIsLoading: isLoading,
    registerError: error,
    registerUser,
  };
};
export default useRegisterUser;
