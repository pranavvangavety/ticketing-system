import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-100 px-4 py-8">
                <Outlet />
            </main>
        </>
    );
}

export default Layout;
