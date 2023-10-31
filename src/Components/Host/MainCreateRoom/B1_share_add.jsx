import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import Navbar_create_room from './../LayoutCreateRoom/Navbar_create_room';
function B1_share_add () {
  return (
    <>
    <Navbar_create_room></Navbar_create_room>
    <div className='me-5 ms-5 col-6'>
        <p className='fs-4 mb-5 mt-5'>Bước 1</p>
        <p className='fs-1 mb-5 mt-5'>Chia sẻ thông tin về chỗ ở của bạn cho chúng tôi</p>
        <p className='fs-6 mb-5 mt-5'>Trong bước này, chúng tôi sẽ hỏi xem bạn cho thuê loại chỗ ở nào và bạn muốn cho khách đặt toàn bộ nhà hay chỉ một phòng cụ thể. Sau đó, hãy cho chúng tôi biết vị trí và số lượng khách có thể ở tại đó.</p>
    </div>
    <div className='fixed-bottom d-flex justify-content-between'>
    <Link className="btn btn-sm ms-5 ms-5 mb-5 fs-5" to={'/'}>
                            <i className="fa fa-arrow-left me-2" />
                            quay lại
                        </Link>
                        <div><Link className="" to={'/host/create/b1/chooseType'}> <button className='btn bg-dark text-white me-5 mb-5' >Tiếp theo</button></Link></div>
    </div>
    </>
  )
}export default B1_share_add
