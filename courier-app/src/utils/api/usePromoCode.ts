import { useFetch } from "@/hooks/useFetch";
import { PROMO_API_URL } from "./apiURL";
import { IPromo } from "@/types/api";
import { useEffect, useState } from "react";

export const usePromoCode = () => {
  const { data: promos, isLoading, error, fetchData } = useFetch<IPromo[]>();

  const findPromoCode = (promoCode: string) => {
    const url = `${PROMO_API_URL}?promoCode=${promoCode}`;
    const options: RequestInit = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetchData(url, options);
  };

  const [availablePromoCode, setAvailablePromoCode] = useState<IPromo | null>(
    null
  );
  useEffect(() => {
    if (promos !== null && promos.length > 0) {
      setAvailablePromoCode(promos[0]);
    }
  }, [promos]);

  return {
    availablePromoCode,
    isLoading,
    error,
    findPromoCode,
  };
};

export default usePromoCode;
