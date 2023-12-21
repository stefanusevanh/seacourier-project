import { IOriginAddress } from "@/types/api";
import { ORI_API_URL } from "./apiURL";
import { useFetch } from "@/hooks/useFetch";

function useUpdateOriginAddress() {
  const { data, isLoading, error, fetchData } = useFetch<IOriginAddress>();
  const updateOriginAddress = (
    type: "ADD" | "EDIT" | "DELETE",
    originAddressID?: number,
    dataToBeUpdated?: Partial<IOriginAddress>
  ) => {
    if (dataToBeUpdated?.id || dataToBeUpdated?.createdAt) {
      return;
    }
    const url = `${ORI_API_URL}/${type === "ADD" ? "" : originAddressID}`;
    let options: RequestInit;
    switch (type) {
      case "ADD":
        options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...dataToBeUpdated,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          }),
        };
        break;
      case "EDIT":
        options = {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...dataToBeUpdated,
            updatedAt: new Date().toISOString(),
          }),
        };
        break;
      case "DELETE":
        options = {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        };
        break;
    }

    fetchData(url, options);
  };

  return {
    updatedOriginAddress: data,
    isUpdatingOriginAddress: isLoading,
    errorUpdateOriginAddress: error,
    updateOriginAddress,
  };
}

export default useUpdateOriginAddress;
