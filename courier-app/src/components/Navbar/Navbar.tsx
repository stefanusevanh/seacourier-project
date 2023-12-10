import { defaultPhotoURL } from "@/utils/defaultPhotoURL";
import { ProfileIcon } from "./ProfileIcon";
import { GameIcon } from "./GameIcon";
import Link from "next/link";
import Image from "next/image";
import { NavbarMenu, NavbarMenuCollapsed } from "./NavbarMenu";
import NotificationIcon from "./NotificationIcon";
import { Button } from "../Button";
import useRole from "@/hooks/useRole";
import { dashboardHomeRoute, homeRoute } from "@/routes";

const Navbar = () => {
  const { role, setRole } = useRole();

  return (
    <div className="w-full bg-primary_blue ">
      <div className="navbar w-[90%] max-w-screen-2xl mx-auto text-[white] ">
        <div className="navbar-start">
          <NavbarMenuCollapsed role={role} />
          <Link href={homeRoute} className="">
            <Image
              src={"/img/logo.png"}
              alt={"SeaCourier logo"}
              width={100}
              height={100}
            />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <NavbarMenu role={role} />
        </div>
        <div className="navbar-end gap-1">
          {role === "USER" && <GameIcon />}
          {role === "ADMIN" && (
            <Link href={dashboardHomeRoute}>
              <Button withoutHoverEffect={true}>Go to Dashboard</Button>
            </Link>
          )}
          {role === "USER" || role === "ADMIN" ? (
            <>
              <NotificationIcon />
              <ProfileIcon
                imgURL={defaultPhotoURL}
                role={role}
                setRole={setRole}
              />
            </>
          ) : (
            <div className="flex flex-row gap-1 w-[200px] justify-center">
              <Link href={"/auth/login"} className="w-1/2">
                <Button>Log In</Button>
              </Link>
              <Link href={"/auth/register"} className="w-1/2">
                <Button>Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
