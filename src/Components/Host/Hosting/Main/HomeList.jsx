import React from 'react'

import { useState, useEffect } from 'react';
import axios from "axios"
import { Link } from 'react-router-dom';
import NavbarHosting from './../../LayoutHosting/NavbarHosting';
import { API_HOST } from '../../../../Services/common';

function HomeList() {
  const [houseList, setHouseList] = useState([])
  useEffect(() => {
    async function getData() {
      let res = await axios.get(API_HOST + "house/houseOfHost", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("jwt")}`
        }
      });
      setHouseList(res.data)
    }
    getData();

  }, [])

  const handleShowDetailHouseOfHost = () => {

  }
  function daoNguocMang(arr) {
    var newArr = [];
    for (var i = arr.length - 1; i >= 0; i--) {
      newArr.push(arr[i]);
    }
    return newArr;
  }

  return (
    <>
      <NavbarHosting></NavbarHosting>
      <div className='ms-5 ms-4 col-11'>
        <table className="table">
          <thead>
            <tr>
              <th className='' scope="col">Nhà/Phòng cho thuê</th>
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
              daoNguocMang(houseList).map((item) => (
                <tr key={item.id}>
                  <th className='pt-4' scope="row"><Link style={{ textDecoration: 'none', color: 'black', verticalAlign: 'center' }} to={`/host/houseOfHostDetail/${item.id}`}>{item.hotelName}</Link></th>
                  <td className='td-homelist'><img style={{ width: '100px', height: '70px', borderRadius: '7px' }} src={item.images[0].srcImg} alt="" /></td>
                  <td className='td-homelist' style={{ verticalAlign: 'middle' }}>{item.status}</td>
                  <td className='td-homelist'>{item.bookNow == "true" ? 'Bật' : 'Tắt'}</td>
                  <td className='td-homelist'>{item.quantityOfRooms}</td>
                  <td className='td-homelist'>{item.quantityOfBeds}</td>
                  <td className='td-homelist'>{item.quantityOfBathrooms}</td>
                  <td className='td-homelist'>{item.location?.address}</td>
                </tr>)

              )
            }


          </tbody>
        </table>
      </div>
    </>
  )
} export default HomeList
