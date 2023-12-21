import React, { ReactNode } from "react";
import Sidebar from "../Sidebar";

const MainLayoutAdmin = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Sidebar>
        <div className="">{children}</div>
      </Sidebar>
    </div>
  );
};

export default MainLayoutAdmin;
