import React from "react";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";

const Pagination = ({
  numOfPages,
  currentPage,
  maxItem,

  itemPerPage,
  setPage,
}: {
  numOfPages: number;
  currentPage: number;
  maxItem: number;
  itemPerPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <div className="flex flex-row justify-between">
      <span>{`Showing ${(currentPage - 1) * itemPerPage + 1}-${
        currentPage * itemPerPage < maxItem
          ? currentPage * itemPerPage
          : maxItem
      } of ${maxItem} items`}</span>
      <div className="join ">
        <button className="join-item btn btn-sm" onClick={() => setPage(1)}>
          <FaAngleDoubleLeft />
        </button>
        <button
          className={`join-item btn btn-sm ${
            currentPage === 1 && "cursor-not-allowed !scale-100"
          }`}
          onClick={() => {
            if (currentPage !== 1) {
              setPage(currentPage - 1);
              return;
            }
          }}
        >
          <FaAngleLeft />
        </button>
        {[...Array(numOfPages)].map((_, idx) => {
          return (
            <button
              key={idx}
              className={`join-item btn btn-sm ${
                currentPage === idx + 1 && "btn-active"
              }`}
              onClick={() => {
                setPage(idx + 1);
              }}
            >
              {idx + 1}
            </button>
          );
        })}
        <button
          className={`join-item btn btn-sm ${
            currentPage === numOfPages && "cursor-not-allowed !scale-100"
          }`}
          onClick={() => {
            if (currentPage !== numOfPages) {
              setPage(currentPage + 1);
              return;
            }
          }}
        >
          <FaAngleRight />
        </button>
        <button
          className="join-item btn btn-sm"
          onClick={() => setPage(numOfPages)}
        >
          <FaAngleDoubleRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
