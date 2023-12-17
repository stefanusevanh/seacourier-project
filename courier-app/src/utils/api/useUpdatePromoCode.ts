import { IPromo } from "@/types/api";
import { PROMO_API_URL } from "./apiURL";
import { useFetch } from "@/hooks/useFetch";

function useUpdatePromoCode() {
  const { data, isLoading, error, fetchData } = useFetch<IPromo>();
  const updatePromoCode = (
    promoCodeID: number,
    dataToBeUpdated: Partial<IPromo>
  ) => {
    if (dataToBeUpdated.id || dataToBeUpdated.createdAt) {
      //these data can not be updated
      return;
    }
    const url = `${PROMO_API_URL}/${promoCodeID}`;
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

  return {
    updatedPromoCode: data,
    isUpdatingPromoCode: isLoading,
    errorUpdatePromoCode: error,
    updatePromoCode,
  };
}

export default useUpdatePromoCode;
