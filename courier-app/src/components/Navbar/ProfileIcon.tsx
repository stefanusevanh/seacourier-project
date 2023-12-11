import { TRole } from "@/types/role";
import Image from "next/image";
import Link from "next/link";
import * as R from "@/routes";
import useLogout from "@/hooks/useLogout";
import useUser from "@/utils/api/useUser";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "@/utils/cookies";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { storeUserID } from "@/stores/roleIDSlice/roleIDSlice";
import { decodeString } from "@/utils/stringEncoderDecoder";

export const ProfileIcon = ({
  role,
  setRole,
}: {
  role: TRole;
  setRole: React.Dispatch<React.SetStateAction<TRole>>;
}) => {
  const logout = useLogout();
  const { user, getUser } = useUser();
  const dispatch = useAppDispatch();
  const roleID = useAppSelector((state) => state.roleID);
  const profilePhotoURL = decodeString(getCookie("PPURL"));
  const tempAdminToken = getCookie("token_temp");
  const [adminToken, setAdminToken] = useState(
    tempAdminToken !== "" ? tempAdminToken : ""
  );

  useEffect(() => {
    switchToUserIsAdmin();
  }, [user]);

  const switchToUserIsAdmin = () => {
    if (user !== null && user.email === "user@mail.com") {
      setCookie("token", user.token, 1);
      setRole("USERISADMIN");
      if (roleID.user_id === 0) {
        dispatch(storeUserID(user.id));
      }
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <Image
            alt="Profile Icon"
            src={profilePhotoURL}
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
                : role === "ADMIN" || role === "USERISADMIN"
                ? R.dashboardProfileRoute
                : ""
            }
            className="justify-between"
          >
            Profile {(role === "ADMIN" || role === "USERISADMIN") && "(Admin)"}
          </Link>
        </li>
        {role === "ADMIN" && (
          <li>
            <span
              className="justify-between"
              onClick={() => {
                if (user === null) {
                  setAdminToken(getCookie("token"));
                  getUser(1);
                  return;
                }
                switchToUserIsAdmin();
              }}
            >
              Switch Role to User
            </span>
          </li>
        )}
        {role === "USERISADMIN" && (
          <li>
            <span
              className="justify-between"
              onClick={() => {
                setCookie("token", adminToken!, 1);
                setRole("ADMIN");
              }}
            >
              Switch Role to Admin
            </span>
          </li>
        )}
        {(role === "USER" || role === "USERISADMIN") && (
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
