import { toast } from "sonner";
import { removeCookie } from "../utils/cookies";

import React from "react";
import { TRole } from "@/types/role";
import { useRouter } from "next/router";
import { homeRoute } from "@/routes";

const useLogout = () => {
  const router = useRouter();

  const logout = (
    mouseClicks: number,
    setRole: React.Dispatch<React.SetStateAction<TRole>>
  ) => {
    let timer;
    if (mouseClicks === 1) {
      timer = setTimeout(() => {
        toast.info("Double click to log out", {
          duration: 1200,
          id: "first-toast",
        });
      }, 200);
    } else if (mouseClicks === 2) {
      clearTimeout(timer);
      setRole("GUEST");
      removeCookie("token");
      toast.dismiss("first-toast");

      setTimeout(() => {
        toast.dismiss("first-toast");
        toast.success("You have been logged out", {
          duration: 1500,
          dismissible: false,
          important: true,
        });
        router.push(homeRoute);
      }, 100);
    }
  };
  return logout;
};

export default useLogout;
