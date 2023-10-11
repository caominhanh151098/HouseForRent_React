import React, { useState } from 'react'
import HeaderFormUser from '../HeaderFormUser'
import FooterFormUser from '../FooterFormUser'
import "../../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import { Link } from 'react-router-dom'
import "../User.css"
import axios from 'axios'
import { API_UPDATE_USER_INFO } from '../../../Services/common'

const PersonalInfo = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))

    const [editState, setEditState] = useState({
        isEditNameOpen: false,
        isEditPhoneOpen: false,
        isEditEmailOpen: false
    })

    const [editFirstName, setEditFirstName] = useState(userInfo ? userInfo.firstName : '');
    const [editLastName, setEditLastName] = useState(userInfo ? userInfo.lastName : '');

    const [tempFirstName, setTempFirstName] = useState(userInfo ? userInfo.firstName : '');
    const [tempLastName, setTempLastName] = useState(userInfo ? userInfo.lastName : '');

    const handleSave = () => {
        setEditFirstName(tempFirstName);
        setEditLastName(tempLastName);

        if (editState.isEditNameOpen) {
            setEditState(prev => ({
                ...prev,
                isEditNameOpen: false
            }))
        }
        console.log('Đã lưu:', tempFirstName, tempLastName);
        if (tempFirstName) {
            handleSaveChanges('firstName', tempFirstName);
        }
        if (tempLastName) {
            handleSaveChanges('lastName', tempLastName);
        }
    };

    const handleCancel = () => {
        setTempFirstName(userInfo.firstName);
        setTempLastName(userInfo.lastName);
    };

    const handleToggleEditDiv = (type) => {
        setEditState(prev => ({
            ...prev,
            [type]: !prev[type]
        }))
    }


    var hiddenEmail = '';
    if (userInfo && userInfo.email) {
        const [username, domain] = userInfo.email.split('@');
        const usernameHidden = username.charAt(0) + '...' + username.charAt(username.length - 1);
        hiddenEmail = usernameHidden + "@" + domain;
    }
    const userPhone = userInfo && userInfo.phone && userInfo.phone || null;
    const hiddenPhone = `+84 ${'**'} ${'**'}${userPhone.slice(7, 8)} ${userPhone.slice(8)}`;

    const handleSaveChanges = async (field, value) => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await axios.patch(API_UPDATE_USER_INFO, {
                [field]: value
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                console.log('Cập nhật thành công');
            } else {
                console.error('Cập nhật không thành công');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <HeaderFormUser />
            <div className='div-account-setting-form-user'>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link className='a-tag-footer-div-form-user' to={'/account-settings'}>
                            <h2>Tài khoản &nbsp;  </h2>
                        </Link>
                        <i class="fa-solid fa-angle-right"></i>
                        <h2> &nbsp; Thông tin cá nhân</h2>
                    </div>
                    <h1>Thông tin cá nhân</h1>
                </div>
                <div className='container-personal-info'>
                    <div className='div-left-personal-info'
                        style={{ opacity: editState.isEditNameOpen ? 0.2 : 1 }}
                    >
                        <div className='detail-div-personal-info'>
                            <div>
                                <h2>Tên pháp lý</h2>
                                <p>{userInfo && userInfo.firstName} {userInfo && userInfo.lastName}</p>
                            </div>
                            <div>
                                <h3 onClick={() => handleToggleEditDiv('isEditNameOpen')}
                                    className='edit-tag-personal-info'>Chỉnh sửa</h3>
                            </div>
                        </div>
                        <hr />
                        <div className='detail-div-personal-info'>
                            <div>
                                <h2>Địa chỉ email</h2>
                                <p>{hiddenEmail && hiddenEmail}</p>
                            </div>
                            <div>
                                <h3 className='edit-tag-personal-info'>Chỉnh sửa</h3>
                            </div>
                        </div>
                        <hr />
                        <div className='detail-div-personal-info'>
                            <div>
                                <h2>Số điện thoại</h2>
                                <p>{hiddenPhone}</p>
                                <p>Số điện thoại liên hệ (để khách đã xác nhận và Airbnb liên hệ). Bạn có thể thêm các số điện thoại khác và chọn mục đích sử dụng tương ứng.</p>
                            </div>
                            <div>
                                <h3 className='edit-tag-personal-info'>Chỉnh sửa</h3>
                            </div>
                        </div>
                        <hr />
                        <div className='detail-div-personal-info'>
                            <div>
                                <h2>Giấy tờ tùy thân do chính phủ cấp</h2>
                                <p>Chưa được cung cấp</p></div>
                            <div>
                                <h3 className='edit-tag-personal-info'>Chỉnh sửa</h3>
                            </div>
                        </div>
                        <hr />
                        <div className='detail-div-personal-info'>
                            <div>
                                <h2>Địa chỉ</h2>
                                <p>Chưa được cung cấp</p></div>
                            <div>
                                <h3 className='edit-tag-personal-info'>Chỉnh sửa</h3>
                            </div>
                        </div>
                        <hr />
                        <div className='detail-div-personal-info'>
                            <div>
                                <h2>Liên hệ trong trường hợp khẩn cấp</h2>
                                <p>Chưa được cung cấp</p></div>
                            <div>
                                <h3 className='edit-tag-personal-info'>Chỉnh sửa</h3>
                            </div>
                        </div>
                    </div>
                    {
                        editState.isEditNameOpen && (
                            <div className='div-edit-first-last-name'>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <h2>Tên pháp lý</h2>
                                        <p>Đây là tên trên giấy tờ thông hành của bạn, có thể là giấy phép hoặc hộ chiếu.</p>
                                    </div>
                                    <div className='cancel-edit'
                                        onClick={() => {
                                            handleToggleEditDiv('isEditNameOpen');
                                            handleCancel();
                                        }}
                                    >Huỷ</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div className='div-edit-name-detail'>
                                        <div className='div-edit-detail-first-last-name'>
                                            <h3 style={{ marginBottom: '3%' }}>Tên</h3>
                                            <input className='input-edit-first-last-name'
                                                type="text"
                                                value={tempFirstName}
                                                onChange={(e) => setTempFirstName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className='div-edit-name-detail'>
                                        <div className='div-edit-detail-first-last-name'>
                                            <h3 style={{ marginBottom: '3%' }}>Họ</h3>
                                            <input className='input-edit-first-last-name'
                                                type="text"
                                                value={tempLastName}
                                                onChange={(e) => setTempLastName(e.target.value)}
                                            />
                                        </div>

                                    </div>
                                </div>
                                <div>
                                    <button onClick={() =>
                                        handleSave()}
                                        className='btn-save-edit'>Lưu</button>
                                </div>
                            </div>
                        )
                    }


                    <div className='div-right-personal-info'>
                        <div className='description-and-details-for-personal'>
                            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", height: "48px", width: "48px", fill: "#E31C5F", stroke: "currentColor" }} aria-hidden="true" role="presentation" focusable="false"><g><g stroke="none"><path d="M27 5l.585.005c4.29.076 8.837.984 13.645 2.737l.77.288V35.4l-.008.13a1 1 0 0 1-.47.724l-.116.06L27 42.716V25a1 1 0 0 0-.883-.993L26 24H12V8.029l.77-.286c4.797-1.75 9.336-2.658 13.62-2.737L27 5z" fill-opacity=".2"></path><path d="M27 1c5.599 0 11.518 1.275 17.755 3.816a2 2 0 0 1 1.239 1.691L46 6.67V35.4a5 5 0 0 1-2.764 4.472l-.205.097-15.594 6.93L27 47l-2.461-1h2.451a.01.01 0 0 0 .007-.003L27 45.99v-1.085l15.218-6.763a3 3 0 0 0 1.757-2.351l.019-.194.006-.196V6.669l-.692-.278C37.557 4.128 32.121 3 27 3S16.443 4.128 10.692 6.391L10 6.67 9.999 24H8V6.669a2 2 0 0 1 1.098-1.786l.147-.067C15.483 2.275 21.401 1 27 1z"></path></g><g fill="none" stroke-width="2"><path d="M4 24h22a1 1 0 0 1 1 1v20.99a.01.01 0 0 1-.01.01H4a1 1 0 0 1-1-1V25a1 1 0 0 1 1-1z"></path><path d="M21 25v-5a6 6 0 1 0-12 0v5"></path><circle cx="15" cy="35" r="2"></circle></g></g></svg>
                            <h2>Tại sao thông tin của tôi không được hiển thị ở đây?</h2>
                            <p className='p-tag-description-and-details'>Chúng tôi đang ẩn một số thông tin tài khoản để bảo vệ danh tính của bạn.</p>
                            <hr />
                        </div>
                        <div className='description-and-details-for-personal'>
                            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", height: "48px", width: "48px", fill: "#E31C5F", stroke: "currentColor" }} aria-hidden="true" role="presentation" focusable="false"><g stroke="none"><path d="m39 15.999v28.001h-30v-28.001z" fill-opacity=".2"></path><path d="m24 0c5.4292399 0 9.8479317 4.32667079 9.9961582 9.72009516l.0038418.27990484v2h7c1.0543618 0 1.9181651.8158778 1.9945143 1.8507377l.0054857.1492623v32c0 1.0543618-.8158778 1.9181651-1.8507377 1.9945143l-.1492623.0054857h-34c-1.0543618 0-1.91816512-.8158778-1.99451426-1.8507377l-.00548574-.1492623v-32c0-1.0543618.81587779-1.9181651 1.85073766-1.9945143l.14926234-.0054857h7v-2c0-5.5228475 4.4771525-10 10-10zm17 14h-34v32h34zm-17 14c1.6568542 0 3 1.3431458 3 3s-1.3431458 3-3 3-3-1.3431458-3-3 1.3431458-3 3-3zm0 2c-.5522847 0-1 .4477153-1 1s.4477153 1 1 1 1-.4477153 1-1-.4477153-1-1-1zm0-28c-4.3349143 0-7.8645429 3.44783777-7.9961932 7.75082067l-.0038068.24917933v2h16v-2c0-4.418278-3.581722-8-8-8z"></path></g></svg>
                            <h2>Bạn có thể chỉnh sửa những thông tin nào?</h2>
                            <p className='p-tag-description-and-details'>Bạn có thể chỉnh sửa thông tin liên hệ và thông tin cá nhân. Nếu sử dụng thông tin này để xác minh danh tính, bạn sẽ cần phải xác minh lần nữa vào lần đặt tiếp theo, hoặc để tiếp tục đón tiếp khách.</p>
                            <hr />
                        </div>
                        <div className='description-and-details-for-personal'>
                            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", height: "48px", width: "48px", fill: "#E31C5F", stroke: "currentColor" }} aria-hidden="true" role="presentation" focusable="false"><g stroke="none"><path d="M24 9C14.946 9 7.125 15.065 4.74 23.591L4.63 24l.013.054c2.235 8.596 9.968 14.78 18.99 14.943L24 39c9.053 0 16.875-6.064 19.26-14.59l.11-.411-.013-.052c-2.234-8.597-9.968-14.78-18.99-14.944L24 9z" fill-opacity=".2"></path><path d="M24 5c11.18 0 20.794 7.705 23.346 18.413l.133.587-.133.587C44.794 35.295 35.181 43 24 43 12.82 43 3.206 35.295.654 24.588l-.133-.587.048-.216C2.985 12.884 12.69 5 24 5zm0 2C13.88 7 5.16 13.887 2.691 23.509l-.12.492.032.14c2.288 9.564 10.728 16.513 20.65 16.846l.377.01L24 41c10.243 0 19.052-7.056 21.397-16.861l.031-.14-.031-.138c-2.288-9.566-10.728-16.515-20.65-16.848l-.377-.01L24 7zm0 10a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"></path></g></svg>
                            <h2>Thông tin nào được chia sẻ với người khác?</h2>
                            <p className='p-tag-description-and-details'>Airbnb chỉ tiết lộ thông tin liên lạc cho Chủ nhà/Người tổ chức và khách sau khi đặt phòng/đặt chỗ được xác nhận.</p>
                        </div>
                    </div>
                </div>
            </div>
            <FooterFormUser />
        </>
    )
}

export default PersonalInfo