import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import HouseOfHostDetail from './HouseOfHostDetail';
import './homeList.css';
import NavbarHosting from './../../LayoutHosting/NavbarHosting';
import { API_HOST } from '../../../../Services/common';

function EditComfortable() {
    const [listType, setListType] = useState([])
    const [comfotableList, setComfortableList] = useState([])
    const { houseID } = useParams();
    const [houseOfHostDetail, sethouseOfHostDetail] = useState({})
    const [render, setRender] = useState(false)

    useEffect(() => {
        async function getData() {
            let res = await axios.get(API_HOST + `house/houseOfHostDetail/${houseID}`);
            sethouseOfHostDetail(res.data)
        }
        getData();
    }, [render])
    useEffect(() => {
        async function getData() {
            let res = await axios.get(API_HOST + `comfortable`);
            setComfortableList(res.data)
        }

        getData();
    }, [])


    const indexOfComfortable = (comfortableID) => {
        let check = false
        houseOfHostDetail?.comfortableDetails.forEach(element => {
            if (element.comfortable.id == comfortableID) {
                check = element
            }
        });
        return check
    }
    const handleAddComfortable = (comfortableID) => {
        async function getData() {
            let res = await axios.get(API_HOST + `house/addComfortable/${houseID}/${comfortableID}`);
            setRender(render ? false : true)
        }
        getData();

    }
    const handleDeleteComfortable = (comfortableID) => {
        async function getData() {
            let res = await axios.get(API_HOST + `house/deleteComfortable/${houseID}/${comfortableID}`);
            setRender(render ? false : true)
        }
        getData();


    }
    useEffect(() => {
        async function getData() {
            let res = await axios.get(API_HOST + `comfortable/getComfortableType`);
            setListType(res.data)

        }
        getData();
    }, [])

    return (
        <>
            <NavbarHosting></NavbarHosting>
            <div className='fs-5 text-decoration-underline ms-5'><Link style={{ color: 'black' }} to={`/host/houseOfHostDetail/${houseID}`}> <i className="fa-solid fa-chevron-left fa-2xs"></i> Quay lại</Link></div>
            <div style={{ marginLeft: '200px' }} className='col-9'>
                <div className='fs-2 mb-5'>Tiện nghi</div>
                <div>
                    <h4>Phổ biến</h4>
                    <p>Đây là những tiện nghi mà khách thường tìm kiếm khi đặt chỗ ở.</p>                                    {
                        comfotableList?.map((item) => (

                            item.popular ?
                                <>

                                    <div key={item.id} className='border-bottom pb-3 pt-3 d-flex justify-content-between '>
                                        <div>
                                            <div>{item.name}</div>
                                            <div>{item.description}</div>
                                        </div>

                                        {
                                            indexOfComfortable(item.id) && indexOfComfortable(item.id).status == true ?
                                                <div className='d-flex'>
                                                    <div className='me-3 ms-3 ' ><button onClick={() => { handleDeleteComfortable(item.id) }} style={{ borderRadius: '50%', border: 'solid 1px' }}><i className="fa-solid fa-x "></i></button></div>
                                                    <div><button className='dark2' style={{ borderRadius: '50%', border: 'solid 1px' }}><i className="fa-solid fa-check "></i></button></div>
                                                </div>
                                                : indexOfComfortable(item.id) && indexOfComfortable(item.id).status == false ?
                                                    <div className='d-flex'>
                                                        <div className='me-3 ms-3' ><button className='dark2' style={{ borderRadius: '50%', border: 'solid 1px' }}><i className="fa-solid fa-x "></i></button></div>
                                                        <div><button onClick={() => { handleAddComfortable(item.id) }} style={{ borderRadius: '50%', border: 'solid 1px' }}><i className="fa-solid fa-check "></i></button></div>
                                                    </div>
                                                    :
                                                    <div className='d-flex'>
                                                        <div className='me-3 ms-3' ><button onClick={() => { handleDeleteComfortable(item.id) }} style={{ borderRadius: '50%', border: 'solid 1px' }}><i className="fa-solid fa-x "></i></button></div>
                                                        <div><button onClick={() => { handleAddComfortable(item.id) }} style={{ borderRadius: '50%', border: 'solid 1px' }}><i className="fa-solid fa-check "></i></button></div>
                                                    </div>
                                        }

                                    </div>
                                </> : ""
                        ))
                    }
                </div>
                <div>
                    {
                        listType.map((typeComfor) => (
                            <>


                                <h4 key={typeComfor.id}>{typeComfor.name}</h4>
                                {
                                    comfotableList?.map((item) => (
                                        item.type.name == typeComfor.name ?
                                            <>
                                                <div key={item.id} className='border-bottom pb-3 pt-3 d-flex justify-content-between '>
                                                    <div>
                                                        <div>{item.name}</div>
                                                        <div>{item.description}</div>
                                                    </div>
                                                    {
                                                        indexOfComfortable(item.id) && indexOfComfortable(item.id).status == true ?
                                                            <div className='d-flex'>
                                                                <div className='me-3 ms-3 ' ><button onClick={() => { handleDeleteComfortable(item.id) }} style={{ borderRadius: '50%', border: 'solid 1px' }}><i className="fa-solid fa-x "></i></button></div>
                                                                <div><button className='dark2' onClick={() => { handleAddComfortable(item.id) }} style={{ borderRadius: '50%', border: 'solid 1px' }}><i className="fa-solid fa-check "></i></button></div>
                                                            </div>
                                                            : indexOfComfortable(item.id) && indexOfComfortable(item.id).status == false ?
                                                                <div className='d-flex'>
                                                                    <div className='me-3 ms-3' onClick={() => { handleDeleteComfortable(item.id) }} ><button className='dark2' style={{ borderRadius: '50%', border: 'solid 1px' }}><i className="fa-solid fa-x "></i></button></div>
                                                                    <div><button onClick={() => { handleAddComfortable(item.id) }} style={{ borderRadius: '50%', border: 'solid 1px' }}><i className="fa-solid fa-check "></i></button></div>
                                                                </div>
                                                                :
                                                                <div className='d-flex'>
                                                                    <div className='me-3 ms-3' onClick={() => { handleDeleteComfortable(item.id) }} ><button style={{ borderRadius: '50%', border: 'solid 1px' }}><i className="fa-solid fa-x "></i></button></div>
                                                                    <div><button onClick={() => { handleAddComfortable(item.id) }} style={{ borderRadius: '50%', border: 'solid 1px' }}><i className="fa-solid fa-check "></i></button></div>
                                                                </div>
                                                    }
                                                </div>

                                            </>
                                            : ''
                                    )
                                    )

                                }
                            </>

                        ))
                    }
                </div>
            </div>
            <div className='fs-5 text-decoration-underline ' style={{ marginLeft: '1100px', marginTop: '50px' }}><Link style={{ color: 'black' }} to={`/host/houseOfHostDetail/${houseID}`}> <i className="fa-solid fa-chevron-left fa-2xs"></i> Quay lại</Link></div>
        </>
    )
} export default EditComfortable