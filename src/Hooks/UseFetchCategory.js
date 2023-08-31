import React, { useEffect, useState } from 'react'
import CategoryService from '../Services/CategoryService';

const UseFetchCategory = () => {
    const [categories, setCategories] = useState([])
    useEffect(() => {
        async function getCategories(){
            let cateRes = await CategoryService.getCategoriesList();
            setCategories(cateRes.data)
        }
        getCategories();
    }, [])
  return categories;
}

export default UseFetchCategory