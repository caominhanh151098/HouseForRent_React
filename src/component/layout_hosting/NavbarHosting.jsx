import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import CreateRoom from '../../service/create_room_usestate';
import HomeList from './../hosting/main/HomeList';

import 'bootstrap/dist/js/bootstrap.min.js';
import './navbarHosting.css';
import { useState } from 'react';
function NavbarHosting(props) {
  const [choose, setChoose] = useState(props.type)
  return (
    <div className='pt-3'>
      <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 mx-4 border-bottom">
        <Link to={'/'}>
          <img
            className="img-header"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png"
            alt=""
          />
        </Link>
        <div className='d-flex justify-content-between col-5 ' style={{ marginLeft: '220px' }}>
          <Link className={`item btn-nb fw-bold ${choose == "bookedToday" ? "choosed" : ""} `} to={'/host/BookedToday'}><div className='item' onClick={() => setChoose("bookedToday")}> Hôm nay</div> </Link>
          <Link className={`item btn-nb fw-bold ${choose == "message" ? "choosed" : ""} `}><div  onClick={() => setChoose("message")} className='item'>Hộp thư đến</div></Link>
          <Link className={`item btn-nb fw-bold ${choose == "calendar" ? "choosed" : ""} `} to={'/host/calendar'}><div  className='item' onClick={() => setChoose("calendar")}> Lịch</div> </Link>
          <Link className={`item btn-nb fw-bold ${choose == "revenueHost" ? "choosed" : ""} `} to={'/host/revenueHost'}><div  className='item' onClick={() => setChoose("revenueHost")}>Lịch sử giao dich</div> </Link>
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
              Menu
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li><Link className="dropdown-item" to={"/host/firstCreateRoom"}>Tạo mục cho thuê mới</Link></li>
              <li><Link className="dropdown-item" to={"/host/homeList"}>Nhà / Phòng cho thuê</Link></li>
              <li><Link className="dropdown-item" to={"/host/reviews"}>Đánh giá của khách hàng</Link></li>            </ul>
          </div>
        </div>
        <div style={{ marginLeft: "300px" }}>
          <img style={{ width: '45px', height: '45px', borderRadius: '50%' }} src="https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA=" alt="" />
        </div>
      </div>
    </div>
  )
} export default NavbarHosting
