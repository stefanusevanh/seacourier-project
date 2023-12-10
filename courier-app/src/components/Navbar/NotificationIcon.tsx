import { IoIosNotifications } from "react-icons/io";
const NotificationIcon = () => {
  return (
    <button className="btn btn-ghost btn-circle">
      <div className="indicator">
        <IoIosNotifications size={25} />
        <span className="badge badge-xs bg-primary_red border-primary_red indicator-item top-0 right-1"></span>
      </div>
    </button>
  );
};

export default NotificationIcon;
