import { useAppDispatch, useAppSelector } from "@/stores/store";
import React, { useEffect } from "react";
import { Card } from "../Card/Card";
import { FaArrowCircleRight } from "react-icons/fa";
import useShipping from "@/utils/api/useShipping";
import { addOnsMap } from "@/utils/addOnsMap";

const NewShipmentStep2 = ({
  setStepNum,
}: {
  setStepNum: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const dispatch = useAppDispatch();
  const shipmentDetails = useAppSelector((state) => state.shipping);
  const { cost, getAvailableShipping: getCost } = useShipping();
  useEffect(() => {
    getCost(
      shipmentDetails.originAddress?.city!,
      shipmentDetails.destinationAddress?.city!,
      shipmentDetails.weight,
      shipmentDetails.category
    );
  }, []);

  return (
    <div>
      Review Order
      <Card>
        <h2>Package Details</h2>
        <p>Package Length: {shipmentDetails.length} cm</p>
        <p>Package Width: {shipmentDetails.width} cm</p>
        <p>Package Height: {shipmentDetails.height} cm</p>
        <p>Package Weight: {shipmentDetails.weight} kg</p>
        <div className="flex flex-cols gap-6 items-center">
          <div className="w-96">
            <p>Origin:</p>
            <div>
              <p>{shipmentDetails.originAddress?.branchName}</p>
              <p>{`${shipmentDetails.originAddress?.street}`}</p>
              <p>{`${shipmentDetails.originAddress?.city}, ${shipmentDetails.originAddress?.province}`}</p>
            </div>
          </div>
          <FaArrowCircleRight size={30} />
          <div className="w-96">
            <p>Destination:</p>
            <div>
              <p>{`${shipmentDetails.destinationAddress?.receiverName} (${shipmentDetails.destinationAddress?.receiverPhone})`}</p>
              <p>{`${shipmentDetails.destinationAddress?.street}`}</p>
              <p>{`${shipmentDetails.destinationAddress?.city}, ${shipmentDetails.destinationAddress?.province}`}</p>
            </div>
          </div>
        </div>
        <p>Category: {shipmentDetails.category}</p>
        <p>Add Ons: {addOnsMap[shipmentDetails.addOns]}</p>
        <p>Shipping Cost:{cost}</p>
      </Card>
    </div>
  );
};

export default NewShipmentStep2;
