import { IoGift } from "react-icons/io5";
export const GameIcon = () => {
  //THIS COMPONENT IS NOT READY YET
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <IoGift size={25} />
          <span className="badge badge-sm bg-primary_orange indicator-item -top-[0.5px] -right-[0.5px] p-1 border-primary_blue text-sm">
            8
          </span>
        </div>
      </div>
      <div
        tabIndex={0}
        className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
      >
        <div className="card-body">
          <span className="font-bold text-lg">8 Items</span>
          <span className="text-info">Subtotal: $999</span>
          <div className="card-actions">
            <button className="btn btn-primary btn-block">View cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};
