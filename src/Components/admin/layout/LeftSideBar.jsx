import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import WaterfallChartIcon from '@mui/icons-material/WaterfallChart';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import MemoryIcon from '@mui/icons-material/Memory';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CottageIcon from '@mui/icons-material/Cottage';
import GiteIcon from '@mui/icons-material/Gite';
import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom';
import HistoryIcon from '@mui/icons-material/History';
import PolicyIcon from '@mui/icons-material/Policy';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SecurityIcon from '@mui/icons-material/Security';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function LeftSideBar({ children }) {
    const [openCustomer, setOpenCustomer] = useState(false);
    const [openProcess, setOpenProcess] = useState(false);
    const [openHouses, setOpenHouses] = useState(false);
    const [openPolicy, setOpenPolicy] = useState(false);

    const [active, setActive] = useState({
        dashboard: false,
        ticket: false,
        houses: false,
        houseBan: false,
        user: false,
        reports: false,
        banList: false,
        refund: false,
        refundPolicy: false
    })

    const location = useLocation();

    useEffect(() => {
        const pathName = location.pathname;
        setActive({
            dashboard: pathName === '/admin',
            ticket: pathName === '/admin/tickets',
            houses: pathName === '/admin/houses',
            houseBan: pathName === 'admin/houseBan',
            user: pathName === '/admin/users',
            banList: pathName === '/admin/banList',
            reports: pathName === '/admin/reports',
            refund: pathName === '/admin/refund',
            refundPolicy: pathName === '/admin/refundPolicy'

        })
    }, [location.pathname])

    const handleClickUsers = () => {
        setOpenCustomer(!openCustomer);
    };

    const handleClickProcess = () => {
        setOpenProcess(!openProcess);
    }

    const handleClickHouses = () => {
        setOpenHouses(!openHouses);
    }
    const handleClickPolicy = () => {
        setOpenPolicy(!openPolicy);
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <nav
                    id="sidebarMenu"
                    className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
                    style={{ overflow: "auto" }}
                >
                    <div className="position-sticky pt-3">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link className={`nav-link ${active.dashboard ? 'active' : ''}`} aria-current="page" to={"/admin"}>
                                    <ListItemButton sx={{ pl: 0 }}>
                                        <ListItemIcon>
                                            <HomeWorkIcon sx={{ fontSize: "18px" }} />
                                        </ListItemIcon>
                                        <ListItemText primary="Dashboard" />
                                    </ListItemButton>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${active.ticket ? 'active' : ''}`} to={"/admin/tickets"}>
                                    <ListItemButton sx={{ pl: 0 }}>
                                        <ListItemIcon>
                                            <PostAddIcon sx={{ fontSize: "18px" }} />
                                        </ListItemIcon>
                                        <ListItemText primary="Browse Tickets" />
                                    </ListItemButton>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <ListItemButton onClick={() => handleClickHouses()}>
                                    <ListItemIcon>
                                        <CottageIcon sx={{ fontSize: "18px" }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Houses" />
                                    {openHouses ? <ExpandLess sx={{ fontSize: "18px" }} /> : <ExpandMore sx={{ fontSize: "18px" }} />}
                                </ListItemButton>
                                <Collapse in={openHouses} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <Link className={`nav-link ${active.houses ? 'active' : ''}`} to={"/admin/houses"}>
                                            <ListItemButton sx={{ pl: 4 }}>
                                                <ListItemIcon>
                                                    <GiteIcon sx={{ fontSize: "18px" }} />
                                                </ListItemIcon>
                                                <ListItemText primary="List Houses" />
                                            </ListItemButton>
                                        </Link>
                                        <Link className={`nav-link ${active.houseBan ? "active" : ""}`} to={"/admin/houseBan"}>
                                            <ListItemButton sx={{ pl: 4 }}>

                                                <ListItemIcon>
                                                    <NoMeetingRoomIcon sx={{ fontSize: "18px" }} />
                                                </ListItemIcon>
                                                <ListItemText primary="Ban List" />
                                            </ListItemButton>
                                        </Link>
                                    </List>
                                </Collapse>

                            </li>
                            <li className="nav-item">
                                <ListItemButton onClick={() => handleClickUsers()}>
                                    <ListItemIcon>
                                        <SupervisedUserCircleIcon sx={{ fontSize: "18px" }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Customers" />
                                    {openCustomer ? <ExpandLess sx={{ fontSize: "18px" }} /> : <ExpandMore sx={{ fontSize: "18px" }} />}
                                </ListItemButton>
                                <Collapse in={openCustomer} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <Link className={`nav-link ${active.user ? "active" : ""}`} to={"/admin/users"}>
                                            <ListItemButton sx={{ pl: 4 }}>

                                                <ListItemIcon>
                                                    <PeopleAltIcon sx={{ fontSize: "18px" }} />
                                                </ListItemIcon>
                                                <ListItemText primary="Customers" />
                                            </ListItemButton>
                                        </Link>
                                        <Link className={`nav-link ${active.banList ? "active" : ""}`} to={"/admin/banList"}>
                                            <ListItemButton sx={{ pl: 4 }}>

                                                <ListItemIcon>
                                                    <NoAccountsIcon sx={{ fontSize: "18px" }} />
                                                </ListItemIcon>
                                                <ListItemText primary="Ban List" />
                                            </ListItemButton>
                                        </Link>
                                    </List>
                                </Collapse>

                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${active.reports ? "active" : ""}`} to={"/admin/reports"}>
                                    <ListItemButton sx={{ pl: 0 }}>
                                        <ListItemIcon>
                                            <WaterfallChartIcon sx={{ fontSize: "18px" }} />
                                        </ListItemIcon>
                                        <ListItemText primary="Chart" />

                                    </ListItemButton>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <ListItemButton onClick={() => handleClickProcess()}>
                                    <ListItemIcon>
                                        <MemoryIcon sx={{ fontSize: "18px" }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Professional Processing" />
                                    {openProcess ? <ExpandLess sx={{ fontSize: "18px" }} /> : <ExpandMore sx={{ fontSize: "18px" }} />}
                                </ListItemButton>
                                <Collapse in={openProcess} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <Link className={`nav-link ${active.refund ? "active" : ""}`} to={"/admin/refund"}>
                                            <ListItemButton sx={{ pl: 4 }}>

                                                <ListItemIcon>
                                                    <CurrencyExchangeIcon sx={{ fontSize: "18px" }} />
                                                </ListItemIcon>
                                                <ListItemText primary="Refund" />
                                            </ListItemButton>
                                        </Link>
                                        <Link className={`nav-link ${active.refund ? "active" : ""}`} to={"/admin/refund"}>
                                            <ListItemButton sx={{ pl: 4 }}>

                                                <ListItemIcon>
                                                    <HistoryIcon sx={{ fontSize: "21px" }} />
                                                </ListItemIcon>
                                                <ListItemText primary="History Refund" />
                                            </ListItemButton>
                                        </Link>
                                        <ListItemButton sx={{ pl: 4 }}>

                                            <ListItemIcon>
                                                <ReceiptLongIcon sx={{ fontSize: "18px" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="History Transaction" />
                                        </ListItemButton>
                                    </List>
                                </Collapse>
                            </li>
                            <li className="nav-item">
                                <ListItemButton onClick={() => handleClickPolicy()}>
                                    <ListItemIcon>
                                        <PolicyIcon sx={{ fontSize: "18px" }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Policy" />
                                    {openPolicy ? <ExpandLess sx={{ fontSize: "18px" }} /> : <ExpandMore sx={{ fontSize: "18px" }} />}
                                </ListItemButton>
                                <Collapse in={openPolicy} timeout="auto" unmountOnExit>
                                    <List>

                                        <ListItemButton sx={{ pl: 4 }}>
                                            <ListItemIcon>
                                                <CreateNewFolderIcon sx={{ fontSize: "18px" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Refund Policy" />
                                        </ListItemButton>

                                        <Link className={`nav-link ${active.refundPolicy ? "active" : ""}`} to={"/admin/refundPolicy"}>
                                            <ListItemButton sx={{ pl: 4 }}>
                                                <ListItemIcon>
                                                    <ReplyAllIcon sx={{ fontSize: "18px" }} />
                                                </ListItemIcon>
                                                <ListItemText primary="Refund Policy" />
                                            </ListItemButton>
                                        </Link>

                                        <ListItemButton sx={{ pl: 4 }}>
                                            <ListItemIcon>
                                                <MonetizationOnIcon sx={{ fontSize: "18px" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Fee Policy" />
                                        </ListItemButton>
                                        <ListItemButton sx={{ pl: 4 }}>
                                            <ListItemIcon>
                                                <SecurityIcon sx={{ fontSize: "18px" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Securiry Policy" />
                                        </ListItemButton>
                                    </List>
                                </Collapse>
                            </li>
                        </ul>
                        {/* <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
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
                        </ul> */}
                    </div>
                </nav>
                {children}
            </div>
        </div>
    )

}

export default LeftSideBar;