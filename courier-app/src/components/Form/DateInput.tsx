import React from "react";

const DateInput = ({
  titleText,
  placeholder,
  errorText,
  isError,
  setDate,
  isPastDateDisabled,
  defaultValue,
}: {
  titleText?: string;
  placeholder?: string;
  errorText?: string;
  isError?: boolean;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  isPastDateDisabled?: boolean;
  defaultValue?: string;
}) => {
  return (
    <label className="form-control w-full">
      {titleText && (
        <div className="label pb-1">
          {titleText && <span className="label-text">{titleText}</span>}
        </div>
      )}
      <div className="flex flex-row gap-1 relative">
        <input
          type="date"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder={placeholder}
          onChange={(e) => {
            if (e.target.value !== "") {
              setDate(e.target.value + "T16:59:59.000Z");
              return;
            }
            setDate(e.target.value);
          }}
          min={
            isPastDateDisabled
              ? new Date().toISOString().split("T")[0]
              : undefined
          }
          defaultValue={defaultValue}
        />
      </div>
      {errorText && (
        <div
          className={`label  ${isError ? "visible" : "invisible"} pb-0 pt-1`}
        >
          <span
            className={`label-text-alt   ${
              isError && "text-[red] animate-wiggle"
            } `}
          >
            {isError && errorText}
          </span>
        </div>
      )}
    </label>
  );
};

export default DateInput;
