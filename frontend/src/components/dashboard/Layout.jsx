import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

import { Outlet } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const isMapEditor = location.pathname.startsWith("/app/map/");

  return (
    <div className="flex h-screen">
      {!isMapEditor && <Sidebar />}

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
