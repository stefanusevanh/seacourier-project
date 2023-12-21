import { useFetch } from "@/hooks/useFetch";
import { PROMO_API_URL } from "./apiURL";
import { IPromo } from "@/types/api";
import { useEffect, useState } from "react";

export const usePromoCode = () => {
  const {
    data: promos,
    isLoading,
    error,
    fetchData,
  } = useFetch<IPromo | IPromo[]>();
  const [findBy, setFindBy] = useState<"promoCode" | "promoCodeID">();

  const findPromoCode = (promoCode?: string, promoCodeID?: number) => {
    let url;

    if (promoCode) {
      url = `${PROMO_API_URL}?promoCode=${promoCode}`;
      setFindBy("promoCode");
    } else if (promoCodeID) {
      url = `${PROMO_API_URL}/${promoCodeID}`;
      setFindBy("promoCodeID");
    } else {
      return;
    }

    const options: RequestInit = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetchData(url, options);
    setAvailablePromoCode(undefined);
  };

  const getPromos = () => {
    const url = `${PROMO_API_URL}`;
    const options: RequestInit = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetchData(url, options);
    setAvailablePromoCode(undefined);
  };

  const [availablePromoCode, setAvailablePromoCode] = useState<
    IPromo | null | undefined
  >(undefined);
  useEffect(() => {
    switch (findBy) {
      case "promoCode":
        if (promos !== null && (promos as IPromo[]).length > 0) {
          setAvailablePromoCode((promos as IPromo[])[0]);
          return;
        }
        break;
      case "promoCodeID":
        if (promos !== null) {
          setAvailablePromoCode(promos as IPromo);
          return;
        }
    }

    setAvailablePromoCode(null);
  }, [promos]);

  return {
    promos,
    getPromos,
    availablePromoCode,
    findPromoCode,
    isLoading,
    error,
  };
};

export default usePromoCode;
