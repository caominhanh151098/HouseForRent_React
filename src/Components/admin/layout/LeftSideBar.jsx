import React, { useState } from "react";

function LeftSideBar({ children }) {
    return (
        <div className="container-fluid">
            <div className="row">
                <nav
                    id="sidebarMenu"
                    className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
                >
                    <div className="position-sticky pt-3">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">
                                    <span className="fa fa-home"></span>
                                    Dashboard
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    <span className="fa fa-file"></span>
                                    Orders
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    <span className="fa fa-shopping-cart"></span>
                                    Products
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    <span className="fa fa-users"></span>
                                    Customers
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    <span className="fa fa-bar-chart"></span>
                                    Reports
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    <span className="fa fa-layer-group"></span>
                                    Integrations
                                </a>
                            </li>
                        </ul>
                        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                            <span>Saved reports</span>
                            <a className="link-secondary" href="#" aria-label="Add a new report">
                                <span data-feather="plus-circle" />
                                <span className="fa fa-plus-circle"></span>
                            </a>
                        </h6>
                        <ul className="nav flex-column mb-2">
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    <span className="fa fa-file-lines"></span>
                                    Current month
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    <span className="fa fa-file-lines"></span>

                                    Last quarter
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    <span className="fa fa-file-lines"></span>

                                    Social engagement
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    <span className="fa fa-file-lines"></span>
                                    Year-end sale
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
                {children}
            </div>
        </div>
    )

}

export default LeftSideBar;