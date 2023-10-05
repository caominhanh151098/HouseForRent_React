import React from 'react'
import './bookedToday.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

function BookedToday() {
    const [type, setType] = useState("willCheckOut")
    const [willCheckOut, setWillCheckOut] = useState([])
    const [welcoming, setWelcoming] = useState([])
    const [coming, setComing] = useState([])
    const [upComing, setUpComing] = useState([])
    const [waitApproval, setApproval] = useState([])
    const [render, setRender] = useState(false)
    const [detail,setDetail]=useState({})
    useEffect(() => {
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/reservation/willCheckOut`);
            setWillCheckOut(res.data)
        }
        getData();
    }, [render])
    useEffect(() => {
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/reservation/welcoming`);
            setWelcoming(res.data)
        }
        getData();
    }, [render])
    useEffect(() => {
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/reservation/coming`);
            setComing(res.data)
        }
        getData();
    }, [render])
    useEffect(() => {
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/reservation/upcoming`);
            setUpComing(res.data)
        }
        getData();
    }, [render])
    useEffect(() => {
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/reservation/waitApproval`);
            setApproval(res.data)
        }
        getData();
    }, [render])

    const submit = (id) => {

        confirmAlert({
            title: "Huỷ lịch đặt",
            message: "Bạn có muốn huỷ lịch đặt này không?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        async function getData() {
                            let res = await axios.get(`http://localhost:8080/api/reservation/delete/${id}`);
                            setRender(render ? false : true)
                        }
                        getData();
                    }

                },
                {
                    label: "No"
                    // onClick: () => alert("Click No")
                }
            ]
        });
    };


    const accept = (id) => {

        confirmAlert({
            title: "Duyệt đơn",
            message: "Bạn có muốn chấp nhận đơn đặt này không?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        async function getData() {
                            let res = await axios.get(`http://localhost:8080/api/reservation/accept/${id}`);
                            setRender(render ? false : true)
                        }
                        getData();
                    }

                },
                {
                    label: "No"
                    // onClick: () => alert("Click No")
                }
            ]
        });
    };
    const deny = (id) => {

        confirmAlert({
            title: "Duyệt đơn",
            message: "Bạn có huỷ đơn đặt này không?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        async function getData() {
                            let res = await axios.get(`http://localhost:8080/api/reservation/delete/${id}`);
                            setRender(render ? false : true)
                        }
                        getData();
                    }

                },
                {
                    label: "No"
                    // onClick: () => alert("Click No")
                }
            ]
        });
    };
    const handleshowGuestDetail =(reservationId)=>{
       
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/reservation/getGuestDetail/${reservationId}`);
            setDetail(res.data)
        }
        getData();
  
    }
    return (
        <>
            <div className='col-10 ' style={{ marginLeft: '100px' }}>
                <div className='fs-3 mt-5 mb-5'>Chào mừng chủ nhà </div>
                <div className='fs-4 mb-4'>
                    Đặt phòng /đặt chỗ của bạn
                </div>
                <div className='d-flex justify-content-between col-12 mb-4'>
                    <button style={type == "willCheckOut" ? { borderColor: 'black ' } : {}} onClick={() => setType("willCheckOut")} className='rounded-pill btn-type' >Sắp trả phòng ({willCheckOut.length})</button>
                    <button style={type == "welcoming" ? { borderColor: 'black' } : {}} onClick={() => setType("welcoming")} className='rounded-pill btn-type'>Hiện đang đón tiếp ({welcoming.length})</button>
                    <button style={type == "coming" ? { borderColor: 'black' } : {}} onClick={() => setType("coming")} className='rounded-pill btn-type'>Sắp đến ({coming.length})</button>
                    <button style={type == "upcoming" ? { borderColor: 'black' } : {}} onClick={() => setType("upcoming")} className='rounded-pill btn-type'>Sắp tới ({upComing.length})</button>
                    <button style={type == "waitApproval" ? { borderColor: 'black' } : {}} onClick={() => setType("waitApproval")} className='rounded-pill btn-type'>Đánh giá đang chờ xử lí ({waitApproval.length})</button>
                    <div className='fs-5 text-decoration-underline' style={{marginLeft:'200px'}}><Link style={{color:'black',textDecoration:'underline'}} to={`/AllReservation`}>Tất cả đặt phòng</Link>  </div>
                </div>
                <table className='col-8 table table-striped' style={{ border: 'solid 1px gray', width: '100%' }}>
                    <thead>
                        <th style={{ height: '40px', padding: '10px', verticalAlign: 'middle' }}>Tên khách hàng</th>
                        <th style={{ height: '40px', padding: '10px', verticalAlign: 'middle' }}>Số điện thoại</th>
                        <th style={{ height: '40px', padding: '10px', verticalAlign: 'middle' }}>Nhà/Phòng của bạn</th>
                        <th style={{ height: '40px', padding: '10px', verticalAlign: 'middle' }}>Ngày Check-in</th>
                        <th style={{ height: '40px', padding: '10px', verticalAlign: 'middle' }}>Ngày Check-out</th>
                        <th style={{ height: '40px', padding: '10px', verticalAlign: 'middle' }}>Tổng giá</th>
                    </thead>
                    <tbody >
                        {
                            type == "willCheckOut" ?
                                willCheckOut.length == 0 ?
                                    <>
                                        <td colSpan={6} style={{ height: '200px', textAlign: 'center', verticalAlign: 'middle' }}>Bạn không có khách nào trả phòng vào hôm nay hoặc ngày mai.</td>
                                    </> :
                                    willCheckOut.map((item) => (
                                        <>    <tr>
                                            <td>{item.user.lastName}</td>
                                            <td>{item.user.phone}</td>
                                            <td>{item.house.hotelName}</td>
                                            <td style={{ textAlign: 'center' }}>{item.checkInDate}</td>
                                            <td style={{ textAlign: 'center' }}>{item.checkOutDate}</td>
                                            <td style={{ textAlign: 'center' }}>{item.totalPrice}</td>
                                            <td><i data-bs-toggle="modal" data-bs-target="#staticBackdrop" class="fa-solid fa-circle-info fa-xl" onClick={()=>handleshowGuestDetail(item.id)}></i></td>
                                        </tr>
                                        </>

                                    )) :
                                type == "welcoming" ?
                                    welcoming.length == 0 ?
                                        <>
                                            <td colSpan={6} style={{ height: '200px', textAlign: 'center', verticalAlign: 'middle' }}>Bạn không có khách nào hiện đang ở chỗ của bạn.</td>
                                        </> :
                                        welcoming.map((item) => (
                                            <>    <tr>
                                                <td>{item.user.lastName}</td>
                                                <td>{item.user.phone}</td>
                                                <td>{item.house.hotelName}</td>
                                                <td style={{ textAlign: 'center' }}>{item.checkInDate}</td>
                                                <td style={{ textAlign: 'center' }}>{item.checkOutDate}</td>
                                                <td style={{ textAlign: 'center' }}>{item.totalPrice}</td>
                                                <td><i data-bs-toggle="modal" data-bs-target="#staticBackdrop" class="fa-solid fa-circle-info fa-xl" onClick={()=>handleshowGuestDetail(item.id)}></i></td>
                                            </tr>
                                            </>

                                        )) :
                                    type == "coming" ?
                                        coming.length == 0 ?
                                            <>
                                                <td colSpan={6} style={{ height: '200px', textAlign: 'center', verticalAlign: 'middle' }}>Bạn không có khách nào đến vào hôm nay hay ngày mai.</td>
                                            </> :
                                            coming.map((item) => (
                                                <>    <tr>
                                                    <td>{item.user.lastName}</td>
                                                    <td>{item.user.phone}</td>
                                                    <td>{item.house.hotelName}</td>
                                                    <td style={{ textAlign: 'center' }}>{item.checkInDate}</td>
                                                    <td style={{ textAlign: 'center' }}>{item.checkOutDate}</td>
                                                    <td style={{ textAlign: 'center' }}>{item.totalPrice}</td>
                                                    <td><i class="fa-solid fa-trash-can fa-lg" onClick={() => submit(item.id)}></i></td>
                                                    <td><i data-bs-toggle="modal" data-bs-target="#staticBackdrop" class="fa-solid fa-circle-info fa-xl"></i></td>
                                                </tr>
                                                </>

                                            )) :
                                        type == "upcoming" ?
                                            upComing.length == 0 ?
                                                <>
                                                    <td colSpan={6} style={{ height: '200px', textAlign: 'center', verticalAlign: 'middle' }}>Hiện bạn không có vị khách nào sắp tới.</td>
                                                </> :
                                                upComing.map((item) => (
                                                    <>    <tr>
                                                        <td>{item.user.lastName}</td>
                                                        <td>{item.user.phone}</td>
                                                        <td>{item.house.hotelName}</td>
                                                        <td style={{ textAlign: 'center' }}>{item.checkInDate}</td>
                                                        <td style={{ textAlign: 'center' }}>{item.checkOutDate}</td>
                                                        <td style={{ textAlign: 'center' }}>{item.totalPrice}</td>
                                                        <td><i class="fa-solid fa-trash-can fa-lg" onClick={() => submit(item.id)}></i></td>
                                                        <td><i data-bs-toggle="modal" data-bs-target="#staticBackdrop" class="fa-solid fa-circle-info fa-xl" onClick={()=>handleshowGuestDetail(item.id)}></i></td>
                                                    </tr>
                                                    </>

                                                )) :
                                            type == "waitApproval" ?
                                                waitApproval.length == 0 ?
                                                    <>
                                                        <td colSpan={6} style={{ height: '200px', textAlign: 'center', verticalAlign: 'middle' }}>Bạn hiện không có đánh giá nào cần viết cho khách.</td>
                                                    </> :
                                                    waitApproval.map((item) => (
                                                        <>    <tr>
                                                            <td>{item.user.lastName}</td>
                                                            <td>{item.user.phone}</td>
                                                            <td>{item.house.hotelName}</td>
                                                            <td style={{ textAlign: 'center' }}>{item.checkInDate}</td>
                                                            <td style={{ textAlign: 'center' }}>{item.checkOutDate}</td>
                                                            <td style={{ textAlign: 'center' }}>{item.totalPrice}</td>
                                                            <td><i class="fa-solid fa-x fa-lg" onClick={() => deny(item.id)}></i></td>
                                                            <td><i class="fa-solid fa-check fa-xl" onClick={() => accept(item.id)}></i></td>
                                                            <td><i data-bs-toggle="modal" data-bs-target="#staticBackdrop" class="fa-solid fa-circle-info fa-xl" onClick={()=>handleshowGuestDetail(item.id)}></i></td>
                                                        </tr>
                                                        </>

                                                    )) : ""
                        }
                    </tbody>
                </table>
            </div>




            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">Detail</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" style={{ marginLeft: '40px', marginRight: '40px' }}>
                            <div className='d-flex justify-content-between border-bottom mb-3 pb-3'>
                                <div className=' fs-4'> người lớn :</div>
                                
                                <div className='fs-5 mt-2 ' style={{ marginRight: '80px' }}>{detail?.numAdults}</div>
                            </div>
                            <div className='d-flex justify-content-between border-bottom mb-3 pb-3'>
                                <div >
                                    <div className=' fs-4' > trẻ em :</div>
                                    <div>Từ 2-12 tuổi</div>
                                </div>
                                <div className='fs-5 mt-2' style={{ marginRight: '80px' }}>{detail?.numChildrenAbove2}</div>
                            </div>
                            <div className='d-flex justify-content-between border-bottom mb-3 pb-3'>
                                <div>
                                    <div className=' fs-4'> em bé:</div>
                                    <div>dưới 2 tuổi</div>
                                </div>
                                <div className='fs-5 mt-2' style={{ marginRight: '80px' }}>{detail?.numBabies}</div>
                            </div>
                            <div className='d-flex justify-content-between border-bottom mb-3 pb-3'>
                                <div className=' fs-4'>thú cưng :</div>
                                <div className='fs-5 mt-2' style={{ marginRight: '80px' }}>{detail?.numPets}</div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default BookedToday