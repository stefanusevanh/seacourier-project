import { useFetch } from "@/hooks/useFetch";
import { ADMIN_API_URL, USERS_API_URL } from "./apiURL";
import { IAdmin, IUser } from "@/types/api";
import { useEffect, useState } from "react";

export const useAccountWithEmail = () => {
  const {
    data: dataUsers,
    isLoading: isLoadingUsers,
    error: errorUsers,
    fetchData: fetchUsers,
  } = useFetch<IUser[]>();
  const {
    data: dataAdmins,
    isLoading: isLoadingAdmins,
    error: errorAdmins,
    fetchData: fetchAdmins,
  } = useFetch<IAdmin[]>();

  const findAccountWithEmail = (email: string) => {
    const urlUsers = `${USERS_API_URL}?email=${email}`;
    const urlAdmins = `${ADMIN_API_URL}?email=${email}`;
    const options: RequestInit = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetchUsers(urlUsers, options);
    fetchAdmins(urlAdmins, options);
  };

  const [accountWithTheEmail, setAccountWithTheEmail] = useState<IAdmin | null>(
    null
  );
  useEffect(() => {
    if (dataUsers !== null) {
      setAccountWithTheEmail(dataUsers[0]);
      return;
    }
    if (dataAdmins !== null) {
      setAccountWithTheEmail(dataAdmins[0]);
      return;
    }
  }, [dataUsers, dataAdmins]);

  const isLoading = isLoadingUsers || isLoadingAdmins;
  const error = errorUsers || errorAdmins;
  return {
    accountWithTheEmail,
    isLoading,
    error,
    findAccountWithEmail,
  };
};

export default useAccountWithEmail;
