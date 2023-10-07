import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import CreateRoom from '../../service/create_room_usestate';
import Navbar_create_room from '../layout_create_room/Navbar_create_room';
function B1_infor ()  {
    const [guestQuantity  ,setGuestQuantity]=useState(CreateRoom?.getCreateRoom()?.quantityOfGuests||1)
    const [roomQuantity  ,setRoomQuantity]=useState(CreateRoom?.getCreateRoom()?.quantityOfRooms||1)
    const [bedQuantity  ,setBedQuantity]=useState(CreateRoom?.getCreateRoom()?.quantityOfBeds||1)
    const [bathroomQuantity , setBathRoomQuantity]=useState(CreateRoom?.getCreateRoom()?.quantityOfBathrooms||1)
    const handleIncreaseGuest=()=>{
        setGuestQuantity(guestQuantity+1)
    }
    const handledescreaseGuest=()=>{
        if(guestQuantity>1){
            setGuestQuantity(guestQuantity-1)
        }
    }
    const handleIncreaseRoom=()=>{
        setRoomQuantity(roomQuantity+1)
    }
    const handleDescreaseRoom=()=>{
        if(roomQuantity>1){
            setRoomQuantity(roomQuantity-1)
        }
    }
    const handleIncreaseBed=()=>{
        setBedQuantity(bedQuantity+1)
    }
    const handleDescreaseBed=()=>{
        if(bedQuantity>1){
            setBedQuantity(bedQuantity-1)
        }
    }
    const handleIncreaseBathroom=()=>{
        setBathRoomQuantity(bathroomQuantity+1)
    }
    const handleDescreaseBathroom=()=>{
        if(bathroomQuantity>1){
            setBathRoomQuantity(bathroomQuantity-1)
        }
    }
  return (
        <>

        <Navbar_create_room></Navbar_create_room>
        <div className='col-6 '></div>
        <div className='col-5 ' style={{marginLeft:'400px'}}>
            <div className='fs-2' style={{marginBottom:'60px'}}>Hãy bắt đầu từ những điều cơ bản</div>
            <div className='d-flex justify-content-between mb-5'style={{borderBottom:'solid 1px'}} >
                <div className='fs-4 '>Khách</div>
                <div className='d-flex col-6 '>
                   <button style={{width:'32px',height:'32px',borderRadius:'50%',border:'solid 1px'}} className='  me-4 ms-4' onClick={handleIncreaseGuest}>+</button>
                   <p>{guestQuantity}</p>
                   <button style={{width:'32px',height:'32px',borderRadius:'50%',border:'solid 1px'}}  className={` me-4 ms-4 ${guestQuantity==1?'disabled':''}`} onClick={handledescreaseGuest}>-</button>
                </div>
            </div>
            <div className='d-flex justify-content-between mb-5'style={{borderBottom:'solid 1px'}} >
                <div className='fs-4 '>Phòng</div>
                <div className='d-flex col-6 '>
                   <button style={{width:'32px',height:'32px',borderRadius:'50%',border:'solid 1px'}} className='  me-4 ms-4'onClick={handleIncreaseRoom}>+</button>
                   <p>{roomQuantity}</p>
                   <button style={{width:'32px',height:'32px',borderRadius:'50%',border:'solid 1px'}}  className={`  me-4 ms-4 ${roomQuantity==1?'disabled':''}`}onClick={handleDescreaseRoom} >-</button>
                </div>
            </div>
            <div className='d-flex justify-content-between mb-5'style={{borderBottom:'solid 1px'}} >
                <div className='fs-4 '>Giường</div>
                <div className='d-flex col-6 '>
                   <button style={{width:'32px',height:'32px',borderRadius:'50%',border:'solid 1px'}} className='  me-4 ms-4' onClick={handleIncreaseBed}>+</button>
                   <p>{bedQuantity}</p>
                   <button style={{width:'32px',height:'32px',borderRadius:'50%',border:'solid 1px'}} className={`  me-4 ms-4 ${bedQuantity==1?'disabled':''}`}onClick={handleDescreaseBed}>-</button>
                </div>
            </div>
            <div className='d-flex justify-content-between mb-5'style={{borderBottom:'solid 1px'}} >
                <div className='fs-4 '>Phòng tắm</div>
                <div className='d-flex col-6 '>
                   <button style={{width:'32px',height:'32px',borderRadius:'50%',border:'solid 1px'}} className='  me-4 ms-4' onClick={handleIncreaseBathroom}>+</button>
                   <p>{bathroomQuantity}</p>
                   <button style={{width:'32px',height:'32px',borderRadius:'50%',border:'solid 1px'}} className={`  me-4 ms-4 ${bedQuantity==1?'disabled':''}`}onClick={handleDescreaseBathroom}>-</button>
                </div>
            </div>
        </div>
        <div className='fixed-bottom d-flex justify-content-between'>
    <Link className="btn btn-sm ms-5 ms-5 mb-5 fs-5" to={'/host/create/b1/address'}>
                            <i className="fa fa-arrow-left me-2" />
                            quay lại
                        </Link>
                        <div><Link className="" to={'/host/create/second'}> <button onClick={()=>{CreateRoom.setCreateRoom({...CreateRoom.getCreateRoom(), quantityOfGuests:guestQuantity,quantityOfRooms:roomQuantity,quantityOfBeds:bedQuantity,quantityOfBathrooms:bathroomQuantity})}} className='btn bg-dark text-white me-5 mb-5' >Tiếp theo</button></Link></div>
    </div>
        </>
  )
}export default B1_infor
