import { TRole } from "@/types/role";
import Image from "next/image";
import Link from "next/link";
import * as R from "@/routes";
import useLogout from "@/hooks/useLogout";

export const ProfileIcon = ({
  imgURL,
  role,
  setRole,
}: {
  imgURL: string;
  role: TRole;
  setRole: React.Dispatch<React.SetStateAction<TRole>>;
}) => {
  const logout = useLogout();

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <Image
            alt="Tailwind CSS Navbar component"
            src={imgURL}
            height={200}
            width={200}
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-[black]"
      >
        <li>
          <Link
            href={
              role === "USER"
                ? R.profileRoute
                : role === "ADMIN"
                ? R.dashboardProfileRoute
                : ""
            }
            className="justify-between"
          >
            Profile
          </Link>
        </li>
        {role === "USER" && (
          <li>
            <Link href={R.addressRoute}>Saved Addresses</Link>
          </li>
        )}
        <li>
          <span
            onClick={(e) => {
              logout(e.detail, setRole);
            }}
          >
            Log Out
          </span>
        </li>
      </ul>
    </div>
  );
};
