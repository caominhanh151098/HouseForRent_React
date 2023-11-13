import axios from "axios";
import { format } from "date-fns";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { API_ADMIN } from "../../../../Services/common";

const useFetchProfitsHouseReportLastMonth = () => {
    const [houses, setHouses] = useState([]);
    const date = new Date();
    const startDate = format(new Date(date.getFullYear(), date.getMonth() - 1, 1), "yyyy-MM-dd")
    const endDate = format(new Date(date.getFullYear(), date.getMonth(), 0), "yyyy-MM-dd")

    useEffect(() => {
        async function getData() {
            const responses = await axios.get(API_ADMIN + `profits/houses?date1=${startDate}&date2=${endDate}`);
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
    }, [])
    return houses;
}

export default useFetchProfitsHouseReportLastMonth;