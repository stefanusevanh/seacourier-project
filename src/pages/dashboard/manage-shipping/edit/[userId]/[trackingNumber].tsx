import { FormSelect } from "@/components/Form";
import { PaymentDetailTable } from "@/components/Table";
import { IShippingDetail, TStatus } from "@/types/api";
import { addOnsMap } from "@/utils/addOnsMap";
import useShippingHistory from "@/utils/api/useShippingHistory";
import useUpdateShipping from "@/utils/api/useUpdateShipping";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiSave } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";

const EditShipping = () => {
  const router = useRouter();
  const { trackingNumber, userId } = router.query;
  const { shippings, getShippingHistory } = useShippingHistory();
  const { updatedShippings, updateShippingData } = useUpdateShipping();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const shipping =
    shippings === null
      ? undefined
      : (shippings as IShippingDetail[]).find(
          (item) => item.trackingNumber === trackingNumber
        );

  useEffect(() => {
    if (userId) {
      getShippingHistory(Number(userId));
    }
  }, [userId]);

  useEffect(() => {
    if (shipping) {
      setSelectedStatus(shipping.status);
    }
  }, [shipping]);

  const handleSave = () => {
    if (selectedStatus !== shipping?.status) {
      updateShippingData(
        "EDIT",
        Number(userId as string),
        {
          status: selectedStatus as TStatus,
        },
        trackingNumber as string
      );
      return;
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedShippings) {
      getShippingHistory(Number(userId));
      setIsEditing(false);
      return;
    }
  }, [updatedShippings]);

  return (
    <div className="flex flex-col gap-4">
      <table className="table ">
        <tbody>
          <tr>
            <td>Tracking Number</td>
            <td>{shipping?.trackingNumber}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>
              <div className="grid grid-cols-[1fr_auto] gap-10 items-center w-[15rem]">
                {!isEditing ? (
                  <span
                    className={`badge badge-lg ${
                      shipping?.status === "PAID"
                        ? "bg-primary_orange"
                        : shipping?.status === "ON SHIPPING"
                        ? "bg-primary_blue text-[white]"
                        : "bg-[#1DC009] text-[white]"
                    }`}
                  >
                    {shipping?.status}
                  </span>
                ) : (
                  <div className="w-40">
                    <FormSelect
                      defaultValue={shipping ? shipping.status : ""}
                      optionPlaceholderText="Select shipping status"
                      options={["PAID", "ON SHIPPING", "DELIVERED"]}
                      setSelectedOption={setSelectedStatus}
                    />
                  </div>
                )}
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    if (!isEditing) {
                      setIsEditing(true);
                      return;
                    }
                    handleSave();
                  }}
                >
                  {!isEditing ? <FiEdit size={30} /> : <BiSave size={30} />}
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td>Origin</td>
            <td>
              <div>
                <p>{shipping?.originAddress?.branchName}</p>
                <p>{`${shipping?.originAddress?.street}`}</p>
                <p>{`${shipping?.originAddress?.city}, ${shipping?.originAddress?.province}`}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td>Destination</td>
            <td>
              <div>
                <p>{`${shipping?.destinationAddress?.receiverName} (${shipping?.destinationAddress?.receiverPhone})`}</p>
                <p>{`${shipping?.destinationAddress?.street}`}</p>
                <p>{`${shipping?.destinationAddress?.city}, ${shipping?.destinationAddress?.province}`}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td>Category</td>
            <td>{shipping?.category}</td>
          </tr>
          <tr>
            <td>Add Ons</td>
            <td>{shipping && addOnsMap[shipping?.addOns]}</td>
          </tr>
          <tr>
            <td>Package Dimension</td>
            <td>
              {shipping?.length} cm x {shipping?.width} cm x {shipping?.height}{" "}
              cm
            </td>
          </tr>
          <tr>
            <td>Package Volume</td>
            <td>
              {shipping &&
                (shipping?.length * shipping?.width * shipping?.height) /
                  1000}{" "}
              L
            </td>
          </tr>
          <tr>
            <td>Package Weight</td>
            <td>{shipping?.weight} gram</td>
          </tr>
        </tbody>
      </table>
      <div className="w-52">
        {shipping && <PaymentDetailTable item={shipping} />}
      </div>
    </div>
  );
};

export default EditShipping;
