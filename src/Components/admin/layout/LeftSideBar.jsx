import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function LeftSideBar({ children }) {

    const [active, setActive] = useState({
        dashboard: false,
        ticket: false,
        houses: false,
        user: false,
        reports: false,

    })

    const location = useLocation();

    useEffect(() => {
        const pathName = location.pathname;
        setActive({
            dashboard: pathName === '/admin',
            ticket: pathName === '/admin/tickets',
            houses: pathName === '/admin/houses',
            user: pathName === '/admin/users',
            reports: pathName === '/admin/reports'
        })
    }, [location.pathname])

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
                                <Link className={`nav-link ${active.dashboard ? 'active' : ''}`} aria-current="page" to={"/admin"}>
                                    <span className="fa fa-home"></span>
                                    Dashboard
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${active.ticket ? 'active' : ''}`} to={"/admin/tickets"}>
                                    <span className="fa fa-file"></span>
                                    Browse Tickets
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${active.history ? 'active' : ''}`} to={"/admin/houses"}>
                                    <span className="fa fa-shopping-cart"></span>
                                    List Houses
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${active.user ? "active" : ""}`} to={"/admin/users"}>
                                    <span className="fa fa-users"></span>
                                    Customers
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${active.reports ? "active" : ""}`} to={"/admin/reports"}>
                                    <span className="fa fa-bar-chart"></span>
                                    Reports
                                </Link>
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