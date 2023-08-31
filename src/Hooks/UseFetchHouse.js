import React, {useEffect, useState} from 'react'
import HouseService from '../Services/HouseService'

const UseFetchHouse = () => {
    const [houseList, setHouseList] = useState([])
    useEffect(() => {
        async function getHouseLists(){
            let houseRes = await HouseService.getHouseList();
            setHouseList(houseRes.data)
        }
        getHouseLists
    })
  return houseList;
}

export default UseFetchHouse