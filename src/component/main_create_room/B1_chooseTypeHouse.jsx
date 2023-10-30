import React from 'react'
import { useState ,useEffect} from 'react';
import { Link, useNavigate } from "react-router-dom";
import CreateRoom from '../../service/create_room_usestate';
import { typeRoomList } from '../../Services/typeRoomList';
import Navbar_create_room from '../layout_create_room/Navbar_create_room';
import "./create_room.css"
function B1_chooseType  () {
    const [type,setType]=useState(CreateRoom?.getCreateRoom()?.categoryHotel||'')
    const handleLog=()=>{
      console.log(type);
    }
    const handleChooseType =(id)=>{
        setType(id)
    }

    

   
  return (
    <>
    <Navbar_create_room></Navbar_create_room>
     {/* <button onClick={handleLog}> log</button> */}
    <div style={{marginLeft:'350px'}} >
        <div>
            <p className='fs-2'>Điều nào sau đây mô tả chính xác nhất về chỗ ở của bạn?</p>
        </div>
        <div className=' d-flex col-7 flex-wrap'>
         {
          typeRoomList.map((item)=>(
            <div key={item.id} className={`card mb-3  me-3 ms-3 ${item.id==type?'dark':''}`} style={{width: '10rem'}}>
            <div className="card-body row" onClick={()=>{handleChooseType(item.id)}}>
                <img style={{width:'50px',height:'40px'}} src={item.icon} ></img>
                <h6 className=" mb-2 text-muted">{item.name} </h6>
            </div>
        </div>
 
          ))
         }           
       
                </div>
    </div>
    <div className='fixed-bottom d-flex justify-content-between'>
    <Link className="btn btn-sm ms-5 ms-5 mb-5 fs-5" to={'/host/create/b1/shareAdd'}>
                            <i className="fa fa-arrow-left me-2" />
                            quay lại
                        </Link>
                        <div><Link className="" to={'/host/create/b1/chooseTypeRoom'}> <button onClick={()=>{CreateRoom.setCreateRoom({...CreateRoom.getCreateRoom(), categoryHotel:type})}} className={`btn bg-dark text-white me-5 mb-5 ${type==''?'disabled':''}`} >Tiếp theo</button></Link></div>
    </div>
    </>
  )
}export default B1_chooseType
