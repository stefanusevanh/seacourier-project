import React, { ReactNode } from "react";
import Navbar from "../Navbar";

const MainLayoutUser = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full min-h-screen">
      <Navbar />
      <div className="w-[90%] max-w-[1240px] mx-auto">{children}</div>
    </div>
  );
};

export default MainLayoutUser;
