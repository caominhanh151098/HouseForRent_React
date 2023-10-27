import { Box, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { addDays, startOfWeek, startOfMonth, endOfWeek, endOfMonth, format } from "date-fns";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Dropdown } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import '../../admin/report/ReportsCSS.css';
import useFetchProfitsReportThisMonth from "../../../Hooks/admin/report/profit/useFetchProfitsReportThisMonth";
import useFetchProfitsHouseReportThisMonth from "../../../Hooks/admin/report/profit/useFetchProfitsHouseReportThisMonth";
import useFetchProfitsHouseReportLastMonth from "../../../Hooks/admin/report/profit/useFetchProfitsHouseReportLastMonth";
import useFetchProfitsReportLastMonth from "../../../Hooks/admin/report/profit/useFetchProfitsReportLastMonth";
import ReportsProfit from "./ReportsProfit";
import useFetchUsersThisMonth from "../../../Hooks/admin/report/user/useFetchUsersThisMonth";
import useFetchUsersLastMonth from "../../../Hooks/admin/report/user/useFetchUsersLastMonth";
import useFetchHousesReportThisMonth from "../../../Hooks/admin/report/house/useFetchHousesReportThisMonth";
import useFetchHousesReportLastMonth from "../../../Hooks/admin/report/house/useFetchHousesReportLastMonth";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import axios from "axios";
import useFetchProfitsReportWithDate from "../../../Hooks/admin/report/profit/useFetchProfitsReportWithDate";
import useFetchProfitsHouseReportWithDate from "../../../Hooks/admin/report/profit/useFetchProfitsHouseReportWithDate";
import moment from "moment/moment";
import useFetchUsersWithDate from "../../../Hooks/admin/report/user/useFetchUsersWithDate";
import useFetchHousesReportWithDate from "../../../Hooks/admin/report/house/useFetchHousesReportWithDate";
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}
// CustomTabPanel.propTypes = {
//     children: PropTypes.node,
//     index: PropTypes.number.isRequired,
//     value: PropTypes.number.isRequired,
// };
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}



