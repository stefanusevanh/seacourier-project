import { useState } from "react";
import { MdContentCopy } from "react-icons/md";

const CopyTextIcon = ({ textToCopy }: { textToCopy: string }) => {
  const [textTooltip, setTextTooltip] = useState<"Copy" | "Copied!">("Copy");
  return (
    <div className="w-[20px] h-[20px] relative">
      <div
        className="tooltip tooltip-right cursor-pointer absolute z-20"
        data-tip={textTooltip}
        onClick={() => {
          navigator.clipboard.writeText(textToCopy);
          setTextTooltip("Copied!");
        }}
      >
        <MdContentCopy size={20} />
      </div>
    </div>
  );
};

export default CopyTextIcon;
