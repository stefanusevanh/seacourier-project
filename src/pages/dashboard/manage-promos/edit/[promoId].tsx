import { useRouter } from "next/router";
import React, { useEffect } from "react";
import PromoDetail from "../add";
import usePromoCode from "@/utils/api/usePromoCode";

const EditPromo = () => {
  const router = useRouter();
  const { promoId } = router.query;
  const { availablePromoCode, findPromoCode } = usePromoCode();

  useEffect(() => {
    findPromoCode(undefined, Number(promoId));
  }, []);

  return (
    <>
      {availablePromoCode !== undefined && availablePromoCode !== null && (
        <PromoDetail
          isEditing={true}
          initialPromoData={availablePromoCode}
          promoCodeId={Number(promoId)}
        />
      )}
    </>
  );
};

export default EditPromo;
