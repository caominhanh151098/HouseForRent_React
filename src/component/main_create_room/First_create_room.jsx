import React from 'react'
import { Link, useNavigate } from "react-router-dom";
function First_create_room() {
  return (
    <>
      <div className='container d-flex'>
        <div className='col-6 fs-1 text-alight-center'>Bắt đầu trên Airbnb thật dễ dàng</div>
        <div className='col-6'>
          <div className='mb-5 mt-5'>
          <div className='d-flex'>

            <div className='col-8 border-dark'  >
              <p className='fs-4'>1
                Chia sẻ thông tin về chỗ ở của bạn cho chúng tôi</p>
              <span>Chia sẻ một số thông tin cơ bản, như vị trí của nhà/phòng cho thuê và số lượng khách có thể ở tại đó</span>
            </div>
            <div className='col-4'>
                <img className='w-75 p-75' src='https://a0.muscache.com/4ea/air/v2/pictures/da2e1a40-a92b-449e-8575-d8208cc5d409.jpg'></img>
            </div>
          </div>
          <div className='d-flex'>

            <div className='col-8'>
              <p className='fs-4'>2
Làm cho nhà/phòng cho thuê trở nên nổi bật</p>
              <span>Thêm từ 5 ảnh trở lên cùng với tiêu đề và nội dung mô tả – chúng tôi sẽ giúp bạn thực hiện.</span>
            </div>
            <div className='col-4'>
                <img className='w-75 p-75' src='https://a0.muscache.com/4ea/air/v2/pictures/bfc0bc89-58cb-4525-a26e-7b23b750ee00.jpg'></img>
            </div>
          </div>
          <div className='d-flex'>

            <div className='col-8'>
              <p className='fs-4'>3
Hoàn thiện và đăng mục cho thuê</p>
              <span>Lựa chọn xem bạn muốn bắt đầu với việc đón tiếp khách có kinh nghiệm, chọn giá khởi điểm hay đăng mục cho thuê.</span>
            </div>
            <div className='col-4'>
                <img className='w-75 p-75' src='https://a0.muscache.com/4ea/air/v2/pictures/c0634c73-9109-4710-8968-3e927df1191c.jpg'></img>
            </div>
          </div>
          </div>
        </div>
      </div>
      <div className='fixed-bottom d-flex justify-content-between'>
     <div></div>
        <div><Link className="" to={'/create/b1/shareAdd'}> <button className='btn bg-dark text-white me-5 mb-5' >Tiếp theo</button></Link></div>
    </div>
    </>
  )
} export default First_create_room
