import { PaymentModal } from "@/components/Modal";
import NewShipmentStep1 from "@/components/NewShipmentStep/NewShipmentStep1";
import NewShipmentStep2 from "@/components/NewShipmentStep/NewShipmentStep2";
import NewShipmentStep3 from "@/components/NewShipmentStep/NewShipmentStep3";
import { useAppSelector } from "@/stores/store";
import useUser from "@/utils/api/useUser";
import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
const ShippingStepIndicator = ({ stepNum }: { stepNum: number }) => {
  return (
    <ul className="steps">
      <li className={`step ${stepNum >= 1 ? "step-primary" : ""}`}>
        Shipment Details{" "}
      </li>
      <li className={`step ${stepNum >= 2 ? "step-primary" : ""}`}>
        Review & Confirm
      </li>
      <li className={`step ${stepNum === 3 ? "step-primary" : ""}`}>
        Track Your Shipment
      </li>
    </ul>
  );
};

const Shipping = () => {
  const [stepNum, setStepNum] = useState(1);
  const [paidAmount, setPaidAmount] = useState(0);
  const [isModalShown, setIsModalShown] = useState(false);
  const userID = useAppSelector((state) => state.roleID.user_id);
  const { user, getUser } = useUser();

  useEffect(() => {
    getUser(userID);
  }, []);

  return (
    <div>
      <h1>Create a New Shipment</h1>
      <div className="relative">
        <div className="flex justify-center">
          <ShippingStepIndicator stepNum={stepNum} />
        </div>
        {stepNum === 2 && (
          <div
            className="absolute left-0 z-10 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setStepNum(stepNum - 1)}
          >
            <div
              className={
                "flex flex-row items-center gap-1 p-1 rounded-md hover:bg-[#ebebeb]"
              }
            >
              <FaChevronLeft size={18} />
              <span>Back</span>
            </div>
          </div>
        )}
      </div>
      {stepNum === 1 && <NewShipmentStep1 setStepNum={setStepNum} />}
      {stepNum === 2 && (
        <NewShipmentStep2
          user={user}
          paidAmount={paidAmount}
          setPaidAmount={setPaidAmount}
          setIsModalShown={setIsModalShown}
        />
      )}
      {stepNum === 3 && <NewShipmentStep3 setStepNum={setStepNum} />}
      <PaymentModal
        isModalShown={isModalShown}
        setIsModalShown={setIsModalShown}
        paidAmount={paidAmount}
        user={user}
        stepNum={2}
        setStepNum={setStepNum}
      />
    </div>
  );
};

export default Shipping;
