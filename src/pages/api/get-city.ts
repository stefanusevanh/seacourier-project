import { IRajaOngkirResponse } from "@/types/api";
import {
  RAJAONGKIR_API_KEY,
  RAJAONGKIR_CITY_API_URL,
} from "@/utils/api/apiURL";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IRajaOngkirResponse>
) {
  const { provinceId } = req.query;
  const fetchData = async (url: string, options: RequestInit | undefined) => {
    const response = await fetch(url, options);
    const data: IRajaOngkirResponse = await response.json();
    return data;
  };

  const url = `${RAJAONGKIR_CITY_API_URL}?province=${provinceId}`;
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      key: RAJAONGKIR_API_KEY,
    },
  };
  const data = await fetchData(url, options);
  res.status(200).json(data);
}
