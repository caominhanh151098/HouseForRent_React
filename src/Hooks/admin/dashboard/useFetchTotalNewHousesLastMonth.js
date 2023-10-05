import axios from "axios";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";

const useFetchTotalNewHousesLastMonth = () => {
    const [houses, setHouses] = useState([]);
    const date = new Date();

    useEffect(() => {

        async function getData() {

            const responses = await axios.get(`http://localhost:8080/api/admin/houses/createdDate?month=${date.getMonth()}&year=${date.getFullYear()}`);



            setHouses(responses.data)
        }
        getData();
    }, [])
    return houses;
}

export default useFetchTotalNewHousesLastMonth;