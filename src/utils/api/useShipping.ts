import {
  IRajaOngkirResponse,
  IResultCost,
  TShippingCategory,
} from "@/types/api";
import { RAJAONGKIR_API_KEY } from "./apiURL";
import { useFetch } from "@/hooks/useFetch";
import { cityMap } from "../cityMap";
import { useEffect, useState } from "react";

function useShipping() {
  const { data, isLoading, error, fetchData } = useFetch<IRajaOngkirResponse>();
  const [shippingCategory, setShippingCategory] = useState<TShippingCategory>();
  const getAvailableShipping = (
    originCity: keyof typeof cityMap,
    destinationCity: keyof typeof cityMap,
    packageWeight: number = 1,
    category: TShippingCategory = "REG"
  ) => {
    setShippingCategory(category);
    const url = `/api/get-cost?originCityId=${cityMap[originCity]}&destinationCityId=${cityMap[destinationCity]}&weight=${packageWeight}`;
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        key: RAJAONGKIR_API_KEY,
      },
      body: JSON.stringify({
        origin: cityMap[originCity],
        destination: cityMap[destinationCity],
        weight: packageWeight,
        courier: "jne",
      }),
    };
    fetchData(url, options);
  };
  const [results, setResults] = useState<IResultCost[]>();
  useEffect(() => {
    if (data?.rajaongkir.status.code === 200) {
      setResults(data.rajaongkir.results[0].costs);
    }
  }, [data]);

  return {
    availableCategories: results?.map((item) => {
      switch (item.service) {
        case "CTC":
          return "REG";
        case "CTCYES":
          return "YES";
        default:
          return item.service;
      }
    }),
    availableCosts: results?.map((item) => item.cost[0].value),
    cost: results?.filter((category) => {
      switch (category.service) {
        case "CTC":
          return "REG" === shippingCategory;
        case "CTCYES":
          return "YES" === shippingCategory;
        default:
          return category.service === shippingCategory;
      }
    })[0].cost[0].value,
    isLoading,
    error,
    getAvailableShipping,
  };
}

export default useShipping;
