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
  withPrefix,
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
  withPrefix?: string;
  withElementAtRight?: JSX.Element;
}) => {
  const [toggleForTypePassword, setToggleForTypePassword] =
    useState("password");

  return (
    <label className="form-control w-full">
      <div className="label pb-1 relative">
        {titleText && <span className="label-text">{titleText}</span>}
        {type === "password" && (
          <div
            className="cursor-pointer rounded-full w-fit h-fit p-1 hover:bg-primary_orange absolute -bottom-9 right-2"
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
        {withPrefix && (
          <div className="absolute -bottom-9 left-3">{withPrefix}</div>
        )}
      </div>
      <div className="flex flex-row gap-1">
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
          } ${withPrefix ? "pl-10" : ""}
        `}
          disabled={isDisabled}
        />
        {withElementAtRight && <div>{withElementAtRight}</div>}
      </div>

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
    </label>
  );
};

export default FormInput;
