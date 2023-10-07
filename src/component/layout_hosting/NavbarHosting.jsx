import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import CreateRoom from '../../service/create_room_usestate';
import HomeList from './../hosting/main/HomeList';

function NavbarHosting() {
  return (
    <div>
      <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
        <Link to={"/"} className="d-flex align-items-center text-dark text-decoration-none">
          <svg xmlns="http://www.w3.org/2000/svg" width={40} height={32} className="me-2" viewBox="0 0 118 94" role="img"><title>Bootstrap</title><path fillRule="evenodd" clipRule="evenodd" d="M24.509 0c-6.733 0-11.715 5.893-11.492 12.284.214 6.14-.064 14.092-2.066 20.577C8.943 39.365 5.547 43.485 0 44.014v5.972c5.547.529 8.943 4.649 10.951 11.153 2.002 6.485 2.28 14.437 2.066 20.577C12.794 88.106 17.776 94 24.51 94H93.5c6.733 0 11.714-5.893 11.491-12.284-.214-6.14.064-14.092 2.066-20.577 2.009-6.504 5.396-10.624 10.943-11.153v-5.972c-5.547-.529-8.934-4.649-10.943-11.153-2.002-6.484-2.28-14.437-2.066-20.577C105.214 5.894 100.233 0 93.5 0H24.508zM80 57.863C80 66.663 73.436 72 62.543 72H44a2 2 0 01-2-2V24a2 2 0 012-2h18.437c9.083 0 15.044 4.92 15.044 12.474 0 5.302-4.01 10.049-9.119 10.88v.277C75.317 46.394 80 51.21 80 57.863zM60.521 28.34H49.948v14.934h8.905c6.884 0 10.68-2.772 10.68-7.727 0-4.643-3.264-7.207-9.012-7.207zM49.948 49.2v16.458H60.91c7.167 0 10.964-2.876 10.964-8.281 0-5.406-3.903-8.178-11.425-8.178H49.948z" fill="currentColor" /></svg>
          <span className="fs-4">Air BNB</span>
        </Link>
        <div className='d-flex justify-content-between col-5 ' style={{ marginLeft: '220px' }}>
          <Link className="" to={'/host/BookedToday'}><div> Hôm nay</div> </Link>
          <div>Hộp thư đến</div>
          <Link className="" to={'/host/calendar'}><div> Lịch</div> </Link>
          <Link className="" to={'/host/revenueHost'}><div>Lịch sử giao dich</div> </Link>
          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
              Menu
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li><Link class="dropdown-item" to={"/host/firstCreateRoom"}>Tạo mục cho thuê mới</Link></li>
              <li><Link class="dropdown-item" to={"/host/homeList"}>Nhà / Phòng cho thuê</Link></li>
              <li><Link class="dropdown-item" to={"/host/reviews"}>Đánh giá của khách hàng</Link></li>            </ul>
          </div>
        </div>
        <div style={{ marginLeft: "300px" }}>
          <img style={{ width: '45px', height: '45px', borderRadius: '50%' }} src="https://media.istockphoto.com/id/1016744004/vector/profile-placeholder-image-gray-silhouette-no-photo.jpg?s=612x612&w=0&k=20&c=mB6A9idhtEtsFXphs1WVwW_iPBt37S2kJp6VpPhFeoA=" alt="" />
        </div>
      </div>
    </div>
  )
} export default NavbarHosting
