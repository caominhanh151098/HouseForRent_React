import React from 'react'

import { useState ,useEffect} from 'react';
import axios from "axios"
import { Link } from 'react-router-dom';
import NavbarHosting from './../../layout_hosting/NavbarHosting';

function HomeList () {
    const [houseList,setHouseList]=useState([])
    useEffect(() => {
        async function getData() {
            let res = await axios.get("http://localhost:8080/api/host/house/houseOfHost",{ headers: {
              'Authorization': `Bearer ${localStorage.getItem("jwt")}`
          }});
            setHouseList(res.data)
        }
        getData();

    }, [])
    const handleLog =()=>{
        console.log(houseList);
    }
    const handleShowDetailHouseOfHost=()=>{

    }
   
  return (
    <>
        <NavbarHosting></NavbarHosting>
        <div className='ms-5 ms-4 col-11'>
        <table className="table">
  <thead>
    <tr>
      <th  className='' scope="col">Nhà/Phòng cho thuê</th>
      <th className='td-homelist' scope="col"></th>
      <th className='td-homelist' scope="col"> Trạng thái</th>
      <th className='td-homelist' scope="col">Đặt ngay</th>
      <th className='td-homelist' scope="col">Phòng ngủ</th>
      <th className='td-homelist' scope="col">Giường</th>
      <th className='td-homelist' scope="col">Phòng tắm</th>
      <th className='td-homelist' scope="col">Vị trí</th>
  
    </tr>
  </thead>
  <tbody>
    {
        houseList.map((item)=>(
          <tr key={item.id}>
               <th className='' scope="row"><Link style={{textDecoration :'none',color:'black'}} to={`/houseOfHostDetail/${item.id}`}>{item.hotelName}</Link></th>
            <td className='td-homelist'><img style={{width: '100px',height:'70px',borderRadius:'7px'}} src={item.images[0].srcImg} alt="" /></td>
            <td className='td-homelist' style={{verticalAlign:'middle'}}>{item.status}</td>
            <td className='td-homelist'>{item.bookNow=="true"?'Bật':'Tắt'}</td>
            <td className='td-homelist'>{item.quantityOfRooms}</td>
            <td className='td-homelist'>{item.quantityOfBeds}</td>
            <td className='td-homelist'>{item.quantityOfBathrooms}</td>
            <td  className='td-homelist'>{item.location?.address}</td>
          </tr> )
           
        )
    }
    
    
  </tbody>
</table>
</div>
    </>
  )
}export default HomeList
