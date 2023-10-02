import React, {useState} from 'react'

const FormHeader = () => {
  return (
    <div>
        <img
          className="img-header"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png"
          alt=""
        />
        <div className="search-box">
          <div className="button-group">
            <button className="anywhere">
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
    </div>
  )
}

export default FormHeader