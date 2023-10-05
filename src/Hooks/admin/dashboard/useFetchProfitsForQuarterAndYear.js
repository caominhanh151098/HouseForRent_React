import axios from "axios";
import React, { useEffect, useState } from "react";

const useFetchProfitsForQuarterAndYear = (startDate, endDate) => {

    const [profits , setProfits] = useState([]);
    useEffect(() => {
        async function getData() {
            const responses = await axios.get(`http://localhost:8080/api/admin/profits?date1=${startDate}&date2=${endDate}`);

            const result = new Map();

            responses.data.forEach(item => {
                const { reservationDate, totalPrice } = item;

                const yearMonth = reservationDate.substring(0, 7);

                if (result.has(yearMonth)) {
                    const existingItem = result.get(yearMonth);
                    existingItem.totalPrice += parseFloat(totalPrice);
                } else {
                    result.set(yearMonth, { reservationDate: yearMonth, totalPrice: parseFloat(totalPrice) });
                }
            });

            const mergedData = [...result.values()];

            const processedData = mergedData.map(item => {
                const x = new Date(item.reservationDate).getMonth();
                const y = parseFloat(item.totalPrice);
                return { x, y, markerType: "none" };
            });

            processedData.sort((a, b) => new Date(a.x) - new Date(b.x))
            
            const data =  [
                { x: 1, y: 64, markerType: "none" },
                { x: 2, y: 61,markerType: "none" },
                { x: 3, y: 64,markerType: "none" },
                { x: 4, y: 62,markerType: "none" },
                { x: 5, y: 64,markerType: "none" },
                { x: 6, y: 60,markerType: "none" },
                { x: 7, y: 58,markerType: "none" },
                { x: 8, y: 59,markerType: "none" },
                { x: 9, y: 53,markerType: "none" },
                { x: 10, y: 54,markerType: "none" },
                { x: 11, y: 61,markerType: "none" },
                { x: 12, y: 60,markerType: "none" },
                { x: 13, y: 55,markerType: "none" },
                { x: 14, y: 60,markerType: "none" },
                { x: 15, y: 56,markerType: "none" },
                { x: 16, y: 60,markerType: "none" },
                { x: 17, y: 59.5,markerType: "none" },
                { x: 18, y: 63,markerType: "none" },
                { x: 19, y: 58,markerType: "none" },
                { x: 20, y: 54,markerType: "none" },
                { x: 21, y: 59,markerType: "none" },
                { x: 22, y: 64,markerType: "none" },
                { x: 23, y: 59,markerType: "none" }
            ]

            const responseData = [
                {
                    type: "line",
                    toolTipContent: "Month {x}: {y}$",
                    dataPoints: [
                        ...data
                    ]
                }
            ]

            setProfits(responseData);
        }
        getData();
    }, [startDate, endDate])
    return profits;
}

export default useFetchProfitsForQuarterAndYear;