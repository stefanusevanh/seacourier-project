import React, { ReactNode } from "react";

export const PageTabContent = ({
  tabTitle,
  isOpen,
  onChange,
  children,
}: {
  tabTitle: string;
  isOpen?: boolean;
  onChange?: () => void;
  children?: ReactNode;
}) => {
  return (
    <>
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab whitespace-nowrap"
        aria-label={tabTitle}
        onChange={onChange}
        checked={isOpen}
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6 shadow-md"
      >
        {children}
      </div>
    </>
  );
};

export const PageTabContentHidden = () => {
  return (
    <input
      type="radio"
      name="my_tabs_2"
      role="tab"
      className="tab whitespace-nowrap cursor-default !border-b-0"
      checked={false}
      onChange={() => {}}
    />
  );
};

export const PageTab = ({
  isNormalTab,
  children,
}: {
  isNormalTab?: boolean;
  children: ReactNode;
}) => {
  return (
    <div
      role="tablist"
      className={`tabs tabs-lifted tabs-md text-primary_blue rounded-b-2xl rounded-t-2xl mx-auto ${
        !isNormalTab ? "grid-cols-[1fr_auto_auto_auto_1fr]" : ""
      }`}
    >
      {children}
    </div>
  );
};
