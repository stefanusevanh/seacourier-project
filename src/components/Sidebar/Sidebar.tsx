import * as R from "@/routes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button, ButtonBorderOnly, ButtonInverted } from "../Button";
import useLogout from "@/hooks/useLogout";
import useRole from "@/hooks/useRole";
import useUser from "@/utils/api/useUser";
import { getCookie, setCookie } from "@/utils/cookies";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { storeUserID } from "@/stores/roleIDSlice/roleIDSlice";

const PageTitle = ({ currentPage }: { currentPage: string }) => {
  let title = "";
  switch (currentPage) {
    case R.dashboardEarningReportsRoute:
      title = "Earning Reports";
      break;
    case R.dashboardShippingRoute:
    case R.dashboardShippingEditRoute:
      title = "Manage Shipping";
      break;
    case R.dashboardAddressRoute:
    case R.dashboardAddressAddRoute:
    case R.dashboardAddressEditRoute:
      title = "Manage Outlet Address";
      break;
    case R.dashboardPromosRoute:
    case R.dashboardPromosAddRoute:
    case R.dashboardPromosEditRoute:
      title = "Manage Promos";
      break;
    case R.dashboardProfileRoute:
    case R.dashboardProfileEditRoute:
      title = "Admin Profile";
      break;
  }

  return <span>{title}</span>;
};

const PageBreadcrumbs = ({ currentPage }: { currentPage: string }) => {
  return (
    <div className="text-sm breadcrumbs">
      <ul>
        <li>
          <Link
            href={
              currentPage === R.dashboardProfileEditRoute
                ? R.dashboardProfileRoute
                : currentPage.includes(R.dashboardShippingRoute)
                ? R.dashboardShippingRoute
                : currentPage.includes(R.dashboardPromosRoute)
                ? R.dashboardPromosRoute
                : currentPage.includes(R.dashboardAddressRoute)
                ? R.dashboardAddressRoute
                : currentPage
            }
          >
            <PageTitle currentPage={currentPage} />
          </Link>
        </li>
        {currentPage.includes("/edit") && (
          <li>
            <span>Edit</span>
          </li>
        )}
        {(currentPage.includes("/add") || currentPage.includes("/new")) && (
          <li>
            <span>Add</span>
          </li>
        )}
      </ul>
    </div>
  );
};

const Sidebar = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  let currentPage = router.route;
  if (currentPage.includes(R.dashboardShippingEditRoute)) {
    currentPage = R.dashboardShippingEditRoute;
  } else if (currentPage.includes(R.dashboardPromosEditRoute)) {
    currentPage = R.dashboardPromosEditRoute;
  } else if (currentPage.includes(R.dashboardPromosAddRoute)) {
    currentPage = R.dashboardPromosAddRoute;
  } else if (currentPage.includes(R.dashboardAddressEditRoute)) {
    currentPage = R.dashboardAddressEditRoute;
  } else if (currentPage.includes(R.dashboardAddressAddRoute)) {
    currentPage = R.dashboardAddressAddRoute;
  }

  const logout = useLogout();
  const { setRole } = useRole();
  const { user, getUser } = useUser();
  const roleID = useAppSelector((state) => state.roleID);
  const dispatch = useAppDispatch();

  useEffect(() => {
    switchToUserIsAdmin();
  }, [user]);

  const switchToUserIsAdmin = () => {
    if (user !== null && user.email === "user@mail.com") {
      setCookie("token_temp", getCookie("token"), 1);
      setCookie("token", user.token, 1);
      setRole("USERISADMIN");
      if (roleID.user_id === 0) {
        dispatch(storeUserID(user.id));
      }
      router.push(R.homeRoute);
    }
  };

  const activeText = (page: string) => {
    if (currentPage === page) {
      return "bg-primary_blue text-primary_orange text-lg";
    }
    return "text-md";
  };
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content p-8">
        <div className="flex flex-row items-center gap-4">
          <label htmlFor="my-drawer-2" className="btn btn-ghost lg:hidden ">
            <GiHamburgerMenu size={20} />
          </label>
          <PageBreadcrumbs currentPage={currentPage} />
        </div>
        {children}
      </div>
      <div className="drawer-side font-semibold">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between ">
              <Link href={R.dashboardHomeRoute} className="mb-4">
                <Image
                  src={"/img/logo.png"}
                  alt={"SeaCourier logo"}
                  width={100}
                  height={100}
                />
              </Link>
              <Link href={R.homeRoute}>
                <Button withoutHoverEffect={true}>
                  Go to Client&apos;s Home
                </Button>
              </Link>
            </div>

            <li>
              <Link
                href={R.dashboardEarningReportsRoute}
                className={activeText(R.dashboardEarningReportsRoute)}
              >
                EARNING REPORTS
              </Link>
            </li>
            <li>
              <Link
                href={R.dashboardShippingRoute}
                className={activeText(R.dashboardShippingRoute)}
              >
                MANAGE SHIPPING
              </Link>
            </li>
            <li>
              <Link
                href={R.dashboardAddressRoute}
                className={activeText(R.dashboardAddressRoute)}
              >
                MANAGE OUTLET ADDRESS
              </Link>
            </li>
            <li>
              <Link
                href={R.dashboardPromosRoute}
                className={activeText(R.dashboardPromosRoute)}
              >
                MANAGE PROMOS
              </Link>
            </li>
            <div className="border-t-2">
              <li className="my-4">
                <Link
                  href={R.dashboardProfileRoute}
                  className={activeText(R.dashboardProfileRoute)}
                >
                  ADMIN PROFILE
                </Link>
              </li>
              <li className="my-4">
                <Link
                  href={R.dashboardProfileEditRoute}
                  className={activeText(R.dashboardProfileEditRoute)}
                >
                  EDIT ADMIN PROFILE
                </Link>
              </li>
            </div>
          </div>
          <div className="mb-6 flex flex-col gap-2">
            <Button
              withoutHoverEffect={true}
              onClick={() => {
                if (user === null) {
                  getUser(1);
                  return;
                }
                switchToUserIsAdmin();
              }}
            >
              Switch Role to User
            </Button>
            <ButtonBorderOnly
              onClick={(e) => {
                logout(e.detail, setRole);
              }}
            >
              Log Out
            </ButtonBorderOnly>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
