import axios from "axios";
import React, { useEffect, useState } from "react";

const useFetchTotalReservationsLastMonth = () => {
    const [reservations , setReservations] = useState([])
    const date = new Date();
    useEffect(() => {
        async function getData(){

            const responses = await axios.get(`http://localhost:8080/api/admin/profits/reservationDate?month=${date.getMonth()}&year=${date.getFullYear()}`);

            setReservations(responses.data)
        }
        getData();
    },[])
    return reservations;
}

export default useFetchTotalReservationsLastMonth;