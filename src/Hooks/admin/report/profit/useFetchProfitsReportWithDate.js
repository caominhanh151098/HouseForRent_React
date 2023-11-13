import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { API_ADMIN } from "../../../../Services/common";

const useFetchProfitsReportWithDate = (startDate, endDate) => {
    const [profits, setProfits] = useState([])
    useEffect(() => {
        async function getData() {
            const responses = await axios.get(API_ADMIN + `profits?date1=${startDate}&date2=${endDate}`);
            const data = responses.data;

            const dateTotalMap = new Map();

            data.forEach(item => {
                const date = item.reservationDate;
                const totalPrice = parseFloat(item.totalPrice);
                let newTotal = 0
                item.bookingFees.forEach(e => {
                    if (e.type === "SERVICE_FEE") {
                        const fee = parseFloat(e.value);
                        return newTotal = (totalPrice * fee) / 100;
                    }
                })

                if (dateTotalMap.has(date)) {
                    dateTotalMap.set(date, dateTotalMap.get(date) + newTotal);
                } else {
                    dateTotalMap.set(date, newTotal);
                }
            });

            const labels = Array.from(dateTotalMap.keys()).sort();

            const newLabels = labels.map((date) => {
                const newDate = new Date(date).getDate();
                return newDate
            })

            const datas = labels.map(date => dateTotalMap.get(date));

            const resultObject = {
                label: newLabels,
                data: datas
            };
            setProfits(resultObject);
        }
        getData();
    }, [startDate, endDate])
    return profits;
}

export default useFetchProfitsReportWithDate;