import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import Dropdown from 'react-bootstrap/Dropdown';
import "../Main/CssHosting/Hosting.css"
import NavbarHosting from './../../LayoutHosting/NavbarHosting';
import { API_HOST } from '../../../../Services/common';

function AllReservation() {
    const [showList, setShowList] = useState([])
    const [type, setType] = useState("upcoming")
    const [startDate, setStartDate] = useState('2020-01-01');
    const [endDate, setEndDate] = useState('2030-01-01');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPage, setTotalPage] = useState();
    const [value, setValue] = React.useState([
        dayjs('2023-09-29'),
        dayjs('2023-09-30'),
    ]);
    const [showFilterForm, setShowFilterForm] = useState(false)
    const onPageChange = (pageChange) => {
        if (pageChange < 0 || pageChange > totalPage - 1 || pageChange === currentPage) {
            return;
        }
        setCurrentPage(pageChange);


    };

    useEffect(() => {
        handleShowList(type)
    }, [currentPage, startDate, endDate])

    const onPageStart = () => {
        setCurrentPage(0);

    };
    const onPageEnd = () => {
        if (currentPage !== totalPage - 1) {
            setCurrentPage(totalPage - 1);
        }

    };
    const renderPagination = () => {

        const pagination = [];
        pagination.push(
            <li
                onClick={() => { onPageStart() }}
                className={`page-item ${currentPage === 0 ? "disabled" : ""}`}
            >
                <a
                    className="page-link"
                    href="#"
                    tabIndex="-1"
                    aria-disabled={currentPage === 0}
                >
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        );
        pagination.push(
            <li
                onClick={() => { onPageChange(currentPage - 1) }}
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                key="prev"
            >
                <a
                    className="page-link"
                    href="#"
                    tabIndex="-1"
                    aria-disabled={currentPage === 0}
                >
                    <span aria-hidden="true">&lt;</span>
                </a>
            </li>
        );
        const startPage = 0
        const endPage = totalPage - 1
        if (startPage > 1) {
            pagination.push(
                <li className="page-item" key="startDots">
                    <a className="page-link" href="#" tabIndex="-1">
                        ...
                    </a>
                </li>
            );
        }
        for (let i = startPage; i <= endPage; i++) {
            pagination.push(
                <li
                    className={`page-item ${currentPage === i ? "active" : ""}`}
                    onClick={() => { onPageChange(i) }}
                    key={i}
                >
                    <a className="page-link" href="#">
                        {i + 1}
                    </a>
                </li>
            );
        }
        if (endPage < totalPage - 1) {
            pagination.push(
                <li className="page-item" key="endDots">
                    <a className="page-link" href="#" tabIndex="-1">
                        ...
                    </a>
                </li>
            );
        }
        pagination.push(
            <li
                onClick={() => { onPageChange(currentPage + 1) }}
                className={`page-item ${currentPage === totalPage - 1 ? "disabled" : ""
                    }`}
                key="next"
            >
                <a
                    className="page-link"
                    href="#"
                    tabIndex="-1"
                    aria-disabled={currentPage === totalPage - 1}
                >
                    <span aria-hidden="true">&gt;</span>
                </a>
            </li>
        );
        pagination.push(
            <li
                onClick={() => { onPageEnd() }}
                className={`page-item ${currentPage === totalPage - 1 ? "disabled" : ""
                    }`}
            >
                <a
                    className="page-link"
                    href="#"
                    tabIndex="-1"
                    aria-disabled={currentPage === totalPage - 1}
                >
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        );
        return pagination;
    };
    useEffect(() => {
        async function getData() {
            let res = await axios.get(API_HOST + `reservation/all/${type}/${startDate}/${endDate}?page=${currentPage}&size=5`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                    }
                });
            setShowList(res.data.content)
            setTotalPage(res.data.totalPages)
            renderPagination()
        }
        getData();
    }, [])
    const handleShowList = (type) => {
        async function getData() {
            let res = await axios.get(API_HOST + `reservation/all/${type}/${startDate}/${endDate}?page=${currentPage}&size=5`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                    }
                });
            setShowList(res.data.content)
            setTotalPage(res.data.totalPages)
            renderPagination()
        }
        getData();
    }
    function formatDateString(inputDate) {
        if (inputDate.length !== 8) {
            return "Ngày không hợp lệ"; // Kiểm tra xem chuỗi đầu vào có đúng độ dài không
        }

        var year = inputDate.slice(0, 4);
        var month = inputDate.slice(4, 6);
        var day = inputDate.slice(6, 8);

        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            return "Ngày không hợp lệ"; // Kiểm tra xem các phần tử có phải là số không
        }

        return year + "-" + month + "-" + day;
    }

    return (
        <>
            <NavbarHosting></NavbarHosting>
            <div className='ms-5'>
                <div className='d-flex justify-content-between mb-3'>
                    <div className='fs-5 text-decoration-underline ms-5 '><Link style={{ color: 'black' }} to={`/host/bookedToday`}> <i class="fa-solid fa-chevron-left fa-2xs"></i> Quay lại</Link></div>
                    <div className='d-flex justify-content-between me-5'>
                        <button className='btn me-3 ms-3' style={{ border: 'gray solid 1px', borderRadius: '5px' }} onClick={() => setShowFilterForm(true)}><i class="fa-solid fa-angle-down" ></i> Lọc</button>
                        <button className='btn me-3 ms-3' style={{ border: 'gray solid 1px', borderRadius: '5px' }}><i class="fa-solid fa-angle-down"></i> Xuất</button>
                    </div>
                </div>
                <div className='fs-1  ms-5 mb-5'>Đặt phòng</div>
                <div className=''>
                    <div className='d-flex justify-content-start border-bottom mb-3'>
                        <div className={`fs-5 me-3 ms-3 pointer pb-3 fw-bold ${type == "upcoming" ? "selected" : ""}`} style={{ color: 'grey' }} onClick={() => { setType("upcoming"); setCurrentPage(0); handleShowList("upcoming"); renderPagination() }}> Sắp tới</div>
                        <div className={`fs-5 me-3 ms-3 pointer pb-3 fw-bold ${type == "finished" ? "selected" : ""}`} style={{ color: 'grey' }} onClick={() => { setType("finished"); setCurrentPage(0); handleShowList("finished"); renderPagination() }}> Đã hoàn tất</div>
                        <div className={`fs-5 me-3 ms-3 pointer pb-3 fw-bold ${type == "cancel" ? "selected" : ""}`} style={{ color: 'grey' }} onClick={() => { setType("cancel"); setCurrentPage(0); handleShowList("cancel"); renderPagination() }}> Đã huỷ</div>
                        <div className={`fs-5 me-3 ms-3 pointer pb-3 fw-bold ${type == "all" ? "selected" : ""}`} style={{ color: 'grey' }} onClick={() => { setType("all"); setCurrentPage(0); handleShowList("all"); }}> Tất cả</div>
                    </div>
                    <div style={{ height: '300px' }}>
                        <table className='col-12 table table-striped' style={{ border: 'solid 1px gray', width: '95%' }}>
                            <thead>
                                <th className='col-2' style={{ height: '40px', padding: '10px', verticalAlign: 'middle' }}>Tên khách hàng</th>
                                <th className='col-1' style={{ height: '40px', padding: '10px', verticalAlign: 'middle' }}>Số điện thoại</th>
                                <th className='col-4' style={{ height: '40px', padding: '10px', verticalAlign: 'middle' }}>Nhà/Phòng của bạn</th>
                                <th className='col-2' style={{ height: '40px', padding: '10px', verticalAlign: 'middle' }}>Ngày Check-in</th>
                                <th className='col-2' style={{ height: '40px', padding: '10px', verticalAlign: 'middle' }}>Ngày Check-out</th>
                                <th className='col-1' style={{ height: '40px', padding: '10px', verticalAlign: 'middle' }}>Tổng giá</th>
                            </thead>
                            <tbody>
                                {showList?.length == 0 ?
                                    <>
                                        <>
                                            <td colSpan={6} style={{ height: '200px', textAlign: 'center', verticalAlign: 'middle' }}>Không tìm thấy kết quả.</td>
                                        </>
                                    </>
                                    :
                                    showList?.map((item) => (
                                        <>
                                            <tr>
                                                <td>{item.user.lastName}</td>
                                                <td>{item.user.phone}</td>
                                                <td>{item.house.hotelName}</td>
                                                <td >{(dayjs(item.checkInDate)).format('YYYY-MM-DD')}</td>
                                                <td >{(dayjs(item.checkOutDate
                                                )).format('YYYY-MM-DD')}</td>
                                                <td style={{ textAlign: 'center' }}>{item.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'VNĐ')}</td>
                                            </tr>
                                        </>
                                    ))
                                }
                            </tbody>
                        </table>

                    </div>

                </div>
                <ul className="pagination justify-content-center">{renderPagination()}</ul>
            </div>


            <div className={`overlay ${showFilterForm ? 'active' : ''}`} >
                <div className={`appearing-div ${showFilterForm ? 'active' : ''}`}>
                    <div className="category-container d-block">
                        <div><h3>Bộ lọc</h3></div>
                        <div>Đặt phòng bắt đầu hoặc kết thúc trong phạm vi ngày như sau.</div>
                        <div className='col-12'><LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>

                                <DemoItem label="Controlled picker" component="DateRangePicker">
                                    <DateRangePicker
                                        value={value}
                                        onChange={(newValue) => setValue(newValue)}
                                    />
                                </DemoItem>
                            </DemoContainer>
                        </LocalizationProvider>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <div className='text-decoration-underline fs-6 mt-5' onClick={() => { setShowFilterForm(false); setStartDate("2020-01-01"); setEndDate("2030-01-01") }}>Xoá bộ lọc</div>
                            <button className='btn btn-form mt-5' onClick={() => { setShowFilterForm(false); setStartDate(value[0].format('YYYY-MM-DD')); setEndDate(value[1].format('YYYY-MM-DD')) }}>Áp dụng</button>
                        </div>

                    </div>
                </div>

            </div>

        </>
    )
} export default AllReservation
