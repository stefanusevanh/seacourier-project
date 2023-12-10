import { RoleEnum, TRole } from "@/types/role";
import { useEffect, useState } from "react";
import { getCookie } from "../utils/cookies";

const useRole = () => {
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
    if (token.startsWith(RoleEnum["USERISADMIN"].toString())) {
      setRole("USERISADMIN");
      return;
    }
  }, []);
  return { role, setRole };
};

export default useRole;
