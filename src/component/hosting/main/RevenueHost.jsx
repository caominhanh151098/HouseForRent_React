import React from 'react'
import axios from 'axios';
import '../main/CssHosting/revenueHost.css';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import MyAxios from '../../../Services/MyAxios';
import NavbarHosting from '../../layout_hosting/NavbarHosting';
import FooterFormUser from './../../../Components/User/FooterFormUser';
function RevenueHost() {

    const [house, setHouse] = useState(-1)
    const [total,setTotal] =useState(0)
    const [start, setStart] = useState({ month: '01', year: '2023' })
    const [end, setEnd] = useState({ month: '10', year: '2023' })
    const [listHouse, setListHouse] = useState([])
    const [listRevenue, setRevenue] = useState([])
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPage, setTotalPage] = useState();
    const onPageChange = (pageChange) => {
        

        if (pageChange < 0 || pageChange > totalPage - 1 || pageChange === currentPage) {
            return;
        }
        setCurrentPage(pageChange);


    };
    useEffect(() => {
        let total=0
        listRevenue.forEach(element => {
            total+=element.totalPrice*97/100
        });
        setTotal(total)
    }, [listRevenue])
   

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
    let listYear = []
    const setListYear = () => {
        let dateNow = new Date();
        let yearNow = dateNow.getFullYear()
        for (let i = yearNow; i >= yearNow - 10; i--) {
            listYear.push(i)
        }
    }
    setListYear()
    let listMonth = []
    const setListMonth = () => {
        for (let i = 1; i <= 12; i++) {
            if (i < 10) {
                listMonth.push('0' + i)
            } else {
                listMonth.push('' + i)
            }

        }
    }
    setListMonth()
    const getLastDayOfMonth = (year, month) => {
        const nextMonth = new Date(+year, +month);
        const lastDay = new Date(nextMonth - 1);
        console.log(nextMonth);

        let x = year + '-' + month + '-' + lastDay.getDate();
        console.log(x);
        return x;
    }
    useEffect(() => {
        async function getData() {


            let res = await axios.get(`http://localhost:8080/api/host/house/getHouseRevenueHost`,
            {headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
            }});
            setListHouse(res.data)
           
        }
        getData();
    }, [])
    useEffect(() => {
        let startdate = start.year + '-' + start.month + '-01'
        let enddate = getLastDayOfMonth(end.year, end.month)
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/host/reservation/getReservationFinish/${house}/${startdate}/${enddate}?page=${currentPage}`,
            {headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
            }});
            setRevenue(res.data.content)
            setTotalPage(res.data.totalPages)
        }
        getData();
    }, [start, end,house,currentPage])
    return (
        <>
            <NavbarHosting type={"revenueHost"}></NavbarHosting>
            <div className='col-9 container-revenue ' style={{marginBottom:"50px"}}>
                <div className='fs-2 mb-5'>Lịch sử giao dịch</div>
                <div className=' d-flex justify-content-between pb-3 mb-3 border-bottom'>
                    <div className='fs-5'>Các khoản thanh toán đã hoàn tất</div>
                    <div className='fs-5'>Các khoản thanh toán sắp tới</div>
                    <div className='fs-5'>Thu nhập thuần</div>
                </div>
                <div className='mb-3'>
                    <select defaultValue={'-1'} onChange={(e) => setHouse(e.target.value)} class="form-select" aria-label="Default select example">
                        <option value='-1'>Tất cả nhà / phòng cho thuê</option>
                        {
                            listHouse?.map((item => (
                                <>
                                    <option value={item.id} key={item.id}>{item.hotelName}</option>
                                </>
                            )))
                        }
                    </select>
                </div>
                <div className=' d-flex justify-content-around mb-4'>
                    <div className='d-flex'>
                        <div style={{ verticalAlign: 'middle' }} className='fs-4'> Từ   </div>
                        <select onChange={(e) => setStart({ ...start, month: e.target.value })} class="form-select month-select me-2 ms-2" aria-label="Default select example">
                            {
                                listMonth?.map((item) => (
                                    <option value={item} key={item.id}>tháng {item}</option>
                                ))
                            }
                        </select>
                        <select onChange={(e) => setStart({ ...start, year: e.target.value })} class="form-select year-select me-2 ms-2" aria-label="Default select example">
                            {
                                listYear?.map((item) => (
                                    <option value={item} key={item.id}>{item}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className='d-flex '>
                        <div style={{ verticalAlign: 'middle' }} className='fs-4'>Đến  </div>
                        <select onChange={(e) => setEnd({ ...end, month: e.target.value })} class="form-select  month-select me-2 ms-2" aria-label="Default select example">
                            {
                                listMonth?.map((item) => (
                                    <option value={item} key={item}>tháng {item}</option>
                                ))
                            }
                        </select>
                        <select onChange={(e) => setEnd({ ...end, year: e.target.value })} class="form-select year-select me-2 ms-2" aria-label="Default select example">
                            {
                                listYear?.map((item) => (
                                    <option value={item} key={item}>{item}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className='d-flex justify-content-between mb-3'>
                    <div className='fs-4'> Tổng doanh thu : {total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'VNĐ')} </div>
                    
                </div>
                {
                    listRevenue.length == 0 ?
                        <div className='not-found'>
                            hiện không có giao dịch nào .
                        </div> :
                        <>
                        <div>

                        
                            <table className='col-12 table table-striped' style={{ border: 'solid 1px gray', width: '100%' }}>
                                <thead>
                                <td  className='col-2'style={{width:'10%'}}>Khách hàng</td>
                                    <td className='col-2' style={{width:'25%'}} >Phòng / nhà</td>
                                    <td className='col-2' style={{width:'10%'}}>Ngày hoàn thành</td>
                                    <td className='col-2' style={{width:'10%'}}>tổng giá</td>
                                </thead>
                                <tbody>

                              
                                {
                                    listRevenue.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.user.lastName}</td>
                                            <td>{item.house.hotelName}</td>
                                            <td>{(dayjs(item.completeDate)).format('YYYY-MM-DD')}</td>
                                            <td>{(item.totalPrice*97/100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'VNĐ')} </td>
                                        </tr>

                                    ))
                                }
                                  </tbody>
                            </table>
                            <ul className="pagination justify-content-center">{renderPagination()}</ul>
                            </div>
                        </>
                }

            </div>
          
            <FooterFormUser/>
        </>
    )
} export default RevenueHost
