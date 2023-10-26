import React from 'react'
import HeaderFormUser from '../HeaderFormUser'
import FooterFormUser from '../FooterFormUser'
import "../User.css"
import "../../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import { Link } from 'react-router-dom'

const UserInfo = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    console.log("userInfo userInfo", userInfo);
    return (
        <>
            <HeaderFormUser />
            <div className='div-user-info-form-user'>
                <div className='div-detail-verify-user-info'>
                    <div className='div-verify-avatar-timework'>
                        <div className='div-details-verify-avatar-timework'>
                            <div>
                                <img className='avatar-verify-avatar-timework' src={userInfo.avatar ? userInfo.avatar : "https://media.istockphoto.com/id/1131164548/vi/vec-to/th%E1%BA%BF-th%E1%BA%A7n-5.jpg?s=612x612&w=0&k=20&c=4qLeuiEXy8mR2r_M81wB9-FTSxaV5aoOBnYkGqHZnUw="} alt="" />
                            </div>
                            <div>
                                <h2>5</h2>
                                <p>Đánh giá</p>
                                <hr/>
                                <h2>6</h2>
                                <p>Năm hoạt động trên Airbnb</p>
                            </div>
                        </div>
                    </div>
                    <div className='div-verify-identity-emal-phone'>
                        <div className='div-details-verify-identity'>
                            <h2>Thông tin đã được xác nhận của {userInfo && userInfo.firstName}</h2>
                            {
                                userInfo.phone ? (
                                    <p><i class="fa-solid fa-check" style={{ marginRight: '10px' }}></i> Số điện thoại</p>
                                ) : (
                                    <p>Chưa xác minh số điện thoại</p>
                                )
                            }
                            {
                                userInfo.email ? (
                                    <p><i class="fa-solid fa-check" style={{ marginRight: '10px' }}></i> Địa chỉ email</p>
                                ) : (
                                    <p>Chưa xác minh địa chỉ email</p>
                                )
                            }
                            {
                                userInfo.identity ? (
                                    <p><i class="fa-solid fa-check"></i> Danh tính</p>
                                ) : (
                                    <>
                                        <hr />
                                        <h3>Xác minh danh tính của bạn</h3>
                                        <p style={{ lineHeight: '1.6' }}>Bạn cần hoàn tất bước này trước khi đặt phòng/đặt chỗ hoặc đón tiếp khách trên Airbnb.</p>
                                        <Link to={'/identity-verification'}>
                                            <button className='btn-verify-identity-if-empty'>Xác minh</button>
                                        </Link>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>



                <div className='div-detail-user-info'></div>
            </div>
            <FooterFormUser />
        </>
    )
}

export default UserInfo