import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useState ,useEffect } from 'react';
import Navbar_create_room from './../LayoutCreateRoom/Navbar_create_room';
import CreateRoom from './../../../Services/CreateRoom';

 function B1_ChooseTypeRoom  ()  {
  
  const [roomType,setRoomType]=useState(CreateRoom?.getCreateRoom()?.typeRoom||'')
  const handleChooseRoomType=(roomType)=>{
    setRoomType(roomType)
  }
  const handleLog=()=>{
    console.log(CreateRoom.getCreateRoom());
  }


  return (
    <>
    <Navbar_create_room></Navbar_create_room>
   {/* <button onClick={handleLog}> log</button> */}
   <div className='col-6 ' style={{marginLeft:'100px'}} >
        <div className='fs-4'>Khách sẽ được sử dụng loại chỗ ở nào?</div>
        <div className='d-flex'>
        <div className='me-5 ms-5'>
        <div className={`card mb-5 mt-5 ${roomType==="ENTIRE_PLACE"?'dark':''}`} style={{width: '18rem', height: '12rem'}}>
        <div className={`card-body row `} onClick={()=>{handleChooseRoomType("ENTIRE_PLACE")}} >
            <div>
          <h6 className=" mb-2 text-muted">Toàn Bộ nhà</h6>
          <p>Khách được sử dụng riêng toàn bộ chỗ ở này</p>
          </div>
          <div>
          <i className="fa-solid fa-door-open fs-2"></i>
          </div>
        </div>
        </div>
        
      </div>
      <div className='me-5 ms-5'>
        <div className={`card mb-5 mt-5 ${roomType==="ROOM"?'dark':''}`} style={{width: '18rem', height: '12rem'}}>
        <div className={`card-body row `} onClick={()=>{handleChooseRoomType("ROOM")}}>
            <div>
          <h6 className=" mb-2 text-muted">Một căn phòng</h6>
          <p>Khách sẽ được có phòng riêng trong một ngôi nhà và được sử dụng khu vực chung</p>
          </div>
          <div>
          <i className="fa-solid fa-house-chimney-window fs-2"></i>
          </div>
        </div>
        </div>
        
      </div>
      <div className='me-5 ms-5'>
        <div className={`card mb-5 mt-5 ${roomType==="SHARED_ROOM"?'dark':''}`} style={{width: '18rem', height: '12rem'}}>
        <div className={`card-body row`} onClick={()=>{handleChooseRoomType("SHARED_ROOM")}}>
            <div>
          <h6 className=" mb-2 text-muted">Phòng chung</h6>
          <p>Khách ngủ trong một phòng hoặc khu vực chung - nơi bạn và người khác có thể cùng sử dụng</p>
          </div>
          <div>
          <i className="fa-solid fa-building-user fs-2"></i>
          </div>
        </div>
        </div>
        
      </div>
      </div>
   </div>
   <div className='fixed-bottom d-flex justify-content-between'>
    <Link className="btn btn-sm ms-5 ms-5 mb-5 fs-5" to={'/host/create/b1/chooseType'}>
                            <i className="fa fa-arrow-left me-2" />
                            quay lại
                        </Link>
                        <div><Link className="" to={'/host/create/b1/address '}> <button onClick={()=>{CreateRoom.setCreateRoom({...CreateRoom.getCreateRoom(), typeRoom:roomType})}} className={`btn bg-dark text-white me-5 mb-5 ${roomType==''?'disabled':''}`} >Tiếp theo</button></Link></div>
    </div>
   </>
  )
}export default B1_ChooseTypeRoom
