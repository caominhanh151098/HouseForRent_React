import React, { useEffect, useState } from 'react'
import HouseService from '../Services/HouseService'

const UseFetchHouse = () => {
    const [loading, setLoading] = useState(true);
    const [houseList, setHouseList] = useState([])
    useEffect(() => {
        async function getHouseLists() {
            try {
                let houseRes = await HouseService.getHouseList();
                setHouseList(houseRes.data.content)
                console.log('ren')
            } catch (error) {
                console.log('Error fetching house list:', error);
            } finally {
                setLoading(false);
            }
        }
        getHouseLists();
    }, [])
    return { houseList, loading };
}

export default UseFetchHouse