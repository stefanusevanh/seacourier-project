import { IShippingDetail } from "@/types/api";
import { addOnsMap, addOnsPriceMap } from "@/utils/addOnsMap";
import { currencyFormat } from "@/utils/currencyFormat";

export const PaymentDetailTable = ({ item }: { item: IShippingDetail }) => {
  const LeftCol = ({
    mainText,
    secondaryText,
  }: {
    mainText: string;
    secondaryText?: string;
  }) => {
    return (
      <td className="flex flex-col">
        <span>{mainText}</span>
        {secondaryText && (
          <span className="text-[0.6rem] whitespace-nowrap ">
            ({secondaryText})
          </span>
        )}
      </td>
    );
  };
  const RightCol = ({ value }: { value: string }) => {
    return <td className="text-right">{value}</td>;
  };
  return (
    <div className="overflow-x-auto flex flex-col">
      <span className=" font-bold text-xs text-left self-end w-full">
        Payment Details
      </span>
      <table className="table table-sm">
        <tbody>
          <tr>
            <LeftCol mainText="Shipping" secondaryText={item.category} />
            <RightCol value={currencyFormat(item.cost)} />
          </tr>
          {item.addOns !== "0" && (
            <tr>
              <LeftCol
                mainText="Add Ons"
                secondaryText={addOnsMap[item.addOns]}
              />
              <RightCol value={currencyFormat(addOnsPriceMap[item.addOns])} />
            </tr>
          )}
          {item.promoUsed !== null &&
            item.promoUsed.promoCode !== "" &&
            item.addOns !== "0" && (
              <tr className="bg-base-200">
                <LeftCol mainText="Sub Total" />
                <RightCol
                  value={currencyFormat(
                    item.cost + addOnsPriceMap[item.addOns]
                  )}
                />
              </tr>
            )}
          {item.promoUsed !== null && item.promoUsed.promoCode !== "" && (
            <tr>
              <LeftCol mainText={item.promoUsed.promoCode} />
              <RightCol
                value={currencyFormat(
                  item.paidAmount - (item.cost + addOnsPriceMap[item.addOns])
                )}
              />
            </tr>
          )}
          <tr className="bg-base-200">
            <LeftCol mainText="Total" />
            <RightCol value={currencyFormat(item.paidAmount)} />
          </tr>
        </tbody>
      </table>
    </div>
  );
};
