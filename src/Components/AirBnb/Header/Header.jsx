import React, { useState, useEffect } from "react";
import "../AirBnb.css"
import FormHeader from "./FormHeader";
import CalenderPicker from "./CalenderPicker";
import { Link } from "react-router-dom";
import "../../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import axios from "axios";
import { API_GET_HOUSE_BY_CITY } from './../../../Services/common';
import { useHouse } from "./HouseContext";

const Header = () => {
  const [showFormHeader, setShowFormHeader] = useState(false);
  const [isSelectLocation, setIsSelectLocation] = useState(false);
  const [isSelectAddGuests, setIsSlectAddGuests] = useState(false);
  const [isSelectChooseDay, setIsSelectChooseDay] = useState(false);
  const [isSelectBackDay, setIsSelectBackDay] = useState(false);
  const [countOld, setCountOld] = useState(0);
  const [countYoung, setCountYoung] = useState(0);
  const [countBaby, setCountBaby] = useState(0);
  const [countPets, setCountPets] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  // const [houseSearchByCity, setHouseSearchByCity] = useState([])


  const API_URL = 'https://nominatim.openstreetmap.org/search';

  const { setHouseSearchByCity, setLoadingSearchByCity } = useHouse();

  const handleInputChangee = async (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() !== '') {
      const suggestionsList = await generateSuggestions(value);
      if (suggestionsList.length > 0) {
        setSuggestions(suggestionsList);
      }
      setIsSelectLocation(false)
      console.log(suggestions);
    } else {
      setSuggestions([]);
    }
  };

  const generateSuggestions = async (value) => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          q: value,
          format: 'json',
        },
      });

      const locations = Array.from(new Set(response.data.map(result => result.display_name.split(',')[0])));
      console.log(locations);
      return locations;

    } catch (error) {
      console.error('Error fetching location suggestions', error);
      return [];
    }
  };

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    setInputValue(region);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setSelectedRegion(null);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };



  const increaseOld = () => {
    setCountOld((prevCount) => prevCount + 1)
  }
  const decreaseOld = () => {
    if (countOld > 0) {
      setCountOld((prevCount) => prevCount - 1)
    }
  }

  const increaseYoung = () => {
    setCountYoung((prevCount) => prevCount + 1)
  }
  const decreaseYoung = () => {
    if (countYoung > 0) {
      setCountYoung((prevCount) => prevCount - 1)
    }
  }

  const increaseBaby = () => {
    setCountBaby((prevCount) => prevCount + 1)
  }
  const decreaseBaby = () => {
    if (countBaby > 0) {
      setCountBaby((prevCount) => prevCount - 1)
    }
  }

  const increasePets = () => {
    setCountPets((prevCount) => prevCount + 1)
  }
  const decreasePets = () => {
    if (countPets > 0) {
      setCountPets((prevCount) => prevCount - 1)
    }
  }

  const handleSelectChooseDay = () => {
    setIsSelectChooseDay(true)
    setIsSelectLocation(false)
    setIsSlectAddGuests(false)
    setIsSelectBackDay(false)
  }

  const handleSelectAddGuests = () => {
    setIsSlectAddGuests(true)
    setIsSelectLocation(false)
    setIsSelectChooseDay(false)
    setIsSelectBackDay(false)
  }

  const handleSelectLocation = () => {
    if (suggestions.length === 0){
      setIsSelectLocation(true)
    }
    setIsSlectAddGuests(false)
    setIsSelectChooseDay(false)
    setIsSelectBackDay(false)
  }

  const handleShowFormHeader = () => {
    setShowFormHeader(true);
    setIsSelectLocation(false)
    setIsSlectAddGuests(false)
    setIsSelectChooseDay(false)
    setIsSelectBackDay(false)
  }

  const handleSearchButtonClick = () => {
    setLoadingSearchByCity(true)
    setTimeout(() => {
      if (inputValue){
        axios.get(API_GET_HOUSE_BY_CITY+inputValue)
        .then(resp => {
          console.log(resp.data);
          setHouseSearchByCity(resp.data);
        })
        .catch(error => {
          console.error('Error fetching houses by city', error);
        })
      } else {
        console.log("Chưa chọn thành phố");
      }
      setLoadingSearchByCity(false)
    }, 1300)
    setShowFormHeader(prev => !prev)
  }
  // useEffect(() => {
  //   console.log("houseSearchByCity", houseSearchByCity);
  // }, [houseSearchByCity])

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
        <Link to={'/'}>
          <img
            className="img-header"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png"
            alt=""
          />
        </Link>

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
                <div style={{ height: '80px' }}>
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
                    <input
                      className={`input-choice-details ${isSelectLocation ? 'active' : ''}`}
                      type="text"
                      placeholder="Tìm kiếm điểm đến"
                      value={inputValue}
                      onChange={handleInputChangee}
                    />
                  </button>
                  {
                    suggestions.length > 0 && (
                      <div className="suggest-location-list">
                        {suggestions.slice(0, 5).map((suggestion, index) => (
                          <div style={{ display: 'flex', alignItems: 'center' }} key={index} onClick={() => handleSuggestionClick(suggestion)}>
                            <i className="fa-solid fa-location-dot icon-location-suggest-list"></i> {suggestion}
                          </div>
                        ))}

                      </div>
                    )
                  }
                  <button onClick={handleSelectChooseDay}
                    className="choices-details2"><span style={{ fontWeight: 'bolder' }}>Nhận phòng</span> <br />
                    <span>Thêm ngày</span>
                  </button>
                  <button className="choices-details3"><span style={{ fontWeight: 'bolder' }}>Trả phòng</span> <br />
                    <span>Thêm ngày</span>
                  </button>
                  <button onClick={handleSelectAddGuests}
                    className={`choices-details4 ${isSelectAddGuests ? 'active' : ''}`}><span style={{ fontWeight: 'bolder', position: 'absolute', left: '44px', top: '17px' }}>Khách</span> <br />
                    <span style={{ position: 'absolute', left: '24px', top: '32px' }}>Thêm khách</span>
                  </button>
                  <button onClick={handleSearchButtonClick}
                  className="choices-details5"><i class="fa-solid fa-magnifying-glass"></i> Tìm kiếm</button>
                </div>
                {
                  isSelectLocation && (
                    <div className="search-location">
                      <h1>Tìm kiếm theo khu vực</h1>
                      <div className="search-div">
                        <div className={`search-details ${selectedRegion === '' ? 'selected-region-search' : ''}`}
                          onClick={() => handleRegionClick('')}>
                          <img src="https://a0.muscache.com/pictures/f9ec8a23-ed44-420b-83e5-10ff1f071a13.jpg" alt="" />
                          <h3>Tìm kiếm linh hoạt</h3>
                        </div>
                        <div className={`search-details ${selectedRegion === 'Châu Âu' ? 'selected-region-search' : ''}`}
                          onClick={() => handleRegionClick('Châu Âu')}>
                          <img src="https://a0.muscache.com/im/pictures/7b5cf816-6c16-49f8-99e5-cbc4adfd97e2.jpg?im_w=320" alt="" />
                          <h3>Châu Âu</h3>
                        </div>
                        <div className={`search-details ${selectedRegion === 'Thái Lan' ? 'selected-region-search' : ''}`}
                          onClick={() => handleRegionClick('Thái Lan')}>
                          <img src="https://a0.muscache.com/im/pictures/924d2b73-6c65-4d04-a2ad-bbc028299658.jpg?im_w=320" alt="" />
                          <h3>Thái Lan</h3>
                        </div>
                        <div className={`search-details ${selectedRegion === 'Hoa kỳ' ? 'selected-region-search' : ''}`}
                          onClick={() => handleRegionClick('Hoa kỳ')}>
                          <img src="https://a0.muscache.com/im/pictures/4e762891-75a3-4fe1-b73a-cd7e673ba915.jpg?im_w=320" alt="" />
                          <h3>Hoa kỳ</h3>
                        </div>
                        <div className={`search-details ${selectedRegion === 'Hàn Quốc' ? 'selected-region-search' : ''}`}
                          onClick={() => handleRegionClick('Hàn Quốc')}>
                          <img src="https://a0.muscache.com/im/pictures/c193e77c-0b2b-4f76-8101-b869348d8fc4.jpg?im_w=320" alt="" />
                          <h3>Hàn Quốc</h3>
                        </div>
                        <div className={`search-details ${selectedRegion === 'Việt Nam' ? 'selected-region-search' : ''}`}
                          onClick={() => handleRegionClick('Việt Nam')}
                        >
                          <img src="https://diaocthinhvuong.vn/wp-content/uploads/2019/10/vi-tri-dia-ly-cua-Viet-Nam.svg" alt="" />
                          <h3>Việt Nam</h3>
                        </div>
                      </div>
                    </div>
                  )
                }
                {
                  isSelectAddGuests && (
                    <div className="addguests">
                      <div className="body-guests">
                        <div className="header-guests">
                          <h3>Người lớn</h3>Từ 13 tuổi trở lên
                        </div>
                        <div className="group-btn-guests">
                          <button className={`degbtn ${countOld === 0 ? 'disable-degbtn' : ''}`} onClick={decreaseOld} disabled={countOld === 0}><span>-</span></button>
                          <span className="countOld">{countOld}</span>
                          <button className="crebtn" onClick={increaseOld}>+</button>
                        </div>
                      </div>
                      <hr className='hr' />
                      <div className="body-guests">
                        <div className="header-guests">
                          <h3>Trẻ em</h3>Độ tuổi 2 - 12
                        </div>
                        <div className="group-btn-guests">
                          <button className={`degbtn ${countYoung === 0 ? 'disable-degbtn' : ''}`} onClick={decreaseYoung} disabled={countYoung === 0}><span>-</span></button>
                          <span className="countOld">{countYoung}</span>
                          <button className="crebtn" onClick={increaseYoung}>+</button>
                        </div>
                      </div>
                      <hr className='hr' />
                      <div className="body-guests">
                        <div className="header-guests">
                          <h3>Em bé</h3>Dưới 2 tuổi
                        </div>
                        <div className="group-btn-guests">
                          <button className={`degbtn ${countBaby === 0 ? 'disable-degbtn' : ''}`} onClick={decreaseBaby} disabled={countBaby === 0}><span>-</span></button>
                          <span className="countOld">{countBaby}</span>
                          <button className="crebtn" onClick={increaseBaby}>+</button>
                        </div>
                      </div>
                      <hr className='hr' />
                      <div className="body-guests">
                        <div className="header-guests">
                          <h3>Thú cưng</h3>
                        </div>
                        <div className="group-btn-guests">
                          <button className={`degbtn ${countPets === 0 ? 'disable-degbtn' : ''}`} onClick={decreasePets} disabled={countPets === 0}><span>-</span></button>
                          <span className="countOld">{countPets}</span>
                          <button className="crebtn" onClick={increasePets}>+</button>
                        </div>
                      </div>
                    </div>
                  )
                }
                {
                  isSelectChooseDay && <CalenderPicker />
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