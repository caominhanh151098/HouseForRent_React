import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import Navbar_create_room from './../LayoutCreateRoom/Navbar_create_room';

function Third() {
    return (
        <>
            <Navbar_create_room></Navbar_create_room>
            <div className='d-flex'>
                <div className='col-6 ms-5 mt-5'>
                    <p className='fs-5 mb-5'>Bước 3</p>
                    <p className='fs-2 mb-5'>Hoàn thiện và đăng</p>
                    <p className='mb-5'>Cuối cùng, bạn sẽ chọn cài đặt đặt phòng, thiết lập giá và đăng mục cho thuê.</p>
                </div>
                <div className='col-4'>
                    <video autoPlay className='m-4 w-100' src='https://res.cloudinary.com/didieklbo/video/upload/f_auto:video,q_auto/v1/Gif/aewep3a0nq7mfcsbcnwg'></video>
                </div>
            </div>
            <div className='fixed-bottom d-flex justify-content-between'>
                <Link className="btn btn-sm ms-5 ms-5 mb-5 fs-5" to={'/host/create/b2/description'}>
                    <i className="fa fa-arrow-left me-2" />
                    quay lại
                </Link>
                <div><Link className="" to={'/host/create/b3/booknow'}> <button className='btn bg-dark text-white me-5 mb-5' >Tiếp theo</button></Link></div>
            </div>
        </>
    )
} export default Third
