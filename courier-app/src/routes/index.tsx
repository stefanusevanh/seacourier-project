//USER and ADMIN ROUTES
export const homeRoute = "/home";
export const shippingRoute = "/shipping";

//USER ROUTES
export const shippingHistoryRoute = "/shipping/history";
export const addressRoute = "/address";
export const addressEditRoute = "/address/edit";
export const topupRoute = "/topup";
export const paymentRoute = "/payment";
export const profileRoute = "/profile";
export const profileEditRoute = "/profile/edit";
export const protectedUserRoutes = [
  shippingHistoryRoute,
  addressRoute,
  addressEditRoute,
  topupRoute,
  paymentRoute,
  profileRoute,
  profileEditRoute,
];

//ADMIN ROUTES
export const dashboardHomeRoute = "/dashboard";
export const dashboardEarningReportsRoute = "/dashboard/earning-reports";
export const dashboardShippingRoute = "/dashboard/manage-shipping";
export const dashboardAddressRoute = "/dashboard/manage-address";
export const dashboardPromosRoute = "/dashboard/manage-promos";
export const dashboardProfileRoute = "/dashboard/profile";
export const dashboardProfileEditRoute = "/dashboard/profile/edit";
export const protectedAdminRoutes = [
  dashboardHomeRoute,
  dashboardEarningReportsRoute,
  dashboardShippingRoute,
  dashboardAddressRoute,
  dashboardPromosRoute,
  dashboardProfileRoute,
  dashboardProfileEditRoute,
];

export const authRoutes = ["/auth", "/auth/login", "/auth/register"];
export const publicRoutes = ["/home", "/shipping"];