const Reports = () => {



    const profitThisMonth = useFetchProfitsReportThisMonth();
    const reportHouseThisMonth = useFetchProfitsHouseReportThisMonth();
    const newReportHouseThisMonth = reportHouseThisMonth.filter((item) => item !== undefined)
    const totalProfitThisMonth = profitThisMonth?.data?.reduce((total, price) => total + price, 0)

    const profitLastMonth = useFetchProfitsReportLastMonth();
    const reportHouseLastMonth = useFetchProfitsHouseReportLastMonth();
    const newReportHouseLastMonth = reportHouseLastMonth.filter((item) => item !== undefined);
    const totalProfitLastMonth = profitLastMonth?.data?.reduce((total, price) => total + price, 0)



    const totalUsersThisMonth = useFetchUsersThisMonth();
    const totalUserThisMonth = totalUsersThisMonth?.data?.reduce((total, data) => total += data, 0)

    const totalUsersLastMonth = useFetchUsersLastMonth();
    const totalUserLastMonth = totalUsersLastMonth?.data?.reduce((total, data) => total += data, 0);

    const totalHousesThisMonth = useFetchHousesReportThisMonth();
    const totalHouseThisMonth = totalHousesThisMonth?.data?.reduce((total, data) => total += data, 0);

    const totalHousesLastMonth = useFetchHousesReportLastMonth();
    const totalHouseLastMonth = totalHousesLastMonth?.data?.reduce((total, data) => total += data, 0);

    const [calendarProfit, setCalendarProfit] = useState([{
        startDate: addDays(new Date(), -1),
        endDate: new Date(),
        key: 'selection',
        customRanges: {
            'Today': {
                startDate: new Date(),
                endDate: new Date(),
            },
            'Yesterday': {
                startDate: new Date(new Date().setDate(new Date().getDate() - 1)),
                endDate: new Date(new Date().setDate(new Date().getDate() - 1)),
            },
            'Last 7 Days': {
                startDate: new Date(new Date().setDate(new Date().getDate() - 6)),
                endDate: new Date(),
            },
            'Last 30 Days': {
                startDate: new Date(new Date().setDate(new Date().getDate() - 29)),
                endDate: new Date(),
            },
            'This Month': {
                startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            },
            'Last Month': {
                startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
                endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
            },
        }
    }]);
    const [calendarUser, setCalendarUser] = useState([{
        startDate: addDays(new Date(), -1),
        endDate: new Date(),
        key: 'selection'
    }]);
    const [calendarHouse, setCalendarHouse] = useState([{
        startDate: addDays(new Date(), -1),
        endDate: new Date(),
        key: 'selection'
    }]);

    const [totalPriceProfit, setTotalPriceProfit] = useState(0);
    const [totalUser, setTotalUser] = useState(0);
    const [totalHouse, setTotalHouse] = useState(0);

    const [choiceProfit, setChoiceProfit] = useState("thisMonth")
    const [choiceUser, setChoiceUser] = useState("thisMonth")
    const [choiceHouse, setChoiceHouse] = useState("thisMonth")

    const [isOpenProfit, setIsOpenProfit] = useState(false);
    const [isOpenUser, setIsOpenUser] = useState(false);
    const [isOpenHouse, setIsOpenHouse] = useState(false);

    const [value, setValue] = useState(0);

    const refCalendarProfit = useRef(null)
    const refCalendarUser = useRef(null)
    const refCalendarHouse = useRef(null)
    const canvas = useRef(null)
    const canvasLoaded = useRef(false);

    const [showThisMonthProfit, setShowThisMonthProfit] = useState(true);
    const [showThisMonthUser, setShowThisMonthUser] = useState(true);
    const [showThisMonthHouse, setShowThisMonthHouse] = useState(true);

    const [houses, setHouses] = useState([]);

    const [dateRangeProfit, setDateRangeProfit] = useState([
        {
            startDate: addDays(new Date(), -1),
            endDate: new Date(),
            key: 'selection',

        }
    ])
    const [dateRangeUser, setDateRangeUser] = useState([
        {
            startDate: addDays(new Date(), -1),
            endDate: new Date(),
            key: 'selection'
        }
    ])
    const [dateRangeHouse, setDateRangeHouse] = useState([
        {
            startDate: addDays(new Date(), -1),
            endDate: new Date(),
            key: 'selection'
        }
    ])


    const profitsOption = useFetchProfitsReportWithDate(format(calendarProfit[0].startDate, 'yyyy-MM-dd'), format(calendarProfit[0].endDate, 'yyyy-MM-dd'));
    const profitsOptionHouse = useFetchProfitsHouseReportWithDate(format(calendarProfit[0].startDate, 'yyyy-MM-dd'), format(calendarProfit[0].endDate, 'yyyy-MM-dd')).filter((item) => item !== undefined);

    const usersOption = useFetchUsersWithDate(format(calendarUser[0].startDate, 'yyyy-MM-dd'), format(calendarUser[0].endDate, 'yyyy-MM-dd'));

    const housesOption = useFetchHousesReportWithDate(format(calendarHouse[0].startDate, 'yyyy-MM-dd'), format(calendarHouse[0].endDate, 'yyyy-MM-dd'))

    const [chartDataProfit, setChartDataProfit] = useState({})
    const [chartDataUser, setChartDataUser] = useState({})
    const [chartDataHouse, setChartDataHouse] = useState({})

    const [chartOptions, setChartOptions] = useState({
        gradientPosition: { y1: 200 },
        scales: {
            y: {
                grid: {
                    color: "#e7eaf3",
                    drawBorder: false,
                    zeroLineColor: "#e7eaf3",
                },
                ticks: {
                    min: 0,
                    max: 100,
                    stepSize: 20,
                    color: "#97a4af",
                    font: {
                        family: "Open Sans, sans-serif",
                    },
                    padding: 10,
                    postfix: "k",
                },
            },
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: "#97a4af",
                    font: {
                        size: 12,
                        family: "Open Sans, sans-serif",
                    },
                    padding: 5,
                },
            },
        },
        plugins: {
            tooltip: {
                prefix: "$",
                postfix: "k",
                hasIndicator: true,
                mode: "index",
                intersect: false,
                lineMode: true,
                lineWithLineColor: "rgba(19, 33, 68, 0.075)",
            },
            colors: {
                forceOverride: true
            }
        },
        hover: {
            mode: "nearest",
            intersect: true,
        },
    });


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const handleDateRangeChangeProfit = (item) => {
        setDateRangeProfit([item.selection]);
    }
    const handleDateRangeChangeUser = (item) => {
        setDateRangeUser([item.selection]);
    }
    const handleDateRangeChangeHouse = (item) => {
        setDateRangeHouse([item.selection]);
    }

    const handleApplyRangeDateProfit = () => {
        const rangeDate = [...dateRangeProfit]
        setCalendarProfit(rangeDate);
        setIsOpenProfit(false);
        setChoiceProfit("option");
    }

    const handleApplyRangeDateUser = () => {
        const rangeDate = [...dateRangeUser]
        setCalendarUser(rangeDate);
        setIsOpenUser(false);
        setChoiceUser("option");
    }

    const handleApplyRangeDateHouse = () => {
        const rangeDate = [...dateRangeHouse]
        setCalendarHouse(rangeDate);
        setIsOpenHouse(false);
        setChoiceHouse("option");
    }

    const handleThisMonthProfitClick = () => {
        setShowThisMonthProfit(true);
        setChoiceProfit("thisMonth");
    };

    const handleThisMonthUserClick = () => {
        setShowThisMonthUser(true);
        setChoiceUser("thisMonth");
    };
    const handleThisMonthHouseClick = () => {
        setShowThisMonthHouse(true);
        setChoiceHouse("thisMonth");
    };

    const handleLastMonthProfitClick = () => {
        setShowThisMonthProfit(false);
        setChoiceProfit("lastMonth");
    };
    const handleLastMonthUserClick = () => {
        setShowThisMonthUser(false);
        setChoiceUser("lastMonth");
    };
    const handleLastMonthHouseClick = () => {
        setShowThisMonthHouse(false);
        setChoiceHouse("lastMonth");
    };

    useEffect(() => {
        const dataDisplay = choiceProfit === "thisMonth" ? profitThisMonth : profitLastMonth;
        const totalDisplay = choiceProfit === "thisMonth" ? totalProfitThisMonth : totalProfitLastMonth;
        const tableDisplay = choiceProfit === "thisMonth" ? newReportHouseThisMonth : newReportHouseLastMonth;
        setChartDataProfit({
            labels: dataDisplay.label,
            datasets: [
                {
                    backgroundColor: "rgba(55, 125, 255, 0.5)",
                    borderWidth: 2,
                    pointRadius: 0,
                    hoverBorderColor: "#377dff",
                    pointBackgroundColor: "#377dff",
                    pointBorderColor: "#fff",
                    pointHoverRadius: 0,
                    tension: 0.4,
                    fill: true,
                    data: dataDisplay.data,
                },
            ],
        });
        setTotalPriceProfit(totalDisplay);
        setHouses(tableDisplay);

    }, [choiceProfit, profitThisMonth, profitLastMonth])

    useEffect(() => {

        if (choiceProfit === "option" && profitsOption.label && profitsOption.label.length > 0) {
            const dataDisplay = profitsOption
            setChartDataProfit({
                labels: dataDisplay.label,
                datasets: [
                    {
                        backgroundColor: "rgba(55, 125, 255, .5)",
                        borderColor: "#377dff",
                        borderWidth: 2,
                        pointRadius: 0,
                        hoverBorderColor: "#377dff",
                        pointBackgroundColor: "#377dff",
                        pointBorderColor: "#fff",
                        pointHoverRadius: 0,
                        tension: 0.4,
                        fill: true,
                        data: dataDisplay.data,
                    },
                ],
            });

            const total = dataDisplay?.data.reduce((total, data) => total += data, 0);
            setTotalPriceProfit(total);
            setHouses(profitsOptionHouse);
        }
    }, [choiceProfit, profitsOption, profitsOptionHouse])

    // useEffect(() => {
    //     console.log(canvas.current);
    //     if (canvas.current && !canvasLoaded.current) {
    //         canvasLoaded.current = true;

    //         const ctx = canvas.current.getContext('2d');
    //         const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    //         gradient.addColorStop(0, 'rgba(55, 125, 255, 0.5)');
    //         gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

    //         const newChart = { ...chartDataProfit };
    //         newChart.datasets[0].backgroundColor = gradient;
    //         setChartDataProfit(newChart);
    //     }
    // }, []);


    useEffect(() => {
        const dataDisplay = choiceUser === "thisMonth" ? totalUsersThisMonth : totalUsersLastMonth;
        const totalDisplay = choiceUser === "thisMonth" ? totalUserThisMonth : totalUserLastMonth;

        setChartDataUser({
            labels: dataDisplay.label,
            datasets: [
                {
                    backgroundColor: ["rgba(55, 125, 255, .5)", "rgba(255, 255, 255, .2)"],
                    borderColor: "#377dff",
                    borderWidth: 2,
                    pointRadius: 0,
                    hoverBorderColor: "#377dff",
                    pointBackgroundColor: "#377dff",
                    pointBorderColor: "#fff",
                    pointHoverRadius: 0,
                    tension: 0.4,
                    fill: true,
                    data: dataDisplay.data,
                },
            ],
        });
        setTotalUser(totalDisplay);
    }, [choiceUser, totalUsersThisMonth, totalUsersLastMonth])

    useEffect(() => {

        if (choiceUser === "option" && usersOption.label && usersOption.label.length > 0) {
            const dataDisplay = usersOption
            setChartDataUser({
                labels: dataDisplay.label,
                datasets: [
                    {
                        backgroundColor: "rgba(55, 125, 255, .5)",
                        borderColor: "#377dff",
                        borderWidth: 2,
                        pointRadius: 0,
                        hoverBorderColor: "#377dff",
                        pointBackgroundColor: "#377dff",
                        pointBorderColor: "#fff",
                        pointHoverRadius: 0,
                        tension: 0.4,
                        fill: true,
                        data: dataDisplay.data,
                    },
                ],
            });

            const total = dataDisplay?.data.reduce((total, data) => total += data, 0);
            setTotalUser(total);
        }
    }, [choiceUser, usersOption])


    useEffect(() => {

        if (choiceHouse === "option" && housesOption.label && housesOption.label.length > 0) {
            const dataDisplay = housesOption
            setChartDataHouse({
                labels: dataDisplay.label,
                datasets: [
                    {
                        backgroundColor: "rgba(55, 125, 255, .5)",
                        borderColor: "#377dff",
                        borderWidth: 2,
                        pointRadius: 0,
                        hoverBorderColor: "#377dff",
                        pointBackgroundColor: "#377dff",
                        pointBorderColor: "#fff",
                        pointHoverRadius: 0,
                        tension: 0.4,
                        fill: true,
                        data: dataDisplay.data,
                    },
                ],
            });

            const total = dataDisplay?.data.reduce((total, data) => total += data, 0);
            setTotalHouse(total);
        }
    }, [choiceHouse, housesOption])


    useEffect(() => {
        const dataDisplay = choiceHouse === "thisMonth" ? totalHousesThisMonth : totalHousesLastMonth;
        const totalDisplay = choiceHouse === "thisMonth" ? totalHouseThisMonth : totalHouseLastMonth;

        setChartDataHouse({
            labels: dataDisplay.label,
            datasets: [
                {
                    backgroundColor: ["rgba(55, 125, 255, .5)", "rgba(255, 255, 255, .2)"],
                    borderColor: "#377dff",
                    borderWidth: 2,
                    pointRadius: 0,
                    hoverBorderColor: "#377dff",
                    pointBackgroundColor: "#377dff",
                    pointBorderColor: "#fff",
                    pointHoverRadius: 0,
                    tension: 0.4,
                    fill: true,
                    data: dataDisplay.data,
                },
            ],
        });
        setTotalHouse(totalDisplay)
    }, [choiceHouse, totalHousesThisMonth, totalHousesLastMonth]);


    return (
        <div className="container">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h2 className="h2">Reports</h2>

            </div>
            <div style={{ maxWidth: "auto", height: "1000px" }}>
                <div style={{ height: "50%", background: "#052c65", color: "white", borderRadius: "15px" }}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Profits" {...a11yProps(0)} sx={{ color: "white" }} />
                                <Tab label="Users" {...a11yProps(1)} sx={{ color: "white" }} />
                                <Tab label="Houses" {...a11yProps(2)} sx={{ color: "white" }} />
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={value} index={0}>
                            <div className="mt-3" style={{ position: "relative", height: "50%", background: "white", top: "-35%", width: "90%", marginLeft: "5%", borderRadius: "15px", border: "1px solid rgb(219, 210, 210)", height: "auto", color: "black", padding: "2%" }}>
                                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                                    <h5 className="h5">Profits</h5>
                                    <div>
                                        <Dropdown>
                                            <Dropdown.Toggle id="dropdown-button-dark-example1" variant="">
                                                <div onClick={() => setIsOpenProfit(true)}>
                                                    <i className="fa-solid fa-calendar-days me-2"></i>
                                                    {`${format(calendarProfit[0].startDate, 'MMM d')} - ${format(calendarProfit[0].endDate, 'MMM d, yyyy')}`}
                                                </div>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <div className="calendarWrap" ref={refCalendarProfit}>
                                                    {isOpenProfit && (
                                                        <>
                                                            <DateRangePicker
                                                                onChange={handleDateRangeChangeProfit}
                                                                showSelectionPreview={true}
                                                                editableDateInputs={true}
                                                                moveRangeOnFirstSelection={false}
                                                                ranges={dateRangeProfit}
                                                                // staticRanges={dateRangeProfit.customRanges}
                                                                months={2}
                                                                direction="horizontal"
                                                                maxDate={new Date()}
                                                            />
                                                            <div className="d-flex justify-content-end align-items-center">
                                                                <small style={{ fontSize: "12px", color: "darkgray" }}>{`${format(calendarProfit[0].startDate, "dd/MM/yyyy")} - ${format(calendarProfit[0].endDate, "dd/MM/yyyy")}`}</small>
                                                                <button onClick={() => setIsOpenProfit(false)} className="me-2 ms-2 btn btn-outline-secondary">Cancle</button>
                                                                <button onClick={() => handleApplyRangeDateProfit()} className="btn btn-primary">Apply</button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="row align-items-sm-center mb-4">
                                    <div className="col-sm mb-3 mb-sm-0">
                                        <div className="d-flex align-items-center">
                                            <span className="h4">{new Intl.NumberFormat('vn-VN', {style: 'currency', currency: 'VND'}).format(parseFloat(totalPriceProfit)) || 0} </span>
                                        </div>
                                    </div>

                                    <div className="col-sm-auto">
                                        <div className="date-filter-container">
                                            <div className="date-filter-group">
                                                <button
                                                    className={`date-filter-button ${showThisMonthProfit ? 'active' : ''}`}
                                                    onClick={() => handleThisMonthProfitClick()}
                                                >
                                                    This Month
                                                </button>
                                                <button
                                                    className={`date-filter-button ${!showThisMonthProfit ? 'active' : ''}`}
                                                    onClick={() => handleLastMonthProfitClick()}
                                                >
                                                    Last Month
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        {chartDataProfit && chartDataProfit.labels && chartDataProfit.labels.length > 0 && (
                                            <Line ref={canvas} data={chartDataProfit} options={chartOptions} />
                                        )}
                                    </div>
                                    <div>
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                <caption>Best 5 House have profit on top in month</caption>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Name House</TableCell>
                                                        <TableCell align="right">Host</TableCell>
                                                        <TableCell align="right">Phone Number</TableCell>
                                                        <TableCell align="right">Email</TableCell>
                                                        <TableCell align="right">Total Profit</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {houses.map((item) => (
                                                        <TableRow
                                                            key={item.id || ""}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell component="th" scope="row">
                                                                {item.house.hotelName || ""}
                                                            </TableCell>
                                                            <TableCell align="right">{item.user.firstName || ""}</TableCell>
                                                            <TableCell align="right">{item.user.phone || ""}</TableCell>
                                                            <TableCell align="right">{item.user.email || ""}</TableCell>
                                                            <TableCell align="right">{new Intl.NumberFormat('vi-VN', { style :'currency', currency: 'VND'}).format(parseFloat(item.totalPrice)) || ""}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>

                                </div>
                            </div>
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            <div className="mt-3" style={{ position: "relative", height: "50%", background: "white", top: "-35%", width: "90%", marginLeft: "5%", borderRadius: "15px", border: "1px solid rgb(219, 210, 210)", height: "auto", color: "black" }}>
                                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                                    <h5 className="h5">Users</h5>
                                    <div>
                                        <Dropdown>
                                            <Dropdown.Toggle id="dropdown-button-dark-example2" variant="">
                                                <div onClick={() => setIsOpenUser(true)}>
                                                    <i className="fa-solid fa-calendar-days me-2"></i>
                                                    {`${format(calendarUser[0].startDate, 'MMM d')} - ${format(calendarUser[0].endDate, 'MMM d, yyyy')}`}
                                                </div>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <div className="calendarWrap" ref={refCalendarUser}>
                                                    {isOpenUser && (
                                                        <>
                                                            <DateRangePicker
                                                                onChange={handleDateRangeChangeUser}
                                                                showSelectionPreview={true}
                                                                editableDateInputs={true}
                                                                moveRangeOnFirstSelection={false}
                                                                ranges={dateRangeUser}
                                                                months={2}
                                                                direction="horizontal"
                                                                maxDate={new Date()}
                                                            />
                                                            <div className="d-flex justify-content-end align-items-center">
                                                                <small style={{ fontSize: "12px", color: "darkgray" }}>{`${format(calendarUser[0].startDate, "dd/MM/yyyy")} - ${format(calendarUser[0].endDate, "dd/MM/yyyy")}`}</small>
                                                                <button onClick={() => setIsOpenUser(false)} className="me-2 ms-2 btn btn-outline-secondary">Cancle</button>
                                                                <button onClick={() => handleApplyRangeDateUser()} className="btn btn-primary">Apply</button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </Dropdown.Menu>
                                        </Dropdown>

                                    </div>
                                </div>
                                <div className="row align-items-sm-center mb-4">
                                    <div className="col-sm mb-3 mb-sm-0">
                                        <div className="d-flex align-items-center">
                                            <span className="h4">{totalUser || 0} New Members</span>
                                        </div>
                                    </div>

                                    <div className="col-sm-auto">
                                        <div className="date-filter-container">
                                            <div className="date-filter-group">
                                                <button
                                                    className={`date-filter-button ${showThisMonthUser ? 'active' : ''}`}
                                                    onClick={() => handleThisMonthUserClick()}
                                                >
                                                    This Month
                                                </button>
                                                <button
                                                    className={`date-filter-button ${!showThisMonthUser ? 'active' : ''}`}
                                                    onClick={() => handleLastMonthUserClick()}
                                                >
                                                    Last Month
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {chartDataUser && chartDataUser.labels && chartDataUser.labels.length > 0 && (
                                            <Line data={chartDataUser} options={chartOptions} />
                                        )}

                                    </div>

                                </div>
                            </div>
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={2}>
                            <div className="mt-3" style={{ position: "relative", height: "50%", background: "white", top: "-35%", width: "90%", marginLeft: "5%", borderRadius: "15px", border: "1px solid rgb(219, 210, 210)", height: "auto", color: "black" }}>
                                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                                    <h5 className="h5">Houses</h5>
                                    <div>

                                        <Dropdown>
                                            <Dropdown.Toggle id="dropdown-button-dark-example2" variant="">
                                                <div onClick={() => setIsOpenHouse(true)}>
                                                    <i className="fa-solid fa-calendar-days me-2"></i>
                                                    {`${format(calendarHouse[0].startDate, 'MMM d')} - ${format(calendarHouse[0].endDate, 'MMM d, yyyy')}`}
                                                </div>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <div className="calendarWrap" ref={refCalendarHouse}>
                                                    {isOpenHouse && (
                                                        <>
                                                            <DateRangePicker
                                                                onChange={handleDateRangeChangeHouse}
                                                                showSelectionPreview={true}
                                                                editableDateInputs={true}
                                                                moveRangeOnFirstSelection={false}
                                                                ranges={dateRangeHouse}
                                                                months={2}
                                                                direction="horizontal"
                                                                maxDate={new Date()}
                                                            />
                                                            <div className="d-flex justify-content-end align-items-center">
                                                                <small style={{ fontSize: "12px", color: "darkgray" }}>{`${format(calendarHouse[0].startDate, "dd/MM/yyyy")} - ${format(calendarHouse[0].endDate, "dd/MM/yyyy")}`}</small>
                                                                <button onClick={() => setIsOpenHouse(false)} className="me-2 ms-2 btn btn-outline-secondary">Cancle</button>
                                                                <button onClick={() => handleApplyRangeDateHouse()} className="btn btn-primary">Apply</button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="row align-items-sm-center mb-4">
                                    <div className="col-sm mb-3 mb-sm-0">
                                        <div className="d-flex align-items-center">
                                            <span className="h4">{totalHouse || 0} New Houses</span>
                                        </div>
                                    </div>

                                    <div className="col-sm-auto">
                                        <div className="date-filter-container">
                                            <div className="date-filter-group">
                                                <button
                                                    className={`date-filter-button ${showThisMonthHouse ? 'active' : ''}`}
                                                    onClick={() => handleThisMonthHouseClick()}
                                                >
                                                    This Month
                                                </button>
                                                <button
                                                    className={`date-filter-button ${!showThisMonthHouse ? 'active' : ''}`}
                                                    onClick={() => handleLastMonthHouseClick()}
                                                >
                                                    Last Month
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Line data={chartDataHouse} options={chartOptions} />
                                    </div>

                                </div>
                            </div>
                        </CustomTabPanel>
                    </Box>
                </div>
            </div >
        </div >
    )
}

export default Reports;