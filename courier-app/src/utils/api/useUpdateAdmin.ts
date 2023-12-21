import { IAdmin, IUser } from "@/types/api";
import { ADMIN_API_URL } from "./apiURL";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";

function useUpdateAdmin() {
  const { data: admins, isLoading, error, fetchData } = useFetch<IUser[]>();
  const updateAdminData = (
    adminId: number,
    dataToBeUpdated: Partial<IAdmin>
  ) => {
    if (
      dataToBeUpdated.id ||
      dataToBeUpdated.token ||
      dataToBeUpdated.createdAt
    ) {
      return;
    }
    const url = `${ADMIN_API_URL}/${adminId}`;
    const options: RequestInit = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...dataToBeUpdated,
        updatedAt: new Date().toISOString(),
      }),
    };
    fetchData(url, options);
  };

  const [admin, setAdmin] = useState<IUser | null>(null);
  useEffect(() => {
    if (admins !== null) {
      setAdmin(admins[0]);
    }
  }, [admins]);

  return {
    admin,
    isLoading,
    error,
    updateAdminData,
  };
}

export default useUpdateAdmin;
