import React from 'react'
import "../Book.css"
import "../../../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import { Link } from 'react-router-dom'

const ErrorBookBody = () => {
  return (
    <>
      <div>
        <Link to={'/'}>
          <img style={{ width: '150px', margin: '15px' }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png" alt="" />
        </Link>
        <hr />
        <div className='error-details-exception'>
          <div className='div-icon-error'>
            <i class="fa-solid fa-circle-exclamation fa-beat" style={{ color: "e75213" }}></i>
          </div>
          <div className='div-details-reason-error'>
            <h2>Đã xảy ra lỗi</h2>
            <p style={{ lineHeight: '1.3' }}>Rất tiếc, đã xảy ra lỗi máy chủ khiến yêu cầu của bạn không thể hoàn tất. Có thể là Airbnb đang được bảo trì hoặc yêu cầu của bạn đã hết thời gian. Vui lòng làm mới trang hoặc thử lại.</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ErrorBookBody