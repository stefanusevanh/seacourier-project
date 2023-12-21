import { IPromo } from "@/types/api";
import { PROMO_API_URL } from "./apiURL";
import { useFetch } from "@/hooks/useFetch";

function useUpdatePromoCode() {
  const { data, isLoading, error, fetchData } = useFetch<IPromo>();
  const updatePromoCode = (
    type: "ADD" | "EDIT" | "DELETE",
    promoCodeID?: number,
    dataToBeUpdated?: Partial<IPromo>
  ) => {
    if (dataToBeUpdated?.id || dataToBeUpdated?.createdAt) {
      return;
    }
    const url = `${PROMO_API_URL}/${type === "ADD" ? "" : promoCodeID}`;
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
        if (dataToBeUpdated?.used) {
          return;
        }
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
    updatedPromoCode: data,
    isUpdatingPromoCode: isLoading,
    errorUpdatePromoCode: error,
    updatePromoCode,
  };
}

export default useUpdatePromoCode;
