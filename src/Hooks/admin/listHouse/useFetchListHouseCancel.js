import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const useFetchListHouseCancel = (search, page, size, nameField, type) => {
    const [houses, setHouses] = useState([]);

    useEffect(() => {
        const getData = async () => {
            await axios.get(`http://localhost:8080/api/admin/houses/cancel?search=${search}&page=${page - 1}&size=${size}&sort=${nameField},${type}`)
                .then(response => {
                    setHouses(response.data);
                }).catch(error => {
                    console.error(error);
                })
                ;
        };

        getData();
    }, [search, page, size, nameField, type])
    return houses;
}

export default useFetchListHouseCancel;