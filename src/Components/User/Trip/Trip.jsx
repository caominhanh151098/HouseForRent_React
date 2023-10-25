import React from 'react'
import HeaderFormUser from '../HeaderFormUser'
import "../User.css"
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { API_CANCEL_RESERVATION, API_GET_HISTORY_RESERVATION } from '../../../Services/common'
import { el } from 'date-fns/locale'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import "../User.css"
import HouseSlider from './../../AirBnb/Body/HouseSlider';
import "../../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import { ToastContainer, toast } from 'react-toastify';
import Pagination from '../../AirBnb/Body/Pagination';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Typography from '@mui/joy/Typography';

const Trip = () => {
    const [reservation, setReversation] = useState(false);
    const token = localStorage.getItem('jwt')
    const [loadingReservation, setLoadingReservation] = useState(false);

    useEffect(() => {
        const getReversation = async () => {
            setLoadingReservation(true);
            const response = await axios.get(API_GET_HISTORY_RESERVATION, {
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.status === 200) {
                const sortedReservations = [...response.data].sort((a, b) => {
                    const dateA = new Date(a.checkInDate[0], a.checkInDate[1] - 1, a.checkInDate[2]);
                    const dateB = new Date(b.checkInDate[0], b.checkInDate[1] - 1, b.checkInDate[2]);
                    return dateB - dateA;
                });
                setReversation(sortedReservations)
                setLoadingReservation(false);
            } else {
                console.log('lỗi');
                setLoadingReservation(false);
            }
        }
        getReversation();
    }, [])

    const getReversation = async () => {
        const response = await axios.get(API_GET_HISTORY_RESERVATION, {
            headers: {
                'Content-Type': 'Application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.status === 200) {
            if (response.data) {
                const sortedReservations = [...response.data].sort((a, b) => {
                    const dateA = new Date(a.checkInDate[0], a.checkInDate[1] - 1, a.checkInDate[2]);
                    const dateB = new Date(b.checkInDate[0], b.checkInDate[1] - 1, b.checkInDate[2]);
                    return dateB - dateA;
                });
                setReversation(sortedReservations)
            } else {
                console.log('Dữ liệu trả về không hợp lệ');
            }
        } else {
            console.log('lỗi');
        }
    }

    console.log("reservation", reservation);

    const [value, setValue] = React.useState('one');

    const handleChange = (event, newValue) => {
        setValue(newValue);
        // if (newValue === 'two') {
        //     const sortedReservations = sortOrder === 'ASC'
        //         ? [...reservation].sort((a, b) => new Date(a.checkInDate) - new Date(b.checkInDate))
        //         : [...reservation].sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));

        //     setReversation(sortedReservations);

        //     // Đảo ngược trạng thái sắp xếp
        //     setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC');
        // }
    };

    const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

    const formatDate = (dateArray) => {
        const day = dateArray[2];
        const month = months[dateArray[1] - 1];
        const year = dateArray[0];
        return `${day} ${month} năm ${year}`;
    };

    const [isOverLayCancelReservation, setIsOverLayCancelReservation] = useState(false);
    const toggleCancelReservation = () => {
        setIsOverLayCancelReservation(!isOverLayCancelReservation);
    }

    const [loadingCancel, setLoadingCancel] = useState(false)

    const handleCancelReservation = async (id) => {
        setLoadingCancel(true);
        setTimeout(async () => {
            const response = await axios.patch(API_CANCEL_RESERVATION + id, {
                Headers: {
                    'Content-Type': 'Application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.status === 200) {
                await getReversation();
                if (isOverLayCancelReservation) {
                    setIsOverLayCancelReservation(false);
                }
                toast.success('Đã huỷ thành công', {
                    className: 'custom-toast-success'
                });
                setLoadingCancel(false)
            } else {
                console.log('Lỗi');
                setLoadingCancel(false)
            }
            setLoadingCancel(false)
        }, 700)

    }

    const [houseSelected, setHouseSelected] = useState();

    useEffect(() => {
        console.log("houseSelected", houseSelected);
    }, [houseSelected])

    const [currentPage, setCurrentPage] = useState(1);
    const housesPerPage = 5;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const startIdx = (currentPage - 1) * housesPerPage;
    const endIdx = Math.min(currentPage * housesPerPage, reservation.length);

    const displayedHouses = reservation && reservation.slice(startIdx, endIdx);

    const totalPages = Math.ceil(reservation && reservation.length / housesPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const [sortOrder, setSortOrder] = useState('DESC');


    const handleSortClick = (order) => {
        setSortOrder(order);

        const sortedReservations = order === 'DESC'
            ? [...reservation].sort((a, b) => new Date(a.checkInDate) - new Date(b.checkInDate))
            : [...reservation].sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));

        setReversation(sortedReservations);
    }

    const [filteredStatus, setFilteredStatus] = useState(null);

    const handleFilterStatus = (status) => {
        setFilteredStatus(status);

        const filterReservation = [...reservation].filter(reservation => reservation.status === status);
        setReversation(filterReservation)
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
            <HeaderFormUser />
            {
                loadingReservation ? (
                    <div style={{ textAlign: 'center' }}>
                        <div class="loadingio-spinner-ellipsis-vy8amekyxyo"><div class="ldio-sesojbulmx">
                            <div></div><div></div><div></div><div></div><div></div>
                        </div></div>
                    </div>
                ) :
                    reservation && reservation.length > 0 ? (
                        <div className='div-trip-form-user'>
                            <Box sx={{ width: '100%' }}>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    textColor="secondary"
                                    indicatorColor="secondary"
                                    aria-label="secondary tabs example"
                                >
                                    <Tab value="one" label="Thông tin nhà" style={{ marginRight: "1%", padding: "0px 98px" }} />
                                    <Tab value="two" label={`Ngày đặt ${sortOrder === 'ASC' ? '↓' : '↑'}`} />
                                    <Tab value="three" label="Trạng thái" />
                                </Tabs>
                                {value === 'two' && (
                                    <div className='condition-sort-date-reservation'>
                                        <Box
                                            sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                gap: 2,
                                                flexWrap: 'wrap',
                                                '& > *': { minWidth: 0, flexBasis: 200 },
                                            }}
                                        >
                                            <div style={{ justifyContent: 'center' }}>
                                                <List
                                                    variant="outlined"
                                                    sx={{
                                                        maxWidth: 300,
                                                        borderRadius: 'sm',
                                                    }}
                                                >
                                                    <ListItem>
                                                        <ListItemButton onClick={() => handleSortClick('ASC')}>Mới nhất</ListItemButton>
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemButton onClick={() => handleSortClick('DESC')}>Cũ nhất</ListItemButton>
                                                    </ListItem>
                                                </List>
                                            </div>
                                        </Box>
                                    </div>
                                )}
                                {value === 'three' && (
                                    <div className='condition-sort-status-reservation'>
                                        <Box
                                            sx={{
                                                flexGrow: 1,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                gap: 2,
                                                flexWrap: 'wrap',
                                                '& > *': { minWidth: 0, flexBasis: 200 },
                                            }}
                                        >
                                            <div style={{ justifyContent: 'center' }}>
                                                <List
                                                    variant="outlined"
                                                    sx={{
                                                        maxWidth: 300,
                                                        borderRadius: 'sm',
                                                    }}
                                                >
                                                    <ListItem>
                                                        <ListItemButton >Đang chờ duyệt <i className="fas fa-hourglass-half"></i></ListItemButton>
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemButton >Đang chờ check-in <i className="fas fa-clock"></i></ListItemButton>
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemButton>Đã huỷ <i className="fas fa-ban"></i></ListItemButton>
                                                    </ListItem>
                                                </List>
                                            </div>
                                        </Box>
                                    </div>
                                )}
                            </Box>
                            <div>
                                {
                                    displayedHouses && displayedHouses.map((house, index) => (
                                        <div className='div-details-reservation-history'>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ marginRight: '5%' }}>
                                                    <HouseSlider house={house.house} />
                                                </div>
                                                <div style={{ width: '360px' }}>
                                                    <h3>{house.house.typeRoom}</h3>
                                                    <h2>{house.house.hotelName}</h2>
                                                    <h3 className='price-detail-reservation-history'>${house.house.price} / đêm</h3>
                                                </div>
                                            </div>
                                            <div style={{ marginRight: '7%' }}>
                                                <h3>{formatDate(house.checkInDate)}  -  {formatDate(house.checkOutDate)}</h3>
                                                <h3 className='total-price-detail-reservation-history'>Tổng: {house.totalPrice} $</h3>
                                            </div>
                                            <div className='div-detail-status-reservation-history'>
                                                {house.status === 'AWAITING_APPROVAL' && (
                                                    <>
                                                        <h3 className='approval-status-reversation'>Đang chờ duyệt <i className="fas fa-hourglass-half spinning"></i></h3>
                                                        <h3 onClick={() => {
                                                            setHouseSelected(prev => house);
                                                            toggleCancelReservation()
                                                        }}
                                                        ><i className="fas fa-trash trash"></i></h3>
                                                    </>
                                                )}
                                                {house.status === "WAIT_FOR_CHECKIN" && (
                                                    <>
                                                        <h3 className='checkin-status-reversation'>Đang chờ Check-in <i className="fas fa-clock"></i></h3>
                                                        <h3 onClick={() => {
                                                            setHouseSelected(prev => house);
                                                            toggleCancelReservation()
                                                        }}
                                                        > <i className="fas fa-trash trash"></i></h3>
                                                    </>
                                                )}
                                                {house.status === 'CANCEL' && (
                                                    <h3 className='cancel-status-reversation'>Đã huỷ <i className="fas fa-ban"></i></h3>
                                                )}
                                                {house.status === 'WAITING_FOR_TRANSACTION' && (
                                                    <>
                                                        <h3 className='approval-status-reversation'>Đang chờ giao dịch <i className="fas fa-hourglass spinning"></i></h3>
                                                        <h3 onClick={() => {
                                                            setHouseSelected(prev => house);
                                                            toggleCancelReservation()
                                                        }}
                                                        > <i className="fas fa-trash trash"></i></h3>
                                                    </>
                                                )}
                                                {house.status === 'FINISH' && (
                                                    <h3>Đã hoàn thành <i className="fas fa-check"></i></h3>
                                                )}
                                                {house.status === 'REFUND' && (
                                                    <h3>Đã hoàn tiền <i className="fas fa-undo"></i></h3>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            {
                                reservation && reservation.length > housesPerPage && (
                                    <div className='container-pagination' style={{ top: '178%', left: '25%' }}>
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}

                                            // itemsPerPage={housesPerPage}
                                            onPageChange={handlePageChange}
                                            handlePrevPage={handlePrevPage}
                                            handleNextPage={handleNextPage}
                                        />
                                    </div>
                                )
                            }
                        </div>
                    ) : (
                        <div className='div-trip-form-user'>
                            <h1>Chuyến đi</h1 >
                            <hr className='hr-form-user' />
                            <h2>Chưa có chuyến đi nào được đặt... vẫn chưa!</h2>
                            <p>Đã đến lúc phủi bụi hành lý và bắt đầu chuẩn bị cho chuyến phiêu lưu tiếp theo của bạn rồi</p>
                            <Link to='/'>
                                <button className='btn-start-search-on-div-trip'>Bắt đầu tìm kiếm</button>
                            </Link>
                            <hr className='hr-form-user' />
                            <p>Bạn không tìm thấy đặt phòng/đặt chỗ của mình ở đây? <a className='a-tag-form-user' href="https://www.airbnb.com.vn/help?audience=guest">Truy cập Trung tâm trợ giúp</a> </p>
                        </div >
                    )
            }
            {(
                <div className={`overlay2 ${isOverLayCancelReservation ? '' : 'd-none'}`} >
                    <div className={`appearing-div ${isOverLayCancelReservation ? 'active' : ''}`}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <i style={{ marginRight: '33%' }}
                                onClick={toggleCancelReservation} class="fa-solid fa-chevron-left close-description" ></i>
                            <h2>Xác nhận huỷ</h2>
                        </div>
                        <hr />
                        <div>
                            <img src="" alt="" />
                            <div style={{ textAlign: 'center' }}>
                                <h1>{houseSelected && houseSelected.house.hotelName}</h1>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ width: '46%' }}>
                                    <img style={{ width: '100%', borderRadius: '16px' }} src={houseSelected && houseSelected.house.images[0].srcImg} alt="" />
                                </div>
                                <div style={{ width: '46%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <h3>Ngày đi: {houseSelected && formatDate(houseSelected.checkInDate)}</h3>
                                    <h3>-</h3>
                                    <h3>Ngày trả: {houseSelected && formatDate(houseSelected.checkOutDate)}</h3>
                                </div>
                            </div>
                            <div style={{ textAlign: 'end' }}>
                                <h2>Tổng Giá: {houseSelected && houseSelected.totalPrice} $</h2>
                            </div>
                        </div>
                        <hr />
                        <div className='group-btn-cancel-and-close-resersation'>
                            <button className='btn-close-reservation'>Đóng</button>
                            {
                                loadingCancel ? (
                                    <div class="loadingio-spinner-ellipsis-xy4aloyie7"><div class="ldio-ijfzxu11m4">
                                        <div></div><div></div><div></div><div></div><div></div>
                                    </div></div>
                                ) : (
                                    <button className='btn-confirm-cancel-reservation'
                                        onClick={() => handleCancelReservation(houseSelected.id)}>Huỷ</button>
                                )
                            }
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Trip