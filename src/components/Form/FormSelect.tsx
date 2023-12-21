import React from "react";

const FormSelect = ({
  options,
  optionPlaceholderText,
  defaultValue,
  titleText,
  errorText,
  correctText,
  isError,
  isCorrect,
  isDisabled,
  setSelectedOption,
}: {
  options: string[];
  optionPlaceholderText: string;
  defaultValue: string;
  titleText?: string;
  errorText?: string;
  correctText?: string;
  isError?: boolean;
  isCorrect?: boolean;
  isDisabled?: boolean;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <label className="form-control w-full max-w-xs">
      {titleText && (
        <div className="label">
          <span className="label-text">{titleText}</span>
        </div>
      )}
      <select
        className="select select-bordered"
        disabled={isDisabled}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        <option disabled selected={defaultValue === ""}>
          {optionPlaceholderText}
        </option>
        {options.map((optionText, idx) => {
          return (
            <option
              key={idx}
              value={optionText}
              selected={optionText === defaultValue}
            >
              {optionText}
            </option>
          );
        })}
      </select>
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

export default FormSelect;
