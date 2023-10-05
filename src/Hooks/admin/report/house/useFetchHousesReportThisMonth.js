import axios from "axios";
import { format } from "date-fns";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const useFetchHousesReportThisMonth = () => {
    const [houses, setHouses] = useState([])
    const date = new Date();
    const startDate = format(new Date(date.getFullYear(), date.getMonth(), 1), "yyyy-MM-dd")
    const endDate = format(new Date(date.getFullYear(), date.getMonth() + 1, 0), "yyyy-MM-dd")

    useEffect(() => {
        async function getData() {
            const responses = await axios.get(`http://localhost:8080/api/admin/houses/report?date1=${startDate}&date2=${endDate}`);
            const dateCountMap = new Map();

            responses?.data?.forEach(item => {
                const createDate = item.createDate;
                if (dateCountMap.has(createDate)) {
                    dateCountMap.set(createDate, dateCountMap.get(createDate) + 1);
                } else {
                    dateCountMap.set(createDate, 1);
                }
            });

            const dateCountArray = Array.from(dateCountMap);

            dateCountArray.sort((a, b) => {
                const dateA = new Date(a[0]);
                const dateB = new Date(b[0]);
                return dateA - dateB;
            });

            const labels = dateCountArray.map(([date]) => {
                const dateObj = new Date(date);
                return dateObj.getDate();
            });

            const data = dateCountArray.map(([, count]) => count);
            
            const resultObject = {
                label: labels,
                data: data
            };
            setHouses(resultObject);
        }
        getData();
    }, [])
    return houses;
}

export default useFetchHousesReportThisMonth;