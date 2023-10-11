import React from 'react'
import "./User.css"
import HeaderFormUser from './HeaderFormUser'
import FooterFormUser from './FooterFormUser'
import { Link } from 'react-router-dom'

const AccountSetting = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    return (
        <>
            <HeaderFormUser />
            <div className='div-account-setting-form-user'>
                <div>
                    <h1>Tài khoản</h1>
                    <h3>{userInfo && userInfo.firstName && userInfo.firstName} {userInfo && userInfo.lastName && userInfo.lastName}, {userInfo && userInfo.email && userInfo.email}  · <a className='a-tag-form-user' href="">Truy cập hồ sơ</a></h3>
                </div>
                <div className='choices-in-account-setting-div'>
                    <Link className='link-to-choice-account-setting' to={'/account-settings/personal-info'}>
                        <div className='choice-account-setting'>
                            <div className='svg-account-setting-div'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false"
                                    style={{ display: "block", height: "40px", width: "40px", fill: "currentcolor" }}>
                                    <path d="M29 5a2 2 0 0 1 2 1.85V25a2 2 0 0 1-1.85 2H3a2 2 0 0 1-2-1.85V7a2 2 0 0 1 1.85-2H3zm0 2H3v18h26zm-3 12v2h-8v-2zm-16-8a3 3 0 0 1 2.5 4.67A5 5 0 0 1 15 20h-2a3 3 0 0 0-2-2.83V14a1 1 0 0 0-2-.12v3.29A3 3 0 0 0 7 20H5a5 5 0 0 1 2.5-4.33A3 3 0 0 1 10 11zm16 4v2h-8v-2zm0-4v2h-8v-2z">
                                    </path>
                                </svg>
                            </div>
                            <div className='details-choice-in-account-setting-div'>
                                <h3>Thông tin cá nhân</h3>
                                <p>Cung cấp thông tin cá nhân và cách chúng tôi có thể liên hệ với bạn</p>
                            </div>
                        </div>
                    </Link>
                    <Link className='link-to-choice-account-setting'>
                    <div className='choice-account-setting'>
                        <div className='svg-account-setting-div'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false"
                                style={{ display: "block", height: "40px", width: "40px", fill: "currentcolor" }}>
                                <path d="m16 .8.56.37C20.4 3.73 24.2 5 28 5h1v12.5C29 25.57 23.21 31 16 31S3 25.57 3 17.5V5h1c3.8 0 7.6-1.27 11.45-3.83L16 .8zm-1 3a22.2 22.2 0 0 1-9.65 3.15L5 6.97V17.5c0 6.56 4.35 11 10 11.46zm2 0v25.16c5.65-.47 10-4.9 10-11.46V6.97l-.35-.02A22.2 22.2 0 0 1 17 3.8z">
                                </path>
                            </svg>
                        </div>
                        <div className='details-choice-in-account-setting-div'>
                            <h3>Đăng nhập và bảo mật</h3>
                            <p>Cập nhật mật khẩu và bảo mật tài khoản của bạn</p>
                        </div>
                    </div>
                    </Link>
                    <Link className='link-to-choice-account-setting'>
                    <div className='choice-account-setting'>
                        <div className='svg-account-setting-div'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false"
                                style={{ display: "block", height: "40px", width: "40px", fill: "currentcolor" }}>
                                <path d="M25 4a2 2 0 0 1 2 1.85V8h2.04c1.04 0 1.88.82 1.96 1.85V26c0 1.05-.8 1.92-1.81 2H6.96a1.98 1.98 0 0 1-1.95-1.85L5 26v-2H3a2 2 0 0 1-2-1.85V6a2 2 0 0 1 1.85-2H3zm2 18a2 2 0 0 1-1.85 2H7v2h22V10h-2zM25 6H3v16h22zm-3 12a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-8-8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM6 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2z">
                                </path>
                            </svg>
                        </div>
                        <div className='details-choice-in-account-setting-div'>
                            <h3>Thanh toán và chi trả</h3>
                            <p>Xem lại các khoản thanh toán, chi trả, phiếu giảm giá và thẻ quà tặng</p>
                        </div>
                    </div>
                    </Link>
                    <Link className='link-to-choice-account-setting'>
                    <div className='choice-account-setting'>
                        <div className='svg-account-setting-div'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false"
                                style={{ display: "block", height: "40px", width: "40px", fill: "currentcolor" }}>
                                <path d="M28.41 10 20 1.59A2.01 2.01 0 0 0 18.59 1H8a5 5 0 0 0-5 5v20a5 5 0 0 0 5 5h16a5 5 0 0 0 5-5V11.41a1.99 1.99 0 0 0-.59-1.41ZM19 3.41 26.59 11H22a3 3 0 0 1-3-3ZM27 26a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h9v5a5 5 0 0 0 5 5h5Z">
                                </path>
                            </svg>
                        </div>
                        <div className='details-choice-in-account-setting-div'>
                            <h3>Thuế</h3>
                            <p>Quản lý thông tin người nộp thuế và chứng từ thuế</p>
                        </div>
                    </div>
                    </Link>
                    <Link className='link-to-choice-account-setting'>
                    <div className='choice-account-setting'>
                        <div className='svg-account-setting-div'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false"
                                style={{ display: "block", height: "40px", width: "40px", fill: "currentcolor" }}>
                                <path d="M30.83 3.73a2 2 0 0 0-2.64-1.02L11.79 10H7a6 6 0 0 0-.26 12H11v7h2v-6.46l15.19 6.75A2 2 0 0 0 31 27.46V4.54a2.02 2.02 0 0 0-.17-.81ZM6.82 20A4 4 0 0 1 7 12h4v8H7.02ZM29 27.46l-16-7.1v-8.71l16-7.11Z">
                                </path>
                            </svg>
                        </div>
                        <div className='details-choice-in-account-setting-div'>
                            <h3>Thông báo</h3>
                            <p>Chọn tùy chọn thông báo và cách bạn muốn được liên hệ</p>
                        </div>
                    </div>
                    </Link>
                    <Link className='link-to-choice-account-setting'>
                    <div className='choice-account-setting'>
                        <div className='svg-account-setting-div'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false"
                                style={{ display: "block", height: "40px", width: "40px", fill: "currentcolor" }}>
                                <path d="M16 27A15.57 15.57 0 0 1 1.48 16.94l-.1-.3.13-.51a15 15 0 0 1 28.98-.01l.14.53-.11.3A15.58 15.58 0 0 1 16 27zM3.47 16.53a13.5 13.5 0 0 0 25.06 0 13 13 0 0 0-25.06 0zM16 21a5 5 0 1 1 5-5 5 5 0 0 1-5 5zm0-8a3 3 0 1 0 3 3 3 3 0 0 0-3-3z">
                                </path>
                            </svg>
                        </div>
                        <div className='details-choice-in-account-setting-div'>
                            <h3>Quyền riêng tư và chia sẻ</h3>
                            <p>Quản lý dữ liệu cá nhân, các dịch vụ được kết nối và chế độ cài đặt chia sẻ dữ liệu của bạn</p>
                        </div>
                    </div>
                    </Link>
                    <Link className='link-to-choice-account-setting'>
                    <div className='choice-account-setting'>
                        <div className='svg-account-setting-div'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false"
                                style={{ display: "block", height: "40px", width: "40px", fill: "currentcolor" }}>
                                <path d="M24 31a7 7 0 0 0 0-14H8a7 7 0 0 0 0 14zm5-7a5 5 0 1 1-5-5 5 5 0 0 1 5 5zM3 24a5 5 0 0 1 5-5h11.11a6.98 6.98 0 0 0 0 10H8a5 5 0 0 1-5-5zM24 1H8a7 7 0 0 0 0 14h16a7 7 0 0 0 0-14zM3 8a5 5 0 1 1 5 5 5 5 0 0 1-5-5zm21 5H12.89a6.98 6.98 0 0 0 0-10H24a5 5 0 0 1 0 10z">
                                </path>
                            </svg>
                        </div>
                        <div className='details-choice-in-account-setting-div'>
                            <h3>Lựa chọn chung</h3>
                            <p>Đặt ngôn ngữ, loại tiền tệ và múi giờ mặc định của bạn</p>
                        </div>
                    </div>
                    </Link>
                    <Link className='link-to-choice-account-setting'>
                    <div className='choice-account-setting'>
                        <div className='svg-account-setting-div'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false"
                                style={{ display: "block", height: "40px", width: "40px", fill: "currentcolor" }}>
                                <path d="M26 2a1 1 0 0 1 .92.61l.04.12 2 7a1 1 0 0 1-.85 1.26L28 11h-3v5h6v2h-2v13h-2v-2.54a3.98 3.98 0 0 1-1.73.53L25 29H7a3.98 3.98 0 0 1-2-.54V31H3V18H1v-2h5v-4a1 1 0 0 1 .88-1h.36L6.09 8.4l1.82-.8L9.43 11H12a1 1 0 0 1 1 .88V16h10v-5h-3a1 1 0 0 1-.99-1.16l.03-.11 2-7a1 1 0 0 1 .84-.72L22 2h4zm1 16H5v7a2 2 0 0 0 1.7 1.98l.15.01L7 27h18a2 2 0 0 0 2-1.85V18zm-16-5H8v3h3v-3zm14.24-9h-2.49l-1.43 5h5.35l-1.43-5z">
                                </path>
                            </svg>
                        </div>
                        <div className='details-choice-in-account-setting-div'>
                            <h3>Đi công tác</h3>
                            <p>Thêm email công việc để hưởng các lợi ích cho chuyến đi công tác</p>
                        </div>
                    </div>
                    </Link>
                    <Link className='link-to-choice-account-setting'>
                    <div className='choice-account-setting'>
                        <div className='svg-account-setting-div'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false"
                                style={{ display: "block", height: "40px", width: "40px", fill: "currentcolor" }}>
                                <path d="M27 5h-4a2 2 0 0 0-2 2v4h-4V3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v8H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zM9 29H5V13h4zm6 0h-4V3h4zm6 0h-4V13h4zm6 0h-4V7h4z">
                                </path>
                            </svg>
                        </div>
                        <div className='details-choice-in-account-setting-div'>
                            <h3>Các công cụ đón tiếp khách chuyên nghiệp</h3>
                            <p>Nhận các công cụ chuyên nghiệp nếu bạn quản lý một số chỗ ở trên Airbnb</p>
                        </div>
                    </div>
                    </Link>
                    <Link className='link-to-choice-account-setting'>
                    <div className='choice-account-setting'>
                        <div className='svg-account-setting-div'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false"
                                style={{ display: "block", height: "40px", width: "40px", fill: "currentcolor" }}>
                                <path d="M28 2a2 2 0 0 1 2 1.85V28a2 2 0 0 1-1.85 2H4a2 2 0 0 1-2-1.85V4a2 2 0 0 1 1.85-2H4zM13.59 17H4v11h11v-9.59l-4.3 4.3-1.4-1.42zM28 17h-9.59l4.3 4.3-1.42 1.4L17 18.42V28h11zM15 4H4v11h3.54a4 4 0 0 1 6.28-4.84c.29.28.68.85 1.18 1.74zm6 7c-.53 0-.98.17-1.42.6-.21.2-.63.87-1.22 1.98l-.25.47-.5.95H21a2 2 0 0 0 1.98-1.7l.01-.15L23 13a2 2 0 0 0-2-2zm7-7H17v7.9c.5-.89.89-1.46 1.18-1.74A4 4 0 0 1 24.46 15H28zm-17 7a2 2 0 0 0-2 2v.15A2 2 0 0 0 11 15h3.38l-.49-.95-.36-.69c-.54-.98-.91-1.58-1.1-1.76-.45-.43-.9-.6-1.43-.6z">
                                </path>
                            </svg>
                        </div>
                        <div className='details-choice-in-account-setting-div'>
                            <h3>Tiền tích lũy và phiếu giảm giá từ việc giới thiệu</h3>
                            <p>Bạn có £0 tiền tích lũy và phiếu giảm giá từ việc giới thiệu. Tìm hiểu thêm.</p>
                        </div>
                    </div>
                    </Link>

                </div>
            </div>
            <FooterFormUser />
        </>

    )
}

export default AccountSetting