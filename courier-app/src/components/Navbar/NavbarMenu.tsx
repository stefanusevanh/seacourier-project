import * as R from "@/routes";
import { TRole } from "@/types/role";
import Link from "next/link";
import { useRouter } from "next/router";
import { GiHamburgerMenu } from "react-icons/gi";

export const NavbarMenuItems = ({ role }: { role: TRole }) => {
  const router = useRouter();
  const currentPage = router.route;

  const activeText = (page: string) => {
    if (currentPage === page) {
      return "text-primary_orange";
    }
    return "";
  };
  return (
    <>
      <li>
        <Link href={R.homeRoute} className={activeText(R.homeRoute)}>
          Home
        </Link>
      </li>
      <li>
        <Link href={R.shippingRoute} className={activeText(R.shippingRoute)}>
          Ship Now
        </Link>
      </li>
      {(role === "USER" || role === "USERISADMIN") && (
        <>
          <li>
            <Link
              href={R.shippingHistoryRoute}
              className={activeText(R.shippingHistoryRoute)}
            >
              Shipping History
            </Link>
          </li>

          <li>
            <Link href={R.topupRoute} className={activeText(R.topupRoute)}>
              Top Up
            </Link>
          </li>
        </>
      )}
    </>
  );
};

export const NavbarMenuCollapsed = ({ role }: { role: TRole }) => {
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <GiHamburgerMenu size={20} />
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-[black]"
      >
        <NavbarMenuItems role={role} />
      </ul>
    </div>
  );
};

export const NavbarMenu = ({ role }: { role: TRole }) => {
  return (
    <ul className="menu menu-horizontal px-1 text-lg">
      <NavbarMenuItems role={role} />
    </ul>
  );
};
