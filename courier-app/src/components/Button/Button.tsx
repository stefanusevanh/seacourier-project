import React, { HTMLInputTypeAttribute, ReactNode } from "react";

interface IButton {
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "reset" | "submit";
  isLoading?: boolean;
  withoutHoverEffect?: boolean;
}

export const Button = ({
  children,
  onClick,
  type,
  isLoading,
  withoutHoverEffect,
}: IButton) => {
  return (
    <div className="card-actions w-full relative">
      <button
        className={`btn text-primary_blue w-full bg-primary_orange ${
          !withoutHoverEffect &&
          "hover:text-primary_orange hover:bg-primary_blue hover:text-[1.125rem]"
        } transition ease-linear delay-0`}
        onClick={onClick}
        type={type}
      >
        {children}
        {isLoading && (
          <span className="loading loading-spinner loading-md absolute right-5 top-3"></span>
        )}
      </button>
    </div>
  );
};

export const ButtonInverted = ({ children, onClick, type }: IButton) => {
  return (
    <div className="card-actions w-full">
      <button
        className="btn hover:text-primary_blue w-full hover:bg-primary_orange text-primary_orange bg-primary_blue hover:text-[1.125rem]"
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    </div>
  );
};

export const ButtonBorderOnly = ({ children, onClick, type }: IButton) => {
  return (
    <div className="card-actions w-full">
      <button
        className="btn  w-full hover:bg-[white] text-primary_blue bg-[white] border-[grey] border-[1px] border-solid hover:border-primary_blue hover:border-2"
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    </div>
  );
};
