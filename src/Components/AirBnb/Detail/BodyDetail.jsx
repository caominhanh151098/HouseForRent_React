import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import "../AirBnbDetail.css"
import { Link, useParams } from 'react-router-dom';
import { API_BLOCKING_DATE_BY_HOUSE_ID, API_BLOCK_REVERSATION_BY_HOUSE_ID, API_HOUSE_COMFORTABLE_DETAIL, API_HOUSE_DETAIL_URL, API_HOUSE_REVIEW, API_HOUSE_REVIEWS } from '../../../Services/common';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { DateRangePickerDay as MuiDateRangePickerDay } from '@mui/x-date-pickers-pro/DateRangePickerDay';
import LocationDetail from './LocationDetail';
import ConvertDateReview from './ConvertDateReview';
import _ from 'lodash';
import GradientButton from './GradientButton';
import { el } from 'date-fns/locale';
import BookingProvider from '../Book/Main/BookingProvider';
import BookingContext from '../Book/Main/BookingContext';
import { API_HOUSE_DETAIL_PRICE } from './../../../Services/common';
import SvgSlider from './SvgSlider';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ImagesSlider from './ImagesSlider';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const BodyDetail = () => {
    const [indexImg, setIndexImg] = useState(0)
    const { houseID, CountOld, CountYoung, CountBaby, CountPet, GoDay, BackDay } = useParams();
    const [house, setHouse] = useState({})
    const [isOverLayImages, setIsOverLayImages] = useState(false)
    const [isOverLayImagesSlider, setIsOverLayImagesSlider] = useState(false)
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [isOverlayComfortable, setIsOVerlayComfortable] = useState(false)
    const [isOverlayReviews, setIsOVerlayReviews] = useState(false)
    const [isOverlayCancellationPolicy, setIsOverlayCancellationPolicy] = useState(false)
    const [searchReviews, setSearchReviews] = useState('');
    const [filteredReviewsSearch, setFilteredReviewsSearch] = useState([]);
    const [houseComfortable, setHouseComfortable] = useState([]);
    const [houseReview, setHouseReview] = useState({})
    const [houseReviews, setHouseReviews] = useState({})
    const [loadingInputSearch, setLoadingInputSearch] = useState(false)
    const [selectedDates, setSelectedDates] = useState([null, null
    ]);
    const [selectNoRefund, setSelectNoRefund] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isTruncated, setIsTruncated] = useState(true);
    const [countOld, setCountOld] = useState(CountOld ? Number(CountOld) : 1);
    const [countYoung, setCountYoung] = useState(CountYoung ? Number(CountYoung) : 0);
    const [countBaby, setCountBaby] = useState(CountBaby ? Number(CountBaby) : 0);
    const [countPets, setCountPets] = useState(CountPet ? Number(CountPet) : 0);
    const [housePrice, setHousePrice] = useState({});
    const [checkAvailableRoom, setCheckAvailableRoom] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleImageClick = (index) => {
        setCurrentImageIndex(index);
        toggleOverlayImagesSlider();
    };


    const [maxDay, setMaxDay] = useState();
    const [hasSelectedDepartureDate, setHasSelectedDepartureDate] = useState(false);
    const [chooseGoDay, setIsChooseGoDay] = useState(false);
    const handleDateChange = (newDates, selectionState) => {
        const selectedDate = dayjs(newDates[0]);
        setIsChooseGoDay(true);
        const nextDate = dayjs(newDates[0] || newDates[1]).add(1, 'day');

        const isNextDateDisabled = shouldDisableDates.includes(nextDate.format('YYYY-MM-DD')) && selectedDates[0] == null;

        if (isNextDateDisabled) {
            toast.error('Đây là ngày chỉ dành cho trả phòng');

            setSelectedDates([null, null]);
            setHasSelectedDepartureDate(false);
            return;
        }
        const closestDate = shouldDisableDates
            .filter(date => date > selectedDate.format('YYYY-MM-DD'))
            .sort((a, b) => new Date(a) - new Date(b))[0];

        const maxDay = closestDate ? dayjs(closestDate) : null;
        setMaxDay(maxDay)
        if (selectedDates[0] !== null && selectedDates[1] != null) {
            setSelectedDates([null, null])
        } else if (selectedDates[0] == null) {
            setSelectedDates([newDates[0] || newDates[1], null])
        } else {
            setSelectedDates([selectedDates[0],
            newDates[0].format('YYYY-MM-DD') === selectedDates[0].format('YYYY-MM-DD') ?
                newDates[1] : newDates[0]])
        }
        if (newDates[1]) {
            setCheckAvailableRoom(false)
            setMaxDay(null);
        }
        if (newDates[0] && newDates[1]) {
            setHasSelectedDepartureDate(true);
        } else {
            setHasSelectedDepartureDate(false);
        }
    };

    const numberOfNights = selectedDates[1] && selectedDates[0] ? selectedDates[1].diff(selectedDates[0], 'day') : null;

    const handleResetDates = () => {
        if (!chooseGoDay) {
            toast.error('Vui lòng chọn ngày đi trước');
            return;
        }
        if (!hasSelectedDepartureDate) {
            toast.error('Vui lòng chọn ngày trả phòng trước');
            return;
        }
        setIsChooseGoDay(false);
        setSelectedDates([null, null]);
        setMaxDay(null);
    };

    useEffect(() => {
        async function getHouseDetail() {
            let res = await fetch(API_HOUSE_DETAIL_URL + `${houseID}`);
            let housedtl = await res.json()
            setHouse(housedtl)
        }
        getHouseDetail();
    }, [])

    useEffect(() => {
        async function getComfortableDetail() {
            let res = await fetch(API_HOUSE_COMFORTABLE_DETAIL + `${houseID}`);
            let houseComfordtl = await res.json();
            setHouseComfortable(houseComfordtl);
        }
        getComfortableDetail();
    }, [])

    // const totalComfortables = house?.miniListComfortable?.length;

    useEffect(() => {
        async function getReviewHouse() {
            let res = await fetch(API_HOUSE_REVIEW + `${houseID}`);
            let houseReview = await res.json();
            setHouseReview(houseReview);
        }
        getReviewHouse();
        document.querySelector('.MuiDateRangeCalendar-root div').style.display = 'none';
        // document.querySelector('.check-room-available-book-detail .MuiDateRangeCalendar-root div').style.display = 'none'
    }, [])

    const sixLastestReviews = houseReview?.reviews?.length >= 6 ? houseReview?.reviews.slice(0, 6)
        .sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)) :
        houseReview?.reviews?.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));

    useEffect(() => {
        async function getReviewsHouse() {
            let res = await fetch(API_HOUSE_REVIEWS + `${houseID}`);
            let houseReviews = await res.json();
            setHouseReviews(houseReviews);
        }
        getReviewsHouse();
    }, [])

    const lastestReviews = houseReviews ? houseReviews?.content?.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)) : null;

    const toggleOverlayImages = () => {
        setIsOverLayImages(!isOverLayImages);
        if (!isOverLayImages) {
            document.querySelector('.leaflet-control').style.display = 'none';
            document.querySelector('.leaflet-control-attribution').style.display = 'none'
        } else {
            document.querySelector('.leaflet-control').style = 'block';
            document.querySelector('.leaflet-control-attribution').style = 'block'
        }
    }

    const toggleOverlayImagesSlider = () => {
        setIsOverLayImagesSlider(!isOverLayImagesSlider);
        if (!isOverLayImagesSlider) {
            document.querySelector('.leaflet-control').style.display = 'none';
            document.querySelector('.leaflet-control-attribution').style.display = 'none'
        } else {
            document.querySelector('.leaflet-control').style = 'block';
            document.querySelector('.leaflet-control-attribution').style = 'block'
        }
    }

    const toggleOverlay = () => {
        setIsOverlayVisible(!isOverlayVisible);
        if (!isOverlayVisible) {
            document.querySelector('.leaflet-control').style.display = 'none';
            document.querySelector('.leaflet-control-attribution').style.display = 'none'
        } else {
            document.querySelector('.leaflet-control').style = 'block';
            document.querySelector('.leaflet-control-attribution').style = 'block'
        }
    };

    const toggleOverlayCancellationPolicy = () => {
        setIsOverlayCancellationPolicy(!isOverlayCancellationPolicy);
    };

    const toggleOverlayComfortable = () => {
        setIsOVerlayComfortable(!isOverlayComfortable);
        if (!isOverlayComfortable) {
            document.querySelector('.css-1nkg345-MuiButtonBase-root-MuiIconButton-root-MuiPickersArrowSwitcher-button').style.display = 'none'
            document.querySelector('.MuiIconButton-root').style.display = 'none'
        } else {
            document.querySelector('.css-1nkg345-MuiButtonBase-root-MuiIconButton-root-MuiPickersArrowSwitcher-button').style = 'block'
            document.querySelector('.MuiIconButton-root').style = 'block'
        }
    };

    const toggleOverlayReviews = () => {
        setIsOVerlayReviews(!isOverlayReviews);
        if (!isOverlayReviews) {
            document.querySelector('.leaflet-control').style.display = 'none';
            document.querySelector('.leaflet-control-attribution').style.display = 'none'
        } else {
            document.querySelector('.leaflet-control').style = 'block';
            document.querySelector('.leaflet-control-attribution').style = 'block'
        }
    };

    const increaseOld = () => {
        if (countOld + countYoung < maxGuests) {
            setCountOld((prevCount) => prevCount + 1)
        }
    }
    const decreaseOld = () => {
        if (countOld > 0) {
            setCountOld((prevCount) => prevCount - 1)
        }
    }

    const increaseYoung = () => {
        if (countOld + countYoung < maxGuests) {
            setCountYoung((prevCount) => prevCount + 1)
        }
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


    const DateRangePickerDay = styled(MuiDateRangePickerDay)(
        ({
            theme,
            isHighlighting,
            isStartOfHighlighting,
            isEndOfHighlighting,
            outsideCurrentMonth,
        }) => ({
            ...(!outsideCurrentMonth &&
                isHighlighting && {
                borderRadius: 0,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
                '&:hover, &:focus': {
                    backgroundColor: theme.palette.primary.dark,
                },
            }),
            ...(isStartOfHighlighting && {
                borderTopLeftRadius: '50%',
                borderBottomLeftRadius: '50%',
            }),
            ...(isEndOfHighlighting && {
                borderTopRightRadius: '50%',
                borderBottomRightRadius: '50%',
            }),
            ...(isHighlighting && {
                // Thêm className range-highlight nếu nằm trong khoảng đang chọn
                '& .range-highlight': {
                    backgroundColor: 'red',
                    opacity: 0.5,
                },
            }),
        }),
    );

    const handleInputSearchReviews = _.debounce((e) => {
        setLoadingInputSearch(true);
        const searchTerm = e.target.value.toLowerCase();

        setSearchReviews(searchTerm);

        const filteredReviews = lastestReviews.filter(
            review => review.content.toLowerCase().includes(searchTerm)
        );

        setFilteredReviewsSearch(filteredReviews);
        setLoadingInputSearch(false)
    }, 500)

    const maxLength = 100;
    const description = house?.description?.listingDescription;

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
        setIsTruncated(!isTruncated);
    };

    const truncatedDescription = description && description.length > maxLength
        ? `${description.substring(0, maxLength)}...`
        : description;




    const [isOpenCountGuests, setIsOpenCountGuests] = useState(false);
    const [isUpOpenCountGuests, setIsUpOpenCountGuests] = useState(false);

    const toggleCountGuestsDetails = () => {
        setIsOpenCountGuests(!isOpenCountGuests);
        setIsUpOpenCountGuests(!isUpOpenCountGuests);
    };

    const { bookingInfo, setBookingInfo } = useContext(BookingContext);

    const handleClick = () => {
        const newBookingInfo = {
            numReview: house?.numReview,
            srcImg: house.images[0].srcImg,
            goDay: selectedDates[0].format('D [thg] M YYYY'),
            backDay: selectedDates[1].format('D [thg] M YYYY'),
        };

        setBookingInfo(newBookingInfo);
        localStorage.setItem('bookingInfo', JSON.stringify(bookingInfo))
    };

    useEffect(() => {
        async function getHousePrice() {
            let res = await fetch(API_HOUSE_DETAIL_PRICE + `${houseID}`)
            let price = await res.json();
            setHousePrice(price)
        }
        getHousePrice();
    }, [])

    const handleCheckAvailableRoom = () => {
        setCheckAvailableRoom(!checkAvailableRoom)
    }
    useEffect(() => {
        if (checkAvailableRoom) {
            document.querySelector('.check-room-available-book-detail .MuiStack-root .MuiDateRangeCalendar-root div').style.display = 'none';
        }
    }, [checkAvailableRoom])

    const requestDetail = house?.requestDetail;
    const requestMaxGuest = requestDetail ? requestDetail.match(/\d+/) : null;
    const maxGuests = requestMaxGuest ? parseInt(requestMaxGuest[0]) : null;

    let maxHeight = 0;

    if (house && house?.rooms) {
        house.rooms.forEach(item => {
            const divs = document.querySelectorAll('.div-detail-where-you-sleep');
            divs.forEach(div => {
                const height = div.clientHeight;
                if (height > maxHeight) {
                    maxHeight = height;
                }
            });
        });
    }

    const [count, setCount] = useState(0)
    let size = house ? house?.rooms ? house?.rooms.length : 0 : 0;
    let imgArrHouse = house && house?.rooms ? house?.rooms : [];
    useEffect(() => {
        let count = 0;
        for (let i = 0; i < size; i++) {
            if (imgArrHouse[i]?.image !== undefined && imgArrHouse[i]?.image !== null) {
                count += 1;
            }
        }
        setCount(count);
    }, [size])

    useEffect(() => {
        const fixedBook = document.querySelector('.fixed-book');
        let isFixed = false;

        window.addEventListener('scroll', () => {
            const offset = window.scrollY;

            if (offset >= 700 && !isFixed) {
                fixedBook.style.position = 'fixed';
                fixedBook.style.top = '100' + 'px';
                isFixed = true;
            }
            if (offset > 2006 && isFixed) {
                fixedBook.style.position = 'absolute';
                fixedBook.style.top = '227%';
                isFixed = false;
            }
            if (offset < 680 && isFixed) {
                fixedBook.style.position = 'absolute';
                fixedBook.style.top = '86%';
                isFixed = false;
            }
        });
    }, []);

    // useEffect(() => {
    //     HouseService.getShowCancellationPolicy(selectedDates, house, selectNoRefund ? true : false);
    // }, [selectedDates, selectNoRefund])

    function srcset(image, width, height, rows = 1, cols = 1) {
        return {
            src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
            srcSet: `${image}?w=${width * cols}&h=${height * rows
                }&fit=crop&auto=format&dpr=2 2x`,
        };
    }

    const getHost = (str) => {
        const matches = str.match(/Chủ nhà (.+)/);
        return matches ? matches[1] : null;
    };

    const totalComfortable = houseComfortable.reduce((acc, type) => acc + type.comfortableDetailList.length, 0) || null;

    const [reservedDates, setReservedDates] = useState([]);
    const [blockedDates, setBlockedDates] = useState([]);

    useEffect(() => {
        // Gọi API để lấy danh sách các ngày đã đặt
        axios.get(API_BLOCK_REVERSATION_BY_HOUSE_ID + houseID)
            .then(response => {
                const dates = response.data.map(reservation => ({
                    checkInDate: dayjs(reservation.checkInDate).format('YYYY-MM-DD'),
                    checkOutDate: dayjs(reservation.checkOutDate).format('YYYY-MM-DD')
                }));
                setReservedDates(dates);
            })
            .catch(error => {
                console.error('Error fetching reserved dates:', error);
            });

        // Gọi API để lấy danh sách các ngày bị chặn
        axios.get(API_BLOCKING_DATE_BY_HOUSE_ID + houseID)
            .then(response => {
                const dates = response.data.map(item => dayjs(item.blockingDate).format('YYYY-MM-DD'));
                setBlockedDates(dates);
            })
            .catch(error => {
                console.error('Error fetching blocked dates:', error);
            });
    }, [houseID]);

    // const shouldDisableDate = (date) => {
    //     const formattedDate = date.format('YYYY - MM - DD');

    //     return blockedDates.some(item => item.blockingDate === formattedDate);
    // };

    const shouldDisableDates = [...reservedDates.map(reservation => reservation.checkInDate), ...blockedDates];

    // Kiểm tra mảng đã tạo
    const ref = useRef();
    const shouldDisableDate = (date) => {
        const formattedDate = date.format('YYYY-MM-DD');

        const isReserved = reservedDates.some(reservation =>
            formattedDate >= reservation.checkInDate && formattedDate <= reservation.checkOutDate
        );

        const isBlocked = blockedDates.includes(formattedDate);

        return isReserved || isBlocked;
    };

    const formatCurrency = (item) => {
        const formater = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        })
        return formater.format(item).replace('₫', 'VNĐ')
    }
    return (
        <>
            <ToastContainer
                position="bottom-right"
                autoClose={5000} // Thời gian tự động đóng toast (5 giây)
                // hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className='body-detail'>
                <div>
                    <div className='title'>
                        <h1>
                            <svg className='svg-title' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-label="Tiêu đề được dịch tự động: Cabin 1 - Cabin sang trọng bên sườn núi với chế độ xem Batulao" role="img" focusable="false">
                                <path d="M9 0a1 1 0 0 1 1 .88V6h5a1 1 0 0 1 1 .88V15a1 1 0 0 1-.88 1H7a1 1 0 0 1-1-.88V10H1a1 1 0 0 1-1-.88V1a1 1 0 0 1 .88-1H9zm1.73 7-1.4.5.24.21.13.13c.12.13.23.25.3.36l.08.1.05.07.04.08H7.31v1.3h1.2l.17.53.1.26.1.3A6.3 6.3 0 0 0 10 12.61c-.5.32-1.12.61-1.87.87l-.33.11-.35.11-.44.14.72 1.15.4-.13.4-.12c1-.35 1.83-.76 2.48-1.22.57.4 1.28.77 2.12 1.08l.37.14.38.12.41.13.72-1.15-.45-.14-.26-.08-.34-.11a9.23 9.23 0 0 1-1.94-.9 6.3 6.3 0 0 0 1.07-1.7l.13-.31.11-.33.17-.52h1.2V8.45h-3.05l-.1-.23A3.7 3.7 0 0 0 11 7.3l-.12-.15-.14-.15zm1.35 2.76-.04.13-.08.22-.1.27a4.99 4.99 0 0 1-.86 1.38 4.95 4.95 0 0 1-.74-1.13l-.12-.25-.1-.27-.08-.22-.04-.13h2.16zM9 1H1v8h5V7l.01-.17H3.83L3.43 8H2l2.26-6h1.48l1.5 4H9V1zM5 3.41 4.25 5.6h1.5L5 3.41z"></path>
                            </svg>
                            {house.hotelName}
                        </h1>
                    </div>
                    <div className='review'>
                        <div>
                            <p><i className="fa-solid fa-star"></i> {house.reviewPoint} ·
                                <span className='text' style={{ textDecoration: 'underline' }}>{house.numReview} đánh giá</span>
                                <span className='text'><i className="fa-solid fa-medal"></i> Chủ nhà siêu cấp</span>
                                <span className='text' style={{ textDecoration: 'underline' }}>{house.location?.address}</span>
                            </p>
                        </div>
                        <div>
                            <p>
                                <span className='text'><i className="fa-solid fa-arrow-up-from-bracket"></i> <span style={{ textDecoration: 'underline' }} > Chia sẻ</span></span>
                                <span className='text'> <i className="fa-regular fa-heart"></i> <span style={{ textDecoration: 'underline' }} > Lưu</span></span>
                            </p>
                        </div>
                    </div>
                    {
                        house.images && (
                            <div className='image-house-detail'>
                                <div className='img0'>
                                    <img src={house.images[0].srcImg} />
                                </div>
                                <div className='imgs'>
                                    <img src={house.images[1].srcImg} />
                                    <img src={house.images[2].srcImg}
                                        style={{ borderRadius: '0px 30px 0px 0px' }} />
                                    <img src={house.images[3].srcImg} />
                                    <img src={house.images[4].srcImg}
                                        style={{ borderRadius: '0px 0px 30px 0px' }} />
                                    <div>
                                        <button onClick={toggleOverlayImages} className='btn-show-imgs'> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" role="presentation" focusable="false" style={{ height: '16px', width: '16px', fill: 'currentcolor', margin: '-3px 1px' }}><path fillRule="evenodd" d="M3 11.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"></path></svg>
                                            <span style={{ padding: '0px 8px' }}>Hiển thị tất cả ảnh</span>
                                        </button>
                                        {(
                                            <div className={`overlay2 ${isOverLayImages ? '' : 'd-none'}`} >
                                                <div style={{ width: '100%', height: '100%' }}
                                                    className={`appearing-div ${isOverLayImages ? 'active' : ''}`}>
                                                    <div>
                                                        <i onClick={toggleOverlayImages} className="fa-solid fa-xmark close-description" ></i>
                                                    </div>
                                                    <div className='container-description-details'>
                                                        <div className='div-show-all-images'>
                                                            <h1>Tổng quan chỗ ở</h1>
                                                            <div>
                                                                <ImageList
                                                                // sx={{
                                                                //     width: 1555,
                                                                //     height: 450,
                                                                //     // Promote the list into its own layer in Chrome. This costs memory, but helps keeping high FPS.
                                                                //     transform: 'translateZ(0)',
                                                                // }}
                                                                // rowHeight={200}
                                                                // gap={1}
                                                                >
                                                                    {house?.images?.map((item, index) => {
                                                                        const cols = (index % 3 === 0) ? 2 : 1;
                                                                        const rows = item.featured ? 2 : 1;



                                                                        return (
                                                                            <ImageListItem
                                                                                className={`${index % 3 === 0 ? 'img-full-show-all-details' : 'img-show-all-details'}`}
                                                                                key={item.srcImg} cols={cols} rows={rows}
                                                                                onClick={() => handleImageClick(index)}
                                                                            >
                                                                                <img
                                                                                    className={`${index % 3 === 0 ? 'img-full-show-all-details' : 'img-show-all-details'}`}
                                                                                    {...srcset(item.srcImg, 250, 200, rows, cols)}
                                                                                    alt={item.description}
                                                                                    loading="lazy"
                                                                                />
                                                                                <ImageListItemBar
                                                                                    sx={{
                                                                                        background:
                                                                                            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                                                                            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                                                                    }}
                                                                                    title={item.description}
                                                                                    position="top"
                                                                                // actionIcon={
                                                                                //     <IconButton
                                                                                //         sx={{ color: 'white' }}
                                                                                //         aria-label={`star ${item.description}`}
                                                                                //     >
                                                                                //         <StarBorderIcon />
                                                                                //     </IconButton>
                                                                                // }
                                                                                // actionPosition="left"
                                                                                />
                                                                            </ImageListItem>
                                                                        );
                                                                    })}
                                                                </ImageList>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {(
                                            <div className={`overlay2 ${isOverLayImagesSlider ? '' : 'd-none'}`} >
                                                <div style={{ width: '100%', height: '100%', maxHeight: '100%' }}
                                                    className={`appearing-div ${isOverLayImagesSlider ? 'active' : ''}`}>
                                                    <div>
                                                        <i onClick={toggleOverlayImagesSlider} className="fa-solid fa-xmark close-description" ></i>
                                                    </div>
                                                    <div className='container-description-details'>
                                                        <div>
                                                            <h1 style={{ textAlign: 'center' }}>Tổng quan chỗ ở</h1>
                                                            <div className='slider-images-show-all'>
                                                                <ImagesSlider style={{ maxLength: '1000px' }} house={house} currentImageIndex={currentImageIndex} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    <div className='details'>
                        <div className='details-container'>
                            <div className='title'>
                                <div className='information-house'>
                                    <div>
                                        <h1 >{house.title} </h1>
                                        <h3 style={{ letterSpacing: '2px' }}>{house.requestDetail}</h3>
                                    </div>
                                    {
                                        house.user && (
                                            <div>
                                                <img className='avatar' src={house.user.avatar} alt="" />
                                                <svg className='avatar2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 14" aria-hidden="true" role="presentation" focusable="false"><linearGradient id="a" x1="8.5%" x2="92.18%" y1="17.16%" y2="17.16%"><stop offset="0" stopColor="#e61e4d"></stop><stop offset=".5" stopColor="#e31c5f"></stop><stop offset="1" stopColor="#d70466"></stop></linearGradient><path fill="#fff" d="M9.93 0c.88 0 1.6.67 1.66 1.52l.01.15v2.15c0 .54-.26 1.05-.7 1.36l-.13.08-3.73 2.17a3.4 3.4 0 1 1-2.48 0L.83 5.26A1.67 1.67 0 0 1 0 3.96L0 3.82V1.67C0 .79.67.07 1.52 0L1.67 0z"></path><path fill="url(#a)" d="M5.8 8.2a2.4 2.4 0 0 0-.16 4.8h.32a2.4 2.4 0 0 0-.16-4.8zM9.93 1H1.67a.67.67 0 0 0-.66.57l-.01.1v2.15c0 .2.1.39.25.52l.08.05L5.46 6.8c.1.06.2.09.29.1h.1l.1-.02.1-.03.09-.05 4.13-2.4c.17-.1.3-.29.32-.48l.01-.1V1.67a.67.67 0 0 0-.57-.66z"></path></svg>
                                            </div>
                                        )
                                    }

                                </div>

                            </div>
                            <hr className='hr'></hr>
                            <div>
                                <div className='title' style={{ display: 'flex', alignItems: 'center' }}>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ height: '26px', width: '25px', fill: 'currentcolor' }}><path d="M1.67 2.68A2 2 0 0 1 4.1.72l.14.04L16.01 4.3 27.78.91a2 2 0 0 1 2.53 1.63l.02.14v23.25a2 2 0 0 1-1.27 1.85l-.15.06-12.62 3.78a1 1 0 0 1-.46.03l-.12-.03L3.1 27.84a2 2 0 0 1-1.42-1.75v-.17zm2 0v23.24L16 29.62l12.33-3.7V2.82L16.28 6.3a1 1 0 0 1-.46.03l-.1-.03zm21.66 17.48v2.08L16 25.04v-2.08zm0-6v2.08L16 19.04v-2.08zm0-6v2.08L16 13.04v-2.08z"></path></svg>
                                    </div>
                                    <div className='main'>
                                        <h3>Được giới thiệu trong</h3>
                                        <p>{house && house.title && getHost(house?.title)}</p>
                                    </div>
                                </div>
                                <div className='title' style={{ display: 'flex', alignItems: 'center' }}>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ height: '26px', width: '25px', fill: 'currentcolor' }}><path d="M2 4a1 1 0 0 1 1.62-.78l.09.07 25 25a1 1 0 0 1-.6 1.7L28 30H3a1 1 0 0 1-1-.88V29zm2 2.42V28h21.59l-4.09-4.09-1.8 1.8-1.4-1.42 1.78-1.8-2.58-2.58-1.8 1.8-1.4-1.42 1.78-1.8-2.58-2.58-1.8 1.8-1.4-1.42 1.78-1.8-2.58-2.58-1.8 1.8-1.4-1.42 1.78-1.8zM7 17a1 1 0 0 1 1.62-.78l.09.07 7 7a1 1 0 0 1-.6 1.7L15 25H8a1 1 0 0 1-1-.88V24zm5.3-15.2a1 1 0 0 1 1.31-.09l.1.08 15.5 15.5a1 1 0 0 1 .15.2l.05.1 2 4.5a1 1 0 0 1-1.1 1.4l-.1-.03-5-1.5a1 1 0 0 1-.32-.17l-.1-.08L9.3 6.2a1 1 0 0 1-.08-1.32l.08-.1zM9 19.4V23h3.58zm7.25-12.25-1.58 1.59L26.02 20.1l2.67.8-1.04-2.33zM13 3.91 11.42 5.5l1.83 1.83 1.58-1.58z"></path></svg>
                                    </div>
                                    <div className='main'>
                                        <h3>Người thiết kế là</h3>
                                        <p>{house && house.title && getHost(house?.title)}</p>
                                    </div>
                                </div>
                                <div className='title' style={{ display: 'flex', alignItems: 'center' }}>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ height: '26px', width: '25px', fill: 'currentcolor' }}><path d="M11.67 0v1.67h8.66V0h2v1.67h6a2 2 0 0 1 2 1.85v16.07a2 2 0 0 1-.46 1.28l-.12.13L21 29.75a2 2 0 0 1-1.24.58H6.67a5 5 0 0 1-5-4.78V3.67a2 2 0 0 1 1.85-2h6.15V0zm16.66 11.67H3.67v13.66a3 3 0 0 0 2.82 3h11.18v-5.66a5 5 0 0 1 4.78-5h5.88zm-.08 8h-5.58a3 3 0 0 0-3 2.82v5.76zm-18.58-16h-6v6h24.66v-6h-6v1.66h-2V3.67h-8.66v1.66h-2z"></path></svg>
                                    </div>
                                    <div className='main'>
                                        <h3>Huỷ miễn phí trong 48 giờ </h3>
                                    </div>
                                </div>
                            </div>
                            <hr className='hr'></hr>
                            <div>
                                <div className='title'>
                                    <p>
                                        <svg className='svg-title' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-label="Tiêu đề được dịch tự động: Cabin 1 - Cabin sang trọng bên sườn núi với chế độ xem Batulao" role="img" focusable="false" style={{ height: '26px', width: '25px' }}>
                                            <path d="M9 0a1 1 0 0 1 1 .88V6h5a1 1 0 0 1 1 .88V15a1 1 0 0 1-.88 1H7a1 1 0 0 1-1-.88V10H1a1 1 0 0 1-1-.88V1a1 1 0 0 1 .88-1H9zm1.73 7-1.4.5.24.21.13.13c.12.13.23.25.3.36l.08.1.05.07.04.08H7.31v1.3h1.2l.17.53.1.26.1.3A6.3 6.3 0 0 0 10 12.61c-.5.32-1.12.61-1.87.87l-.33.11-.35.11-.44.14.72 1.15.4-.13.4-.12c1-.35 1.83-.76 2.48-1.22.57.4 1.28.77 2.12 1.08l.37.14.38.12.41.13.72-1.15-.45-.14-.26-.08-.34-.11a9.23 9.23 0 0 1-1.94-.9 6.3 6.3 0 0 0 1.07-1.7l.13-.31.11-.33.17-.52h1.2V8.45h-3.05l-.1-.23A3.7 3.7 0 0 0 11 7.3l-.12-.15-.14-.15zm1.35 2.76-.04.13-.08.22-.1.27a4.99 4.99 0 0 1-.86 1.38 4.95 4.95 0 0 1-.74-1.13l-.12-.25-.1-.27-.08-.22-.04-.13h2.16zM9 1H1v8h5V7l.01-.17H3.83L3.43 8H2l2.26-6h1.48l1.5 4H9V1zM5 3.41 4.25 5.6h1.5L5 3.41z"></path>
                                        </svg>
                                        Một số thông tin đã được dịch tự động.
                                        <span style={{ textDecoration: 'underline', fontWeight: 'bolder', cursor: 'pointer' }}> Hiển thị ngôn ngữ gốc</span>
                                    </p>
                                    {
                                        house.description && (
                                            <p className='description'>{house.description.listingDescription}</p>
                                        )
                                    }
                                    <button className='btn-show-description' onClick={toggleOverlay}>
                                        <p>Hiển thị thêm  <span><i className="fa-solid fa-angle-right"></i></span></p>
                                    </button>

                                </div>
                                {(
                                    <div className={`overlay2 ${isOverlayVisible ? '' : 'd-none'}`} >
                                        <div className={`appearing-div ${isOverlayVisible ? 'active' : ''}`}>
                                            <div>
                                                <i onClick={toggleOverlay} className="fa-solid fa-xmark close-description" ></i>
                                            </div>
                                            <div className='container-description-details'>
                                                {
                                                    house.description?.listingDescription && (
                                                        <>
                                                            <h1>Giới thiệu về chỗ này</h1>
                                                            <p className='description'>{house.description.listingDescription}</p>
                                                        </>
                                                    )
                                                }
                                                {
                                                    house.description?.space && (
                                                        <>
                                                            <h2>Chỗ ở</h2>
                                                            <p className='description'>{house.description.space}</p>
                                                        </>
                                                    )
                                                }
                                                {
                                                    house.description?.guestAccess && (
                                                        <>
                                                            <h2>Tiện nghi khách có quyền sử dụng</h2>
                                                            <p className='description'>{house.description.guestAccess}</p>
                                                        </>
                                                    )
                                                }
                                                {
                                                    house.description?.other && (
                                                        <>
                                                            <h2>Những điều cần lưu ý khác</h2>
                                                            <p className='description'>{house.description.other}</p>
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <hr className='hr'></hr>
                            {
                                house && house?.rooms && size && count && size === count ? (
                                    <>
                                        <div>
                                            <div className='title'>
                                                <h2>Nơi bạn sẽ ngủ nghỉ</h2>
                                            </div>
                                            <div className='div-where-you-sleep'>
                                                <Slider
                                                    dots={true}
                                                    infinite={true}
                                                    speed={400}
                                                    slidesToShow={2.5}
                                                    slidesToScroll={1}
                                                    prevArrow={<div className="slick-arrow"><FontAwesomeIcon icon={faArrowLeft} /></div>}
                                                    nextArrow={<div className="slick-arrow"><FontAwesomeIcon icon={faArrowRight} /></div>}
                                                >
                                                    {
                                                        house && house?.rooms && (
                                                            house?.rooms.map((item, index) => (
                                                                <div className='div-where-you-sleep-have-image'
                                                                    key={index}>
                                                                    <div>
                                                                        <img className='img-div-where-you-sleep-have-image'
                                                                            src={item.image}>
                                                                        </img>
                                                                    </div>
                                                                    <div style={{ textAlign: 'center', width: '95%' }}>
                                                                        <h3>{item.name}</h3>
                                                                        <p>{item.bed}</p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )
                                                    }

                                                </Slider>
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                            </div>
                                        </div>
                                        <hr className='hr' style={{ marginTop: '36px' }}></hr>
                                    </>
                                ) :
                                    house && house?.rooms && size > 1 ?
                                        (
                                            <>
                                                <div>
                                                    <div className='title'>
                                                        <h2>Nơi bạn sẽ ngủ nghỉ</h2>
                                                    </div>
                                                    <div className='div-where-you-sleep'>
                                                        <Slider
                                                            dots={true}
                                                            infinite={true}
                                                            speed={400}
                                                            slidesToShow={2.5}
                                                            slidesToScroll={1}
                                                            prevArrow={<div className="slick-arrow"><FontAwesomeIcon icon={faArrowLeft} /></div>}
                                                            nextArrow={<div className="slick-arrow"><FontAwesomeIcon icon={faArrowRight} /></div>}
                                                        >
                                                            {
                                                                house && house?.rooms && (
                                                                    house?.rooms.map((item, index) => (
                                                                        <div style={{ height: `${maxHeight}px` }}
                                                                            className='div-detail-where-you-sleep' key={index}>
                                                                            <div className="svg-container">
                                                                                {Array?.from({ length: item?.bedDetail[0]?.quantity }, (_, i) => (
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
                                                                                        <path fillRule="evenodd" d={item?.bedDetail[0]?.iconPath}>
                                                                                        </path>
                                                                                    </svg>
                                                                                ))}
                                                                            </div>
                                                                            <div style={{ padding: '5px 30px' }}>
                                                                                <h3>{item.name}</h3>
                                                                                <p>{item.bed}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                )
                                                            }

                                                        </Slider>
                                                        <div></div>
                                                        <div></div>
                                                        <div></div>
                                                    </div>
                                                </div>
                                                <hr className='hr' style={{ marginTop: '36px' }}></hr>
                                            </>
                                        ) : (
                                            <></>
                                        )
                            }
                            <div>
                                <div className='title'>
                                    <h2>Nơi này có những gì cho bạn</h2>
                                </div>
                                <div className='container-comfortable'>
                                    {
                                        house.miniListComfortable && (
                                            house.miniListComfortable.slice(0, 10).map((item, index) => (
                                                <div key={index} className='comfortable'>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ height: '26px', width: '25px', fill: 'currentcolor' }}
                                                        className='svg-title comfortable-icon'>
                                                        <path d={item.icon}></path>
                                                    </svg>
                                                    <p>{item.name}</p>
                                                </div>
                                            ))
                                        )
                                    }
                                    {house.numComfortable > 8 && (
                                        <button className='btn-show-all-comfortable' onClick={toggleOverlayComfortable}>Hiển thị tất cả {house.numComfortable} tiện nghi</button>
                                    )}
                                    {(
                                        <div className={`overlay2 ${isOverlayComfortable ? '' : 'd-none'}`} >
                                            <div className={`appearing-div ${isOverlayComfortable ? 'active' : ''}`}>
                                                <div>
                                                    <i onClick={toggleOverlayComfortable} className="fa-solid fa-xmark close-description" ></i>
                                                </div>
                                                <div>
                                                    {
                                                        houseComfortable && (
                                                            <>
                                                                <h1>Nơi này có những gì cho bạn</h1>
                                                                <div className='comfortable-details'>
                                                                    {
                                                                        houseComfortable?.map((item, index) => (
                                                                            <div key={index}>
                                                                                <h2>{item.nameComfortableType}</h2>
                                                                                {
                                                                                    item.comfortableDetailList?.map((item) => (
                                                                                        <>
                                                                                            <div key={index} className='comfortable'>
                                                                                                <svg
                                                                                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ height: '26px', width: '25px', fill: 'currentcolor' }}
                                                                                                    className='svg-title comfortable-icon'>
                                                                                                    <path d={item.icon}></path>
                                                                                                </svg>
                                                                                                {item.status ? <p>{item.name}</p> : <del>{item.name}</del>}
                                                                                            </div>
                                                                                        </>
                                                                                    ))
                                                                                }
                                                                                <hr className='hr'></hr>
                                                                            </div>
                                                                        ))
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
                            <hr className='hr'></hr>
                            <div>
                                <div className='title'>
                                    <h2>{numberOfNights !== null ? `${numberOfNights} đêm tại ${house.hotelName}` : `${selectedDates[0] ? 'Chọn ngày trả phòng' : 'Chọn ngày đi'}`}</h2>
                                    <h3>{selectedDates[0] && selectedDates[1] ? (
                                        `${selectedDates[0].format('D [thg] M YYYY')} - ${selectedDates[1].format('D [thg] M YYYY')}`
                                    ) : (
                                        <div>
                                            <p style={{ opacity: '0.8' }}>Thêm ngày đi để biết giá chính xác</p>
                                        </div>
                                    )}</h3>
                                    <button className='btn-reset-daysbook'
                                        onClick={handleResetDates}>Đặt lại ngày</button>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateRangeCalendar']}>
                                            <DateRangeCalendar
                                                ref={ref}
                                                value={selectedDates}
                                                onChange={handleDateChange}
                                                minDate={selectedDates[0] ? selectedDates[0] : dayjs().add(1, 'day')}
                                                shouldDisableDate={shouldDisableDate}
                                                maxDate={maxDay}
                                                slots={{ day: (props) => <DateRangePickerDay {...props} className={props.isHighlighting ? 'range-highlight' : ''} /> }}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </div>
                            </div>
                            <hr className='hr' style={{ width: '140%' }}></hr>
                            <div style={{ width: '1200px' }}>
                                <div className='title'>
                                    <h3><i className="fa-solid fa-star"></i> {house.reviewPoint} ·
                                        <span className='text' style={{ textDecoration: 'underline' }}>{house.numReview} đánh giá</span>
                                    </h3>
                                    <div className='container-review'>
                                        {
                                            houseReview.reviewPointHouse && (
                                                <div className="rating-container">
                                                    <div className="rating-label" >
                                                        <span>Mức độ sạch sẽ: </span>
                                                    </div>
                                                    <span className='review-point'>{houseReview.reviewPointHouse.cleanlinessPoint}</span>
                                                    <div className="rating-bar" style={{ display: 'flex' }}>
                                                        <div className="filled-bar" style={{ width: `${(houseReview.reviewPointHouse.cleanlinessPoint / 5) * 100}%` }}></div>
                                                        <div className="empty-bar"></div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            houseReview.reviewPointHouse && (
                                                <div className="rating-container">
                                                    <div className="rating-label" >
                                                        <span>Độ chính xác :</span>
                                                    </div>
                                                    <span className='review-point'>{houseReview.reviewPointHouse.accuracyPoint}</span>
                                                    <div className="rating-bar" style={{ display: 'flex' }}>
                                                        <div className="filled-bar" style={{ width: `${(houseReview.reviewPointHouse.accuracyPoint / 5) * 100}%` }}></div>
                                                        <div className="empty-bar"></div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            houseReview.reviewPointHouse && (
                                                <div className="rating-container">
                                                    <div
                                                        className="rating-label" >Giao tiếp: </div>
                                                    <span
                                                        className='review-point'>{houseReview.reviewPointHouse.communicationPoint}</span>
                                                    <div className="rating-bar" style={{ display: 'flex' }}>
                                                        <div className="filled-bar" style={{ width: `${(houseReview.reviewPointHouse.communicationPoint / 5) * 100}%` }}></div>
                                                        <div className="empty-bar"></div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            houseReview.reviewPointHouse && (
                                                <div className="rating-container">
                                                    <div className="rating-label" >Vị trí: </div>
                                                    <span
                                                        className='review-point'>{houseReview.reviewPointHouse.locationPoint}</span>
                                                    <div className="rating-bar" style={{ display: 'flex' }}>
                                                        <div className="filled-bar" style={{ width: `${(houseReview.reviewPointHouse.locationPoint / 5) * 100}%` }}></div>
                                                        <div className="empty-bar"></div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            houseReview.reviewPointHouse && (
                                                <div className="rating-container">
                                                    <div className="rating-label">Nhận phòng: </div>
                                                    <span
                                                        className='review-point'>{houseReview.reviewPointHouse.checkInPoint}</span>
                                                    <div className="rating-bar" style={{ display: 'flex' }}>
                                                        <div className="filled-bar" style={{ width: `${(houseReview.reviewPointHouse.checkInPoint / 5) * 100}%` }}></div>
                                                        <div className="empty-bar"></div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            houseReview.reviewPointHouse && (
                                                <div className="rating-container">
                                                    <div className="rating-label" >Giá trị: </div>
                                                    <span
                                                        className='review-point'>{houseReview.reviewPointHouse.valuePoint}</span>
                                                    <div className="rating-bar" style={{ display: 'flex' }}>
                                                        <div className="filled-bar" style={{ width: `${(houseReview.reviewPointHouse.valuePoint / 5) * 100}%` }}></div>
                                                        <div className="empty-bar"></div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className='review-details'>
                                        {
                                            sixLastestReviews && (
                                                sixLastestReviews.map((review, index) => (
                                                    <div className='content-details' key={index}>
                                                        <div className='container-details-users'>
                                                            <img className='avatar-user-review'
                                                                src={review?.user?.avatar} alt="" />
                                                            <div >
                                                                <h3>{review?.user.lastName}</h3>
                                                                <ConvertDateReview date={review?.reviewDate}></ConvertDateReview>
                                                            </div>
                                                        </div>
                                                        <div className='content-user-review'>
                                                            <p>{review?.content}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            )

                                        }
                                    </div>
                                    {
                                        houseReview?.reviews?.length >= 2 && (
                                            <button className='btn-show-all-comfortable' onClick={toggleOverlayReviews}>Hiển thị tất cả {houseReviews?.totalElements} đánh giá</button>
                                        )
                                    }
                                    {(
                                        <div className={`overlay2 ${isOverlayReviews ? '' : 'd-none'}`} >
                                            <div style={{ width: '60%', height: '700px' }}
                                                className={`appearing-div ${isOverlayReviews ? 'active' : ''}`}>
                                                <div>
                                                    <i onClick={toggleOverlayReviews} className="fa-solid fa-xmark close-description" ></i>
                                                </div>
                                                <div className='active-reviews-container'>
                                                    <div className='active-reviews-main'>
                                                        <h2><i className="fa-solid fa-star"></i> {house.reviewPoint} ·
                                                            <span> {house.numReview} đánh giá</span>
                                                        </h2>
                                                        {
                                                            houseReview.reviewPointHouse && (
                                                                <div className="rating-container" style={{ width: '100%' }}>
                                                                    <div className="rating-label" >
                                                                        <span>Mức độ sạch sẽ: </span>
                                                                    </div>
                                                                    <span className='review-point'>{houseReview.reviewPointHouse.cleanlinessPoint}</span>
                                                                    <div className="rating-bar" style={{ display: 'flex' }}>
                                                                        <div className="filled-bar" style={{ width: `${(houseReview.reviewPointHouse.cleanlinessPoint / 5) * 100}%` }}></div>
                                                                        <div className="empty-bar"></div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            houseReview.reviewPointHouse && (
                                                                <div className="rating-container" style={{ width: '100%' }}>
                                                                    <div className="rating-label" >
                                                                        <span>Độ chính xác :</span>
                                                                    </div>
                                                                    <span className='review-point'>{houseReview.reviewPointHouse.accuracyPoint}</span>
                                                                    <div className="rating-bar" style={{ display: 'flex' }}>
                                                                        <div className="filled-bar" style={{ width: `${(houseReview.reviewPointHouse.accuracyPoint / 5) * 100}%` }}></div>
                                                                        <div className="empty-bar"></div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            houseReview.reviewPointHouse && (
                                                                <div className="rating-container" style={{ width: '100%' }}>
                                                                    <div
                                                                        className="rating-label" >Giao tiếp: </div>
                                                                    <span
                                                                        className='review-point'>{houseReview.reviewPointHouse.communicationPoint}</span>
                                                                    <div className="rating-bar" style={{ display: 'flex' }}>
                                                                        <div className="filled-bar" style={{ width: `${(houseReview.reviewPointHouse.communicationPoint / 5) * 100}%` }}></div>
                                                                        <div className="empty-bar"></div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            houseReview.reviewPointHouse && (
                                                                <div className="rating-container" style={{ width: '100%' }}>
                                                                    <div className="rating-label" >Vị trí: </div>
                                                                    <span
                                                                        className='review-point'>{houseReview.reviewPointHouse.locationPoint}</span>
                                                                    <div className="rating-bar" style={{ display: 'flex' }}>
                                                                        <div className="filled-bar" style={{ width: `${(houseReview.reviewPointHouse.locationPoint / 5) * 100}%` }}></div>
                                                                        <div className="empty-bar"></div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            houseReview.reviewPointHouse && (
                                                                <div className="rating-container" style={{ width: '100%' }}>
                                                                    <div className="rating-label">Nhận phòng: </div>
                                                                    <span
                                                                        className='review-point'>{houseReview.reviewPointHouse.checkInPoint}</span>
                                                                    <div className="rating-bar" style={{ display: 'flex' }}>
                                                                        <div className="filled-bar" style={{ width: `${(houseReview.reviewPointHouse.checkInPoint / 5) * 100}%` }}></div>
                                                                        <div className="empty-bar"></div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            houseReview.reviewPointHouse && (
                                                                <div className="rating-container" style={{ width: '100%' }}>
                                                                    <div className="rating-label" >Giá trị: </div>
                                                                    <span
                                                                        className='review-point'>{houseReview.reviewPointHouse.valuePoint}</span>
                                                                    <div className="rating-bar" style={{ display: 'flex' }}>
                                                                        <div className="filled-bar" style={{ width: `${(houseReview.reviewPointHouse.valuePoint / 5) * 100}%` }}></div>
                                                                        <div className="empty-bar"></div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className='active-reviews-extra'>
                                                        <div>
                                                            <i className="fa-solid fa-magnifying-glass icon-inp-search-review"></i>
                                                            <input className='input-search-reviews'
                                                                type="text" placeholder='Tìm kiếm đánh giá'
                                                                onChange={handleInputSearchReviews} />
                                                        </div>
                                                        <div className='container-lastest-reviews'>
                                                            {
                                                                searchReviews ?
                                                                    loadingInputSearch ? (
                                                                        <div><p>Đang tìm kiếm</p></div>
                                                                    ) : (
                                                                        filteredReviewsSearch?.length > 0 ? (
                                                                            filteredReviewsSearch?.map((review, index) => {
                                                                                return (
                                                                                    <div style={{ width: '100%' }} className='content-details' key={index}>
                                                                                        <div className='container-details-users'>
                                                                                            <img className='avatar-user-review' src={review?.user?.avatar} alt="" />
                                                                                            <div>
                                                                                                <h3>{review?.user.lastName}</h3>
                                                                                                <ConvertDateReview date={review?.reviewDate}></ConvertDateReview>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div style={{ width: '100%' }} className='content-user-review'>
                                                                                            <p>{review?.content}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })
                                                                        ) : (
                                                                            <div><p>Không tìm thấy đánh giá nào phù hợp</p></div>
                                                                        )
                                                                    ) : (
                                                                        lastestReviews && (
                                                                            lastestReviews.map((review, index) => (
                                                                                <div style={{ width: '100%' }}
                                                                                    className='content-details' key={index}>
                                                                                    <div className='container-details-users'>
                                                                                        <img className='avatar-user-review'
                                                                                            src={review?.user?.avatar} alt="" />
                                                                                        <div >
                                                                                            <h3>{review?.user.lastName}</h3>
                                                                                            <ConvertDateReview date={review?.reviewDate}></ConvertDateReview>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div style={{ width: '100%' }}
                                                                                        className='content-user-review'>
                                                                                        <p>{review?.content}</p>
                                                                                    </div>
                                                                                </div>
                                                                            ))
                                                                        )
                                                                    )
                                                            }

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                            <hr className='hr' style={{ width: '140%' }}></hr>
                            <div style={{ width: '1200px' }}>
                                <div className='title'>
                                    <h2>Nơi bạn sẽ đến</h2>
                                    {
                                        house?.location?.latitude && (
                                            <LocationDetail latitude={house.location.latitude} longitude={house.location.longitude} />
                                        )
                                    }
                                    <button className='btn-show-description' onClick={toggleOverlay}>
                                        <p>Hiển thị thêm  <span><i className="fa-solid fa-angle-right"></i></span></p>
                                    </button>
                                </div>
                            </div>
                            <hr className='hr' style={{ width: '140%' }}></hr>
                            <div style={{ width: '1200px' }}>
                                <div className='title'>
                                    {
                                        house.user && (
                                            <div>
                                                <div>
                                                    <Link to={'/user/show'}>
                                                        <img style={{ margin: '17px 0px' }}
                                                            className='avatar' src={house.user.avatar} alt="" />
                                                    </Link>
                                                    <svg style={{ padding: '90px 60px' }}
                                                        className='avatar2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 14" aria-hidden="true" role="presentation" focusable="false"><linearGradient id="a" x1="8.5%" x2="92.18%" y1="17.16%" y2="17.16%"><stop offset="0" stopColor="#e61e4d"></stop><stop offset=".5" stopColor="#e31c5f"></stop><stop offset="1" stopColor="#d70466"></stop></linearGradient><path fill="#fff" d="M9.93 0c.88 0 1.6.67 1.66 1.52l.01.15v2.15c0 .54-.26 1.05-.7 1.36l-.13.08-3.73 2.17a3.4 3.4 0 1 1-2.48 0L.83 5.26A1.67 1.67 0 0 1 0 3.96L0 3.82V1.67C0 .79.67.07 1.52 0L1.67 0z"></path><path fill="url(#a)" d="M5.8 8.2a2.4 2.4 0 0 0-.16 4.8h.32a2.4 2.4 0 0 0-.16-4.8zM9.93 1H1.67a.67.67 0 0 0-.66.57l-.01.1v2.15c0 .2.1.39.25.52l.08.05L5.46 6.8c.1.06.2.09.29.1h.1l.1-.02.1-.03.09-.05 4.13-2.4c.17-.1.3-.29.32-.48l.01-.1V1.67a.67.67 0 0 0-.57-.66z"></path></svg>
                                                </div>
                                                <div className='infor-host'>
                                                    <h3>Chủ nhà</h3>
                                                    <p>{house && house.title && getHost(house?.title)}</p>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div className='infor-host-detail'>
                                        <div className='infor-host-devide'>
                                            <div className='title-host-detail'>
                                                <div className='icon-host-detail'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '16px', width: '16px' }}><path fillRule="evenodd" d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1 0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"></path></svg>
                                                    <p>{house && house.numReview} đánh giá</p>
                                                </div>
                                                <div className='icon-host-detail'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '16px', width: '16px' }}><path d="m16 .8.56.37C20.4 3.73 24.2 5 28 5h1v12.5C29 25.57 23.21 31 16 31S3 25.57 3 17.5V5h1c3.8 0 7.6-1.27 11.45-3.83L16 .8zm7 9.08-9.5 9.5-4.5-4.5L6.88 17l6.62 6.62L25.12 12 23 9.88z"></path></svg>
                                                    <p>Đã xác minh danh tính</p>
                                                </div>
                                                <div className='icon-host-detail'>
                                                    <i style={{ marginRight: '15px' }} className="fa-solid fa-medal"></i>
                                                    <p>Chủ nhà siêu cấp</p>
                                                </div>
                                            </div>
                                            <div>
                                                {
                                                    house && (
                                                        <>
                                                            <p style={{ width: '90%' }}>{isTruncated ? truncatedDescription : description}</p>
                                                            {isTruncated ? (
                                                                <p className='text-underline' onClick={toggleDescription}>Tìm hiểu thêm</p>
                                                            ) : (
                                                                <p className='text-underline' onClick={toggleDescription}>Ẩn bớt</p>
                                                            )}
                                                        </>
                                                    )
                                                }
                                            </div>
                                            <div style={{ width: '90%' }}>
                                                {
                                                    house && (
                                                        <>
                                                            <h3>{house?.hotelName} là 1 chủ nhà siêu cấp</h3>
                                                            <p>Chủ nhà siêu cấp là những người có kinh nghiệm, được đánh giá cao và cam kết mang lại kỳ nghỉ tuyệt vời cho khách.</p>
                                                        </>
                                                    )
                                                }

                                            </div>
                                        </div>
                                        <div style={{ lineHeight: '2' }}
                                            className='infor-host-devide'>
                                            <p>Ngôn ngữ: Việt Nam</p>
                                            <p>Tỉ lệ phản hồi: 100%</p>
                                            <p>Thời gian phản hồi: Trong vòng 1 giờ</p>
                                            <button className='btn-contact-with-host'>Liên hệ với chủ nhà</button>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <i style={{ marginRight: '15px' }}
                                                    className="fa-solid fa-shield"></i>
                                                <p style={{ opacity: '0.8', width: '65%' }}>
                                                    Để bảo vệ khoản thanh toán của bạn, tuyệt đối không chuyển tiền hoặc liên lạc bên ngoài trang web hoặc ứng dụng Airbnb.</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <hr className='hr' style={{ width: '140%' }}></hr>
                            <div style={{ width: '1200px' }}>
                                <div className='title'>
                                    <h2>Những điều cần biết</h2>
                                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        <div style={{ width: '33%' }}>
                                            <h3>Nội quy nhà</h3>
                                            <p>Nhận phòng sau</p>
                                            <p>Trả phòng sau</p>
                                            <p>Tối đa 12 khách</p>
                                            <button className='btn-show-description' onClick={toggleOverlay}>
                                                <p>Hiển thị thêm  <span><i className="fa-solid fa-angle-right"></i></span></p>
                                            </button>
                                        </div>
                                        <div style={{ width: '33%' }}>
                                            <h3>An toàn và chỗ ở</h3>
                                            <p>Không có máy phát hiện khí CO</p>
                                            <p>Không có máy báo khói</p>
                                            <p>Camera an ninh/thiết bị ghi</p>
                                            <button className='btn-show-description' onClick={toggleOverlay}>
                                                <p>Hiển thị thêm  <span><i className="fa-solid fa-angle-right"></i></span></p>
                                            </button>
                                        </div>
                                        <div style={{ width: '33%' }}>
                                            <h3>Chính sách hủy</h3>
                                            <p>Đặt phòng/đặt chỗ này không được hoàn tiền.</p>
                                            <p>Hãy đọc toàn bộ chính sách hủy của Chủ nhà/Người tổ chức được áp dụng ngay cả khi bạn hủy vì ốm bệnh hoặc gián đoạn do dịch COVID-19.</p>
                                            <button className='btn-show-description' onClick={toggleOverlayCancellationPolicy}>
                                                <p>Hiển thị thêm  <span><i className="fa-solid fa-angle-right"></i></span></p>
                                            </button>
                                        </div>
                                        {(
                                            <div className={`overlay2 ${isOverlayCancellationPolicy ? '' : 'd-none'}`} >
                                                <div className={`appearing-div ${isOverlayCancellationPolicy ? 'active' : ''}`}>
                                                    <div>
                                                        <i onClick={toggleOverlayCancellationPolicy} className="fa-solid fa-xmark close-description" ></i>
                                                    </div>
                                                    <div>
                                                        <h1>Chính sách hủy</h1>
                                                        <div className='description'>Trước khi bạn đặt phòng/đặt chỗ, hãy đảm bảo chính sách hủy của Chủ nhà/Người tổ chức này phù hợp với bạn. Xin lưu ý rằng <span style={{ textDecoration: "underline", fontWeight: "bold", cursor: "pointer" }}> chính sách Trường hợp bất khả kháng</span>  của Airbnb không áp dụng cho các trường hợp hủy vì ốm bệnh hoặc gián đoạn đi lại do dịch COVID-19.</div>
                                                        <h3>Hủy muộn nhất vào ngày</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <hr className='hr' style={{ width: '140%' }}></hr>
                            <div className='menu-on-list-airbnb'>
                                <Link className='link-to' to={`/house`}><p>AirBnb</p></Link>
                                <i className="fa-solid fa-angle-right"></i>
                                <Link className='link-to' to={`/house`}><p>Việt Nam</p></Link>
                                <i className="fa-solid fa-angle-right"></i>
                                <Link className='link-to' to={`/house`}><p>MIMAROPA</p></Link>
                                <i className="fa-solid fa-angle-right"></i>
                                <Link className='link-to' to={`/house`}><p>Palawan</p></Link>
                                <i className="fa-solid fa-angle-right"></i>
                                <Link className='link-to' to={`/house`}><p>San Vicente</p></Link>
                            </div>
                            <hr className='hr' style={{ width: '140%' }}></hr>
                            <div>
                                <div className='end'>
                                    <div style={{ display: 'flex', alignItems: 'center ' }}>
                                        <p style={{ padding: '0px 10px' }}>© 2023 Airbnb, Inc. </p>
                                        <span>·</span>
                                        <a className='a-tag-end' href=""> <bnsp></bnsp> Quyền riêng tư</a>
                                        <span>·</span>
                                        <a className='a-tag-end' href=""> <bnsp></bnsp> Điều khoản</a>
                                        <span> · </span>
                                        <a className='a-tag-end' href=""> <bnsp></bnsp> Sơ đồ trang web</a>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <a className='a-tag' href="https://www.facebook.com/airbnb" target='_blank'>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-label="Chuyển tới Facebook" role="img" focusable="false" style={{ display: 'block', height: '16px', width: '16px' }}><path d="M30 0a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"></path><path fill="#fff" d="M22.94 16H18.5v-3c0-1.27.62-2.5 2.6-2.5h2.02V6.56s-1.83-.31-3.58-.31c-3.65 0-6.04 2.21-6.04 6.22V16H9.44v4.62h4.06V32h5V20.62h3.73z"></path></svg>
                                        </a>
                                        <a className='a-tag' href="https://twitter.com/airbnb" target='_blank'>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-label="Chuyển tới Twitter" role="img" focusable="false" style={{ display: 'block', height: '16px', width: '16px' }}><path d="M32 4v24a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4z"></path><path fill="#fff" d="M18.66 7.99a4.5 4.5 0 0 0-2.28 4.88A12.31 12.31 0 0 1 7.3 8.25a4.25 4.25 0 0 0 1.38 5.88c-.69 0-1.38-.13-2-.44a4.54 4.54 0 0 0 3.5 4.31 4.3 4.3 0 0 1-2 .06 4.64 4.64 0 0 0 4.19 3.13A8.33 8.33 0 0 1 5.8 23a12.44 12.44 0 0 0 19.32-11.19A7.72 7.72 0 0 0 27.3 9.5a8.3 8.3 0 0 1-2.5.75 4.7 4.7 0 0 0 2-2.5c-.87.5-1.81.87-2.81 1.06a4.5 4.5 0 0 0-5.34-.83z"></path></svg>
                                        </a>
                                        <a className='a-tag' href="https://www.instagram.com/airbnb/" target='_blank'>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-label="Chuyển tới Instagram" role="img" focusable="false" style={{ display: 'block', height: '16px', width: '16px' }}><path d="M30 0H2a2 2 0 0 0-2 2v28c0 1.1.9 2 2 2h28a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path><path fill="#fff" d="M15.71 4h1.25c2.4 0 2.85.02 3.99.07 1.28.06 2.15.26 2.91.56.79.3 1.46.72 2.13 1.38.6.6 1.08 1.33 1.38 2.13l.02.06c.28.74.48 1.58.54 2.8l.01.4c.05 1.02.06 1.63.06 4.4v.92c0 2.6-.02 3.05-.07 4.23a8.78 8.78 0 0 1-.56 2.91c-.3.8-.77 1.53-1.38 2.13a5.88 5.88 0 0 1-2.13 1.38l-.06.02c-.74.28-1.59.48-2.8.53l-.4.02c-1.02.05-1.63.06-4.4.06h-.92a73.1 73.1 0 0 1-4.23-.07 8.78 8.78 0 0 1-2.91-.56c-.8-.3-1.53-.77-2.13-1.38a5.88 5.88 0 0 1-1.38-2.13l-.02-.06a8.84 8.84 0 0 1-.54-2.8l-.01-.37A84.75 84.75 0 0 1 4 16.29v-1c0-2.62.02-3.06.07-4.24.06-1.26.26-2.13.55-2.88l.01-.03c.3-.8.77-1.53 1.38-2.13a5.88 5.88 0 0 1 2.13-1.38l.06-.02a8.84 8.84 0 0 1 2.8-.54l.37-.01C12.39 4 12.99 4 15.71 4zm.91 2.16h-1.24c-2.3 0-2.91.01-3.81.05l-.42.02c-1.17.05-1.8.25-2.23.41-.56.22-.96.48-1.38.9-.4.41-.67.8-.88 1.35l-.03.06a6.7 6.7 0 0 0-.4 2.2l-.02.45c-.04.9-.05 1.53-.05 3.94v1.08c0 2.64.02 3.05.07 4.23v.07c.06 1.13.25 1.74.42 2.16.21.56.47.96.9 1.38.4.4.8.67 1.34.88l.06.03a6.7 6.7 0 0 0 2.2.4l.45.02c.9.04 1.53.05 3.94.05h1.08c2.64 0 3.05-.02 4.23-.07h.07a6.51 6.51 0 0 0 2.16-.42c.52-.19.99-.5 1.38-.9.4-.4.67-.8.88-1.34l.03-.06a6.7 6.7 0 0 0 .4-2.2l.02-.45c.04-.9.05-1.53.05-3.94v-1.09c0-2.63-.02-3.04-.07-4.22v-.07a6.51 6.51 0 0 0-.42-2.16c-.19-.52-.5-.99-.9-1.38a3.7 3.7 0 0 0-1.34-.88l-.06-.03a6.63 6.63 0 0 0-2.16-.4l-.46-.02c-.9-.04-1.5-.05-3.8-.05zM16 9.84a6.16 6.16 0 1 1 0 12.32 6.16 6.16 0 0 1 0-12.32zM16 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm6.4-3.85a1.44 1.44 0 1 1 0 2.88 1.44 1.44 0 0 1 0-2.88z"></path></svg>                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='fixed-book'>
                    <div className='fixed-price'>
                        <div style={{ marginLeft: '20px' }}>
                            {
                                housePrice && (
                                    <h1 style={{ lineHeight: '0.7' }}>{formatCurrency(housePrice.price)} <span style={{ fontWeight: '200', fontSize: '20px' }}> / đêm</span></h1>
                                )
                            }
                            <p>Tổng trước thuế</p>
                        </div>
                        <div>
                            {
                                house && (
                                    <p>
                                        <i className="fa-solid fa-star"></i> {house.reviewPoint} ·
                                        <span className='text' style={{ textDecoration: 'underline' }}>{house.numReview} đánh giá</span>
                                    </p>
                                )
                            }
                        </div>
                    </div>
                    <div className='fixed-book-day'>
                        <div style={{ borderRadius: '10px 0px 0px 0px' }}
                            className='fixed-devide-book fix-div1'>
                            <div style={{ lineHeight: '0.8', borderRight: 'none' }}>
                                <p style={{ fontWeight: 'bolder' }}>Nhận phòng</p>
                                <p>
                                    {selectedDates[0] ?
                                        (`${selectedDates[0].format('D [thg] M YYYY')}`) : ('Thêm ngày')}
                                </p>
                            </div>

                        </div>
                        <div style={{ borderRadius: '0px 10px 0px 0px' }}
                            className='fixed-devide-book'>
                            <div style={{ lineHeight: '0.8' }}>
                                <p style={{ fontWeight: 'bolder' }}>Trả phòng</p>
                                <p>{selectedDates[0] && selectedDates[1] ? (
                                    `${selectedDates[1].format('D [thg] M YYYY')}`
                                ) : ('Thêm ngày')}</p>
                            </div>
                        </div>
                        <div className='fixed-full-book'>
                            <div style={{ textAlign: 'left', margin: '0px 25px' }}>
                                <p style={{ fontWeight: 'bolder' }}>Khách</p>
                                <p style={{ width: '113%' }}>
                                    {countOld || countYoung ? countOld + countYoung + ' khách ' : 'Thêm ít nhất 1 khách'}
                                    {countBaby ? ', ' + countBaby + ' em bé ' : ''}
                                    {countPets ? ', ' + countPets + ' thú cưng' : ''}
                                </p>
                                {
                                    isOpenCountGuests && (
                                        <div className='count-guest-detail'>
                                            <div className="add-guest-detail">
                                                <div className="body-guests">
                                                    <div className="header-guests">
                                                        <h3>Người lớn</h3>Từ 13 tuổi trở lên
                                                    </div>
                                                    <div className="group-btn-guests">
                                                        <button className={`degbtn ${countOld === 0 ? 'disable-degbtn' : ''}`} onClick={decreaseOld} disabled={countOld === 1}><span>-</span></button>
                                                        <span className="countOld">{countOld}</span>
                                                        <button className="crebtn" onClick={increaseOld} disabled={countOld + countYoung >= maxGuests}>+</button>
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
                                                        <button className="crebtn" onClick={increaseYoung} disabled={countOld + countYoung >= maxGuests}>+</button>
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
                                                        <button className="crebtn" onClick={increaseBaby} disabled={countBaby === 5}>+</button>
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
                                                        <button className="crebtn" onClick={increasePets} disabled={countPets === 5}>+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className='fixed-down-icon' onClick={toggleCountGuestsDetails} >
                                <i
                                    className={`fa-solid fa-angle-${isUpOpenCountGuests ? 'up' : 'down'}`}></i>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginLeft: '3%', marginRight: '-2%' }}>
                        {
                            selectedDates[0] && selectedDates[1] ? (
                                house?.status == "ACCEPTED" ?
                                    (
                                        <Link to={`/book/${houseID}/${countOld}/${countYoung}/${countBaby}/${countPets}/${selectedDates[0].format('YYYY-MM-DD')}/${selectedDates[1].format('YYYY-MM-DD')}`}
                                            onClick={handleClick}>
                                            <GradientButton >Đặt phòng</GradientButton>
                                        </Link>
                                    ) : (
                                        <>
                                            <div style={{ display: "flex", justifyContent: "center", color: "red" }}>
                                                <span>
                                                    <svg style={{ padding: "4px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-label="Lỗi" role="img" focusable="false" className="icon-error-message">
                                                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 10.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm.8-6.6H7.2v5.2h1.6z" />
                                                    </svg>
                                                </span>
                                                <div style={{ color: "red", padding: "4px 0px" }}>Tắt tính năng</div>
                                            </div>
                                            <GradientButton onClick={handleCheckAvailableRoom}>Thay đổi ngày</GradientButton>
                                        </>
                                    )
                            ) : (
                                <GradientButton onClick={handleCheckAvailableRoom}>Kiểm tra tình trạng còn phòng</GradientButton>
                            )
                        }
                        {
                            checkAvailableRoom && (
                                <div className='check-room-available-book-detail'>
                                    <div className='div-choose-day-available-room'>
                                        <div style={{ width: '45%' }}>
                                            <h2>Chọn ngày</h2>
                                            <p>Thời gian ở tối thiểu: 1 đêm</p>
                                        </div>
                                        <div className='details-choose-day-available' style={{ textAlign: 'center' }}>
                                            <div style={{ borderRadius: '15px' }}
                                                className='fixed-devide-book fix-div1'>
                                                <div style={{ lineHeight: '0.8', borderRight: 'none' }}>
                                                    <p style={{ fontWeight: 'bolder' }}>Nhận phòng</p>
                                                    <p>
                                                        {selectedDates[0] ?
                                                            (`${selectedDates[0].format('D [thg] M YYYY')}`) : ('Thêm ngày')}
                                                    </p>
                                                </div>

                                            </div>
                                            <div style={{ borderRadius: '15px' }}
                                                className='fixed-devide-book'>
                                                <div style={{ lineHeight: '0.8' }}>
                                                    <p style={{ fontWeight: 'bolder' }}>Trả phòng</p>
                                                    <p>{selectedDates[0] && selectedDates[1] ? (
                                                        `${selectedDates[1].format('D [thg] M YYYY')}`
                                                    ) : ('Thêm ngày')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer id='huydeptrai' components={['DateRangeCalendar']}>
                                            <DateRangeCalendar
                                                value={selectedDates}
                                                onChange={handleDateChange}
                                                minDate={selectedDates[0] ? selectedDates[0] : dayjs().add(1, 'day')}
                                                shouldDisableDate={shouldDisableDate}
                                                maxDate={maxDay}
                                                slots={{ day: (props) => <DateRangePickerDay {...props} className={props.isHighlighting ? 'range-highlight' : ''} /> }}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                    <div style={{ textAlign: 'right' }}>
                                        <button className='btn-reset-check-available-room'
                                            onClick={handleResetDates}>Xoá ngày</button>
                                        <button className='btn-close-check-available-room'
                                            onClick={handleCheckAvailableRoom}>Đóng</button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <div>

            </div>
        </>
    )
}

export default BodyDetail