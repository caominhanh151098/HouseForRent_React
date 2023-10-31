import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import Navbar_create_room from '../layout_create_room/Navbar_create_room';
import CreateRoom from './../../Services/CreateRoomUsestate';

function B2_description  () {
  const [description,setDescription]=useState(CreateRoom?.getCreateRoom()?.descriptions||'')
  return (
    <>     
       <Navbar_create_room></Navbar_create_room>
        <div className='col-7 ' style={{marginLeft:'300px'}}>
            <div className='fs-2 mb-3'>Tạo phần mô tả</div>
            <div className='fs-5 mb-3'>Chia sẻ những điều tạo nên nét đặc biệt cho chỗ ở của bạn.</div>
            <div>
                <textarea value={description} onChange={(e)=>{setDescription(e.target.value)}} className='col-10' style={{height:'150px', width:'720px'}}>

                </textarea>
            </div>
        </div>
        <div className='fixed-bottom d-flex justify-content-between'>
    <Link className="btn btn-sm ms-5 ms-5 mb-5 fs-5" to={'/host/create/b2/title'}>
                            <i className="fa fa-arrow-left me-2" />
                            quay lại
                        </Link>
                        <div><Link className="" to={'/host/create/third'}> <button onClick={()=>{CreateRoom.setCreateRoom({...CreateRoom.getCreateRoom(), descriptions:description})}} className={`btn bg-dark text-white me-5 mb-5 ${description==''?'disabled':''}`} >Tiếp theo</button></Link></div>
    </div>
    </>
  )
}export default B2_description
