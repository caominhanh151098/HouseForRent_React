import React, { useState } from "react";
import "../AirBnb.css"
import FormHeader from "./FormHeader";

const Header = () => {
  const [showFormHeader, setShowFormHeader] = useState(false);
  const [isSelectLocation, setIsSelectLocation] = useState(false);

  const handleSelectLocation = () => {
    setIsSelectLocation(true)
  }

  const handleShowFormHeader = () => {
    setShowFormHeader(true);
  }
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        rel="icon"
        href="https://ebenezersuites.com/wp-content/uploads/2016/06/airbnb-logo-266x300@2x.png"
        sizes="64x64"
        type="image/png"
      />
      <title>Nhà nghỉ dưỡng và căn hộ cao cấp</title>
      <link rel="stylesheet" href="airbnb.css" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
      />
      <header>
      <div className={`overlay ${showFormHeader ? 'active' : ''}`} onClick={() => setShowFormHeader(false)}></div>
        <img
          className="img-header"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png"
          alt=""
        />
        <div className="search-box">
          <div className="button-group">
            <button className="anywhere" onClick={handleShowFormHeader}>
              Địa điểm bất kỳ &nbsp;&nbsp;<span className="separator">|</span>
            </button>
            <button className="anyweek">
              Tuần bất kỳ &nbsp;&nbsp;<span className="separator">|</span>
            </button>
            <button className="anyguest">&nbsp;&nbsp;Thêm khách</button>
          </div>
          <input className="search-input" type="text" />
          <button className="search-button">
            <i className="fa-solid fa-magnifying-glass" />
          </button>
          {
            showFormHeader && (
              <div className="form-header">
                <div style={{height: '80px'}}>
                  <button className="choices">Chỗ ở</button>
                  <button className="choices">Trải nghiệm</button>
                  <button className="choices">Trải nghiệm trực tuyến</button>
                  <button className="close-form-header"
                    onClick={() => setShowFormHeader(false)}><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div className="body-choices">
                  <button onClick={handleSelectLocation}
                    className={`choices-details ${isSelectLocation ? 'active' : ' '}`}
                    >Địa điểm <br />
                    <input className={`input-choice-details ${isSelectLocation ? 'active' : ''}`} type="text" placeholder="Tìm kiếm điểm đến" />
                  </button>
                  <button className="choices-details2"><span style={{ fontWeight: 'bolder' }}>Nhận phòng</span> <br />
                    <span>Thêm ngày</span>
                  </button>
                  <button className="choices-details3"><span style={{ fontWeight: 'bolder' }}>Trả phòng</span> <br />
                    <span>Thêm ngày</span>
                  </button>
                  <button className="choices-details4"><span style={{ fontWeight: 'bolder', position: 'absolute', left: '44px', top: '17px' }}>Khách</span> <br />
                    <span style={{ position: 'absolute', left: '24px', top: '32px' }}>Thêm khách</span>
                  </button>
                  <button className="choices-details5"><i class="fa-solid fa-magnifying-glass"></i> Tìm kiếm</button>
                </div>
                {
                  isSelectLocation && (
                    <div className="search-location">
                      <h1>Tìm kiếm theo khu vực</h1>
                      <div className="search-div">
                        <div className="search-details">
                          <img src="https://a0.muscache.com/pictures/f9ec8a23-ed44-420b-83e5-10ff1f071a13.jpg" alt="" />
                          <h3>Tìm kiếm linh hoạt</h3>
                        </div>
                        <div className="search-details">
                          <img src="https://a0.muscache.com/im/pictures/7b5cf816-6c16-49f8-99e5-cbc4adfd97e2.jpg?im_w=320" alt="" />
                          <h3>Châu Âu</h3>
                        </div>
                        <div className="search-details">
                          <img src="https://a0.muscache.com/im/pictures/924d2b73-6c65-4d04-a2ad-bbc028299658.jpg?im_w=320" alt="" />
                          <h3>Thái Lan</h3>
                        </div>
                        <div className="search-details">
                          <img src="https://a0.muscache.com/im/pictures/4e762891-75a3-4fe1-b73a-cd7e673ba915.jpg?im_w=320" alt="" />
                          <h3>Hoa kỳ</h3>
                        </div>
                        <div className="search-details">
                          <img src="https://a0.muscache.com/im/pictures/c193e77c-0b2b-4f76-8101-b869348d8fc4.jpg?im_w=320" alt="" />
                          <h3>Hàn Quốc</h3>
                        </div>
                        <div className="search-details">
                          <img src="https://diaocthinhvuong.vn/wp-content/uploads/2019/10/vi-tri-dia-ly-cua-Viet-Nam.svg" alt="" />
                          <h3>Việt Nam</h3>
                        </div>
                      </div>
                    </div>
                  )
                }

              </div>
            )
          }

        </div>
        <div className="header-2">
          <button className="header3">Cho thuê chỗ ở qua Airbnb</button>
          <span>
            <i className="fa-solid fa-globe world" />
          </span>
          <span>
            <i className="fa-solid fa-circle-user" />
          </span>
        </div>
      </header>
    </>
  )
}

export default Header;