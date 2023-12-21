import { Button } from "@/components/Button";
import { SearchInput } from "@/components/Form";
import { DeleteModal } from "@/components/Modal";
import Pagination from "@/components/Pagination";
import { TD, TH, TR, Table } from "@/components/Table";
import { dashboardPromosAddRoute, dashboardPromosEditRoute } from "@/routes";
import { IPromo } from "@/types/api";
import usePromoCode from "@/utils/api/usePromoCode";
import useUpdatePromoCode from "@/utils/api/useUpdatePromoCode";
import { dateFormat } from "@/utils/dateFormat";
import { maxPromoCodeDigits } from "@/utils/formFieldValidation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "sonner";

const ManagePromos = () => {
  const router = useRouter();
  const { promos, getPromos } = usePromoCode();
  const [searchPromoCode, setSearchPromoCode] = useState("");
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [promoCodeToDelete, setPromoCodeToDelete] = useState<IPromo | null>(
    null
  );
  const { updatePromoCode } = useUpdatePromoCode();

  const [pageNum, setPageNum] = useState(1);
  const [maxPageNum, setMaxPageNum] = useState(1);
  const [maxItem, setMaxItem] = useState(1);
  const numOfItemPerPage = 10;
  const heads = {
    createdAt: "Created Date",
    promoCode: "Promo Code",
    discount: "Discount [%]",
    quota: "Quota",
    used: "Used",
    expiryDate: "Exp Date",
  };
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [sortItem, setSortItem] = useState<keyof typeof heads>("createdAt");
  const sorting = (a: IPromo, b: IPromo) => {
    const val = (val: IPromo) => {
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
    getPromos();
  }, []);

  useEffect(() => {
    if (promos !== null) {
      setMaxItem((promos as IPromo[]).length);
      if (searchPromoCode !== "") {
        setPageNum(1);
      }
    }
  }, [promos, searchPromoCode]);

  useEffect(() => {
    setMaxPageNum(Math.ceil(maxItem / numOfItemPerPage));
  }, [maxItem]);

  useEffect(() => {
    if (promos !== null) {
      const filteredPromos = (promos as IPromo[])
        ?.slice()
        .filter(
          (promo) =>
            promo.promoCode.includes(searchPromoCode.toUpperCase()) ||
            searchPromoCode === ""
        );

      setMaxItem(filteredPromos.length);
    }
  }, [searchPromoCode, promos]);

  const handleDeletePromo = () => {
    if (promoCodeToDelete !== null) {
      updatePromoCode("DELETE", promoCodeToDelete?.id);
      setTimeout(() => {
        getPromos();
      }, 500);
      setTimeout(() => {
        toast.success(
          `Promo #${promoCodeToDelete?.promoCode} has been deleted`,
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
            placeholder="Search by promo code"
            maxInputLength={maxPromoCodeDigits}
            setSearchInputDebounced={setSearchPromoCode}
          />
        </div>
        <div>
          <Button
            withoutHoverEffect
            onClick={() => router.push(dashboardPromosAddRoute)}
          >
            Add New Promo
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
          {promos !== null &&
            (promos as IPromo[])
              .filter(
                (promo) =>
                  promo.promoCode.includes(searchPromoCode.toUpperCase()) ||
                  searchPromoCode === ""
              )
              .sort(sorting)
              .slice(
                (pageNum - 1) * numOfItemPerPage,
                pageNum * numOfItemPerPage < maxItem
                  ? pageNum * numOfItemPerPage
                  : undefined
              )
              .map((promo) => {
                return (
                  <TR
                    key={promo.promoCode}
                    additionalStyle={
                      promo.expiryDate < new Date().toISOString() ||
                      promo.quota === promo.used
                        ? "bg-[red]/20 "
                        : ""
                    }
                  >
                    {Object.keys(heads).map((key, idx) => {
                      if (key === "expiryDate" || key === "createdAt") {
                        return (
                          <TD key={idx}>
                            {dateFormat(promo[key as keyof IPromo] as string)}
                          </TD>
                        );
                      }
                      return <TD key={idx}>{promo[key as keyof IPromo]}</TD>;
                    })}
                    <TD>
                      <div className="flex flex-row gap-4">
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            router.push(
                              `${dashboardPromosEditRoute}/${promo.id}`
                            );
                          }}
                        >
                          <FaEdit size={20} />
                        </div>
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setPromoCodeToDelete(promo);
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
      {isDeleteModalShown && promoCodeToDelete?.promoCode !== null && (
        <DeleteModal
          itemToDelete={`Promo ${promoCodeToDelete?.promoCode}`}
          isModalShown={isDeleteModalShown}
          setIsModalShown={setIsDeleteModalShown}
          handleDeleteItem={() => handleDeletePromo()}
        />
      )}
    </div>
  );
};

export default ManagePromos;
