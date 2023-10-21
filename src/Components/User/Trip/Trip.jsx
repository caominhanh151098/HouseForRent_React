import React from 'react'
import HeaderFormUser from '../HeaderFormUser'
import "../User.css"
import { Link } from 'react-router-dom'

const Trip = () => {
    return (
        <>
            <HeaderFormUser />
            <div className='div-trip-form-user'>
                <h1>Chuyến đi</h1>
                <hr className='hr-form-user'/>
                <h2>Chưa có chuyến đi nào được đặt... vẫn chưa!</h2>
                <p>Đã đến lúc phủi bụi hành lý và bắt đầu chuẩn bị cho chuyến phiêu lưu tiếp theo của bạn rồi</p>
                <Link to='/'>
                <button className='btn-start-search-on-div-trip'>Bắt đầu tìm kiếm</button>
                </Link>
                <hr className='hr-form-user'/>
                <p>Bạn không tìm thấy đặt phòng/đặt chỗ của mình ở đây? <a className='a-tag-form-user' href="https://www.airbnb.com.vn/help?audience=guest">Truy cập Trung tâm trợ giúp</a> </p>
            </div>
        </>
    )
}

export default Trip