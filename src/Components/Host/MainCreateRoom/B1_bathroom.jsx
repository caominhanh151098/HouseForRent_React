import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import Navbar_create_room from './../LayoutCreateRoom/Navbar_create_room';

function B1_bathroom  ()  {
  return (
    <>
    <Navbar_create_room></Navbar_create_room>
        <div className='col-6 '></div>
        <div className='col-5 ' style={{marginLeft:'400px'}}>
            <div className='fs-2' style={{marginBottom:'60px'}}>Khách có thể sử dụng loại phòng tắm nào</div>
            <div className='d-flex justify-content-between mb-5'style={{borderBottom:'solid 1px'}} >
                <div className='fs-4 '>Riêng và khép kín</div>
                <div className='d-flex col-6 '>
                   <button className='rounded  me-4 ms-4'>+</button>
                   <p>1</p>
                   <button  className='rounded  me-4 ms-4'>-</button>
                </div>
            </div>
            <div className='d-flex justify-content-between mb-5'style={{borderBottom:'solid 1px'}} >
                <div className='fs-4 '>Riêng</div>
                <div className='d-flex col-6 '>
                   <button className='rounded  me-4 ms-4'>+</button>
                   <p>1</p>
                   <button  className='rounded  me-4 ms-4'>-</button>
                </div>
            </div>
            <div className='d-flex justify-content-between mb-5'style={{borderBottom:'solid 1px'}} >
                <div className='fs-4 '>Chung</div>
                <div className='d-flex col-6 '>
                   <button className='rounded  me-4 ms-4'>+</button>
                   <p>1</p>
                   <button  className='rounded  me-4 ms-4'>-</button>
                </div>
            </div>
        </div>
        <div className='fixed-bottom d-flex justify-content-between'>
    <Link className="btn btn-sm ms-5 ms-5 mb-5 fs-5" to={'/host/create/b1/infor'}>
                            <i className="fa fa-arrow-left me-2" />
                            quay lại
                        </Link>
                        <div><Link className="" to={'/host/create/second'}> <button className='btn bg-dark text-white me-5 mb-5' >Tiếp theo</button></Link></div>
    </div>
        </>
  )
}export default B1_bathroom
