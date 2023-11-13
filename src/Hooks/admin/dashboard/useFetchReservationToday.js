import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { API_ADMIN } from './../../../Services/common';

const useFetchReservationToday = () => {
    const [profits , setProfits] = useState([]);

    useEffect(() => {
        async function getData(){
            const responses = await axios.get(API_ADMIN + `profits/show_all`);
            setProfits(responses.data)
        }

        getData()
    },[])
    return profits;
}

export default useFetchReservationToday;