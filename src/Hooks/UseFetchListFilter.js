import React from 'react'
import { useEffect, useState } from 'react'
import ListFilterService from '../Services/ListFilterService'

const UseFetchListFilter = () => {
    const [listFilter, setListFilter] = useState([])
    useEffect(() => {
        async function getListFilter(){
            try{
                let listRes = await ListFilterService.getListFilter();
                setListFilter(listRes.data);
            } catch (error){
                console.log('Error fetching list filter:', error);
            }
        }
        getListFilter();
    }, [])
  return listFilter
}

export default UseFetchListFilter