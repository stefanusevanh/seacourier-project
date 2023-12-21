//USER and ADMIN ROUTES
export const homeRoute = "/home";

//USER ROUTES
export const shippingRoute = "/shipping";
export const shippingHistoryRoute = "/shipping/history";
export const addressRoute = "/address";
export const addressEditRoute = "/address/edit";
export const addressNewRoute = "/address/new";
export const topupRoute = "/topup";
export const paymentRoute = "/payment";
export const profileRoute = "/profile";
export const profileEditRoute = "/profile/edit";
export const protectedUserRoutes = [
  shippingRoute,
  shippingHistoryRoute,
  addressRoute,
  addressEditRoute,
  addressNewRoute,
  topupRoute,
  paymentRoute,
  profileRoute,
  profileEditRoute,
];

//ADMIN ROUTES
export const dashboardEarningReportsRoute = "/dashboard/earning-reports";
export const dashboardHomeRoute = dashboardEarningReportsRoute;
export const dashboardShippingRoute = "/dashboard/manage-shipping";
export const dashboardShippingEditRoute = "/dashboard/manage-shipping/edit";
export const dashboardAddressRoute = "/dashboard/manage-address";
export const dashboardAddressEditRoute = "/dashboard/manage-address/edit";
export const dashboardAddressAddRoute = "/dashboard/manage-address/add";
export const dashboardPromosRoute = "/dashboard/manage-promos";
export const dashboardPromosEditRoute = "/dashboard/manage-promos/edit";
export const dashboardPromosAddRoute = "/dashboard/manage-promos/add";
export const dashboardProfileRoute = "/dashboard/profile";
export const dashboardProfileEditRoute = "/dashboard/profile/edit";
export const protectedAdminRoutes = [
  dashboardHomeRoute,
  dashboardEarningReportsRoute,
  dashboardShippingRoute,
  dashboardShippingEditRoute,
  dashboardAddressRoute,
  dashboardAddressEditRoute,
  dashboardAddressAddRoute,
  dashboardPromosRoute,
  dashboardPromosEditRoute,
  dashboardPromosAddRoute,
  dashboardProfileRoute,
  dashboardProfileEditRoute,
];

export const authRoutes = ["/auth", "/auth/login", "/auth/register"];
export const publicRoutes = ["/home"];
