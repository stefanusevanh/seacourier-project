import { IAdmin, IUser } from "@/types/api";
import { ADMIN_API_URL, USERS_API_URL } from "./apiURL";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";

function useAdmin() {
  const { data: admins, isLoading, error, fetchData } = useFetch<IAdmin[]>();
  const getAdmin = (adminId: number) => {
    const url = `${ADMIN_API_URL}?id=${adminId}`;
    const options: RequestInit = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetchData(url, options);
  };

  const [admin, setAdmin] = useState<IAdmin | null>(null);
  useEffect(() => {
    if (admins !== null) {
      setAdmin(admins[0]);
    }
  }, [admins]);

  return {
    admin,
    isLoading,
    error,
    getAdmin,
  };
}

export default useAdmin;
