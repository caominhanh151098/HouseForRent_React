import React, { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import CanvasJSReact from "@canvasjs/react-charts";
import { Table } from "react-bootstrap";
import { Card } from "react-bootstrap";
import "../dashboard/DashBoardCSS.css"
import us from "../../../assets/images/animat-rocket-color.gif";
import defaultAva from "../../../assets/images/avatar-1577909_1280.webp";
import useFetchProfitsForQuarterAndYear from "../../../Hooks/admin/dashboard/useFetchProfitsForQuarterAndYear";
import useFetchTotalUsersThisMonth from "../../../Hooks/admin/dashboard/useFetchTotalUsersThisMonth";
import useFetchTotalUsersLastMonth from "../../../Hooks/admin/dashboard/useFetchTotalUsersLastMonth";
import useFetchTotalReservationsThisMonth from "../../../Hooks/admin/dashboard/useFetchTotalReservationsThisMonth";
import useFetchTotalReservationsLastMonth from "../../../Hooks/admin/dashboard/useFetchTotalReservationsLastMonth";
import useFetchTotalNewHousesThisMonth from "../../../Hooks/admin/dashboard/useFetchTotalNewHousesThisMonth";
import useFetchTotalNewHousesLastMonth from "../../../Hooks/admin/dashboard/useFetchTotalNewHousesLastMonth";
import useFetchProfitsForThisMonth from "../../../Hooks/admin/dashboard/useFetchProfitsForThisMonth";
import useFetchProfitsForLastMonth from "../../../Hooks/admin/dashboard/useFetchProfitsForLastMonth";
import useFetchProfitsForPreLastMonth from "../../../Hooks/admin/dashboard/useFetchProfitsForPreLastMonth";
import SockJS from "sockjs-client";
// import { Stomp } from "@stomp/stompjs";
import axios from "axios";
import Stomp from "stompjs";
import useFetchReservationToday from "../../../Hooks/admin/dashboard/useFetchReservationToday";
import { format } from "date-fns";
import { API_ADMIN } from "../../../Services/common";

Chart.register(...registerables);
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function DashBoard() {

    const profitsThisMonth = useFetchProfitsForThisMonth();
    const profitsLastMonth = useFetchProfitsForLastMonth();
    const profitsPreLastMonth = useFetchProfitsForPreLastMonth();
    const calculatePercentofProfitsThisMonth = () => {
        const dataThisMonth = profitsThisMonth[0]?.dataPoints;
        let total = 0;

        if (dataThisMonth) {
            for (const data of dataThisMonth) {
                total += data.y
            }
        }
        const dataLastMonth = profitsLastMonth[0]?.dataPoints;
        let total1 = 0;
        if (dataLastMonth) {
            for (const data of dataLastMonth) {
                total1 += data.y
            }
        }
        const percent = ((total - total1) / total1) * 100;
        const newPercent = percent.toFixed(2);

        return newPercent;
    }
    const calculatePercentofProfitsLastMonth = () => {
        const dataLastMonth = profitsLastMonth[0]?.dataPoints;
        let total = 0;

        if (dataLastMonth) {
            for (const data of dataLastMonth) {
                total += data.y
            }
        }
        const dataPreLastMonth = profitsPreLastMonth[0]?.dataPoints;
        let total1 = 0;
        let percent = 0;
        if (dataPreLastMonth) {
            for (const data of dataPreLastMonth) {
                total1 += data.y
            }

            percent = ((total - total1) / total1) * 100;
        } else {
            percent = total * 100;
        }
        const newPercent = percent.toFixed(2);

        return newPercent;
    }
    const calculatePercentGrowthForProfits = () => {
        const thisMonth = calculatePercentofProfitsThisMonth();
        const lastMonth = calculatePercentofProfitsLastMonth();
        const value = thisMonth - lastMonth;
        const newValue = value.toFixed(2);
        if (newValue === 0) {
            return (
                <span className="d-flex align-items-center ms-1 card-statistical-equal">
                    <span>0.0%</span>
                </span>
            )
        } else if (newValue > 0) {
            return (
                <span className="d-flex align-items-center ms-1 card-statistical-up">
                    <i className="fa-solid fa-arrow-trend-up"></i>
                    <span>{newValue}%</span>

                </span>
            )
        } else {
            return (
                <span className="d-flex align-items-center ms-1 card-statistical-down">
                    <i className="fa-solid fa-arrow-trend-down"></i>
                    <span>{newValue}%</span>
                </span>
            )
        }
    }
    const statisticalProfits = {
        animationEnabled: true,
        exportEnabled: false,
        theme: "light2", // "light1", "dark1", "dark2"
        title: {
            text: ""
        },
        axisY: {
            title: "",
            suffix: "",
            lineColor: "transparent",
            gridThickness: 0,
            lineThickness: 0,
            labelFormatter: function (e) { return " "; },
            tickLength: 0,
        },
        axisX: {
            title: "",
            prefix: "",
            interval: 1,
            lineColor: "transparent",
            gridThickness: 0,
            lineThickness: 0,
            labelFormatter: function (e) { return " "; },
            tickLength: 0,


        },
        data: profitsThisMonth,
        width: 200,
        height: 100,
    }


    const totalHousesThisMonth = useFetchTotalNewHousesThisMonth();
    const totalHousesLastMonth = useFetchTotalNewHousesLastMonth();
    const calculatePercentGrowthForHouses = () => {
        const dataThisMonth = totalHousesThisMonth[0]?.dataPoints;
        let total = 0;

        if (dataThisMonth) {
            for (const data of dataThisMonth) {
                total += data.y
            }
        }
        const percent = ((total - totalHousesLastMonth.length) / totalHousesLastMonth.length) * 100;
        const newPercent = percent.toFixed(2);

        if (total === totalHousesLastMonth.length) {
            return (
                <span className="d-flex align-items-center ms-1 card-statistical-equal">
                    <span>0.0%</span>
                </span>
            )
        } else if (total > totalHousesLastMonth.length) {
            return (
                <span className="d-flex align-items-center ms-1 card-statistical-up">
                    <i className="fa-solid fa-arrow-trend-up"></i>
                    <span>{newPercent}%</span>

                </span>
            )
        } else {
            return (
                <span className="d-flex align-items-center ms-1 card-statistical-down">
                    <i className="fa-solid fa-arrow-trend-down"></i>
                    <span>{newPercent}%</span>
                </span>
            )
        }
    }
    const statisticalHouses = {
        animationEnabled: true,
        exportEnabled: false,
        theme: "light2", // "light1", "dark1", "dark2"
        title: {
            text: ""
        },
        axisY: {
            title: "",
            suffix: "",
            lineColor: "transparent",
            gridThickness: 0,
            lineThickness: 0,
            labelFormatter: function (e) { return " "; },
            tickLength: 0,
        },
        axisX: {
            title: "",
            prefix: "",
            interval: 1,
            lineColor: "transparent",
            gridThickness: 0,
            lineThickness: 0,
            labelFormatter: function (e) { return " "; },
            tickLength: 0,


        },
        data: totalHousesThisMonth,
        width: 200,
        height: 100,
    }

    const totalReservationsThisMonth = useFetchTotalReservationsThisMonth();
    const totalReservationsLastMonth = useFetchTotalReservationsLastMonth();
    const calculatePercentGrowthForReservations = () => {
        const dataThisMonth = totalReservationsThisMonth[0]?.dataPoints;
        let total = 0;

        if (dataThisMonth) {
            for (const data of dataThisMonth) {
                total += data.y
            }
        }
        const percent = ((total - totalReservationsLastMonth.length) / totalReservationsLastMonth.length) * 100;
        const newPercent = percent.toFixed(2);

        if (total === totalReservationsLastMonth.length) {
            return (
                <span className="d-flex align-items-center ms-1 card-statistical-equal">
                    <span>0.0%</span>
                </span>
            )
        } else if (total > totalReservationsLastMonth.length) {
            return (
                <span className="d-flex align-items-center ms-1 card-statistical-up">
                    <i className="fa-solid fa-arrow-trend-up"></i>
                    <span>{newPercent}%</span>

                </span>
            )
        } else {
            return (
                <span className="d-flex align-items-center ms-1 card-statistical-down">
                    <i className="fa-solid fa-arrow-trend-down"></i>
                    <span>{newPercent}%</span>
                </span>
            )
        }
    }

    const statisticalReservations = {
        animationEnabled: true,
        exportEnabled: false,
        theme: "light2", // "light1", "dark1", "dark2"
        title: {
            text: ""
        },
        axisY: {
            title: "",
            suffix: "",
            lineColor: "transparent",
            gridThickness: 0,
            lineThickness: 0,
            labelFormatter: function (e) { return " "; },
            tickLength: 0,
        },
        axisX: {
            title: "",
            prefix: "",
            interval: 1,
            lineColor: "transparent",
            gridThickness: 0,
            lineThickness: 0,
            labelFormatter: function (e) { return " "; },
            tickLength: 0,


        },
        data: totalReservationsThisMonth,
        width: 200,
        height: 100,
    }

    const totalUserThisMonth = useFetchTotalUsersThisMonth();
    const totalUsersLastMonth = useFetchTotalUsersLastMonth();
    const calculatePercentGrowthForUsers = () => {
        const dataThisMonth = totalUserThisMonth[0]?.dataPoints;
        let total = 0;

        if (dataThisMonth) {
            for (const data of dataThisMonth) {
                total += data.y
            }
        }
        const percent = ((total - totalUsersLastMonth.length) / totalUsersLastMonth.length) * 100;
        const newPercent = percent.toFixed(2);

        if (total === totalUsersLastMonth.length) {
            return (
                <span className="d-flex align-items-center ms-1 card-statistical-equal">
                    <span>0.0%</span>
                </span>
            )
        } else if (total > totalUsersLastMonth.length) {
            return (
                <span className="d-flex align-items-center ms-1 card-statistical-up">
                    <i className="fa-solid fa-arrow-trend-up"></i>
                    <span>{newPercent}%</span>

                </span>
            )
        } else {
            return (
                <span className="d-flex align-items-center ms-1 card-statistical-down">
                    <i className="fa-solid fa-arrow-trend-down"></i>
                    <span>{newPercent}%</span>
                </span>
            )
        }
    }


    const statisticalUsers = {
        animationEnabled: true,
        exportEnabled: false,
        theme: "light2", // "light1", "dark1", "dark2"
        title: {
            text: ""
        },
        axisY: {
            title: "",
            suffix: "",
            lineColor: "transparent",
            gridThickness: 0,
            lineThickness: 0,
            labelFormatter: function (e) { return " "; },
            tickLength: 0,
        },
        axisX: {
            title: "",
            prefix: "",
            interval: 1,
            lineColor: "transparent",
            gridThickness: 0,
            lineThickness: 0,
            labelFormatter: function (e) { return " "; },
            tickLength: 0,


        },

        data: totalUserThisMonth,
        width: 200,
        height: 100,



    }

    const dataForYear = useFetchProfitsForQuarterAndYear("2023-01-01", "2023-12-31");

    const profitsForYear = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", // "light1", "dark1", "dark2"
        title: {
            text: "Bounce Rate by  Year"
        },
        axisY: {
            title: "",
            suffix: "",
            gridThickness: 0,
        },
        axisX: {
            title: "Year",
            prefix: "",
            interval: 1
        },
        data: dataForYear
    }

    const data = {
        labels: ['KPI', 'Profit'],
        datasets: [
            {
                label: '# of Votes',
                data: [700, 300],
                backgroundColor: ["#377dff", "rgba(55, 125, 255, 0.35)"],
                borderColor: ["#ffffff", "#ffffff"],
                borderWidth: 4,
                hoverBorderColor: "#ffffff"
            },
        ],
    };


    const dataToday = useFetchReservationToday();

    const [socketData, setSocketData] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [dataChart, setDataChart] = useState(data);
    const [dataShow, setDataShow] = useState([])
    const [totalShow, setTotalShow] = useState(0);
    const [reservationTest, setReservationTest] = useState({});
    // const [dataProcessed, setDataProcessed] = useState(false);



    useEffect(() => {
        if (dataToday) {
            let total = 0;
            dataToday.forEach((item) => {
                let price = item.totalPrice;
                let tempService = 0;
                let tempHost = 0;
                item?.bookingFees.forEach((e) => {
                    if (e.type === 'SERVICE_FEE') {
                        const fee = parseFloat(e.value) / 100;
                        price -= (price * fee);
                        total += fee * item.totalPrice;
                        tempService = fee * item.totalPrice;
                    }
                    if (e.type === 'HOST_FEE') {
                        const fee = parseFloat(e.value) / 100;
                        total += fee * price;
                        tempHost = fee * price;
                    }
                })
                const surplus = item.totalPrice - tempService - tempHost;
                item.totalPrice = surplus;
            })

            const newChart = { ...dataChart };
            const newArr = [...newChart.datasets[0].data];
            newArr[0] = parseInt(1000 - total);
            newArr[1] = parseInt(total);
            newChart.datasets[0].data = newArr;

            setDataShow(dataToday);
            setTotalShow(total);
            setDataChart(newChart)
        }
    }, [dataToday])

    useEffect(() => {
        async function getData() {
            const response = await axios.get(API_ADMIN + "profits/findAll");
            setReservations(response.data);
        }
        getData();
    }, [])

    useEffect(() => {

        const socket = new SockJS('https://quarter-rois.cghue.com/ws');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            if (client.connect()) {
                client?.subscribe('/topic/dataNew', (response) => {

                    const newData = JSON.parse(response.body);
                    setSocketData((prev) => [...prev, newData]);
                    // setSocketData(newData)

                });
            }

            setStompClient(client);

            return () => {
                if (stompClient.connected) {
                    stompClient.disconnect();
                    console.error("Disconnected from WebSocket");
                }
            }
        })
    }, [])


    const option = {
        plugins: {
            tooltip: {
                postfix: "%"
            }
        },
        cutout: '85%',
        rotation: '270',
        circumference: '180'
    }

    const handleAccept = (item) => {
        const test = {
            id: item.id,
            status: 'FINISH',
            completeDate: format(new Date(), 'yyyy-MM-dd'),
            totalPrice: item.totalPrice
        }
        setReservationTest(test);
    }

    useEffect(() => {
        async function updateData() {
            try {
                await axios.patch(API_ADMIN + `profits/update/${reservationTest.id}`, { status: reservationTest.status, totalPrice: reservationTest.totalPrice, completeDate: reservationTest.completeDate }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });


                const data = { ...reservationTest };
                stompClient?.send("/app/sendData", {}, JSON.stringify(data));
            } catch (error) {
                console.error("Lỗi đổi status", error);
            }
        }
        updateData()
    }, [reservationTest])

    useEffect(() => {

        let total = 0;

        const dataSave = socketData[socketData.length - 1];
        if (dataSave) {
            dataSave?.bookingFees?.forEach((e) => {
                const temp = parseFloat(dataSave.totalPrice);
                let tempService = 0;
                let tempHost = 0;

                if (e.type === 'SERVICE_FEE') {
                    const fee = parseFloat(e.value) / 100;
                    total += temp * fee;
                    tempService = temp * fee;
                }
                if (e.type === 'HOST_FEE') {
                    const fee = parseFloat(e.value) / 100;
                    const surplus = temp - tempService;
                    total += surplus * fee;
                    tempHost = surplus * fee;
                }
                dataSave.totalPrice = temp - tempService - tempHost;

            })
        }

        const newChart = { ...dataChart };
        const newArr = [...newChart.datasets[0].data];
        newArr[0] = parseInt(1000 - total);
        newArr[1] = parseInt(total);
        newChart.datasets[0].data = newArr;

        setDataShow((prev) => [dataSave, ...prev])

        setTotalShow(prev => (parseFloat(prev) + total));
        setDataChart(newChart)
        // if (!dataProcessed) {

        //     setDataProcessed(true);
        // }
    }, [socketData]);


    return (
        <div className="container">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Dashboard</h1>
            </div>
            {/* <table className="table">
                <thead>
                    <th>
                        <td>id</td>
                        <td>status</td>
                        <td>price</td>
                        <td>action</td>
                    </th>
                </thead>
                <tbody>
                    {reservations.map(reservation => (
                        <tr>
                            <td>{reservation.id}</td>
                            <td>{reservation.status}</td>
                            <td>{reservation.totalPrice}</td>
                            <td>
                                <button onClick={() => handleAccept(reservation)}>Accept</button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table> */}

            <div style={{ height: "900px" }}>
                <div style={{ height: '25%', display: 'flex' }}>
                    <div style={{ width: '25%', height: 'auto' }}>
                        <div style={{ width: "75%", height: "50%" }}>
                            <Card className="card-profit">
                                <Card.Body>
                                    <Card.Title>Total Users</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted d-flex">{statisticalUsers?.data[0]?.dataPoints?.reduce((total, point) => total + point.y, 0)} News
                                        {calculatePercentGrowthForUsers()}
                                        <span className="ms-1" style={{ fontWeight: "lighter" }}>from {totalUsersLastMonth.length}</span>
                                    </Card.Subtitle>

                                    <CanvasJSChart options={statisticalUsers} />
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                    <div style={{ width: '25%', height: 'auto' }}>
                        <div style={{ width: "75%", height: "70%" }}>
                            <Card className="card-profit">
                                <Card.Body>
                                    <Card.Title>Total Reservation</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted d-flex">{statisticalReservations?.data[0]?.dataPoints?.reduce((total, point) => total + point.y, 0)} News
                                        {calculatePercentGrowthForReservations()}
                                        <span className="ms-1" style={{ fontWeight: "lighter" }}>from {totalReservationsLastMonth.length}</span>

                                    </Card.Subtitle>

                                    <CanvasJSChart options={statisticalReservations} />
                                </Card.Body>
                            </Card>

                        </div>
                    </div>
                    <div style={{ width: '25%', height: 'auto' }}>
                        <div style={{ width: "75%", height: "70%" }}>
                            <Card className="card-profit">
                                <Card.Body>
                                    <Card.Title>Total New House</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted d-flex">{statisticalHouses?.data[0]?.dataPoints?.reduce((total, point) => total + point.y, 0)} News


                                        {calculatePercentGrowthForHouses()}
                                        <span className="ms-1" style={{ fontWeight: "lighter" }}>from {totalHousesLastMonth.length}</span>

                                    </Card.Subtitle>

                                    <CanvasJSChart options={statisticalHouses} />
                                </Card.Body>
                            </Card>

                        </div>
                    </div>
                    <div style={{ width: '25% ', height: 'auto' }}>
                        <div style={{ width: "75%", height: "50%" }}>
                            <Card className="card-profit">
                                <Card.Body>
                                    <Card.Title>Profits</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted d-flex">

                                        <div style={{ width: "33%" }}>{calculatePercentofProfitsThisMonth()}%</div>
                                        <div style={{ width: "36%" }}>{calculatePercentGrowthForProfits()}</div>
                                        <div style={{ width: "33%" }}><span className="ms-1" style={{ fontWeight: "lighter" }}>from {calculatePercentofProfitsLastMonth()}%</span></div>

                                    </Card.Subtitle>

                                    <CanvasJSChart options={statisticalProfits} />
                                </Card.Body>
                            </Card>
                        </div>
                        {/* <CanvasJSChart options={profitsForYear} /> */}
                    </div>
                </div>

                <div style={{ height: '75%', display: 'flex' }} >
                    <div style={{ width: '30%', height: 'auto' }}>
                        <div style={{ position: "relative" }}>
                            <Doughnut data={data} options={option} />
                            <div style={{ position: 'absolute', bottom: '70px', left: '105px', textAlign: "center" }}>
                                <small style={{ fontSize: "15px", textTransform: "uppercase", letterSpacing: ".03125rem", fontWeight: "600" }}>Project balance</small> <br />
                                <span style={{ fontSize: "1.4109375rem", fontWeight: "600", lineHeight: "1.2" }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalShow) || 0 + 'đ'}</span>
                            </div>
                        </div>
                        {/* <Line config={config} data={data} /> */}
                    </div>
                    <div className="d-flex align-items-start justify-content-center" style={{ width: '70%', height: 'auto', overflow: "auto" }}>

                        <Table striped>
                            <thead className="sticky-thead">
                                <tr>
                                    <th colSpan={4}>Latest Transactions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataShow?.map((data) => (
                                    <tr>
                                        <td>
                                            <div className='d-flex align-items-center '>
                                                <img className="img-tbody me-2" src={data?.user?.avatar || defaultAva} />
                                                {data?.house?.hotelName}
                                            </div>
                                        </td>
                                        <td className="align-middle">
                                            <span className="span-completed">
                                                Finished
                                            </span>

                                        </td>
                                        <td className="align-middle" style={{ color: "lightgreen", fontFamily: "monospace", fontWeight: "bolder", fontSize: "23px" }}>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data?.totalPrice)}
                                        </td>
                                    </tr>

                                ))}
                                {/* <tr>

                                    <td>
                                        <div className='d-flex align-items-center'>
                                            <img className="img-tbody me-2" src="https://res.cloudinary.com/didieklbo/image/upload/f_auto,q_auto/v1/AvatarUser/jig2yadz7mfmrc01qtje" />
                                            Apartment-3 bedrooms view Thành Phố +swimming pool
                                        </div>
                                    </td>
                                    <td className="align-middle">
                                        <span className="span-completed">
                                            Finished
                                        </span>
                                        <span className="span-waiting">
                                            Waiting
                                        </span>
                                    </td>
                                    <td className="align-middle " style={{ color: "lightgreen", fontFamily: "monospace", fontWeight: "bolder", fontSize: "23px" }}>
                                        100.000.000Đ
                                    </td>
                                </tr> */}


                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default DashBoard;