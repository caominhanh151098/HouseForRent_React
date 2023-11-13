import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_ADMIN } from "../../../Services/common";

const useFetchProfitsForWeekAndMonth = (startDate, endDate) => {

    const [profits, setProfits] = useState([]);
    useEffect(() => {


        async function getData() {
            const response = await axios.get(API_ADMIN + `profits?date1=${startDate}&date2=${endDate}`);

            const result = new Map();
            response.data.forEach(item => {
                const { reservationDate, totalPrice } = item;
                if (result.has(reservationDate)) {
                    const existingItem = result.get(reservationDate);
                    existingItem.totalPrice += parseFloat(totalPrice);
                } else {
                    result.set(reservationDate, { reservationDate, totalPrice: parseFloat(totalPrice) });
                }
            });

            const mergedData = [...result.values()];

            const processedData = mergedData.map(item => {
                const x = new Date(item.reservationDate).getDate();
                const y = parseFloat(item.totalPrice);
                return { x, y };
            });

            processedData.sort((a, b) => new Date(a.x) - new Date(b.x))

            const responseData = [
                {
                    type: "line",
                    toolTipContent: "Day {x}: {y}$",
                    dataPoints: [
                        ...processedData
                    ]
                }
            ]

            setProfits(responseData);
        }
        getData();
    }, [startDate, endDate])
    return profits;
}

export default useFetchProfitsForWeekAndMonth;