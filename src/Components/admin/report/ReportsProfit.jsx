import { Box, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import { addDays, startOfWeek, startOfMonth, endOfWeek, endOfMonth, format } from "date-fns";
import { Line } from "react-chartjs-2";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../../admin/report/ReportsCSS.css';
import useFetchProfitsReportThisMonth from "../../../Hooks/admin/report/profit/useFetchProfitsReportThisMonth";
import useFetchProfitsHouseReportThisMonth from "../../../Hooks/admin/report/profit/useFetchProfitsHouseReportThisMonth";
import useFetchProfitsHouseReportLastMonth from "../../../Hooks/admin/report/profit/useFetchProfitsHouseReportLastMonth";
import useFetchProfitsReportLastMonth from "../../../Hooks/admin/report/profit/useFetchProfitsReportLastMonth";

const ReportsProfit = () => {
    const profitThisMonth = useFetchProfitsReportThisMonth();
    const reportHouseThisMonth = useFetchProfitsHouseReportThisMonth();
    const newReportHouseThisMonth = reportHouseThisMonth.filter((item) => item !== undefined)
    const totalThisMonth = profitThisMonth?.data?.reduce((total, price) => total + price, 0)

    const profitLastMonth = useFetchProfitsReportLastMonth();
    const reportHouseLastMonth = useFetchProfitsHouseReportLastMonth();
    const newReportHouseLastMonth = reportHouseLastMonth.filter((item) => item !== undefined);
    const totalLastMonth = profitLastMonth?.data?.reduce((total, price) => total + price, 0)

    const [calendar, setCalendar] = useState([{
        startDate: addDays(new Date(), -1),
        endDate: new Date(),
        key: 'selection'
    }]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [choice, setChoice] = useState("")
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(0);
    const refCalendar = useRef(null)
    const [showThisMonth, setShowThisMonth] = useState(true);
    const [houses, setHouses] = useState([]);
    const [dateRange, setDateRange] = useState([
        {
            startDate: addDays(new Date(), -1),
            endDate: new Date(),
            key: 'selection'
        }
    ])
    const [chartData, setChartData] = useState({
        labels: [],
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
                data: [],

            },
            // {
            //     backgroundColor: ["rgba(0, 201, 219, .5)", "rgba(255, 255, 255, .2)"],
            //     borderColor: "#00c9db",
            //     borderWidth: 2,
            //     pointRadius: 0,
            //     hoverBorderColor: "#00c9db",
            //     pointBackgroundColor: "#00c9db",
            //     pointBorderColor: "#fff",
            //     pointHoverRadius: 0,
            //     tension: 0.4,
            //     data: [27,38,60,77,40,50,49,29,42,27,42,50]
            // },
        ],
    })
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
        },
        hover: {
            mode: "nearest",
            intersect: true,
        },
    })


    const handleDateRangeChange = (item) => {
        setDateRange([item.selection]);
    }

    const handleClickOutside = (event) => {
        if (refCalendar.current && !refCalendar.current.contains(event.target)) {
            setIsOpen(false);
        }
    }

    const handleClickEsc = (event) => {
        if (event.key === "Escape") {
            setIsOpen(false)
        }
    }

    const handleApplyRangeDate = () => {
        const rangeDate = [...dateRange]
        setCalendar(rangeDate);
        setIsOpen(false)
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        document.addEventListener("keydown", handleClickEsc, true);

    }, [])




    const handleThisMonthClick = () => {
        setShowThisMonth(true);
        setChoice("thisMonth");
    };

    const handleLastMonthClick = () => {
        setShowThisMonth(false);
        setChoice("lastMonth");
    };




    const switchChoice = () => {
        switch (choice) {
            case "thisMonth":
                const newLabelThisMonth = profitThisMonth.label;
                const newDataThisMonth = profitThisMonth.data;
                const newChartThisMonth = { ...chartData };
                newChartThisMonth.labels = newLabelThisMonth;
                newChartThisMonth.datasets[0].data = newDataThisMonth;
                setTotalPrice(totalThisMonth);
                setChartData(newChartThisMonth)
                setHouses(newReportHouseThisMonth);

                break;
            case "lastMonth":
                const newLabelLastMonth = profitLastMonth.label;
                const newDataLastMonth = profitLastMonth.data;
                const newChartLastMonth = { ...chartData };
                newChartLastMonth.labels = newLabelLastMonth;
                newChartLastMonth.datasets[0].data = newDataLastMonth;
                setTotalPrice(totalLastMonth);
                setChartData(newChartLastMonth)
                setHouses(newReportHouseLastMonth);
                break;
        }
    }
    useEffect(() => {
        switchChoice();
    }, [choice])

    return (
        <div className="mt-3" style={{ position: "relative", height: "50%", background: "white", top: "-35%", width: "90%", marginLeft: "5%", borderRadius: "15px", border: "1px solid rgb(219, 210, 210)", height: "auto", color: "black" }}>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                <h5 className="h5">Profits</h5>
                <div>
                    <button onClick={() => setIsOpen(true)} className="btn btn-outline-danger">
                        <i className="fa-solid fa-calendar-days me-2"></i>
                        {`${format(calendar[0].startDate, 'MMM d')} - ${format(calendar[0].endDate, 'MMM d, yyyy')}`}
                    </button>
                    <div className="calendarWrap" ref={refCalendar}>
                        {isOpen && (
                            <>
                                <DateRangePicker
                                    onChange={handleDateRangeChange}
                                    showSelectionPreview={true}
                                    editableDateInputs={true}
                                    moveRangeOnFirstSelection={false}
                                    ranges={dateRange}
                                    months={2}
                                    direction="horizontal"
                                    maxDate={new Date()}
                                />
                                <div className="d-flex justify-content-end align-items-center">
                                    <small style={{ fontSize: "12px", color: "darkgray" }}>{`${format(calendar[0].startDate, "dd/MM/yyyy")} - ${format(calendar[0].endDate, "dd/MM/yyyy")}`}</small>
                                    <button onClick={() => setIsOpen(false)} className="me-2 ms-2 btn btn-outline-secondary">Cancle</button>
                                    <button onClick={() => handleApplyRangeDate()} className="btn btn-primary">Apply</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="row align-items-sm-center mb-4">
                <div className="col-sm mb-3 mb-sm-0">
                    <div className="d-flex align-items-center">
                        <span className="h4">${totalPrice} USD</span>
                    </div>
                </div>

                <div className="col-sm-auto">
                    <div className="date-filter-container">
                        <div className="date-filter-group">
                            <button
                                className={`date-filter-button ${showThisMonth ? 'active' : ''}`}
                                onClick={handleThisMonthClick}
                            >
                                This Month
                            </button>
                            <button
                                className={`date-filter-button ${!showThisMonth ? 'active' : ''}`}
                                onClick={handleLastMonthClick}
                            >
                                Last Month
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <Line data={chartData} options={chartOptions} />
                </div>
                <div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <caption>A basic table example with a caption</caption>
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
                                        <TableCell align="right">{item.totalPrice || ""}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

            </div>
        </div>
    )
}

export default ReportsProfit;