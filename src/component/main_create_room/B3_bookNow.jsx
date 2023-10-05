import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import CreateRoom from '../../service/create_room_usestate';
import Navbar_create_room from '../layout_create_room/Navbar_create_room';
function B3_bookNow ()  {
  const [bookNow, setBookNow]=useState(CreateRoom?.getCreateRoom()?.bookNow||false)
  
  return (
    
    <>
    <Navbar_create_room></Navbar_create_room>
        <div>
            <div className='fs-3' style={{marginLeft:'300px'}}>Quyết định cách thức xác nhận đặt phòng</div>
            <div className='d-flex' style={{marginLeft:'200px'}}>
            <div className='me-5 ms-5'>
        <div className={`card mb-5 mt-5 ${bookNow==false?'dark':''}` } style={{width: '18rem'}}>
        <div onClick={()=>{setBookNow(false)}} className={`card-body row ` }>
            <div>
          <h6 className=" mb-2 text-muted">Sử dụng tính năng đặt ngay</h6>
          <p className='fs-5'>Khách có thể đặt phòng tự động</p>
       

          </div>
          <div>
          <i className="fa-solid fa-bolt fs-2"></i>
          </div>
        </div>
        </div>
        </div>
        <div className='me-5 ms-5'>
        <div className={`card mb-5 mt-5 ${bookNow==true?'dark':''}` } style={{width: '18rem'}}>
        <div onClick={()=>{setBookNow(true)}} className={`card-body row`}>
            <div>
          <h6 className=" mb-2 text-muted">Chấp thuận hoặc từ chối yêu cầu</h6>
          <p className='fs-5'>Khách phải hỏi xem họ có thể  được đặt phòng không    </p>
       

          </div>
          <div>
          <i className="fa-regular fa-comments fs-2"></i>
          </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        <div className='fixed-bottom d-flex justify-content-between'>
    <Link className="btn btn-sm ms-5 ms-5 mb-5 fs-5" to={'/create/third'}>
                            <i className="fa fa-arrow-left me-2" />
                            quay lại
                        </Link>
                        <div><Link className="" to={'/create/b3/price'}> <button onClick={()=>{CreateRoom.setCreateRoom({...CreateRoom.getCreateRoom(), bookNow:bookNow})}} className='btn bg-dark text-white me-5 mb-5' >Tiếp theo</button></Link></div>
    </div>
    </>
  )
}export default B3_bookNow
