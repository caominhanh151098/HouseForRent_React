import axios from "axios";
import React, { useEffect, useState } from "react";

const useFetchTotalUsersLastMonth = () => {
    const [users , setUsers] = useState([]);
    const date = new Date();
    useEffect(() => {
        async function getData(){

            const responses = await axios.get(`http://localhost:8080/api/admin/users/createdDate?month=${date.getMonth()}&year=${date.getFullYear()}`);
            setUsers(responses.data)
        }
        getData();
    },[])
    return users;
}

export default useFetchTotalUsersLastMonth;