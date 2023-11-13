import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_ADMIN } from "../../../Services/common";

const useFetchListHouseAccepted = (page , size) => {
    const [houses , setHouses] = useState([]);
    useEffect(() => {
        async function getData(){
            const responses = await axios.get(API_ADMIN + `houses/accepted?page=${page - 1}&size=${size}`);
            setHouses(responses.data);
        }
        getData()
    },[page , size])
    return houses;
}

export default useFetchListHouseAccepted;