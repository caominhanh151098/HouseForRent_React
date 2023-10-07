    import React from 'react'
    import { Link, useNavigate } from "react-router-dom";
import Navbar_create_room from '../layout_create_room/Navbar_create_room';
   function Third  () {
      return (
        <>
        <Navbar_create_room></Navbar_create_room>
        <div className='d-flex'>
            <div className='col-5 ms-5 mt-5'> 
                <p className='fs-5 mb-5'>Bước 3</p>
                <p className='fs-2 mb-5'>Hoàn thiện và đăng</p>
                <p className='mb-5'>Cuối cùng, bạn sẽ chọn cài đặt đặt phòng, thiết lập giá và đăng mục cho thuê.</p>
            </div>
            <div>
                <img className='w-75 p-75' src="https://a0.muscache.com/4ea/air/v2/pictures/d7cb2e2b-f9b5-44e1-b510-44eaaf67889b.jpg" alt="" />
            </div>
        </div>
        <div className='fixed-bottom d-flex justify-content-between'>
    <Link className="btn btn-sm ms-5 ms-5 mb-5 fs-5" to={'/create/b2/description'}>
                            <i className="fa fa-arrow-left me-2" />
                            quay lại
                        </Link>
                        <div><Link className="" to={'/create/b3/booknow'}> <button className='btn bg-dark text-white me-5 mb-5' >Tiếp theo</button></Link></div>
    </div>
   </>
      )
    }export default Third
    