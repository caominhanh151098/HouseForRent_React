import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import Navbar_create_room from '../layout_create_room/Navbar_create_room';
import CreateRoom from './../../Services/CreateRoomUsestate';

function B3_price() {
    const [price, setPrice] = useState(CreateRoom?.getCreateRoom()?.price || 0);
    return (
        <>
            <Navbar_create_room></Navbar_create_room>
            <div className='text-alight-center col-6' style={{ marginLeft: '300px' }}>
                <div className='fs-4 mb-5'>Bây giờ, hãy đặt mức giá mà bạn muốn   </div>
                <div className='fs-6 mb-4'>Bạn có thể thay đổi giá này bất cứ lúc nào.</div>
                <div>
                    <input value={price} onChange={(e) => { setPrice(e.target.value) }} type="number" className='form-control' placeholder='nhập giá của bạn ($)' />
                </div>
            </div>
            <div className='fixed-bottom d-flex justify-content-between'>
                <Link className="btn btn-sm ms-5 ms-5 mb-5 fs-5" to={'/host/create/b3/booknow'}>
                    <i className="fa fa-arrow-left me-2" />
                    quay lại
                </Link>
                <div><Link className="" to={'/host/create/b3/discount'}> <button onClick={() => { CreateRoom.setCreateRoom({ ...CreateRoom.getCreateRoom(), price: price }) }} className={`btn bg-dark text-white me-5 mb-5 ${price == 0 ? 'disabled' : ''}`} >Tiếp theo</button></Link></div>
            </div>
        </>
    )
} export default B3_price
