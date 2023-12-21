import useOriginAddresses from "@/utils/api/useOriginAddresses";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import AddOriginAddress from "../add";
import { IOriginAddress } from "@/types/api";

const EditOriginAddress = () => {
  const router = useRouter();
  const { originAddressId } = router.query;
  const { originAddresses, getOriginAddresses } = useOriginAddresses();

  useEffect(() => {
    getOriginAddresses(Number(originAddressId));
  }, []);
  return (
    <>
      {originAddresses !== undefined && originAddresses !== null && (
        <AddOriginAddress
          title="Edit Address"
          initialAddressData={originAddresses as IOriginAddress}
          isEditing={true}
          originAddressId={Number(originAddressId)}
        />
      )}
    </>
  );
};

export default EditOriginAddress;
