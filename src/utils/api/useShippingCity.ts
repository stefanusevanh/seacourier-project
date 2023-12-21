import { IRajaOngkirResponseCity } from "@/types/api";
import { RAJAONGKIR_API_KEY } from "./apiURL";
import { useFetch } from "@/hooks/useFetch";
import { provinceMap } from "../provinceMap";

function useShippingCity() {
  const { data, isLoading, error, fetchData } =
    useFetch<IRajaOngkirResponseCity>();

  const getCities = (province: keyof typeof provinceMap) => {
    const url = `/api/get-city?provinceId=${provinceMap[province]}`;
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        key: RAJAONGKIR_API_KEY,
      },
    };
    fetchData(url, options);
  };

  return {
    cities: data?.rajaongkir.results,
    isLoading,
    error,
    getCities,
  };
}

export default useShippingCity;
