import React, { HTMLInputTypeAttribute, useState } from "react";
import { IoMdEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";

const FormInput = ({
  type,
  value,
  onChange,
  titleText,
  placeholder,
  errorText,
  correctText,
  isError,
  isCorrect,
  isDisabled,
  isHidden,
  isRoundedFull,
  withPrefix,
  withSuffix,
  withElementAtRight,
}: {
  type: HTMLInputTypeAttribute;
  value?: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  titleText?: string;
  placeholder?: string;
  errorText?: string;
  correctText?: string;
  isError?: boolean;
  isCorrect?: boolean;
  isDisabled?: boolean;
  isHidden?: boolean;
  isRoundedFull?: boolean;
  withPrefix?: string | JSX.Element;
  withSuffix?: string | JSX.Element;
  withElementAtRight?: JSX.Element;
}) => {
  const [toggleForTypePassword, setToggleForTypePassword] =
    useState("password");

  return (
    <label className="form-control w-full">
      {titleText && (
        <div className="label pb-1">
          {titleText && <span className="label-text">{titleText}</span>}
        </div>
      )}
      <div className="flex flex-row gap-1 relative">
        <input
          type={type === "password" ? toggleForTypePassword : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input ${
            isError && "input-error"
          } input-bordered w-full bg-[#f4f4f4] focus:border-dashed ${
            type === "password" ? "tracking-widest" : "tracking-normal"
          } placeholder:tracking-normal ${isHidden ? "hidden" : ""} ${
            isDisabled
              ? "!bg-[white] !cursor-text !border-none !text-primary_blue"
              : ""
          } ${isRoundedFull ? "rounded-full" : ""} ${withPrefix ? "pl-10" : ""}
        `}
          disabled={isDisabled}
        />
        {type === "password" && (
          <div
            className="cursor-pointer rounded-full w-fit h-fit p-1 hover:bg-primary_orange absolute top-1/2 right-2.5 -translate-y-1/2"
            onMouseDown={() => setToggleForTypePassword("text")}
            onMouseUp={() => setToggleForTypePassword("password")}
          >
            {toggleForTypePassword === "password" ? (
              <IoMdEyeOff />
            ) : (
              <IoMdEye />
            )}
          </div>
        )}
        {withSuffix && (
          <div className="absolute top-1/2 right-2.5 -translate-y-1/2">
            {withSuffix}
          </div>
        )}
        {withPrefix && (
          <div className="absolute top-1/2 left-3.5 -translate-y-1/2">
            {withPrefix}
          </div>
        )}
        {withElementAtRight && <div>{withElementAtRight}</div>}
      </div>

      {(errorText || correctText) && (
        <div
          className={`label  ${
            isError || isCorrect ? "visible" : "invisible"
          } pb-0 pt-1`}
        >
          <span
            className={`label-text-alt   ${
              isError && "text-[red] animate-wiggle"
            } ${isCorrect && "text-[green] animate-wiggle"}`}
          >
            {isError && errorText}
            {isCorrect && correctText}
          </span>
        </div>
      )}
    </label>
  );
};

export default FormInput;
