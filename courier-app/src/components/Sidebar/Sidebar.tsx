import * as R from "@/routes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button, ButtonBorderOnly, ButtonInverted } from "../Button";
import useLogout from "@/hooks/useLogout";
import useRole from "@/hooks/useRole";

const PageTitle = ({ currentPage }: { currentPage: string }) => {
  let title = "";
  switch (currentPage) {
    case R.dashboardHomeRoute:
      title = "Dashboard Home";
      break;
    case R.dashboardEarningReportsRoute:
      title = "Earning Reports";
      break;
    case R.dashboardShippingRoute:
      title = "Manage Shipping";
      break;
    case R.dashboardAddressRoute:
      title = "Manage Outlet Address";
      break;
    case R.dashboardPromosRoute:
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
          <Link href={R.dashboardHomeRoute}>Home</Link>
        </li>
        {currentPage !== R.dashboardHomeRoute && (
          <li>
            <Link
              href={
                currentPage === R.dashboardProfileEditRoute
                  ? R.dashboardProfileRoute
                  : currentPage
              }
            >
              <PageTitle currentPage={currentPage} />
            </Link>
          </li>
        )}
        {currentPage === R.dashboardProfileEditRoute && (
          <li>
            <Link href={R.dashboardProfileEditRoute}>Edit</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

const Sidebar = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const currentPage = router.route;
  const logout = useLogout();
  const { setRole } = useRole();

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
                href={R.dashboardHomeRoute}
                className={activeText(R.dashboardHomeRoute)}
              >
                HOME
              </Link>
            </li>
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
          <div className="mb-6">
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