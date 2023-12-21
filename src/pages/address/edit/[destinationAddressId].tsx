import React, { useEffect } from "react";
import AddressNew from "../new";
import { useRouter } from "next/router";
import { useAppSelector } from "@/stores/store";
import useDestinationAddress from "@/utils/api/useDestinationAddress";

const AddressEdit = () => {
  const router = useRouter();
  const { destinationAddressId } = router.query;
  const userId = useAppSelector((state) => state.roleID.user_id);
  const { destinationAddresses, getDestinationAddresses } =
    useDestinationAddress();

  useEffect(() => {
    getDestinationAddresses(userId);
  }, []);

  return (
    <>
      {destinationAddresses !== undefined && (
        <AddressNew
          title="Edit Address"
          initialAddressData={
            destinationAddresses[Number(destinationAddressId) - 1]
          }
          isEditing={true}
          editAddressIndex={Number(destinationAddressId) - 1}
        />
      )}
    </>
  );
};

export default AddressEdit;
