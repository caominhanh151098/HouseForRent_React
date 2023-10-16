import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";

const useFetchReservationToday = () => {
    const [profits , setProfits] = useState([]);

    useEffect(() => {
        async function getData(){
            const responses = await axios.get(`http://localhost:8080/api/admin/profits/show_all`);
            setProfits(responses.data)
        }

        getData()
    },[])
    return profits;
}

export default useFetchReservationToday;