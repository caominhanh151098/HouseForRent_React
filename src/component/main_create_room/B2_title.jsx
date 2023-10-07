import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import CreateRoom from '../../service/create_room_usestate';
import Navbar_create_room from '../layout_create_room/Navbar_create_room';
function B2_title() {
    const [title,setTitle]=useState(CreateRoom?.getCreateRoom()?.hotelName||'');
    const handlelog =()=>{
        console.log(CreateRoom.getCreateRoom());
    }
  return (
   <>     
       <Navbar_create_room></Navbar_create_room>
        <div className='col-7  ' style={{marginLeft:'300px'}}>
            <div className='fs-3 mb-3'>Bây giờ, hãy đặt tiêu đề cho chỗ ở thuộc danh mục nhà của bạn</div>
            <div className='fs-5 mb-3'>Tiêu đề ngắn cho hiệu quả tốt nhất. Đừng lo lắng, bạn luôn có thể thay đổi tiêu đề sau.</div>
            <div>
                <textarea value={title} onChange={(e)=>{setTitle(e.target.value)}} className='col-10' placeholder='Nhập tên ' style={{height:'150px', width:'750px'}}>

                </textarea>
            </div>
        </div>
        <div className='fixed-bottom d-flex justify-content-between'>
    <Link className="btn btn-sm ms-5 ms-5 mb-5 fs-5" to={'/host/create/b2/uploadImage'}>
                            <i className="fa fa-arrow-left me-2" />
                            quay lại
                        </Link>
                        <div><Link className="" to={'/host/create/b2/description'}> <button onClick={()=>{CreateRoom.setCreateRoom({...CreateRoom.getCreateRoom(), hotelName:title})}} className={`btn bg-dark text-white me-5 mb-5 ${title==''?'disabled':''}`}  >Tiếp theo</button></Link></div>
    </div>
   </>
  )
}export default B2_title
