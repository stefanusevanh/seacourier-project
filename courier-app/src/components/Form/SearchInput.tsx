import React, { useEffect, useState } from "react";
import { FormInput } from ".";
import { FaSearch } from "react-icons/fa";

const SearchInput = ({
  placeholder,
  maxInputLength,
  setSearchInputDebounced,
}: {
  placeholder: string;
  maxInputLength: number;
  setSearchInputDebounced: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [searchTrackingNumberInput, setSearchTrackingNumberInput] =
    useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        setSearchInputDebounced(searchTrackingNumberInput);
      }, 800)
    );
  }, [searchTrackingNumberInput]);

  return (
    <FormInput
      type="text"
      withPrefix={<FaSearch />}
      placeholder={placeholder}
      value={searchTrackingNumberInput}
      onChange={(e) => {
        if (
          e.target.value.replace(/[^ \da-zA-Z]/g, "").length <= maxInputLength
        ) {
          setSearchTrackingNumberInput(
            e.target.value.replace(/[^ \da-zA-Z]/g, "")
          );
        }
      }}
      isRoundedFull
    />
  );
};

export default SearchInput;
