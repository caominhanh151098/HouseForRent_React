import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_ADMIN } from './../../../Services/common';

const useFetchTotalReservationsLastMonth = () => {
    const [reservations , setReservations] = useState([])
    const date = new Date();
    useEffect(() => {
        async function getData(){

            const responses = await axios.get(API_ADMIN + `profits/reservationDate?month=${date.getMonth()}&year=${date.getFullYear()}`);

            setReservations(responses.data)
        }
        getData();
    },[])
    return reservations;
}

export default useFetchTotalReservationsLastMonth;