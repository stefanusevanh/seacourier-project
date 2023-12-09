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
  isError,
}: {
  type: HTMLInputTypeAttribute;
  value: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  titleText: string;
  placeholder: string;
  errorText?: string;
  isError?: boolean;
}) => {
  const [toggleForTypePassword, setToggleForTypePassword] =
    useState("password");

  return (
    <label className="form-control w-full">
      <div className="label pb-1 relative">
        <span className="label-text">{titleText}</span>
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
      </div>
      <input
        type={type === "password" ? toggleForTypePassword : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input ${
          isError && "input-error"
        } input-bordered w-full bg-[#f4f4f4] focus:border-dashed ${
          type === "password" ? "tracking-widest" : "tracking-normal"
        } placeholder:tracking-normal`}
      ></input>

      <div className={`label  ${isError ? "visible" : "invisible"} pb-0 pt-1`}>
        <span
          className={`label-text-alt text-[red]  ${
            isError && "animate-wiggle"
          }`}
        >
          {errorText}
        </span>
      </div>
    </label>
  );
};

export default FormInput;