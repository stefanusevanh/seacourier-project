import React, { ReactNode } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";

const MainLayoutUser = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full min-h-screen">
      <Navbar />
      <div className="w-[90%] max-w-[1240px] mx-auto min-h-screen">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayoutUser;
