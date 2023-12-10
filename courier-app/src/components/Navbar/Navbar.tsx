import { defaultPhotoURL } from "@/utils/defaultPhotoURL";
import React, { useEffect, useState } from "react";
import { ProfileIcon } from "./ProfileIcon";
import { GameIcon } from "./GameIcon";
import Link from "next/link";
import Image from "next/image";
import { NavbarMenu, NavbarMenuCollapsed } from "./NavbarMenu";
import NotificationIcon from "./NotificationIcon";
import { getCookie } from "@/utils/cookies";
import { RoleEnum, TRole } from "@/types/role";
import { Button } from "../Button";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const [role, setRole] = useState<TRole>("GUEST");
  useEffect(() => {
    const token = getCookie("token");
    if (token.startsWith(RoleEnum["USER"].toString())) {
      setRole("USER");
      return;
    }
    if (token.startsWith(RoleEnum["ADMIN"].toString())) {
      setRole("ADMIN");
      return;
    }
    setRole("GUEST");
  }, []);

  return (
    <div className="w-full bg-primary_blue ">
      <div className="navbar w-[90%] max-w-screen-2xl mx-auto text-[white] ">
        <div className="navbar-start">
          <NavbarMenuCollapsed role={role} />
          <Link href={"/home"} className="">
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
            <div>
              <Button
                withoutHoverEffect={true}
                onClick={() => {
                  router.push("/dashboard");
                }}
              >
                Go to Dashboard
              </Button>
            </div>
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
      </div>{" "}
    </div>
  );
};

export default Navbar;
