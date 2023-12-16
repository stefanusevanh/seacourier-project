import { shippingHistoryRoute } from "@/routes";
import { useAppSelector } from "@/stores/store";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CopyTextIcon from "../CopyTextIcon";

const NewShipmentStep3 = ({
  setStepNum,
}: {
  setStepNum: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const trackingNumber = useAppSelector(
    (state) => state.shipping.trackingNumber
  );
  return (
    <div className="flex flex-col items-center justify-between gap-2 text-center self-center  ">
      <p className="text-2xl">We are now preparing your order for shipment</p>
      <div className="rounded-full  flex justify-center items-center bg-gradient-to-br from-[green]  to-[yellow] w-fit h-fit my-2">
        <Image
          src={"/img/payment-complete.png"}
          alt="illustration of courier driver standing next to boxes"
          width={"350"}
          height={"350"}
        />
      </div>
      <div className="flex flex-row items-center gap-2 text-2xl">
        Your shipment tracking number:{" "}
        <span className="text-primary_orange bg-primary_blue p-1 rounded-md ">
          {trackingNumber}
        </span>
        <CopyTextIcon textToCopy={trackingNumber} />
      </div>
      <p className="text-xs">
        You can track your shipment status{" "}
        <Link href={shippingHistoryRoute} className="text-primary_red">
          here
        </Link>
      </p>
    </div>
  );
};

export default NewShipmentStep3;
