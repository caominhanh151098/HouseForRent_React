import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import useFormatDate from "../useFormatDate";
import axios from "axios";
import { API_ADMIN } from "../../../Services/common";

const useFetchProfitsForLastMonth = () => {

    const [profits, setProfits] = useState([])
    const date = new Date();
    const startDate = useFormatDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    const endDate = useFormatDate(new Date(date.getFullYear(), date.getMonth(), 0));

    useEffect(() => {
        async function getData() {
            const responses = await axios.get(API_ADMIN + `profits?date1=${startDate}&date2=${endDate}`);
            const result = new Map();

            responses.data.forEach(e => {
                const temp = e.totalPrice;
                let total = 0;
                e.bookingFees.forEach(fee => {
                    if (fee.type === 'SERVICE_FEE') {
                        const feee = parseFloat(fee.value);
                        total = (temp * feee) / 100;
                    }
                })
                e.totalPrice = total;
            })

            responses.data.forEach(item => {
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
                return { x, y, markerType: "none" };
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

            setProfits(responseData)
        }
        getData();
    }, [])
    return profits;
}

export default useFetchProfitsForLastMonth;