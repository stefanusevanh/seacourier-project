import { ReactNode } from "react";
import { IoMdClose } from "react-icons/io";

export const Modal = ({
  isModalShown,
  setIsModalShown,
  children,
}: {
  isModalShown: boolean;
  setIsModalShown: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
}) => {
  return (
    <div
      tabIndex={-1}
      className={`fixed z-40 ${
        isModalShown ? "flex" : "hidden"
      } overflow-y-auto overflow-x-hidden justify-center items-center w-full h-full md:inset-0 max-h-full bg-[rgba(0,0,0,0.4)]`}
    >
      <div className="relative p-4 w-full max-w-md max-h-full ">
        <div className="relative bg-[white] rounded-lg shadow">{children}</div>

        <button
          type="button"
          className="absolute top-5 end-5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={() => setIsModalShown(false)}
        >
          <IoMdClose size={25} />
        </button>
      </div>
    </div>
  );
};
