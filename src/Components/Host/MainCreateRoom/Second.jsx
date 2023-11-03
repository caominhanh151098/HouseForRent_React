import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import Navbar_create_room from './../LayoutCreateRoom/Navbar_create_room';

function Second() {
    return (
        <>
            <Navbar_create_room></Navbar_create_room>
            <div className='d-flex'>
                <div className='col-6 ms-5 mt-5'>
                    <p className='fs-5 mb-5'>Bước 2</p>
                    <p className='fs-2 mb-5'>Làm cho chỗ ở của bạn trở nên nổi bật</p>
                    <p className='mb-5'>Ở bước này, bạn sẽ thêm một số tiện nghi được cung cấp tại chỗ ở của bạn, cùng với 5 bức ảnh trở lên. Sau đó, bạn sẽ soạn tiêu đề và nội dung mô tả.</p>
                </div>
                <div className='col-4'>
                    <video autoPlay className='m-4 w-100' src='https://res.cloudinary.com/didieklbo/video/upload/f_auto:video,q_auto/v1/Gif/jyqfakyde0c9rj7enieh'></video>
                </div>
            </div>
            <div className='fixed-bottom d-flex justify-content-between'>
                <Link className="btn btn-sm ms-5 ms-5 mb-5 fs-5" to={'/host/create/b1/address'}>
                    <i className="fa fa-arrow-left me-2" />
                    quay lại
                </Link>
                <div><Link className="" to={'/host/create/b2/comfortable'}> <button className='btn bg-dark text-white me-5 mb-5' >Tiếp theo</button></Link></div>
            </div>
        </>
    )
} export default Second
