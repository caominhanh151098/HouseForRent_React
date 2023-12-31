import React, { useState, useRef } from 'react'
import "./User.css"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


const HeaderFormUser = () => {
  const navigate = useNavigate();
  var jwtValue = localStorage.getItem("jwt");
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const [isOpenDropMenuLoginWithJWT, setIsOpenDropMenuLoginWithJWT] = useState(false);


  const handleLogOut = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userInfo')
    navigate('/loggout', { replace: true });
    window.location.reload();
  }

  const handleOpenMenuDropdownLoginWithJWT = () => {
    setIsOpenDropMenuLoginWithJWT(!isOpenDropMenuLoginWithJWT)
  }

  // console.log("userInfo", userInfo);
  const imgRef = useRef(null);

  const handleClick = () => {
    window.location.href = 'https://house-for-rent-psi.vercel.app/';
  };

  return (
    <>
      <div className='div-header-form-user'>

        <img
          className="img-header" ref={imgRef} onClick={handleClick}
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png"
          alt=""
        />

        <div className="header-2">
          {
            jwtValue && jwtValue ? (
              <Link to={"/host/bookedToday"}>
                <button className="header3">Đón tiếp khách</button>
              </Link>
            ) : (
              <Link to={"/host/bookedToday"}>
                <button className="header3">Cho thuê chỗ ở qua Airbnb</button>
              </Link>
            )
          }

          <span>
            <i className="fa-solid fa-globe world" />
          </span>

          {
            jwtValue && jwtValue ? userInfo && userInfo.avatar ? (
              <img
                onClick={handleOpenMenuDropdownLoginWithJWT}
                className="avatar-login"
                src={userInfo.avatar} alt="" />
            ) : (
              <img
                onClick={handleOpenMenuDropdownLoginWithJWT}
                className="avatar-login"
                src="https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg" alt="" />
            ) : (
              <span>
                <i className="fa-solid fa-circle-user" />
              </span>
            )
          }
          {
            isOpenDropMenuLoginWithJWT && (
              <div className="dropdown-menu-login">
                <div className="dropdown-menu-choice">Tin nhắn</div>
                <Link className="link-user-login"
                  to={'/trip'}>
                  <div className="dropdown-menu-choice">Chuyến đi</div>
                </Link>
                <Link className="link-user-login"
                  to={'/wish-lists'}>
                  <div className="dropdown-menu-choice">Danh sách yêu thích</div>
                </Link>
                <hr />
                {
                  userInfo.role == "GUEST" ?
                    <><div className="dropdown-menu-choice">Bắt đầu cho thuê taij air-bnb</div></> :
                    <><div className="dropdown-menu-choice">Quản lý nhà/phòng cho thuê</div></>
                }

                <Link className="link-user-login"
                  to={'/account-settings'}>
                  <div className="dropdown-menu-choice">Tài khoản</div>
                </Link>
                <hr />
                <div className="dropdown-menu-choice">Trung tâm trợ giúp</div>
                <div
                  onClick={handleLogOut}
                  className="dropdown-menu-choice">Đăng xuất</div>
              </div>
            )
          }
        </div>
      </div>
      <hr className='hr-form-user' />
    </>
  )
}

export default HeaderFormUser