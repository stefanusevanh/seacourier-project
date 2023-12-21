import { IDestinationAddress, IDestinationAddressDetail } from "@/types/api";
import { DEST_API_URL } from "./apiURL";
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";

function useUpdateDestinationAddress() {
  const {
    data: destAddressData,
    isLoading: isGetDataLoading,
    error: errorGetData,
    fetchData: getData,
  } = useFetch<IDestinationAddress[]>();
  const {
    data: updatedDestinationAddress,
    isLoading: isUpdateDataLoading,
    error: errorUpdateData,
    fetchData: updateData,
  } = useFetch<IDestinationAddress[]>();

  const [userId, setUserId] = useState(0);
  const [typeOfUpdate, setTypeOfUpdate] = useState<"ADD" | "EDIT" | "DELETE">(
    "ADD"
  );
  const [dataToBeUpdated, setDataToBeUpdated] =
    useState<Partial<IDestinationAddressDetail>>();
  const [addressIndex, setAddressIndex] = useState<number>();

  const getCurrentData = (userId: number) => {
    const url = `${DEST_API_URL}?userId=${userId}`;
    const options: RequestInit = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    getData(url, options);
  };

  const updateDestinationAddress = (
    type: "ADD" | "EDIT" | "DELETE",
    userId: number,
    dataToBeUpdated?: Partial<IDestinationAddressDetail>,
    addressIndex?: number
  ) => {
    if (dataToBeUpdated?.createdAt) {
      return;
    }
    switch (type) {
      case "ADD":
        dataToBeUpdated = {
          ...dataToBeUpdated,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        break;
      case "EDIT":
        if (addressIndex !== undefined) {
          dataToBeUpdated = {
            ...dataToBeUpdated,
            updatedAt: new Date().toISOString(),
          };
          setAddressIndex(addressIndex);
        }
        break;
      case "DELETE":
        if (addressIndex !== undefined) {
          setAddressIndex(addressIndex);
        }
        break;
    }
    setUserId(userId);
    setTypeOfUpdate(type);
    if (dataToBeUpdated) {
      setDataToBeUpdated(dataToBeUpdated);
    }
    getCurrentData(userId);
  };

  useEffect(() => {
    if (destAddressData !== null && userId !== 0) {
      switch (typeOfUpdate) {
        case "ADD":
          if (dataToBeUpdated) {
            destAddressData[0].addresses?.push(
              dataToBeUpdated as IDestinationAddressDetail
            );
          }
          break;
        case "EDIT":
          if (addressIndex !== undefined && dataToBeUpdated !== undefined) {
            const addressToBeUpdated =
              destAddressData[0].addresses.at(addressIndex);
            if (!addressToBeUpdated) {
              return;
            }
            Object.assign(addressToBeUpdated, { ...dataToBeUpdated });
          }
          break;
        case "DELETE":
          if (addressIndex !== undefined) {
            destAddressData[0].addresses?.splice(addressIndex, 1);
          }
          break;
      }
      const url = `${DEST_API_URL}/${userId}`;
      const options: RequestInit = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(destAddressData[0]),
      };
      updateData(url, options);
    }
  }, [destAddressData, userId, dataToBeUpdated]);

  return {
    updatedDestinationAddresses:
      updatedDestinationAddress !== null && updatedDestinationAddress.length > 0
        ? updatedDestinationAddress[0].addresses
        : null,
    isUpdatingDestinationAddress: isUpdateDataLoading,
    errorUpdateDestinationAddress: errorUpdateData,
    updateDestinationAddress,
  };
}

export default useUpdateDestinationAddress;
