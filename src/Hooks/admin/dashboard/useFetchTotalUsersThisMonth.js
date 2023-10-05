import axios from "axios";
import React, { useEffect, useState } from "react";
import { get } from "react-hook-form";

function useFetchTotalUsersThisMonth() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        async function getData() {
            const date = new Date();
            const responses = await axios.get(`http://localhost:8080/api/admin/users/createdDate?month=${date.getMonth() + 1}&year=${date.getFullYear()}`);
            const dateCountMap = new Map();

            responses?.data?.forEach(item => {
                const createDate = item.createDate;
                if (dateCountMap.has(createDate)) {
                    dateCountMap.set(createDate, dateCountMap.get(createDate) + 1);
                } else {
                    dateCountMap.set(createDate, 1);
                }
            });

            const resultData = Array.from(dateCountMap.entries()).map(([date, count]) => {
                const x = new Date(date).getDate();
                const y = count;

                return { x , y , markerType: "none"}
            });

            resultData.sort((a , b) => new Date(a.x) - new Date(b.x))

            const responseData = [
                {
                    type: "line",
                    toolTipContent: "Day {x}: {y}",
                    dataPoints: [
                        ...resultData
                    ]
                }
            ]

            setUsers(responseData);
        }
        getData();
    },[])
    return users;
}

export default useFetchTotalUsersThisMonth;