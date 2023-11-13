import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { API_ADMIN } from './../../../../Services/common';

const useFetchUsersWithDate = (startDate, endDate) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function getData() {
            const responses = await axios.get(API_ADMIN + `users/report?date1=${startDate}&date2=${endDate}`);
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
            setUsers(resultObject);
        }
        getData()
    }, [startDate, endDate])
    return users
}

export default useFetchUsersWithDate;