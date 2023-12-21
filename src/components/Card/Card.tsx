import React, { ReactNode } from "react";

export const Card = ({
  withShadow = true,
  cardPadding,
  bgColor,
  children,
}: {
  withShadow?: boolean;
  cardPadding?: string;
  bgColor?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={`card w-full ${
        bgColor ? bgColor : "bg-base-100"
      } border-base-300 border-[1px] items-center ${
        withShadow ? "shadow-md" : "shadow-none"
      }`}
    >
      <div className={`card-body items-center w-full ${cardPadding}`}>
        {children}
      </div>
    </div>
  );
};

export const SmallCard = ({ children }: { children: ReactNode }) => {
  return (
    <div className="card w-full max-w-52 bg-base-100  items-center border-[grey] border-[1px] cursor-pointer">
      <div className="card-body items-center">{children}</div>
    </div>
  );
};
export const BigCard = ({ children }: { children: ReactNode }) => {
  return (
    <div className="card w-full bg-base-100 border-base-300 border-[1px] shadow-xl items-center mx-auto">
      <div className="card-body items-center w-full">{children}</div>
    </div>
  );
};

export const OptionCard = ({
  optionName,
  textMain,
  textSecondary,
  defaultValue,
  defaultChecked,
  onChange,
  onClick,
  id,
  isDisabled,
}: {
  optionName: string;
  textMain: string;
  textSecondary?: string;
  defaultValue: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: () => void;
  onClick?: (e: any) => void;
  id?: string;
  isDisabled?: boolean;
}) => {
  return (
    <div id={id}>
      <input
        type="radio"
        name={optionName}
        defaultValue={defaultValue}
        id={defaultValue}
        className="peer hidden [&:checked_+_label_svg]:block"
        defaultChecked={defaultChecked}
        onChange={onChange}
        disabled={isDisabled}
      />
      <label
        id={defaultValue}
        htmlFor={defaultValue}
        onClick={onClick}
        className={`block  rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 peer-checked:border-blue-500 peer-checked:ring-1 peer-checked:ring-blue-500 ${
          isDisabled
            ? "bg-[#e7e7e7] text-[grey] cursor-not-allowed "
            : "cursor-pointer"
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-gray-700">{textMain}</p>
          <svg
            className="hidden h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {textSecondary && <p className="mt-1 text-[0.8rem]">{textSecondary}</p>}
      </label>
    </div>
  );
};
