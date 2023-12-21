import StatCard from "@/components/Card/StatCard";
import EarningChart from "@/components/EarningChart";
import { FormSelect } from "@/components/Form";
import { IShippingList } from "@/types/api";
import { addOnsPriceMap } from "@/utils/addOnsMap";
import useShippingHistory from "@/utils/api/useShippingHistory";
import { currencyFormat } from "@/utils/currencyFormat";
import React, { useEffect, useState } from "react";

const EarningReports = () => {
  const { shippings, getShippingHistory } = useShippingHistory();

  const earnings = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    Desember: 0,
  };
  const discounts = { ...earnings };

  const [earningByMonth, setEarningByMonth] = useState<typeof earnings>();
  const [discountByMonth, setDiscountByMonth] = useState<typeof discounts>();
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const months = Object.keys(earnings);

  useEffect(() => {
    getShippingHistory();
  }, []);

  useEffect(() => {
    if (shippings !== null) {
      (shippings as IShippingList[])
        .flatMap((user) => user.detail)
        .filter(
          (shipping) =>
            new Date(shipping.createdAt).getFullYear().toString() ===
            selectedYear
        )
        .forEach((shipping) => {
          const monthIdx = new Date(shipping.createdAt).getMonth();
          earnings[months[monthIdx] as keyof typeof earnings] +=
            shipping.paidAmount;
          discounts[months[monthIdx] as keyof typeof discounts] +=
            shipping.cost +
            addOnsPriceMap[shipping.addOns] -
            shipping.paidAmount;
        });
      setEarningByMonth(earnings);

      setDiscountByMonth(discounts);
    }
  }, [shippings, selectedYear]);

  return (
    <div className="h-[80vh]">
      <div className="flex flex-row justify-between w-[90%]">
        <div className="flex flex-row gap-4">
          <div>
            <StatCard
              title="Total Earning"
              value={
                earningByMonth
                  ? currencyFormat(
                      months
                        .map((month) => {
                          return earningByMonth[
                            month as keyof typeof earningByMonth
                          ];
                        })
                        .reduce((sum, cur) => sum + cur)
                    )
                  : ""
              }
            />
          </div>{" "}
          <div>
            <StatCard
              title="Total Discount"
              value={
                discountByMonth
                  ? currencyFormat(
                      months
                        .map((month) => {
                          return discountByMonth[
                            month as keyof typeof discountByMonth
                          ];
                        })
                        .reduce((sum, cur) => sum + cur)
                    )
                  : ""
              }
            />
          </div>
        </div>
        <div>
          <FormSelect
            defaultValue={selectedYear}
            optionPlaceholderText="Select Year"
            options={["2023", "2022", "2021"]}
            setSelectedOption={setSelectedYear}
            titleText="Year"
          />
        </div>
      </div>
      {earningByMonth && discountByMonth && (
        <div className="flex flex-col h-full">
          <div className="w-full h-full">
            <EarningChart
              title=""
              xLabelNames={["Earning", "Discount"]}
              labels={months}
              dataYs={[
                months.map((month) => {
                  return earningByMonth[month as keyof typeof earningByMonth];
                }),
                months.map((month) => {
                  return discountByMonth[month as keyof typeof discountByMonth];
                }),
              ]}
              lineColors={["#1DC009", "#353E69"]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningReports;
