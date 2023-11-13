import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_ADMIN } from "../../../Services/common";

const useFetchTotalUsersLastMonth = () => {
    const [users , setUsers] = useState([]);
    const date = new Date();
    useEffect(() => {
        async function getData(){

            const responses = await axios.get(API_ADMIN + `users/createdDate?month=${date.getMonth()}&year=${date.getFullYear()}`);
            setUsers(responses.data)
        }
        getData();
    },[])
    return users;
}

export default useFetchTotalUsersLastMonth;