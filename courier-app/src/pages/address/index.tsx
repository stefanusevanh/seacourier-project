import { Button } from "@/components/Button";
import { Card } from "@/components/Card/Card";
import { DeleteModal, Modal } from "@/components/Modal";
import { PageTab, PageTabContent } from "@/components/PageTab";
import { addressEditRoute, addressNewRoute } from "@/routes";
import { useAppSelector } from "@/stores/store";
import useDestinationAddress from "@/utils/api/useDestinationAddress";
import useUpdateDestinationAddress from "@/utils/api/useUpdateDestinationAddress";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaRegAddressCard } from "react-icons/fa";
import { toast } from "sonner";

const Address = () => {
  const router = useRouter();
  const userId = useAppSelector((state) => state.roleID.user_id);
  const { destinationAddresses, getDestinationAddresses } =
    useDestinationAddress();
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [addressIdxToDelete, setAddressIdxToDelete] = useState<number | null>(
    null
  );
  const { updateDestinationAddress } = useUpdateDestinationAddress();

  useEffect(() => {
    if (userId !== 0) {
      getDestinationAddresses(userId);
    }
  }, [userId]);

  const handleDelete = () => {
    if (userId !== 0 && addressIdxToDelete !== null) {
      updateDestinationAddress("DELETE", userId, undefined, addressIdxToDelete);
      setTimeout(() => {
        getDestinationAddresses(userId);
      }, 500);
      setTimeout(() => {
        toast.success(`Address #${addressIdxToDelete + 1} has been deleted`, {
          duration: 1500,
        });
        setIsDeleteModalShown(false);
      }, 1000);
      return;
    }
  };

  return (
    <div>
      <div className="flex flex-row-reverse mt-4">
        <div className="">
          <Link href={addressNewRoute}>
            <Button withoutHoverEffect>New Address</Button>
          </Link>
        </div>
      </div>
      <PageTab isNormalTab={true}>
        <PageTabContent
          tabTitle="My Addresses"
          isOpen={true}
          onChange={() => {}}
        >
          <div className="flex flex-col gap-4">
            {destinationAddresses &&
              destinationAddresses.length > 0 &&
              destinationAddresses.map((item, idx) => {
                return (
                  <Card key={idx} withShadow={false} cardPadding={"p-6"}>
                    <div className="flex flex-col w-full justify-start">
                      <div className="flex flex-row justify-between">
                        <h2>Address #{idx + 1}</h2>
                        <div className="flex flex-row gap-2">
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              router.push(`${addressEditRoute}/${idx + 1}`);
                            }}
                          >
                            <FiEdit size={30} />
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              setAddressIdxToDelete(idx);
                              setIsDeleteModalShown(true);
                            }}
                          >
                            <IoMdCloseCircleOutline
                              size={30}
                              color={"#e82d28"}
                            />
                          </div>
                        </div>
                      </div>

                      <table className="table">
                        <tbody>
                          <tr>
                            <td>Name:</td>
                            <td>{item.receiverName}</td>
                          </tr>
                          <tr>
                            <td>Phone:</td>
                            <td>{item.receiverPhone}</td>
                          </tr>
                          <tr>
                            <td className="">Address:</td>
                            <td className="flex flex-col">
                              <span>{item.street}</span>
                              <span>
                                {item.city}, {item.province}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card>
                );
              })}
            {!destinationAddresses ||
              (destinationAddresses.length === 0 && (
                <div className="flex flex-col items-center my-5  gap-6 ">
                  <p className="text-2xl font-bold">
                    Oops! Your address book is empty!
                  </p>

                  <FaRegAddressCard size={80} color={"grey"} />
                  <p className="text-xl">Let&apos;s save new addresses!</p>
                </div>
              ))}
          </div>
        </PageTabContent>
      </PageTab>
      {isDeleteModalShown && addressIdxToDelete !== null && (
        <DeleteModal
          itemToDelete={`Address #${addressIdxToDelete + 1}`}
          isModalShown={isDeleteModalShown}
          setIsModalShown={setIsDeleteModalShown}
          handleDeleteItem={() => handleDelete()}
        />
      )}
    </div>
  );
};

export default Address;
