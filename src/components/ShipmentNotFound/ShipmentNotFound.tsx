import React from "react";
import { LuSearchX } from "react-icons/lu";

const ShipmentNotFound = ({
  trackingNumber,
  isInHistory,
}: {
  trackingNumber: string;
  isInHistory?: boolean;
}) => {
  return (
    <div
      className={`flex flex-col items-center ${
        isInHistory ? "my-5 gap-6" : "gap-1"
      }`}
    >
      <p className={`${isInHistory ? "text-4xl" : "text-lg"} font-bold`}>
        Oops!
      </p>
      <LuSearchX size={isInHistory ? 80 : 40} />
      <p className={`${isInHistory ? "text-xl" : ""}`}>
        Sorry, we can not find shipment with tracking number:
        <span
          className={`bg-primary_red mx-1 text-[white] ${
            isInHistory ? "text-xl" : ""
          } rounded-full px-2 py-1`}
        >
          {trackingNumber}
        </span>
      </p>
    </div>
  );
};

export default ShipmentNotFound;
