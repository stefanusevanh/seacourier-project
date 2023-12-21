import { SearchInput } from "@/components/Form";
import Pagination from "@/components/Pagination";
import RatingStars from "@/components/RatingStars";
import { TD, TH, TR, Table } from "@/components/Table";
import { dashboardShippingEditRoute, dashboardShippingRoute } from "@/routes";
import { IShippingDetail, IShippingList } from "@/types/api";
import useShippingHistory from "@/utils/api/useShippingHistory";
import { dateFormat } from "@/utils/dateFormat";
import { maxTrackingNumberLength } from "@/utils/formFieldValidation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiDetail } from "react-icons/bi";

const ManageShipping = () => {
  const router = useRouter();
  const { shippings, getShippingHistory } = useShippingHistory();
  const [searchTrackingNumber, setSearchTrackingNumber] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [maxPageNum, setMaxPageNum] = useState(1);
  const [maxItem, setMaxItem] = useState(1);
  const numOfItemPerPage = 10;
  const heads = {
    trackingNumber: "TN",
    createdAt: "Order Date",
    origin: "Origin",
    destination: "Destination",
    category: "Category",
    status: "Status",
    size: "Size",
    review: "Review",
  };
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [sortItem, setSortItem] =
    useState<keyof typeof heads>("trackingNumber");
  const sorting = (a: IShippingDetail, b: IShippingDetail) => {
    const val = (val: IShippingDetail) => {
      switch (sortItem) {
        case "size":
          return val.length * val.width * val.height;
        case "origin":
          return val.originAddress.city;
        case "destination":
          return val.destinationAddress.city;
        default:
          return val[sortItem].toLowerCase();
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
    getShippingHistory();
  }, []);

  useEffect(() => {
    if (shippings !== null) {
      setMaxItem(shippings.length);
      if (searchTrackingNumber !== "") {
        setPageNum(1);
      }
    }
  }, [shippings, searchTrackingNumber]);

  useEffect(() => {
    setMaxPageNum(Math.ceil(maxItem / numOfItemPerPage));
  }, [maxItem]);

  useEffect(() => {
    if (shippings !== null) {
      const filteredShippings = (shippings as IShippingList[])?.map((user) =>
        user.detail
          .slice()
          .filter(
            (shipping) =>
              shipping.trackingNumber.includes(
                searchTrackingNumber.toUpperCase()
              ) || searchTrackingNumber === ""
          )
      );
      setMaxItem(filteredShippings.flat().length);
    }
  }, [searchTrackingNumber, shippings]);

  return (
    <div className="">
      <div className="w-64 my-4">
        <SearchInput
          placeholder="Search by tracking number"
          maxInputLength={maxTrackingNumberLength}
          setSearchInputDebounced={setSearchTrackingNumber}
        />
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
          {shippings !== null &&
            (shippings as IShippingList[])
              ?.flatMap((user) => user.detail)
              .filter((shipping) => {
                if (searchTrackingNumber !== "") {
                  return shipping.trackingNumber.includes(
                    searchTrackingNumber.toUpperCase()
                  );
                }
                return true;
              })
              .sort(sorting)
              .slice(
                (pageNum - 1) * numOfItemPerPage,
                pageNum * numOfItemPerPage < maxItem
                  ? pageNum * numOfItemPerPage
                  : undefined
              )
              .map((shipping) => {
                return (
                  <TR key={shipping.trackingNumber}>
                    <TD>{shipping.trackingNumber}</TD>
                    <TD>{dateFormat(shipping.createdAt)}</TD>
                    <TD>{shipping.originAddress.city}</TD>
                    <TD>{shipping.destinationAddress.city}</TD>
                    <TD>{shipping.category}</TD>
                    <TD>
                      <span
                        className={`badge badge-lg ${
                          shipping.status === "PAID"
                            ? "bg-primary_orange"
                            : shipping.status === "ON SHIPPING"
                            ? "bg-primary_blue text-[white]"
                            : "bg-[#1DC009] text-[white]"
                        }`}
                      >
                        {shipping.status}
                      </span>
                    </TD>
                    <TD>
                      {(shipping.length * shipping.width * shipping.height) /
                        1000}
                    </TD>
                    <TD>
                      {shipping.status === "DELIVERED" &&
                        shipping.review !== "" && (
                          <RatingStars ratingValue={Number(shipping.review)} />
                        )}
                    </TD>
                    <TD>
                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(
                            `${dashboardShippingEditRoute}/${shipping.trackingNumber.charAt(
                              0
                            )}/${shipping.trackingNumber}`
                          )
                        }
                      >
                        <BiDetail size={20} />
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
    </div>
  );
};

export default ManageShipping;
