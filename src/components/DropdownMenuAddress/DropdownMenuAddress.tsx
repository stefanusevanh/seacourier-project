import React, { useState } from "react";
import { ButtonBorderOnly } from "../Button";
import { IDestinationAddressDetail, IOriginAddress } from "@/types/api";
import { OptionCard } from "../Card/Card";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const DropdownMenuAddress = ({
  placeholder,
  type,
  selectedAddress,
  setSelectedAddressOrigin,
  setSelectedAddressDestination,
  addresses,
}: {
  placeholder: string;
  type: "origin" | "destination";
  selectedAddress: IDestinationAddressDetail | IOriginAddress | null;
  setSelectedAddressOrigin?: React.Dispatch<
    React.SetStateAction<IOriginAddress | null>
  >;
  setSelectedAddressDestination?: React.Dispatch<
    React.SetStateAction<IDestinationAddressDetail | null>
  >;
  addresses: IDestinationAddressDetail[] | IOriginAddress[] | undefined;
}) => {
  const [isDropdownShown, setIsDropdownShown] = useState(false);

  return (
    <div
      onMouseLeave={() => {
        if (selectedAddress !== null) {
          setTimeout(() => {
            setIsDropdownShown(false);
          }, 200);
        }
      }}
      className="w-full h-24 relative"
    >
      <ButtonBorderOnly
        onClick={() => setIsDropdownShown(!isDropdownShown)}
        flexibleHeight
      >
        <div className="flex flew-row w-full justify-between items-center">
          <div className="text-left">
            {selectedAddress === null ? (
              placeholder
            ) : (
              <>
                <p>
                  {type === "origin"
                    ? `${(selectedAddress as IOriginAddress).branchName}`
                    : `${
                        (selectedAddress as IDestinationAddressDetail)
                          .receiverName
                      } (${
                        (selectedAddress as IDestinationAddressDetail)
                          .receiverPhone
                      })`}
                </p>
                <p>{`${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.province}`}</p>
              </>
            )}
          </div>
          <div>{isDropdownShown ? <FaChevronUp /> : <FaChevronDown />}</div>
        </div>
      </ButtonBorderOnly>
      {isDropdownShown && (
        <div
          className="absolute z-10 bg-[white] flex flex-col gap-2 h-80 overflow-y-auto"
          onMouseOver={() => setIsDropdownShown(true)}
        >
          {addresses !== null &&
            addresses?.map((address, idx) => {
              return (
                <OptionCard
                  key={idx}
                  optionName={`${
                    type === "origin"
                      ? "OriginAddressOption"
                      : "DestinationAddressOption"
                  }`}
                  defaultValue={address.street}
                  textMain={
                    type === "origin"
                      ? `${(address as IOriginAddress).branchName}`
                      : `${
                          (address as IDestinationAddressDetail).receiverName
                        } (${
                          (address as IDestinationAddressDetail).receiverPhone
                        })`
                  }
                  textSecondary={`${address.street}, ${address.city}, ${address.province}`}
                  defaultChecked={address.street === selectedAddress?.street}
                  onChange={() => {
                    type === "origin"
                      ? setSelectedAddressOrigin!(address as IOriginAddress)
                      : setSelectedAddressDestination!(
                          address as IDestinationAddressDetail
                        );
                  }}
                />
              );
            })}
        </div>
      )}
    </div>
  );
};

export default DropdownMenuAddress;
