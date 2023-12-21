import { Button } from "@/components/Button";
import { SearchInput } from "@/components/Form";
import { DeleteModal } from "@/components/Modal";
import Pagination from "@/components/Pagination";
import { TD, TH, TR, Table } from "@/components/Table";
import { dashboardAddressAddRoute, dashboardAddressEditRoute } from "@/routes";
import { IOriginAddress } from "@/types/api";
import useOriginAddresses from "@/utils/api/useOriginAddresses";
import useUpdateOriginAddress from "@/utils/api/useUpdateOriginAddress";
import { maxBranchNameCharacter } from "@/utils/formFieldValidation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "sonner";

const ManageAddress = () => {
  const router = useRouter();
  const { originAddresses, getOriginAddresses } = useOriginAddresses();
  const [searchBranchName, setSearchBranchName] = useState("");

  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [originAddressToDelete, setOriginAddressToDelete] =
    useState<IOriginAddress | null>(null);
  const { updateOriginAddress } = useUpdateOriginAddress();

  const [pageNum, setPageNum] = useState(1);
  const [maxPageNum, setMaxPageNum] = useState(1);
  const [maxItem, setMaxItem] = useState(1);
  const numOfItemPerPage = 10;
  const heads = {
    branchName: "Branch Name",
    city: "City",
    province: "Province",
    street: "Street",
  };
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [sortItem, setSortItem] = useState<keyof typeof heads>("branchName");
  const sorting = (a: IOriginAddress, b: IOriginAddress) => {
    const val = (val: IOriginAddress) => {
      switch (sortItem) {
        default:
          return val[sortItem].toString().toLowerCase();
      }
    };
    if (val(a) < val(b)) {
      return sortDir === "desc" ? 1 : -1;
    }
    if (val(a) > val(b)) {
      return sortDir === "desc" ? -1 : 1;
    }
    return 0;
  };

  const toggleSorting = () => {
    if (sortDir === "desc") {
      setSortDir("asc");
      return;
    }
    setSortDir("desc");
    return;
  };

  const handleSorting = (item: typeof sortItem) => {
    setSortItem(item);
    toggleSorting();
  };

  useEffect(() => {
    getOriginAddresses();
  }, []);

  useEffect(() => {
    if (originAddresses !== null && originAddresses !== undefined) {
      setMaxItem((originAddresses as IOriginAddress[]).length);
      if (searchBranchName !== "") {
        setPageNum(1);
      }
    }
  }, [originAddresses, searchBranchName]);

  useEffect(() => {
    setMaxPageNum(Math.ceil(maxItem / numOfItemPerPage));
  }, [maxItem]);

  useEffect(() => {
    if (originAddresses !== null && originAddresses !== undefined) {
      const filteredOriginAddress = (originAddresses as IOriginAddress[])
        ?.slice()
        .filter(
          (address) =>
            address.branchName
              .toLowerCase()
              .includes(searchBranchName.toLowerCase()) ||
            searchBranchName === ""
        );

      setMaxItem(filteredOriginAddress.length);
    }
  }, [searchBranchName, originAddresses]);

  const handleDeleteAddress = () => {
    if (originAddressToDelete !== null) {
      updateOriginAddress("DELETE", originAddressToDelete?.id);
      setTimeout(() => {
        getOriginAddresses();
      }, 500);
      setTimeout(() => {
        toast.success(
          `Address ${originAddressToDelete?.branchName} has been deleted`,
          {
            duration: 1500,
          }
        );
        setIsDeleteModalShown(false);
      }, 1000);
      return;
    }
  };

  return (
    <div className="">
      <div className="flex flex-row justify-between gap-4 items-center">
        <div className="w-64 my-4">
          <SearchInput
            placeholder="Search by branch name"
            maxInputLength={maxBranchNameCharacter}
            setSearchInputDebounced={setSearchBranchName}
          />
        </div>
        <div>
          <Button
            withoutHoverEffect
            onClick={() => router.push(dashboardAddressAddRoute)}
          >
            Add New Address
          </Button>
        </div>
      </div>
      <Table>
        <thead>
          <TR>
            {Object.keys(heads).map((head) => {
              return (
                <TH
                  key={head}
                  onClick={() => handleSorting(head as typeof sortItem)}
                  isSortable
                  sortType={sortDir}
                  isSortActive={head === sortItem}
                >
                  {heads[head as typeof sortItem]}
                </TH>
              );
            })}
            <TH></TH>
          </TR>
        </thead>
        <tbody>
          {originAddresses !== null &&
            originAddresses != undefined &&
            (originAddresses as IOriginAddress[])
              .filter(
                (address) =>
                  address.branchName
                    .toLowerCase()
                    .includes(searchBranchName.toLowerCase()) ||
                  searchBranchName === ""
              )
              .sort(sorting)
              .slice(
                (pageNum - 1) * numOfItemPerPage,
                pageNum * numOfItemPerPage < maxItem
                  ? pageNum * numOfItemPerPage
                  : undefined
              )
              .map((address) => {
                return (
                  <TR key={address.id}>
                    {Object.keys(heads).map((key, idx) => {
                      return (
                        <TD key={idx}>
                          {address[key as keyof IOriginAddress]}
                        </TD>
                      );
                    })}
                    <TD>
                      <div className="flex flex-row gap-4">
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            router.push(
                              `${dashboardAddressEditRoute}/${address.id}`
                            );
                          }}
                        >
                          <FaEdit size={20} />
                        </div>
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setOriginAddressToDelete(address);
                            setIsDeleteModalShown(true);
                          }}
                        >
                          <RiDeleteBin6Line size={20} />
                        </div>
                      </div>
                    </TD>
                  </TR>
                );
              })}
        </tbody>
      </Table>
      <div className="mt-2">
        <Pagination
          numOfPages={maxPageNum}
          currentPage={pageNum}
          maxItem={maxItem}
          itemPerPage={numOfItemPerPage}
          setPage={setPageNum}
        />
      </div>
      {isDeleteModalShown && originAddressToDelete !== null && (
        <DeleteModal
          itemToDelete={`address ${originAddressToDelete?.branchName}`}
          isModalShown={isDeleteModalShown}
          setIsModalShown={setIsDeleteModalShown}
          handleDeleteItem={() => handleDeleteAddress()}
        />
      )}
    </div>
  );
};

export default ManageAddress;
