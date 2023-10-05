import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const useFetchProfitsHouseReportWithDate = (startDate, endDate) => {
    const [houses, setHouses] = useState([]);
    useEffect(() => {
        async function getData() {
            const responses = await axios.get(`http://localhost:8080/api/admin/profits/houses?date1=${startDate}&date2=${endDate}`);
            const data = responses.data;
            const result = data.reduce((accumulator, item) => {
                const houseId = item.house.id;
                const totalPrice = parseFloat(item.totalPrice);

                const existingHouse = accumulator.find(house => house.house.id === houseId);

                if (existingHouse) {
                    existingHouse.totalPrice += totalPrice;
                } else {
                    const newHouse = { ...item };
                    newHouse.totalPrice = totalPrice;
                    accumulator.push(newHouse);
                }

                return accumulator;
            }, []);
            result.sort((a, b) => b.totalPrice - a.totalPrice);

            result.forEach(e => {
                const temp = e.totalPrice
                let newTotal = 0
                e.bookingFees.forEach(fee => {
                    if (fee.type === 'SERVICE_FEE') {
                        const fees = parseFloat(fee.value);
                        return newTotal = (temp * fees) / 100;
                    }
                });
                e.totalPrice = newTotal;
            });

            const newResult = [];
            for (let i = 0; i < 5; ++i) {
                newResult.push(result[i]);
            }
            setHouses(newResult);
        }
        getData();
    }, [startDate, endDate])
    return houses;
}

export default useFetchProfitsHouseReportWithDate;