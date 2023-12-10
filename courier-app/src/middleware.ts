import {
  authRoutes,
  protectedAdminRoutes,
  protectedUserRoutes,
} from "@/routes";
import { RoleEnum } from "@/types/role";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isAdmin = token?.startsWith(RoleEnum["ADMIN"].toString());
  const isUser = token?.startsWith(RoleEnum["USER"].toString());

  const destinationPath = request.nextUrl.pathname;
  const isNotAdminToProtectedAdminRoutes =
    protectedAdminRoutes.includes(destinationPath) && !isAdmin;
  const isNotUserToProtectedUserRoutes =
    protectedUserRoutes.includes(destinationPath) && !isUser;

  const isAdminToAuthRoutes = authRoutes.includes(destinationPath) && isAdmin;
  const isUserToAuthRoutes = authRoutes.includes(destinationPath) && isUser;

  const isNotAdminToHome = destinationPath === "/" && !isAdmin;

  const isAdminToProtectedUserRoutes =
    protectedUserRoutes.includes(destinationPath) && isAdmin;

  const isUserToProtectedAdminRoutes =
    protectedUserRoutes.includes(destinationPath) && isUser;

  if (destinationPath === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }
  if (
    isNotAdminToProtectedAdminRoutes ||
    (isNotUserToProtectedUserRoutes && !isAdminToProtectedUserRoutes) ||
    destinationPath === "/login"
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (destinationPath === "/register") {
    return NextResponse.redirect(new URL("/auth/register", request.url));
  }

  if (isAdminToAuthRoutes) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (
    isUserToAuthRoutes ||
    isNotAdminToHome ||
    isUserToProtectedAdminRoutes ||
    isAdminToProtectedUserRoutes
  ) {
    return NextResponse.redirect(new URL("/home", request.url));
  }
}
