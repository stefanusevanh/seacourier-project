import NewShipmentStep1 from "@/components/NewShipmentStep/NewShipmentStep1";
import NewShipmentStep2 from "@/components/NewShipmentStep/NewShipmentStep2";
import NewShipmentStep3 from "@/components/NewShipmentStep/NewShipmentStep3";
import React, { useState } from "react";

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

  return (
    <div>
      <h1>Create a New Shipment</h1>
      <div className="flex justify-center">
        <ShippingStepIndicator stepNum={stepNum} />
      </div>
      {stepNum === 1 && <NewShipmentStep1 setStepNum={setStepNum} />}
      {stepNum === 2 && <NewShipmentStep2 setStepNum={setStepNum} />}
      {stepNum === 3 && <NewShipmentStep3 setStepNum={setStepNum} />}
    </div>
  );
};

export default Shipping;
