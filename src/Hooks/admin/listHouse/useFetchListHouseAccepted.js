import axios from "axios";
import React, { useEffect, useState } from "react";

const useFetchListHouseAccepted = (page , size) => {
    const [houses , setHouses] = useState([]);
    useEffect(() => {
        async function getData(){
            const responses = await axios.get(`http://localhost:8080/api/admin/houses/accepted?page=${page - 1}&size=${size}`);
            setHouses(responses.data);
        }
        getData()
    },[page , size])
    return houses;
}

export default useFetchListHouseAccepted;