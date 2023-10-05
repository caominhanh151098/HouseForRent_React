import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import Navbar_create_room from '../layout_create_room/Navbar_create_room';
function Second  () {
  return (
   <>
    <Navbar_create_room></Navbar_create_room>
        <div className='d-flex'>
            <div className='col-5 ms-5 mt-5'> 
                <p className='fs-5 mb-5'>Bước 2</p>
                <p className='fs-2 mb-5'>Làm cho chỗ ở của bạn trở nên nổi bật</p>
                <p className='mb-5'>Ở bước này, bạn sẽ thêm một số tiện nghi được cung cấp tại chỗ ở của bạn, cùng với 5 bức ảnh trở lên. Sau đó, bạn sẽ soạn tiêu đề và nội dung mô tả.</p>
            </div>
            <div>
                <img className='w-75 p-75' src="https://a0.muscache.com/4ea/air/v2/pictures/4d3a607e-7a32-4f78-bcb0-8841fdac8773.jpg" alt="" />
            </div>
        </div>
        <div className='fixed-bottom d-flex justify-content-between'>
    <Link className="btn btn-sm ms-5 ms-5 mb-5 fs-5" to={'/create/b1/address'}>
                            <i className="fa fa-arrow-left me-2" />
                            quay lại
                        </Link>
                        <div><Link className="" to={'/create/b2/comfortable'}> <button className='btn bg-dark text-white me-5 mb-5' >Tiếp theo</button></Link></div>
    </div>
   </>
  )
}export default Second
