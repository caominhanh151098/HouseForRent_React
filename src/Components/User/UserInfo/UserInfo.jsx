import React, { useEffect, useState } from 'react'
import HeaderFormUser from '../HeaderFormUser'
import FooterFormUser from '../FooterFormUser'
import "../User.css"
import "../../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import { Link } from 'react-router-dom'
import { API_GET_ALL_INFORMATION_USER, API_GET_REVIEWS_FROM_GUEST, API_GET_REVIEWS_FROM_HOST } from '../../../Services/common'
import axios from 'axios'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const UserInfo = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    console.log("userInfo userInfo", userInfo);
    const countHowManyDays = (day) => {
        const createDate = new Date(day);
        const today = new Date();
        const timeDiff = today - createDate;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        return daysDiff;
    }
    const [allInformationUser, setAllInformationUser] = useState();
    useEffect(() => {
        const getUser = async () => {
            try {
                const resp = await axios.get(API_GET_ALL_INFORMATION_USER + userInfo.id);
                if (resp.status === 200) {
                    setAllInformationUser(resp.data)
                } else {
                    console.log('Lỗi');
                }
            } catch (err) {
                console.log('Lỗi');
            }
        }
        getUser()
    }, [])
    console.log("allInformationUser", allInformationUser);

    const [isOverlayShowAllReviews, setIsOverlayShowAllReviews] = useState(false)
    const toggleShowAllReviews = () => {
        setIsOverlayShowAllReviews(!isOverlayShowAllReviews)
    }

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [reviewFromGuest, setReviewFromGuest] = useState();
    const [reviewFromHost, setReviewFromHost] = useState();

    useEffect(() => {
        const id = userInfo && userInfo.id
        const getReviewFromGuest = async () => {
            try {
                const resp = await axios.get(API_GET_REVIEWS_FROM_GUEST + id);
                if (resp.status === 200) {
                    setReviewFromGuest(resp.data.content)
                } else {
                    console.log('Lỗi revies guest');
                }
            } catch (err) {
                console.log('Lỗi');
            }
        }
        getReviewFromGuest()
    }, [])
    console.log("reviewFromGuest", reviewFromGuest);

    useEffect(() => {
        const id = userInfo && userInfo.id
        const getReviewFromGuest = async () => {
            try {
                const resp = await axios.get(API_GET_REVIEWS_FROM_HOST + id);
                if (resp.status === 200) {
                    setReviewFromHost(resp.data.content)
                } else {
                    console.log('Lỗi revies host');
                }
            } catch (err) {
                console.log('Lỗi');
            }
        }
        getReviewFromGuest()
    }, [])
    console.log("reviewFromHost", reviewFromHost);

    const formatDate = (reviewDate) => {
        const year = reviewDate[0];
        const month = reviewDate[1];
        const day = reviewDate[2];
        const formattedDate = `${day} tháng ${month} năm ${year}`;

        return formattedDate
    }

    return (
        <>
            <HeaderFormUser />
            <div className='div-user-info-form-user'>
                <div className='div-detail-verify-user-info'>
                    <div className='div-verify-avatar-timework'>
                        <div className='div-details-verify-avatar-timework'>
                            <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <img className='avatar-verify-avatar-timework' src={userInfo.avatar ? userInfo.avatar : "https://media.istockphoto.com/id/1131164548/vi/vec-to/th%E1%BA%BF-th%E1%BA%A7n-5.jpg?s=612x612&w=0&k=20&c=4qLeuiEXy8mR2r_M81wB9-FTSxaV5aoOBnYkGqHZnUw="} alt="" />
                                <h2>{userInfo.lastName}</h2>
                                <h3>{userInfo.role === 'HOST' ? 'Chủ nhà' : 'Khách'}</h3>
                            </div>
                            <div>
                                <h2>{allInformationUser && allInformationUser.numReview}</h2>
                                <p>Đánh giá</p>
                                <hr />
                                <h2>{countHowManyDays(userInfo.createDate)}</h2>
                                <p style={{ lineHeight: '1.6' }}>Ngày hoạt động trên Airbnb</p>
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



                <div className='div-detail-user-info'>
                    <h1>Thông tin về {userInfo.firstName} {userInfo.lastName}</h1>
                    <div className='container-infomation-userinfo'>
                        <div className='div-infomation-verify-userinfo'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style={{ display: "block", height: "24px", width: "24px", fill: "var(--f-k-smk-x)" }} aria-hidden="true" role="presentation" focusable="false"><path d="M20 2a2 2 0 0 1 2 1.85V6h6a3 3 0 0 1 3 2.82V27a3 3 0 0 1-2.82 3H4a3 3 0 0 1-3-2.82V9a3 3 0 0 1 2.82-3H10V4a2 2 0 0 1 1.85-2H12zm8 6H4a1 1 0 0 0-1 .88V12a3 3 0 0 0 2.82 3H13v2H6a4.98 4.98 0 0 1-3-1v11a1 1 0 0 0 .88 1H28a1 1 0 0 0 1-.88V16c-.78.59-1.74.95-2.78 1h-7.17v-2H26a3 3 0 0 0 3-2.82V9a1 1 0 0 0-.88-1zm-10 4a1 1 0 0 1 1 .88V19a1 1 0 0 1-.88 1H14a1 1 0 0 1-1-.88V13a1 1 0 0 1 .88-1H14zm-1 2h-2v4h2zm3-10h-8v2h8z"></path></svg>
                            <p>Công việc của tôi: Information Technology</p>
                        </div>
                        <div className='div-infomation-verify-userinfo'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style={{ display: "block", height: "24px", width: "24px", fill: "var(--f-k-smk-x)" }} aria-hidden="true" role="presentation" focusable="false"><path d="M26 2a5 5 0 0 1 5 4.78V21a5 5 0 0 1-4.78 5h-6.06L16 31.08 11.84 26H6a5 5 0 0 1-4.98-4.56L1 21.22 1 21V7a5 5 0 0 1 4.78-5H26zm0 2H6a3 3 0 0 0-3 2.82V21a3 3 0 0 0 2.82 3H12.8l3.2 3.92L19.2 24H26a3 3 0 0 0 3-2.82V7a3 3 0 0 0-2.82-3H26zM16 6a8.02 8.02 0 0 1 8 8.03A8 8 0 0 1 16.23 22h-.25A8 8 0 0 1 8 14.24v-.25A8 8 0 0 1 16 6zm1.68 9h-3.37c.11 1.45.43 2.76.79 3.68l.09.22.13.3c.23.45.45.74.62.8H16c.33 0 .85-.94 1.23-2.34l.11-.44c.16-.67.29-1.42.34-2.22zm4.24 0h-2.23c-.1 1.6-.42 3.12-.92 4.32a6 6 0 0 0 3.1-4.07l.05-.25zm-9.61 0h-2.23a6 6 0 0 0 3.14 4.32c-.5-1.2-.82-2.71-.91-4.32zm.92-6.32-.13.07A6 6 0 0 0 10.08 13h2.23c.1-1.61.42-3.12.91-4.32zM16 8h-.05c-.27.08-.64.7-.97 1.65l-.13.4a13.99 13.99 0 0 0-.54 2.95h3.37c-.19-2.66-1.1-4.85-1.63-5H16zm2.78.69.02.05c.48 1.19.8 2.68.9 4.26h2.21A6.02 6.02 0 0 0 19 8.8l-.22-.12z"></path></svg>
                            <p>Nói tiếng Việt và tiếng Anh</p>
                        </div>
                        <div className='div-infomation-verify-userinfo'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style={{ display: "block", height: "24px", width: "24px", fill: "var(--f-k-smk-x)" }} aria-hidden="true" role="presentation" focusable="false"><path d="m5.7 1.3 3 3-.66.72a12 12 0 0 0 16.95 16.94l.72-.67 3 3-1.42 1.42-1.67-1.68A13.94 13.94 0 0 1 18 26.96V29h3v2h-8v-2h3v-2.04a13.95 13.95 0 0 1-8.92-4.08 14 14 0 0 1-1.11-18.5L4.29 2.71zm18.18 4.44.21.21.21.22a10 10 0 1 1-.64-.63zm-9.34 11.13-2.45 2.45a8 8 0 0 0 8.04 1.05 16.7 16.7 0 0 1-5.59-3.5zm4.91-4.91-3.5 3.5c2.85 2.54 6.08 3.82 6.7 3.2.63-.61-.66-3.85-3.2-6.7zm-9.81-2.1-.08.19a8 8 0 0 0 1.12 7.86l2.45-2.45a16.68 16.68 0 0 1-3.5-5.6zM23.32 8.1l-2.45 2.44a16.73 16.73 0 0 1 3.5 5.6 8 8 0 0 0-1.05-8.05zm-11.98-.76c-.62.62.66 3.86 3.2 6.7l3.5-3.5c-2.85-2.54-6.07-3.82-6.7-3.2zm2.54-1.7c1.75.59 3.75 1.83 5.58 3.49l2.44-2.45a8.03 8.03 0 0 0-8.02-1.04z"></path></svg>
                            <p>Sống tại Việt Nam</p>
                        </div>
                        <div className='div-infomation-verify-userinfo'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style={{ display: "block", height: "32px", width: "32px", fill: "var(--f-k-smk-x)" }} aria-hidden="true" role="presentation" focusable="false"><path d="M6 23v3h3v2H6v3H4v-3H1v-2h3v-3h2zm9.04-19.29c.28-.9 1.52-.95 1.88-.12l.04.12 2.61 8.72 8.72 2.61c.86.26.94 1.4.22 1.82l-.1.06-.12.04-8.72 2.61-2.61 8.72c-.26.86-1.4.94-1.82.22l-.06-.1-.04-.12-2.61-8.72-8.72-2.61c-.87-.26-.94-1.4-.22-1.82l.1-.06.12-.04 8.72-2.61 2.61-8.72zM16 7.48l-1.81 6.04a1 1 0 0 1-.55.63l-.12.04L7.48 16l6.04 1.81a1 1 0 0 1 .57.45l.06.1.04.12L16 24.52l1.81-6.04a1 1 0 0 1 .45-.57l.1-.06.12-.04L24.52 16l-6.04-1.81a1 1 0 0 1-.57-.44l-.06-.12-.04-.11L16 7.48zM28 1v3h3v2h-3v3h-2V6h-3V4h3V1h2z"></path></svg>
                            <p>Điều làm nên sự độc đáo cho nhà tôi: Một ngôi nhà với các góc nhìn tuyệt vời</p>
                        </div>
                        <div className='div-infomation-verify-userinfo'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style={{ display: "block", height: "24px", width: "24px", fill: "var(--f-k-smk-x)" }} aria-hidden="true" role="presentation" focusable="false"><path d="M13.7 13.93a4 4 0 0 1 5.28.6l.29.37 4.77 6.75a4 4 0 0 1 .6 3.34 4 4 0 0 1-4.5 2.91l-.4-.08-3.48-.93a1 1 0 0 0-.52 0l-3.47.93a4 4 0 0 1-2.94-.35l-.4-.25a4 4 0 0 1-1.2-5.2l.23-.37 4.77-6.75a4 4 0 0 1 .96-.97zm3.75 1.9a2 2 0 0 0-2.98.08l-.1.14-4.84 6.86a2 2 0 0 0 2.05 3.02l.17-.04 4-1.07a1 1 0 0 1 .5 0l3.97 1.06.15.04a2 2 0 0 0 2.13-2.97l-4.95-7.01zM27 12a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM5 12a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm22 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM5 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6-10a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm10 0a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM11 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"></path></svg>
                            <p>Thú cưng: Mewtwo</p>
                        </div>
                        <div className='div-infomation-verify-userinfo'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style={{ display: "block", height: "38px", width: "38px", fill: "var(--f-k-smk-x)" }} aria-hidden="true" role="presentation" focusable="false"><path d="M0 18v-2h1.3A15.02 15.02 0 0 1 13.27 4.25a3 3 0 1 1 5.46 0c6 1.1 10.76 5.78 11.97 11.75H32v2zM16 6A13 13 0 0 0 3.35 16h25.3A13 13 0 0 0 16 6zm0-4a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7.55 18.1a3.24 3.24 0 0 1 3.07 5.7l-.17.1-9.63 4.82a5 5 0 0 1-3.23.43l-.25-.05-7.84-2.01A2 2 0 0 1 4 27.31V22a2 2 0 0 1 1.85-2h11.26l.14.01L19 20c.92.01 1.44.7 1.57 1.59zm2.56 2.35a1.24 1.24 0 0 0-1.54-.6l-.12.04-4.37 2.19a3.89 3.89 0 0 1-3.34 1.91l-.24.01H12v-2h5a2 2 0 0 0 2-1.85V22l-3.7.02h-1.58L12.6 22l-.6-.01H6v5.15l7.83 2.01a3 3 0 0 0 1.9-.13l.2-.1 9.62-4.82c.61-.3.86-1.05.56-1.66z"></path></svg>
                            <p>Đối với khách, tôi luôn: Tôi hy vọng đó sẽ là một ngôi nhà nơi bạn có thể thư giãn và hít thở trong lành sau những giờ làm việc căng thẳng</p>
                        </div>

                    </div>
                    {
                        userInfo.role === 'HOST' ? (
                            <p style={{ lineHeight: '1.7' }}>Xin chào, các nhà thám hiểm! <br /> Tôi là {userInfo.lastName}, người sở hữu các ngôi nhà quanh thành phố Huế, thành phố đáng kinh ngạc này đã giữ một vị trí đặc biệt
                                trong trái tim tôi. Dù bạn có tin hay không, tôi đã lớn lên để biết mọi ngóc ngách
                                của thành phố tuyệt đẹp này ^^. <br />
                                Tham gia với chúng tôi để có một trải nghiệm khó quên khám phá sự quyến rũ yên bình của cuộc sống và văn hóa Huế. <br />
                                Chào mừng bạn đến với thành phố Huế mộng mơ - nơi những kỷ niệm đẹp được tạo ra!</p>
                        ) : (
                            <p>Xin chào, các chủ nhà thân thiện! <br />
                                Tôi tự tin rằng mình không chỉ là một vị khách thông thường, mà còn là người đem lại sự khác biệt tích cực trong mỗi trải nghiệm. <br />
                                Với tôi, việc tôn trọng không chỉ dừng lại ở việc giữ gìn không gian mà còn lan rộng tới sự tôn trọng đối với cả chủ nhà và cộng đồng xung quanh. Tôi luôn cố gắng để không gây phiền hà và để lại một ấn tượng tốt.<br />
                                Không chỉ vậy, tôi luôn tham gia tích cực trong những hoạt động và giao lưu với chủ nhà, mang đến một không khí vui vẻ và thoải mái. Tôi luôn cố gắng để chia sẻ kinh nghiệm và đóng góp ý kiến xây dựng. <br />
                                Cuối cùng, tôi mong muốn mỗi chuyến đi của tôi không chỉ để lại kỷ niệm tuyệt vời cho bản thân mà còn để lại ấn tượng tốt với mọi người xung quanh. <br />
                                Cảm ơn vì đã cho tôi cơ hội tham gia vào trải nghiệm này và tôi rất mong được gặp gỡ và giao lưu với tất cả mọi người!
                            </p>
                        )
                    }
                    <hr style={{ marginBottom: '4%' }} />
                    <h2>Đánh giá của {userInfo.lastName}</h2>
                    <Slider
                        dots={true}
                        infinite={true}
                        speed={400}
                        slidesToShow={2}
                        slidesToScroll={1}
                        prevArrow={<div className="slick-arrow"><FontAwesomeIcon icon={faArrowLeft} /></div>}
                        nextArrow={<div className="slick-arrow"><FontAwesomeIcon icon={faArrowRight} /></div>}
                    >
                        {
                            allInformationUser &&
                            allInformationUser?.miniReview &&
                            allInformationUser?.miniReview
                                .slice()
                                .sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate))
                                .map((item, index) => (
                                    <div className='div-where-you-sleep-have-image'
                                        key={index}>
                                        <div className='details-reviews-mini'>
                                            <div>
                                                <p>{item.content.length > 100 ? `${item.content.substring(0, 80)}...` : item.content}</p>
                                            </div>
                                            <div style={{ textAlign: 'center', width: '95%', display: 'flex' }}>
                                                <div>
                                                    <img className='avatar-user-reviews' src={item.user.avatar ? item.user.avatar : 'https://media.istockphoto.com/id/1131164548/vi/vec-to/th%E1%BA%BF-th%E1%BA%A7n-5.jpg?s=612x612&w=0&k=20&c=4qLeuiEXy8mR2r_M81wB9-FTSxaV5aoOBnYkGqHZnUw='} alt="" />
                                                </div>
                                                <div>
                                                    <p>{item.user.lastName}</p>
                                                    <p>{formatDate(item.reviewDate)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        }
                    </Slider>
                    <button onClick={() => toggleShowAllReviews()}
                        className='btn-show-all-revies-on-host'>Hiểm thị {allInformationUser && allInformationUser.numReview} đánh giá</button>
                    {(
                        <div className={`overlay2 ${isOverlayShowAllReviews ? '' : 'd-none'}`} >
                            <div className={`appearing-div ${isOverlayShowAllReviews ? 'active' : ''}`}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <i style={{ marginRight: '20%' }}
                                        onClick={toggleShowAllReviews} class="fa-solid fa-chevron-left close-description" ></i>
                                </div>
                                <h2>{allInformationUser && allInformationUser.numReview} đánh giá</h2>
                                <Box sx={{ width: '100%', typography: 'body1' }}>
                                    <TabContext value={value}>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                                <Tab label={`Từ khách · ${reviewFromGuest && reviewFromGuest.length}`} value="1" />
                                                <Tab label={`Từ chủ nhà / Người tổ chức · ${reviewFromHost && reviewFromHost.length}`} value="2" />
                                            </TabList>
                                        </Box>
                                        <TabPanel value="1">
                                            <div className='div-details-reviews-from-guest-and-host'>
                                                {
                                                    reviewFromGuest &&
                                                    reviewFromGuest
                                                        .slice()
                                                        .sort((a, b) => new Date(b.review.reviewDate) - new Date(a.review.reviewDate)) // Sắp xếp theo ngày giảm dần
                                                        .map((item, index) => (
                                                            <>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <h2>{item.house && item.house.hotelName}</h2>
                                                                    <img className='img-house-reviews-from-guest' src={item.house && item.house.image} alt="" />
                                                                </div>
                                                                <div style={{ display: 'flex' }}>
                                                                    <div>
                                                                        <img style={{ marginRight: '15px' }} className='avatar-verify-avatar-timework' src={item.review.user && item.review.user.avatar ? item.review.user.avatar : "https://media.istockphoto.com/id/1131164548/vi/vec-to/th%E1%BA%BF-th%E1%BA%A7n-5.jpg?s=612x612&w=0&k=20&c=4qLeuiEXy8mR2r_M81wB9-FTSxaV5aoOBnYkGqHZnUw="} alt="" />
                                                                    </div>
                                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                        <h3>{item && item.review.user && item.review.user.lastName}</h3>
                                                                        <p>{item && item.review.reviewDate && formatDate(item.review.reviewDate)}</p>
                                                                    </div>
                                                                </div>
                                                                <p>{item && item.review && item.review.content}</p>
                                                                <hr />
                                                            </>
                                                        ))
                                                }
                                            </div>
                                        </TabPanel>
                                        <TabPanel value="2">
                                            <div className='div-details-reviews-from-guest-and-host'>
                                                {
                                                    reviewFromHost &&
                                                    reviewFromHost
                                                        .slice()
                                                        .sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate))
                                                        .map((item, index) => (
                                                            <>
                                                                <div style={{ display: 'flex' }}>

                                                                    <div>
                                                                        <img style={{ marginRight: '15px' }} className='avatar-verify-avatar-timework' src={item.user && item.user.avatar ? item.user.avatar : "https://media.istockphoto.com/id/1131164548/vi/vec-to/th%E1%BA%BF-th%E1%BA%A7n-5.jpg?s=612x612&w=0&k=20&c=4qLeuiEXy8mR2r_M81wB9-FTSxaV5aoOBnYkGqHZnUw="} alt="" />
                                                                    </div>
                                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                        <h3>{item && item.user && item.user.lastName}</h3>
                                                                        <p>{item && item.reviewDate && formatDate(item.reviewDate)}</p>
                                                                    </div>
                                                                </div>
                                                                <p>{item && item.content}</p>
                                                                <hr />
                                                            </>
                                                        ))
                                                }
                                            </div>
                                        </TabPanel>
                                    </TabContext>
                                </Box>
                            </div>
                        </div>
                    )}

                    <hr />
                    <h2>Hỏi {userInfo.lastName} về </h2>
                    <div>
                        <div style={{ display: 'flex', marginBottom: '3%', justifyContent: 'space-between' }}>
                            <button className='ask-about-div-host'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "24px", width: "24px", fill: "var(--f-k-smk-x)" }}><path d="M28 18C28 12 24.16 6.1 16.6.45L16 0l-.6.45C7.84 6.09 4 12 4 18c0 6.28 4.85 11.44 11 11.95V32h2v-2.05c6.15-.51 11-5.67 11-11.95zm-11 9.95v-3.54l8.76-8.76c.15.79.24 1.57.24 2.35 0 5.18-3.95 9.45-9 9.95zm0-12.54 5.96-5.96a17.8 17.8 0 0 1 2.17 4L17 21.6v-6.17zm-2 6.18-8.13-8.14c.5-1.33 1.22-2.67 2.17-4L15 15.41v6.18zm6.72-13.73L17 12.6v-9.3a35.05 35.05 0 0 1 4.72 4.57zM15 3.3v9.29l-4.72-4.73A34.93 34.93 0 0 1 15 3.3zM6 18c0-.78.09-1.56.24-2.35L15 24.41v3.54c-5.05-.5-9-4.77-9-9.95z"></path></svg>
                                <p>Bảo vệ môi trường</p>
                            </button>
                            <button className='ask-about-div-host'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "24px", width: "24px", fill: "var(--f-k-smk-x)" }}><path d="M12.72 2.73A3 3 0 0 1 15.92.5l.18.02 8.5 1.35a3 3 0 0 1 2.53 2.97v.18L26.05 21.7l1.6 1.47c.74.68 1.09 1.69.93 2.66L28.16 29H31v2H1v-2h2.2l1.64-7.08a3 3 0 0 1 1.5-1.96l.17-.09 2.06-.94zM8.49 21.17l-1.14.52a1 1 0 0 0-.56.68L5.26 29h20.88l.08-.56.4-2.9a1 1 0 0 0-.23-.8l-.09-.1-.85-.78c-.21.28-.47.53-.78.73-2.93 1.92-5.73 2.7-8.4 2.27-2.65-.42-5.08-2.02-7.27-4.75a3 3 0 0 1-.51-.94zM13.64 7.2l-3.27 12.78a1 1 0 0 0 .19.87c1.9 2.37 3.91 3.7 6.03 4.03 2.12.34 4.44-.3 6.99-1.97a1 1 0 0 0 .43-.65l.02-.12.83-13.16-4.62-.74-.94 5.93 1.98.31-.32 1.98-5.92-.94.31-1.97 1.97.3.94-5.92zm.1 10.14 7.9 1.25-.31 1.98-7.9-1.25zm2.04-14.86a1 1 0 0 0-1.09.62l-.03.12-.52 2.03 10.85 1.72.14-2.1a1 1 0 0 0-.73-1.02l-.12-.03z"></path></svg>
                                <p>Di sản văn hoá</p>
                            </button>
                            <button className='ask-about-div-host'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "24px", width: "24px", fill: "var(--f-k-smk-x)" }}><path d="M23 15a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-7-5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-8 2a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm22-4v12a9.98 9.98 0 0 1-17.98 6H12C6.49 26 2 21.51 2 16V4c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v2h6a2 2 0 0 1 2 2zM12 24a8 8 0 0 0 8-8V4H4v12a8 8 0 0 0 8 8zM28 8h-6v8a9.92 9.92 0 0 1-1.38 5.04c1.58.16 3.03.96 4.15 2.29l-1.54 1.28A4.2 4.2 0 0 0 20.01 23c-.36 0-.7.07-1.05.17a9.99 9.99 0 0 1-4.57 2.53A7.97 7.97 0 0 0 20 28a8 8 0 0 0 8-8V8zM13.29 25.9l-.09.02.09-.01zM12 18a4.21 4.21 0 0 1-3.24-1.64l-1.54 1.28A6.18 6.18 0 0 0 12.01 20c1.8 0 3.5-.83 4.76-2.33l-1.54-1.28A4.21 4.21 0 0 1 12.01 18z"></path></svg>
                                <p>Du lịch</p>
                            </button>
                        </div>
                        <div style={{ display: 'flex', marginBottom: '3%', justifyContent: 'space-between' }}>
                            <button className='ask-about-div-host'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "24px", width: "24px", fill: "var(--f-k-smk-x)" }}><path d="m24.73 2.29.48 1.94-3.21.8V14h7a1 1 0 0 1 1 .88V29a1 1 0 0 1-.88 1H3a1 1 0 0 1-1-.88V10.03l-.73.18L.8 8.27zM9 21.99H4V28h5zM28 16H11v12h4v-7a1 1 0 0 1 .88-1H21a1 1 0 0 1 1 .88V28h6zm-8 6h-3v6h3zm5 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM9 8.28 4 9.53V20h5zm11-2.75-9 2.25V14h9z"></path></svg>
                                <p>Kiến trúc</p>
                            </button>
                            <button className='ask-about-div-host'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "24px", width: "24px", fill: "var(--f-k-smk-x)" }}><path d="M24 9H8v10h16V9zm2-2v14H6V7h20zm2-2H4v18h24V5zM17 1v2h11a2 2 0 0 1 2 1.85V23a2 2 0 0 1-1.85 2h-3.87l1.5 6h-2.06l-1.5-6H9.78l-1.5 6H6.22l1.5-6H4a2 2 0 0 1-2-1.85V5a2 2 0 0 1 1.85-2H15V1h2z"></path></svg>
                                <p>Nghệ thuật</p>
                            </button>
                            <button className='ask-about-div-host'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "24px", width: "24px", fill: "var(--f-k-smk-x)" }}><path d="M12 1a5 5 0 0 1 4.9 4H31v2H16.9a5 5 0 0 1-3.9 3.9v7.44A9 9 0 0 1 28.95 23H31v3a5 5 0 0 1-4.78 5H6a5 5 0 0 1-5-4.78V23h2V11H1V9h2V7H1V5h2V3H1V1h11zm17 24H3v1a3 3 0 0 0 2.65 2.98l.17.01L6 29h20a3 3 0 0 0 3-2.82V25zM7 11H5v12h2V11zm4 0H9v12h2V11zm9 10a3 3 0 0 0-2.83 2h5.66A3 3 0 0 0 20 21zm0-4a7 7 0 0 0-6.93 6h2.03a5 5 0 0 1 9.8 0h2.03A7 7 0 0 0 20 17zM7 3H5v6h2V3zm4 0H9v6h2V3zm2 .17v5.66a3 3 0 0 0 0-5.66z"></path></svg>
                                <p>Đồ ăn</p>
                            </button>
                            <button className='ask-about-div-host'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "24px", width: "24px", fill: "var(--f-k-smk-x)" }}><path d="M13.7 13.93a4 4 0 0 1 5.28.6l.29.37 4.77 6.75a4 4 0 0 1 .6 3.34 4 4 0 0 1-4.5 2.91l-.4-.08-3.48-.93a1 1 0 0 0-.52 0l-3.47.93a4 4 0 0 1-2.94-.35l-.4-.25a4 4 0 0 1-1.2-5.2l.23-.37 4.77-6.75a4 4 0 0 1 .96-.97zm3.75 1.9a2 2 0 0 0-2.98.08l-.1.14-4.84 6.86a2 2 0 0 0 2.05 3.02l.17-.04 4-1.07a1 1 0 0 1 .5 0l3.97 1.06.15.04a2 2 0 0 0 2.13-2.97l-4.95-7.01zM27 12a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM5 12a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm22 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM5 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6-10a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm10 0a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM11 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"></path></svg>
                                <p>Động vật</p>
                            </button>
                        </div>
                    </div>


                    <hr style={{ marginBottom: '4%' }} />
                    <h2>Mục cho thuê của {userInfo.lastName}</h2>
                    <Slider
                        dots={true}
                        infinite={true}
                        speed={400}
                        slidesToShow={2}
                        slidesToScroll={1}
                        prevArrow={<div className="slick-arrow"><FontAwesomeIcon icon={faArrowLeft} /></div>}
                        nextArrow={<div className="slick-arrow"><FontAwesomeIcon icon={faArrowRight} /></div>}
                    >
                        {
                            allInformationUser && allInformationUser?.hotels && allInformationUser?.hotels?.map((item, index) => (
                                <div className='div-where-you-sleep-have-image'
                                    key={index}>
                                    <div>
                                        <Link to={`/house/${item.id}`}>
                                            <img className='img-div-where-you-sleep-have-image'
                                                src={item.image}>
                                            </img>
                                        </Link>
                                    </div>
                                    <div style={{ textAlign: 'center', width: '95%' }}>
                                        <h3>{item.hotelName}</h3>
                                    </div>
                                </div>
                            ))
                        }
                    </Slider>

                    <hr style={{ marginBottom: '4%', marginTop: '8%' }} />
                    <h2>Sách hướng dẫn của {userInfo.lastName}</h2>
                    <div>
                        <Link to={'https://www.airbnb.com.vn/s/guidebooks?refinement_paths[]=/guidebooks/133270'}>
                            <div className='book-help'>
                                <h3 className='guidebook'>Guidebook for Thành phố Huế</h3>
                            </div>
                        </Link>
                    </div>

                </div>
            </div>
            <FooterFormUser />
        </>
    )
}

export default UserInfo