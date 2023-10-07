import React, { useState, useEffect, createContext } from 'react'
import "../Book.css"
import { pink } from '@mui/material/colors';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import GradientButton from '../../Detail/GradientButton';
import { useContext } from 'react';
import BookingProvider from '../Main/BookingProvider';
import BookingContext from '../Main/BookingContext';
import { useParams, useHistory, Link } from 'react-router-dom';
import { API_HOUSE_DETAIL_URL, API_HOUSE_DETAIL_PRICE, API_CREATE_BOOK_HOUSE } from '../../../../Services/common';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateRangeCalendar, DateRangePickerDay } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import CircularProgressVariants from './CircularProgressVariants';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import "../../../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import OpenOTP from '../../../otp/OpenOTP';


const BookBody = () => {
  const { bookingInfo } = useContext(BookingContext)
  const { houseID, CountOld, CountYoung, CountBaby, CountPet, GoDay, BackDay } = useParams();
  const [house, setHouse] = useState({})
  const [housePrice, setHousePrice] = useState({})
  const [selectedDivPayment, setIsSelectedDivPayment] = useState('all');
  const [selectedPhoneLogIn, setSelectedPhoneLogIn] = useState(null)
  const [userLogin, setUserLogin] = useState(true);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isOverlayVisible2, setIsOverlayVisible2] = useState(false);
  const [isOverlayVisible3, setIsOverlayVisible3] = useState(false);
  const [countOld, setCountOld] = useState(Number(CountOld));
  const [countYoung, setCountYoung] = useState(Number(CountYoung));
  const [countBaby, setCountBaby] = useState(Number(CountBaby));
  const [countPets, setCountPets] = useState(Number(CountPet));
  const [tempBookDay, setTempBookDay] = useState([
    GoDay ? dayjs(GoDay) : dayjs(),
    BackDay ? dayjs(BackDay) : dayjs().add(1, 'day')]);
  const [bookDay, setBookDay] = useState([
    GoDay ? dayjs(GoDay) : dayjs(),
    BackDay ? dayjs(BackDay) : dayjs().add(1, 'day')
  ])
  const [countWeekendDay, setCountWeekendDay] = useState(0);
  const [weekendDayDetails, setWeekendDayDetails] = useState([])
  const [isOpenWeekendDetail, setIsOpenWeekendDetail] = useState(false);
  const [saveDay, setSaveDay] = useState(false);
  const [loadingBtnContinueAddTelePhone, setLoadingBtnContinueAddTelephone] = useState(false);
  const [loadingBtnSaveBookDay, setLoadingBtnSaveBookDay] = useState(false);
  const [loadingBtnSaveCountGuests, setLoadingBtnSaveCountGuests] = useState(false)
  const [isUpdatingUrl, setIsUpdatingUrl] = useState(false);



  const goDay = GoDay ? new Date(GoDay) : null
  console.log("goDay", goDay);
  const backDay = BackDay ? new Date(BackDay) : null
  console.log("backDay", goDay);
  const timeDifference = goDay && backDay ? backDay.getTime() - goDay.getTime() : null;
  console.log("timeDifference", timeDifference);


  useEffect(() => {
    async function getHouseDetail() {
      let res = await fetch(API_HOUSE_DETAIL_URL + `${houseID}`);
      let housedtl = await res.json()
      setHouse(housedtl)
    }
    getHouseDetail();
    document.querySelector('.MuiDateRangeCalendar-root div').style.display = 'none'
  }, [])
  console.log(house);

  useEffect(() => {
    async function getHousePrice() {
      let res = await fetch(API_HOUSE_DETAIL_PRICE + `${houseID}`)
      let price = await res.json();
      setHousePrice(price)
    }
    getHousePrice();
  }, [])
  console.log("Giá của nhà là:", housePrice);

  const handleClickDivPayment = (div) => {
    setIsSelectedDivPayment(div)
  }

  const handleClickDivPhoneLogIn = (div) => {
    setSelectedPhoneLogIn(div)
  }



  const [selectedValue, setSelectedValue] = React.useState('a');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const controlProps = (item) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item },
  });

  useEffect(() => {
    const fixedDivPayment = document.getElementsByClassName('fixed-div-payment-book-body')[0];
    let isFixedDivPayment = false;

    window.addEventListener('scroll', () => {
      const offset = window.scrollY;

      if (offset >= 80 && !isFixedDivPayment) {
        fixedDivPayment.style.position = 'fixed';
        fixedDivPayment.style.top = '30' + 'px';
        isFixedDivPayment = true;
      }
      if (offset < 100 && isFixedDivPayment) {
        fixedDivPayment.style.position = 'relative';
        fixedDivPayment.style.top = '30' + 'px';
        isFixedDivPayment = false;
      }
    });
  }, []);

  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible);
    const elements = document.querySelectorAll('.css-o22y52-MuiButtonBase-root-MuiRadio-root');
    if (!isOverlayVisible) {
      elements.forEach(element => {
        element.style.display = 'none';
      });
    } else {
      elements.forEach(element => {
        element.style = 'block';
      });
    }
  };

  const toggleOverlayGuests = () => {
    setIsOverlayVisible2(!isOverlayVisible2);
    const elements = document.querySelectorAll('.css-o22y52-MuiButtonBase-root-MuiRadio-root');
    if (!isOverlayVisible2) {
      elements.forEach(element => {
        element.style.display = 'none';
      });
    } else {
      elements.forEach(element => {
        element.style = 'block';
      });
    }
  };

  const toggleAddTelephone = () => {
    setIsOverlayVisible3(!isOverlayVisible3);
    const elements = document.querySelectorAll('.css-o22y52-MuiButtonBase-root-MuiRadio-root');
    if (!isOverlayVisible3) {
      elements.forEach(element => {
        element.style.display = 'none';
      });
    } else {
      elements.forEach(element => {
        element.style = 'block';
      });
    }
  }

  const handleDateChange = (newBookDay) => {
    setTempBookDay(newBookDay);
  }

  const handleResetDates = () => {
    setTempBookDay([
      dayjs(),
      dayjs().add(5, 'day')]);
    setBookDay([
      dayjs(),
      dayjs().add(5, 'day')]);
    setSaveDay(false);
  };

  useEffect(() => {
    console.log("Số ngày cuối tuần sau khi cập nhật:", countWeekendDay);
  }, [countWeekendDay]);

  const countWeekendDays = (startDate, endDate) => {
    let currentDate = startDate.clone();
    let weekendDays = 0;
    const length = endDate.diff(startDate, 'day');
    let counter = 0;
    let weekendArr = []
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      if (currentDate.day() === 6 && currentDate.add(1, 'day').day() === 0 || currentDate.day() === 0 && currentDate.add(1, 'day').day() === 1) {
        weekendDays++;
        weekendArr.push(currentDate.format('YYYY-MM-DD'));
        console.log(weekendArr);
        setWeekendDayDetails(weekendArr);
        console.log(weekendDayDetails);
      }
      currentDate = currentDate.add(1, 'day');
      counter++;
      if (counter >= length) {
        break;
      }
    }
    return weekendDays;
  };




  // const history = useHistory();
  const navigate = useNavigate();

  const handleSaveDates = () => {
    setLoadingBtnSaveBookDay(true)
    setTimeout(() => {
      toggleOverlay();
      setBookDay(tempBookDay);
      setSaveDay(true);
      setLoadingBtnSaveBookDay(false)
      const startDate = tempBookDay[0];
      const endDate = tempBookDay[1];
      const weekendDays = countWeekendDays(startDate, endDate);
      setCountWeekendDay(weekendDays > 0 ? weekendDays : 0);
      console.log("bookDay", bookDay);

      // const newURL = `/book/${houseID}/${countOld}/${countYoung}/${tempBookDay[0].format('YYYY-MM-DD')}/${tempBookDay[1].format('YYYY-MM-DD')}`
      // history.push(newURL)

    }, 1000)
    setTimeout(() => {
      const newURL = `/book/${houseID}/${countOld}/${countYoung}/${countBaby}/${countPets}/${tempBookDay[0].format('YYYY-MM-DD')}/${tempBookDay[1].format('YYYY-MM-DD')}`
      navigate(newURL)
    }, 1300)
  }

  useEffect(() => {
    const isInvalid = (
      GoDay === undefined ||
      BackDay === undefined ||
      dayjs(BackDay).isBefore(dayjs(GoDay))
    );
    if (isInvalid) {
      const errorURL = `/error/${houseID}/${CountOld}/${CountYoung}/${CountBaby}/${CountPet}/${tempBookDay[0].format('YYYY-MM-DD')}/${tempBookDay[1].format('YYYY-MM-DD')}`;
      navigate(errorURL);
    }
  }, [GoDay, BackDay, houseID, CountOld, CountYoung, CountBaby, CountPet, bookDay, navigate])

  useEffect(() => {
    const startDate = tempBookDay[0];
    const endDate = tempBookDay[1];
    const weekendDays = countWeekendDays(startDate, endDate);
    setCountWeekendDay(weekendDays > 0 ? weekendDays : 0);

    const newURL = `/book/${houseID}/${CountOld}/${CountYoung}/${CountBaby}/${CountPet}/${tempBookDay[0].format('YYYY-MM-DD')}/${tempBookDay[1].format('YYYY-MM-DD')}`;
    navigate(newURL);
  }, [houseID, CountOld, CountYoung, CountBaby, CountPet, bookDay, navigate]);



  const isSaveDisabled = !tempBookDay[0] || !tempBookDay[1];

  const numberOfNights = goDay && backDay ? Math.ceil(timeDifference / (1000 * 3600 * 24)) :
    bookDay[1] && bookDay[0] ? bookDay[1].diff(bookDay[0], 'day') : null;
  console.log("convert dayjs", dayjs(bookDay[1]));

  console.log("numberOfNights", numberOfNights);

  const requestDetail = house?.requestDetail;
  const requestMaxGuest = requestDetail ? requestDetail.match(/\d+/) : null;
  const maxGuests = requestMaxGuest ? parseInt(requestMaxGuest[0]) : null;
  console.log(maxGuests + " khách");


  const [tempCountOld, setTempCountOld] = useState(Number(CountOld))
  const [tempCountYoung, setTempCountYoung] = useState(Number(CountYoung))
  const [tempCountBaby, setTempCountBaby] = useState(Number(CountBaby))
  const [tempCountPets, setTempCountPets] = useState(Number(CountPet))

  // const increaseOld = () => {
  //   if (countOld + countYoung < maxGuests) {
  //     setCountOld(countOld + 1)
  //   }
  // }
  // const decreaseOld = () => {
  //   if (countOld > 0) {
  //     setCountOld((prevCount) => prevCount - 1)
  //   }
  // }

  // const increaseYoung = () => {
  //   if (countOld + countYoung < maxGuests) {
  //     setCountYoung(countYoung + 1)
  //   }
  // }
  // const decreaseYoung = () => {
  //   if (countYoung > 0) {
  //     setCountYoung((prevCount) => prevCount - 1)
  //   }
  // }

  // const increaseBaby = () => {
  //   setCountBaby((prevCount) => prevCount + 1)
  // }
  // const decreaseBaby = () => {
  //   if (countBaby > 0) {
  //     setCountBaby((prevCount) => prevCount - 1)
  //   }
  // }

  // const increasePets = () => {
  //   setCountPets((prevCount) => prevCount + 1)
  // }
  // const decreasePets = () => {
  //   if (countPets > 0) {
  //     setCountPets((prevCount) => prevCount - 1)
  //   }
  // }

  const increaseOld = () => {
    if (tempCountOld + tempCountYoung < maxGuests) {
      setTempCountOld(tempCountOld + 1)
    }
  }
  const decreaseOld = () => {
    if (tempCountOld > 0) {
      setTempCountOld((prevCount) => prevCount - 1)
    }
  }

  const increaseYoung = () => {
    if (tempCountOld + tempCountYoung < maxGuests) {
      setTempCountYoung(tempCountYoung + 1)
    }
  }
  const decreaseYoung = () => {
    if (tempCountYoung > 0) {
      setTempCountYoung((prevCount) => prevCount - 1)
    }
  }

  const increaseBaby = () => {
    setTempCountBaby((prevCount) => prevCount + 1)
  }
  const decreaseBaby = () => {
    if (tempCountBaby > 0) {
      setTempCountBaby((prevCount) => prevCount - 1)
    }
  }

  const increasePets = () => {
    setTempCountPets((prevCount) => prevCount + 1)
  }
  const decreasePets = () => {
    if (tempCountPets > 0) {
      setTempCountPets((prevCount) => prevCount - 1)
    }
  }


  const handleSaveCountGuest = () => {
    setLoadingBtnSaveCountGuests(true);
    setIsUpdatingUrl(true);
    setTimeout(() => {
      setLoadingBtnSaveCountGuests(false)
      setCountOld(tempCountOld);
      setCountYoung(tempCountYoung);
      setCountBaby(tempCountBaby);
      setCountPets(tempCountPets);
      toggleOverlayGuests()
      setIsUpdatingUrl(false);
      // const newURL = `/book/${houseID}/${countOld}/${countYoung}/${tempBookDay[0].format('YYYY-MM-DD')}/${tempBookDay[1].format('YYYY-MM-DD')}`
      // navigate(newURL)
    }, 1500)
  }

  useEffect(() => {
    if (!isUpdatingUrl) {
      const newURL = `/book/${houseID}/${countOld}/${countYoung}/${countBaby}/${countPets}/${tempBookDay[0].format('YYYY-MM-DD')}/${tempBookDay[1].format('YYYY-MM-DD')}`;
      navigate(newURL);
    }
  }, [countOld, countYoung, countBaby, countPets, houseID, navigate, isUpdatingUrl]);

  useEffect(() => {
    const totalGuests = Number(CountOld) + Number(CountYoung);
    if (totalGuests > maxGuests || Number(CountBaby) > 5 || Number(CountYoung) > 5) {
      const initialURL = `/book/${houseID}/${CountOld}/${CountYoung}/${CountBaby}/${CountPet}/${tempBookDay[0].format('YYYY-MM-DD')}/${tempBookDay[1].format('YYYY-MM-DD')}`;
      navigate(initialURL);
    }
  }, [countOld, countYoung, countBaby, countPets])

  const handleResetCountGuests = () => {
    setTempCountOld(1); setCountOld(1);
    setTempCountYoung(0); setCountYoung(0);
    setTempCountBaby(0); setCountBaby(0);
    setTempCountPets(0); setCountPets(0);
  }

  const handleOpenWeekendDayDetail = () => {
    setIsOpenWeekendDetail(!isOpenWeekendDetail)
  }



  const handleConfirmPayment = async () => {
    const requestData = {
      "checkInDate": bookDay ? bookDay[0].format('YYYY-MM-DD') : null,
      "checkOutDate": bookDay ? bookDay[1].format('YYYY-MM-DD') : null,
      "guestDetail": {
        "numAdults": countYoung ? countYoung : null,
        "numChildrenAbove2": countOld ? countOld : null,
        "numBabies": countBaby ? countBaby : null,
        "numPets": countPets ? countPets : null
      },
      "userId": 1,
      "houseId": houseID ? houseID : null
    };

    try {
      const response = await axios.post(API_CREATE_BOOK_HOUSE, requestData)
      console.log('Đã tạo hóa đơn:', response.data);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  }

  const handleContinueAddTelephone = () => {
    setLoadingBtnContinueAddTelephone(true);
    setTimeout(() => {

      setLoadingBtnContinueAddTelephone(false)
    }, 2000)
  }

  const [phoneInput, setPhoneInput] = useState('');

  const debouncedHandleChangePhoneInput = _.debounce((input) => {
    const sanitizedInput = input.replace(/\D/g, '');
    if (sanitizedInput.length <= 11) {
      setPhoneInput(sanitizedInput);
    }
  }, 0);

  const handleChangePhoneInput = (event) => {
    const input = event.target.value;
    debouncedHandleChangePhoneInput(input);
  }

  return (
    <div className='book-body'>
      <div className='devide-book-body' style={{ background: 'white' }}>
        <div className='back-book-body'>
          <Link to={`/house/${houseID}/${countOld}/${countYoung}/${countBaby}/${countPets}/${GoDay}/${BackDay}`}>
          <svg className='svg-book-body' style={{color:'black'}}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-label="Quay lại" role="img" focusable="false" ><path fill="none" d="M20 28 8.7 16.7a1 1 0 0 1 0-1.4L20 4"></path></svg>
          </Link>
          <h1>Yêu cầu đặt phòng/đặt chỗ</h1>
        </div>
        <div className='text-book-body'>
          <h2>Chuyến đi của bạn</h2>
          <div className='your-journey-book-body'>
            <div>
              <h3>Ngày</h3>
              {
                GoDay && BackDay && (
                  <p>{bookDay[0] && bookDay[1] ? (
                    `${bookDay[0].format('D [thg] M YYYY')} - ${bookDay[1].format('D [thg] M YYYY')}`
                  ) : (
                    <div>
                      <p style={{ opacity: '0.8' }}>Thêm ngày trả để biết giá chính xác</p>
                    </div>
                  )}
                  </p>

                )
              }
            </div>
            <div>
              <button className='btn-edit-day-book-body' onClick={toggleOverlay} >Chỉnh sửa</button>
              {(
                <div className={`overlay2 ${isOverlayVisible ? '' : 'd-none'}`} >
                  <div className={`appearing-div ${isOverlayVisible ? 'active' : ''}`} style={{ width: '629px', height: '478px' }}>
                    <div>
                      <i onClick={() => {
                        if (saveDay) {
                          setTempBookDay(bookDay);
                        }
                        toggleOverlay()
                      }} class="fa-solid fa-xmark close-description" ></i>
                    </div>
                    <div className='container-description-details'>
                      {
                        house && (
                          <>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={['DateRangeCalendar']}>
                                <DateRangeCalendar
                                  value={tempBookDay}
                                  onChange={handleDateChange}
                                  minDate={tempBookDay[0]}
                                  slots={{ day: (props) => <DateRangePickerDay {...props} className={props.isHighlighting ? 'range-highlight' : ''} /> }}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                            <div className='btn-group-reset-save-book-date'>
                              <button className='btn-delete-book-date' onClick={handleResetDates}>Xoá ngày</button>
                              {
                                loadingBtnSaveBookDay ? (
                                  <button style={{top:'13px', margin:'-15px 0px'}} className='btn-save-book-date-loading'><CircularProgressVariants /></button>
                                ) : (
                                  
                                   <button className='btn-save-book-date' onClick={handleSaveDates} disabled={isSaveDisabled}>Lưu</button>
                                 
                                 
                                  // <button className='btn-save-book-date-loading'><CircularProgressVariants /></button>
                                )
                              }
                            </div>
                          </>
                        )
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='your-journey-book-body'>
            <div>
              <h3>Khách</h3>
              <p>{countOld || countYoung ? countOld + countYoung + ' khách ' : 'Thêm ít nhất 1 khách'}
                {countBaby ? ', ' + countBaby + ' em bé ' : ''}
                {countPets ? ', ' + countPets + ' thú cưng' : ''}
              </p>
            </div>
            <div>
              <button className='btn-edit-day-book-body' onClick={toggleOverlayGuests}>Chỉnh sửa</button>
              {(
                <div className={`overlay2 ${isOverlayVisible2 ? '' : 'd-none'}`} >
                  <div className={`appearing-div ${isOverlayVisible2 ? 'active' : ''}`} style={{ width: '550px' }}>
                    <div>
                      <i onClick={() => { toggleOverlayGuests() }} class="fa-solid fa-xmark close-description" ></i>
                    </div>
                    <div className='container-description-details'>
                      {
                        house && (
                          <>
                            <div style={{ textAlign: 'left', margin: '0px 25px' }}>
                              <h2 style={{ fontWeight: 'bolder' }}>Khách</h2>
                              <p>Chỗ ở này cho phép tối đa {maxGuests} khách, không tính em bé. Nếu bạn mang theo thú cưng, bạn phải trả thêm phí (Số lượng tuỳ thích)</p>
                              {
                                (<div>
                                  <div className='count-guest-detail' style={{ position: 'relative', width: '107%', border: 'none' }}>
                                    <div className="add-guest-detail">
                                      <div className="body-guests">
                                        <div className="header-guests">
                                          <h3>Người lớn</h3>Từ 13 tuổi trở lên
                                        </div>
                                        <div className="group-btn-guests">
                                          <button className={`degbtn ${tempCountOld === 0 ? 'disable-degbtn' : ''}`} onClick={decreaseOld} disabled={tempCountOld === 1}><span>-</span></button>
                                          <span className="countOld">{tempCountOld}</span>
                                          <button className="crebtn" onClick={increaseOld} disabled={tempCountOld + tempCountYoung >= maxGuests}>+</button>
                                        </div>
                                      </div>
                                      <hr className='hr' />
                                      <div className="body-guests">
                                        <div className="header-guests">
                                          <h3>Trẻ em</h3>Độ tuổi 2 - 12
                                        </div>
                                        <div className="group-btn-guests">
                                          <button className={`degbtn ${tempCountYoung === 0 ? 'disable-degbtn' : ''}`} onClick={decreaseYoung} disabled={tempCountYoung === 0}><span>-</span></button>
                                          <span className="countOld">{tempCountYoung}</span>
                                          <button className="crebtn" onClick={increaseYoung} disabled={tempCountOld + tempCountYoung >= maxGuests}>+</button>
                                        </div>
                                      </div>
                                      <hr className='hr' />
                                      <div className="body-guests">
                                        <div className="header-guests">
                                          <h3>Em bé</h3>Dưới 2 tuổi
                                        </div>
                                        <div className="group-btn-guests">
                                          <button className={`degbtn ${tempCountBaby === 0 ? 'disable-degbtn' : ''}`} onClick={decreaseBaby} disabled={tempCountBaby === 0}><span>-</span></button>
                                          <span className="countOld">{tempCountBaby}</span>
                                          <button className="crebtn" onClick={increaseBaby} disabled={tempCountBaby === 5}>+</button>
                                        </div>
                                      </div>
                                      <hr className='hr' />
                                      <div className="body-guests">
                                        <div className="header-guests">
                                          <h3>Thú cưng</h3>
                                        </div>
                                        <div className="group-btn-guests">
                                          <button className={`degbtn ${tempCountPets === 0 ? 'disable-degbtn' : ''}`} onClick={decreasePets} disabled={tempCountPets === 0}><span>-</span></button>
                                          <span className="countOld">{tempCountPets}</span>
                                          <button className="crebtn" onClick={increasePets} disabled={tempCountPets === 5}>+</button>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='btn-group-reset-save-book-date' style={{ width: '97%', margin: '10px 0px' }}>
                                      <button className='btn-delete-book-date' onClick={handleResetCountGuests}>Xoá khách</button>

                                      {
                                        loadingBtnSaveCountGuests ? (
                                          <button style={{margin:'-11px 0px'}}
                                          className='btn-save-count-guests-loading'><CircularProgressVariants /></button>
                                        ) : (
                                           <button style={{padding:'9px 20px', borderRadius:'12px'}}
                                            className='btn-save-book-date' onClick={() => { handleSaveCountGuest() }} disabled={isSaveDisabled}>Lưu</button>
                                          
                                        )
                                      }
                                    </div>
                                  </div>
                                </div>
                                )
                              }
                            </div>
                          </>
                        )
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <hr style={{ width: '82%' }} />
        <div className='payment-text-body'>
          <h2>Chọn cách thanh toán</h2>
          <div onClick={() => { handleClickDivPayment('all') }}
            className={`pay-all-text-body ${selectedDivPayment === 'all' ? 'selectedDivPaymentAmount' : ''}`}>
            <div className='text-div-text-body'>
              <h3>Trả toàn bộ</h3>
              <p>Thanh toán toàn bộ số tiền
                <span style={{ fontWeight: 'bold' }}> ({
                  housePrice &&
                  housePrice.feeHouses &&
                  numberOfNights && '$' + (
                    housePrice.price * (numberOfNights - countWeekendDay) +
                    (countWeekendDay > 0 && housePrice.weekendPrice ? housePrice.weekendPrice * countWeekendDay : housePrice.price * countWeekendDay) +
                    (numberOfNights >= 3 && housePrice.feeHouses[0]?.price || 0) +
                    (numberOfNights === 2 && housePrice.feeHouses[1]?.price || 0) +
                    (countPets > 0 && housePrice.feeHouses[2]?.price || 0) +
                    ((countOld + countYoung) - Number(housePrice?.feeHouses[3]?.other) > 0 && 
                    ((countOld + countYoung) - Number(housePrice?.feeHouses[3]?.other)) * housePrice.feeHouses[3]?.price || 0)
                  ).toFixed(2)
                }) </span> ngay bây giờ và thế là xong.</p>
            </div>
            <div>
              <Radio
                {...controlProps('a')}
                checked={selectedDivPayment === 'all'}
                sx={{
                  color: pink[800],
                  '&.Mui-checked': {
                    color: pink[600],
                  },
                }}
              />
            </div>
          </div>
          <div onClick={() => { handleClickDivPayment('amount') }}
            className={`pay-amount-text-body ${selectedDivPayment === 'amount' ? 'selectedDivPaymentAll' : ''}`}>
            <div className='text-div-text-body'>
              <h3>Trả ngay một phần, phần còn lại trả sau</h3>
              <p>Cần thanh toán $139,78 vào hôm nay và $139,77 vào 1 thg 10, 2023. Không có phụ phí.</p>
            </div>
            <div>
              <Radio
                {...controlProps('b')}
                checked={selectedDivPayment === 'amount'}
                sx={{
                  color: pink[800],
                  '&.Mui-checked': {
                    color: pink[600],
                  },
                }}
              />
            </div>
          </div>
        </div>
        <hr style={{ width: '82%' }} />
        {
          userLogin && (
            <div>
              <h2 style={{padding:"0px 56px"}}>Đăng nhập hoặc đăng ký để đặt phòng/đặt chỗ</h2>
              <div className='payment-text-body'>
                <div onClick={() => { handleClickDivPhoneLogIn('country') }}
                  className={`country-login-text-body ${selectedPhoneLogIn === 'country' ? 'selectedDivCountryLogIn' : ''}`}>
                  <div className='text-div-text-body'>
                    <h3>Quốc gia/Khu vực</h3>
                    <p>Việt nam (+84)</p>
                  </div>
                  <div>
                    <svg className='svg-book-body' style={{ width: '20px' }} viewBox="0 0 18 18" role="presentation" aria-hidden="true" focusable="false"><path d="m16.29 4.3a1 1 0 1 1 1.41 1.42l-8 8a1 1 0 0 1 -1.41 0l-8-8a1 1 0 1 1 1.41-1.42l7.29 7.29z" fill-rule="evenodd"></path></svg>
                  </div>
                </div>
                <div onClick={() => { handleClickDivPhoneLogIn('phone') }}
                  className={`phone-login-text-body ${selectedPhoneLogIn === 'phone' ? 'selectedDivPhoneLogin' : ''} 
                  ${phoneInput.length > 0 && phoneInput.length < 10 ? 'checkPhoneInput' : ''}`}>
                  <div className='text-div-text-body'>
                    <input className='input-phone-login-text-body'
                      type="text"
                      placeholder='Số điện thoại'
                      value={phoneInput}
                      onChange={handleChangePhoneInput} />
                  </div>
                  {phoneInput.length > 0 && phoneInput.length < 10 && (
                    <span style={{ color: 'red', bottom: '5px', right: '5px', width: '300px' }}>
                      Vui lòng nhập ít nhất 10 số
                    </span>
                  )}
                  {phoneInput.length > 11 && (
                    <span style={{ color: 'red', bottom: '5px', right: '5px' }}>
                      Không được nhập quá 11 số
                    </span>
                  )}
                  {phoneInput.length >= 10 && phoneInput.length <= 11 && (
                    <span style={{ color: 'red', bottom: '5px', right: '5px' }}>
                      <i class="fa-solid fa-check" style={{ fontSize: '30px', marginRight: '8px', color: 'black' }}></i>
                    </span>
                  )}
                </div>
              </div>
              <div className='text-div-text-body'>
                <p className='p-tag-text-body'>Chúng tôi sẽ gọi điện hoặc nhắn tin cho bạn để xác nhận số điện thoại.
                  Có áp dụng phí dữ liệu và phí tin nhắn tiêu chuẩn. <a href="https://www.airbnb.com.vn/help/article/2855" className='a-tag-text-body'>Chính sách về quyền riêng tư</a></p>
              </div>
              <div style={{margin:"0px 48px", width:'92%'}}
               className='div-gradient-btn-text-body'>
                <GradientButton >Tiếp tục</GradientButton>
              </div>
              <div className='group-btn-login-text-body'>
                <button className='btn-method-login-text-body'>
                  <svg className='svg-tag-login-text-body' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false"><path fill="#1877F2" d="M32 0v32H0V0z"></path><path fill="#FFF" d="M22.94 16H18.5v-3c0-1.27.62-2.5 2.6-2.5h2.02V6.56s-1.83-.31-3.58-.31c-3.65 0-6.04 2.21-6.04 6.22V16H9.44v4.63h4.06V32h5V20.62h3.73l.7-4.62z"></path></svg>
                </button>
                <button className='btn-method-login-text-body'>
                  <svg className='svg-tag-login-text-body' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" ><path fill="#4285f4" d="M24.12 25c2.82-2.63 4.07-7 3.32-11.19H16.25v4.63h6.37A5.26 5.26 0 0 1 20.25 22z"></path><path fill="#34a853" d="M5.62 21.31A12 12 0 0 0 24.12 25l-3.87-3a7.16 7.16 0 0 1-10.69-3.75z"></path><path fill="#fbbc02" d="M9.56 18.25c-.5-1.56-.5-3 0-4.56l-3.94-3.07a12.08 12.08 0 0 0 0 10.7z"></path><path fill="#ea4335" d="M9.56 13.69c1.38-4.32 7.25-6.82 11.19-3.13l3.44-3.37a11.8 11.8 0 0 0-18.57 3.43l3.94 3.07z"></path></svg>
                </button>
                <button className='btn-method-login-text-body'>
                  <svg className='svg-tag-login-text-body' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="presentation" aria-hidden="true" focusable="false" ><path d="m13.3 2.1a5.1 5.1 0 0 1 3.8-2.1 5.1 5.1 0 0 1 -1.2 3.8 4.1 4.1 0 0 1 -3.6 1.7 4.5 4.5 0 0 1 1-3.4zm-5 3.7c-2.8 0-5.8 2.5-5.8 7.3 0 4.9 3.5 10.9 6.3 10.9 1 0 2.5-1 4-1s2.6.9 4 .9c3.1 0 5.3-6.4 5.3-6.4a5.3 5.3 0 0 1 -3.2-4.9 5.2 5.2 0 0 1 2.6-4.5 5.4 5.4 0 0 0 -4.7-2.4c-2 0-3.5 1.1-4.3 1.1-.9 0-2.4-1-4.2-1z"></path></svg>
                </button>
                <button className='btn-continue-with-email-text-body'>
                  <svg className='svg-tag-login-text-body' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" ><path d="M30.51 5.88A5.06 5.06 0 0 0 26 3H6a5.06 5.06 0 0 0-4.51 2.88A4.94 4.94 0 0 0 1 8v16a5 5 0 0 0 5 5h20a5 5 0 0 0 5-5V8a4.94 4.94 0 0 0-.49-2.12ZM6 5h20a2.97 2.97 0 0 1 1.77.6L17.95 14a2.98 2.98 0 0 1-3.9 0L4.23 5.6A2.97 2.97 0 0 1 6 5Zm23 19a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a2.97 2.97 0 0 1 .1-.74l9.65 8.27a4.97 4.97 0 0 0 6.5 0l9.65-8.27A2.97 2.97 0 0 1 29 8Z"></path></svg>
                  Tiếp tục bằng Email
                </button>
              </div>
            </div>
          )
        }
        <hr style={{ width: '82%' }} />
        <div className='payment-text-body' style={{ margin: '25px 59px' }}>
          <h2>Bắt buột cho chuyến đi của bạn</h2>
          <div className='required-for-your-trip'>
            <div style={{ width: '80%' }}>
              <h3>Số điện thoại</h3>
              <p>Thêm và xác nhận số điện thoại của bạn để nhận thông tin cập nhật về chuyến đi.</p>
            </div>
            <div>
              <button className='add-telephone-to-your-trip' onClick={toggleAddTelephone}>Thêm</button>
            </div>
            <OpenOTP/>
            {(
              <div className={`overlay2 ${isOverlayVisible3 ? '' : 'd-none'}`} >
                <div className={`appearing-div ${isOverlayVisible3 ? 'active' : ''}`} style={{ width: '550px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i onClick={toggleAddTelephone} class="fa-solid fa-xmark close-description" ></i>
                    <h1 style={{ margin: '0px 103px' }}>Thêm số điện thoại</h1>
                  </div>
                  <hr />
                  <div className='container-description-details'>
                    <div className='payment-text-body'>
                      <p>Chúng tôi sẽ gửi cho bạn thông tin cập nhật về chuyến đi cùng một tin nhắn để xác minh số điện thoại này.</p>
                      <div onClick={() => { handleClickDivPhoneLogIn('country') }}
                        className={`country-login-text-body ${selectedPhoneLogIn === 'country' ? 'selectedDivCountryLogIn' : ''}`}>
                        <div className='text-div-text-body'>
                          <h3>Quốc gia/Khu vực</h3>
                          <p>Việt nam (+84)</p>
                        </div>
                        <div>
                          <svg className='svg-book-body' style={{ width: '20px' }} viewBox="0 0 18 18" role="presentation" aria-hidden="true" focusable="false"><path d="m16.29 4.3a1 1 0 1 1 1.41 1.42l-8 8a1 1 0 0 1 -1.41 0l-8-8a1 1 0 1 1 1.41-1.42l7.29 7.29z" fill-rule="evenodd"></path></svg>
                        </div>
                      </div>
                      <div onClick={() => { handleClickDivPhoneLogIn('phone') }}
                        className={`phone-login-text-body ${selectedPhoneLogIn === 'phone' ? 'selectedDivPhoneLogin' : ''}`}>
                        <div className='text-div-text-body'>
                          <input className='input-phone-login-text-body' type="text" placeholder='Số điện thoại' />
                        </div>
                      </div>
                      <p>Chúng tôi sẽ nhắn tin gửi mã đến cho bạn để xác nhận số điện thoại. Có áp dụng phí dữ liệu và phí tin nhắn tiêu chuẩn.</p>
                    </div>
                  </div>
                  {
                    loadingBtnContinueAddTelePhone ? (
                      <button className='btn-continue-add-telephone-loading'><CircularProgressVariants /></button>
                    ) : (
                      <button className='btn-continue-add-telephone' onClick={handleContinueAddTelephone}>Tiếp tục</button>
                    )
                  }
                </div>
              </div>
            )}
          </div>
        </div>
        <hr style={{ width: '82%' }} />
        <div className='cancellation-policy-text-body'>
          <h2>Chính sách huỷ</h2>
          <p><span style={{ fontWeight: 'bold' }}>Huỷ miễn phí trước {bookDay[0].format('D [thg] M YYYY')}.</span>
            <span> Bạn được hoàn tiền một phần nếu hủy trước khi nhận phòng vào {bookDay[0].format('D [thg] M YYYY')}. Sau thời gian đó, số tiền hoàn lại sẽ phụ thuộc vào thời điểm bạn hủy.</span></p>
        </div>
        <hr style={{ width: '82%' }} />
        <div className='cancellation-policy-text-body'>
          <h2>Quy chuẩn chung</h2>
          <p>Chúng tôi yêu cầu tất cả khách phải ghi nhớ một số quy chuẩn đơn giản để làm một vị khách tuyệt vời.</p>
          <p>1. Tuân thủ nội quy nhà</p>
          <p>2. Giữ gìn ngôi nhà như thể đó là nhà bạn</p>
        </div>
        <hr style={{ width: '82%' }} />
        <div className='cancellation-policy-text-body'>
          <p>
            <span>Bằng việc chọn nút bên dưới, tôi đồng ý với </span>
            <span className='span-tag-text-body'>Nội quy nhà của Chủ nhà,</span>
            <a className='a-tag-text-body' href=""> Quy chuẩn chung đối với khách, </a>
            <span className='span-tag-text-body'>Chính sách đặt lại và hoàn tiền của Airbnb,</span>
            <a className='a-tag-text-body' href=""> Điều khoản trả trước một phần,</a>
            <span> và đồng ý rằng Airbnb có thể </span>
            <span className='span-tag-text-body'>tính phí vào phương thức thanh toán của tôi</span>
            <span> nếu tôi phải chịu trách nhiệm về thiệt hại.</span>
          </p>
        </div>
        <div className='btn-confirm-payment-text-body'>
          <GradientButton onClick={() => handleConfirmPayment()}>Xác nhận và thanh toán</GradientButton>
        </div>
      </div>
      <div className='devide-book-body'>
        <div className='fixed-div-payment-book-body'>
          <div className='title-details-fix-book-body'>
            <div>
              {
                house.images && (
                  <img className='img-div-fixed-book-body'
                    src={house?.images[0]?.srcImg} alt="" />
                )
              }
            </div>
            <div>
              {
                house && (
                  <p>{house?.hotelName}</p>
                )
              }
              <p>{house?.title}</p>
              {
                house && (
                  <p style={{ display: 'flex', alignItems: 'center', padding: '9px 0px' }}>
                    <svg style={{ width: '20px', padding: '0px 5px' }} className='svg-tag-login-text-body' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" ><path fill-rule="evenodd" d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1 0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"></path></svg>
                    {house?.reviewPoint} ({house?.numReview} đánh giá) </p>
                )
              }
            </div>
          </div>
          <hr style={{ width: '95%', margin: '-10px 10px' }} />
          <div className='price-detail-fixed-book-detail'>
            <h2>Chi tiết giá</h2>
            {
              housePrice && numberOfNights && numberOfNights - countWeekendDay > 0 && (
                <div className='total-fixed-book-detail' style={{ margin: '-10px 15px', marginBottom: '10px' }}>
                  <div>
                    {
                      housePrice && (
                        <p className='detail-text-payment-book-body'>${housePrice.price} x {numberOfNights - countWeekendDay} đêm (Trong tuần)  </p>
                      )
                    }
                  </div>
                  <div>
                    <p>${housePrice && numberOfNights ? housePrice?.price * (numberOfNights - countWeekendDay) : 'Tối thiểu 1 ngày'}</p>
                  </div>
                </div>
              )
            }

            {
              housePrice && countWeekendDay > 0 && (
                <div className='total-fixed-book-detail' style={{ margin: '-10px 15px', marginBottom: '10px' }}>
                  <div>
                    {
                      housePrice && countWeekendDay > 0 && (
                        <p onClick={handleOpenWeekendDayDetail}
                          className='detail-text-payment-book-body'>${housePrice?.weekendDays ? housePrice.weekendPrice : housePrice.price} x {countWeekendDay} đêm (Cuối tuần)</p>
                      )
                    }
                  </div>
                  <div>
                    <p>{housePrice && countWeekendDay > 0 && housePrice?.weekendPrice ? '$' + housePrice?.weekendPrice * countWeekendDay : housePrice?.price * countWeekendDay}</p>
                  </div>
                  {
                    isOpenWeekendDetail && (
                      <div className={`show-weekend-days-details ${isOpenWeekendDetail ? '' : 'hide-weekend-details'}`}>
                        <div className='title-weekend-days-detail'>
                          <i onClick={handleOpenWeekendDayDetail}
                          class="fa-solid fa-xmark"></i>
                          <h2>Các ngày cuối tuần</h2>
                          <p></p>
                        </div>
                        <div className='weekend-days-details'>
                          {
                            weekendDayDetails.map((day, index) => (
                              <p key={index}>{index + 1}. {day}</p>
                            ))
                          }
                        </div>
                      </div>
                    )
                  }
                </div>
              )
            }
            <div className='total-fixed-book-detail' style={{ margin: '-10px 15px', marginBottom: '10px' }}>
              <div>
                {
                  housePrice &&
                  housePrice?.feeHouses &&
                  numberOfNights >= 3 &&
                  housePrice.feeHouses[0] &&
                  (
                    <p className='detail-text-payment-book-body'>{housePrice?.feeHouses[0]?.fee.name}</p>
                  )
                }
              </div>
              <div>
                {
                  housePrice &&
                  housePrice?.feeHouses &&
                  numberOfNights >= 3 &&
                  housePrice.feeHouses[0] &&
                  (
                    <p>${housePrice?.feeHouses[0]?.price}</p>
                  )
                }
              </div>
            </div>
            <div className='total-fixed-book-detail' style={{ margin: '-10px 15px', marginBottom: '10px' }}>
              <div>
                {
                  housePrice &&
                  housePrice?.feeHouses &&
                  numberOfNights === 2 &&
                  housePrice.feeHouses[0] &&
                  (
                    <p className='detail-text-payment-book-body'>{housePrice?.feeHouses[1]?.fee.name}</p>
                  )
                }
              </div>
              <div>
                {
                  housePrice &&
                  housePrice?.feeHouses &&
                  numberOfNights === 2 &&
                  housePrice.feeHouses[0] &&
                  (
                    <p>${housePrice?.feeHouses[1]?.price}</p>
                  )
                }
              </div>
            </div>
            <div className='total-fixed-book-detail' style={{ margin: '-10px 15px', marginBottom: '10px' }}>
              <div>
                {
                  housePrice &&
                  housePrice?.feeHouses &&
                  housePrice.feeHouses[2] && 
                  countPets > 0 && (
                    <p className='detail-text-payment-book-body'>{housePrice?.feeHouses[2]?.fee.name}</p>
                  )
                }
              </div>
              <div>
                {
                  housePrice &&
                  housePrice?.feeHouses &&
                  housePrice.feeHouses[0] && 
                  countPets > 0 && (
                    <p>${housePrice?.feeHouses[2]?.price}</p>
                  )
                }
              </div>
            </div>
            <div className='total-fixed-book-detail' style={{ margin: '-10px 15px', marginBottom: '10px' }}>
              <div>
                {
                  housePrice &&
                  housePrice?.feeHouses &&
                  housePrice.feeHouses[3] && 
                  housePrice?.feeHouses[3]?.other && 
                  ((countOld + countYoung) - Number(housePrice?.feeHouses[3]?.other) > 0) && (
                    <p className='detail-text-payment-book-body'>{housePrice?.feeHouses[3]?.fee.name}</p>
                  )
                }
              </div>
              <div>
                {
                  housePrice &&
                  housePrice?.feeHouses &&
                  housePrice.feeHouses[3] && 
                  housePrice?.feeHouses[3]?.other && 
                  ((countOld  + countYoung) - Number(housePrice?.feeHouses[3]?.other) > 0) &&(
                    <p>${((countOld  + countYoung) - Number(housePrice?.feeHouses[3]?.other)) * housePrice?.feeHouses[3]?.price}</p>
                  )
                }
              </div>
            </div>
          </div>
          <hr style={{ width: '95%', margin: '-10px 10px' }} />
          <div className='price-detail-fixed-book-detail'>
            <div className='total-fixed-book-detail' style={{ margin: '20px 11px' }}>
              <div>
                <h3>Tổng <span className='span-tag-text-body'>(USD)</span> </h3>
              </div>
              <div>
                <h3>
                  {
                    housePrice &&
                    housePrice.feeHouses &&
                    numberOfNights && '$' + (
                      housePrice.price * (numberOfNights - countWeekendDay) +
                      (countWeekendDay > 0 && housePrice.weekendPrice ? housePrice.weekendPrice * countWeekendDay : housePrice.price * countWeekendDay) +
                      (numberOfNights >= 3 && housePrice.feeHouses[0]?.price || 0) +
                      (numberOfNights === 2 && housePrice.feeHouses[1]?.price || 0) +
                      (countPets > 0 && housePrice.feeHouses[2]?.price || 0) +
                      ((countOld + countYoung) - Number(housePrice?.feeHouses[3]?.other) > 0 && 
                      ((countOld + countYoung) - Number(housePrice?.feeHouses[3]?.other)) * housePrice.feeHouses[3]?.price || 0)
                    ).toFixed(2)
                  }
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookBody