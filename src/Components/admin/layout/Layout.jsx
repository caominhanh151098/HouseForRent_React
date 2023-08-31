import React from "react";
import HeaderItem from "./HeaderItem";
import LeftSideBar from "./LeftSideBar";

function Layout({ children }) {
    return (
        <>
            <HeaderItem />
            <LeftSideBar>
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                            {children}
                    </main>
            </LeftSideBar>
        </>
    )
}

export default Layout;