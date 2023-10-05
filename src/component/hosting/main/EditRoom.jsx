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
import NavbarHosting from '../../layout_hosting/NavbarHosting';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    
    bgcolor: 'background.paper',
    border: '1px solid white',
    boxShadow: 24,
    p: 4,
};


function EditRoom() {
    const typeBedList = ['SINGLE', 'KING', 'QUEEN', 'BUNK', 'SOFA', 'COUCH']
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [openImage, setOnpenImage] = React.useState(false);
    const handleOpenImage = () => setOnpenImage(true);
    const handleCloseImage = () => setOnpenImage(false);

    const [openBed, setOnpenBed] = React.useState(false);
    const handleOpenBed = () => setOnpenBed(true);
    const handleCloseBed = () =>{
        setBed([{ type: "SINGLE", quantity: 0 },
        { type: "KING", quantity: 0 },
        { type: "QUEEN", quantity: 0 },
        { type: "BUNK", quantity: 0 },
        { type: "SOFA", quantity: 0 },
        { type: "COUCH", quantity: 0 }]);
        setOnpenBed(false);
    } 

    const [RoomEdit, setRoomEdit] = useState()
    const { houseID } = useParams();
    const [houseOfHostDetail, sethouseOfHostDetail] = useState({})
    const [updateRoom, setUpdateRoom] = useState([])
    const [newQuantityRoom, setQuantityRoom] = useState(0)
    const [newQuantityOfBathrooms, setNewQuantityOfbathrooms] = useState(0)
    const [imageChoosed, setImageChoosed] = useState([])
    const [bed, setBed] = useState([{ type: "SINGLE", quantity: 0 },
    { type: "KING", quantity: 0 },
    { type: "QUEEN", quantity: 0 },
    { type: "BUNK", quantity: 0 },
    { type: "SOFA", quantity: 0 },
    { type: "COUCH", quantity: 0 }])
    useEffect(() => {
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/host/house/houseOfHostDetail/${houseID}`,{ headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
            }});
            sethouseOfHostDetail(res.data)
        }
        getData();
    }, [open, openImage,openBed])
    const handlesetUpdateRoom = (index) => {
        let newList = []
        let check = false
        updateRoom.forEach(element => {
            if (element?.index == index && element?.status == true) {
                newList.push({ index: index, status: false })
                check = true
            } else if (element?.index == index && element?.status == false) {
                newList.push({ index: index, status: true })
                check = true
            } else {
                newList.push(element)
            }

        });
        if (check == false) {
            newList.push({ index: index, status: true })
        }
        setUpdateRoom(newList)
    }
    const checkInclues = (index) => {
        let check = false
        updateRoom.forEach(element => {
            if (element.index == index && element.status == true) {
                check = true
            }
        });
        return check
    }
    const handleLog = () => {
        console.log(updateRoom);
    }
    const handleUpdateQuantity = () => {

        async function getData2() {

            let res2 = await axios.get(`http://localhost:8080/api/host/house/edit/quantityRoomBedBath/${houseID}/${newQuantityRoom}/${newQuantityOfBathrooms}`,{ headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
            }});

        }
        getData2();
    }
    const handleChooseImage = () => {

        async function getData2() {

            let res2 = await axios.post(`http://localhost:8080/api/host/house/edit/chooseImage/${RoomEdit}`, imageChoosed, 
            { headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
            }});

        }
        getData2();



    }
    const handleChoose = (imageId) => {
        if (imageChoosed.includes(imageId)) {
            let newList = imageChoosed.filter((item) => (item != imageId)

            )
            setImageChoosed(newList)
        } else {
            setImageChoosed([...imageChoosed, imageId])
        }
        console.log(imageChoosed);
    }

    const handleSetBed = (item) => {
        let list = []
        let Bed=[]
        let checkInclue = (x, y) => {
            let check = false
            y.forEach(element => {
                if (x.type == element.type) {
                    check = element
                }
            });
            return check
        }
        bed.forEach(element => {
            if (checkInclue(element, item)) {
                list.push(checkInclue(element, item))
            } else {

                list.push(element)
            }

        });
        setBed(list)
    }
    
    const handleUpdateBed=()=>{
        
        async function getData2() {
            
            let res2 = await axios.post(`http://localhost:8080/api/host/house/edit/updateBed/${RoomEdit}`, bed, 
            { headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
            }});

        }
        getData2();
    }
    return (
        <>
            <NavbarHosting></NavbarHosting>
            <div className='col-9' style={{ marginLeft: '200px' }}>
                <h3 className='mb-3'>Phòng và không gian</h3>
                <p className='mb-5'>Thêm hoặc chỉnh sửa khu vực mà khách có thể sử dụng</p>

                <div className='d-flex justify-content-between mb-3' style={{ border: 'solid gray 1px', borderRadius: '5px', height: '50px' }}>
                    <div className='ms-4 mt-2'>
                        {`Phòng ngủ (${houseOfHostDetail?.quantityOfRooms}) - Phòng tắm (${houseOfHostDetail?.quantityOfBathrooms})`}
                    </div >
                    <div onClick={() => { handleOpen(); setNewQuantityOfbathrooms(houseOfHostDetail?.quantityOfBathrooms); setQuantityRoom(houseOfHostDetail?.quantityOfRooms) }} className='me-4 mt-2 fs-5 text-decoration-underline'>Chỉnh sửa phòng và không gian</div>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginBottom: '50px' }}>
                                Khách có thể sử dụng những khu vực nào?
                            </Typography>
                            <div className='d-flex justify-content-between mb-3'>
                                <div className='fs-4'>
                                    Phòng ngủ :
                                </div>
                                <div className='d-flex justify-content-between mb-3>'>
                                    <button onClick={() => newQuantityRoom > 1 ? setQuantityRoom(newQuantityRoom - 1) : ""} style={{ width: '30px', height: '30px', borderRadius: '50%', border: 'solid 1px' }} className=' me-3 ms-3'>-</button>
                                    <p>{newQuantityRoom}</p>
                                    <button onClick={() => setQuantityRoom(parseInt(newQuantityRoom) + 1)} style={{ width: '30px', height: '30px', borderRadius: '50%', border: 'solid 1px' }} className=' me-3 ms-3'>+</button>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between mb-3'>
                                <div className='fs-4'>
                                    Phòng tắm :
                                </div>
                                <div className='d-flex justify-content-between mb-3>'>
                                    <button onClick={() => newQuantityOfBathrooms > 1 ? setNewQuantityOfbathrooms(newQuantityOfBathrooms - 1) : ""} style={{ width: '30px', height: '30px', borderRadius: '50%', border: 'solid 1px' }} className=' me-3 ms-3'>-</button>
                                    <p>{newQuantityOfBathrooms}</p>
                                    <button onClick={() => setNewQuantityOfbathrooms(parseInt(newQuantityOfBathrooms) + 1)} style={{ width: '30px', height: '30px', borderRadius: '50%', border: 'solid 1px' }} className=' me-3 ms-3'>+</button>
                                </div>
                            </div>
                            <div className='d-flex flex-row-reverse'>
                                <div><button onClick={handleUpdateQuantity} style={{ backgroundColor: 'black', color: 'white', borderRadius: '5px', width: '60px', marginLeft: '30px' }}>Lưu</button></div>

                            </div>
                        </Box>
                    </Modal>
                </div>
                <div>
                    {
                        houseOfHostDetail?.rooms?.map((item, index) => (
                            <>{
                                !checkInclues(index) ?
                                    <>
                                        <div onClick={() => { handlesetUpdateRoom(index) }} className='d-flex justify-content-between mb-3 ' style={{ border: 'solid gray 2px', borderRadius: '5px', height: '100px' }}>
                                            <div className='fs-3 ms-5 mt-4' style={{ marginLeft: '' }}>
                                                Phòng ngủ {index + 1}
                                            </div>
                                            <div className='me-5 mt-4'>
                                                <i class="fa-solid fa-chevron-down"></i>
                                            </div>
                                        </div>
                                    </> :
                                    <>
                                        <div style={{ border: 'solid gray 2px', borderRadius: '5px', marginBottom: '20px' }}>
                                            <div onClick={() => { handlesetUpdateRoom(index) }} className='d-flex justify-content-between mb-3 ' style={{ borderBottom: 'solid gray 1px' }} >
                                                <div className='fs-3 ms-5 mt-4' style={{ marginLeft: '' }}>
                                                    Phòng ngủ {index + 1}
                                                </div>
                                                <div className='me-5 mt-4'>
                                                    <i class="fa-solid fa-chevron-down"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div className='fs-5 ms-3 mb-3'>Ảnh của phòng</div>
                                                <div className='d-flex justify-content-between'>
                                                    <div className='d flex ' style={{ borderBottom: 'solid gray 1px' }}>
                                                        {houseOfHostDetail.rooms[index].images.length == 0 ? <div className='ms-3 mb-3'>chưa có ảnh</div> :

                                                            houseOfHostDetail.rooms[index].images.map((image) => (
                                                                <img style={{ height: '150px', width: '230px', marginLeft: '20px', marginBottom: '20px' }} src={image?.srcImg} alt="" />
                                                            ))
                                                        }

                                                    </div>
                                                    <div onClick={() => { handleOpenImage(); setRoomEdit(item.id); setImageChoosed(item.images.map((i) => (i.id))) }} className='fs-5 me-5 text-decoration-underline'>
                                                        Chỉnh sửa
                                                    </div>
                                                    <Modal
                                                        open={openImage}
                                                        onClose={handleCloseImage}
                                                        aria-labelledby="modal-modal-title"
                                                        aria-describedby="modal-modal-description"
                                                    >
                                                        <Box sx={style}>
                                                            <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginBottom: '20px' }}>
                                                                Phòng ngủ Gán ảnh hiện có của khu vực này
                                                            </Typography>

                                                            {
                                                                houseOfHostDetail.images.map((image) => (
                                                                    image.room == null || image.room.id == RoomEdit ? <>  <img onClick={() => { handleChoose(image.id) }} style={imageChoosed.includes(image.id) ? { border: 'solid  3px', borderRadius: '5px', width: '200px', height: '130px', marginLeft: '20px', marginRight: '20px', marginBottom: '15px' } : { width: '200px', height: '130px', marginLeft: '20px', marginRight: '20px', marginBottom: '15px' }} src={image.srcImg} alt="" /></> :
                                                                        ""
                                                                ))
                                                            }


                                                            <div className='d-flex flex-row-reverse'>
                                                                <div><button onClick={handleChooseImage} style={{ backgroundColor: 'black', color: 'white', borderRadius: '5px', width: '60px', marginLeft: '30px' }}>Lưu</button></div>

                                                            </div>
                                                        </Box>
                                                    </Modal>
                                                </div>

                                            </div>
                                            <div>
                                                <div className='fs-5 ms-3 mb-2'>Bố trí chỗ ngủ</div>
                                                <div className='d-flex justify-content-between'>
                                                    <div className='fs-6 ms-3 mb-3'>
                                                        {
                                                            houseOfHostDetail?.rooms[index]?.beds?.map((item) => (
                                                                `${item.quantity} giường ${item.type} ,`
                                                            ))
                                                        }
                                                    </div>
                                                    <div onClick={() => {
                                                        handleOpenBed();
       
                                                        setRoomEdit(item.id);
                                                         handleSetBed(item.beds);
                                                    }} className='fs-5 me-5 text-decoration-underline'>
                                                        Chỉnh sửa
                                                    </div>
                                                    <Modal
                                                        open={openBed}
                                                        onClose={handleCloseBed}
                                                        aria-labelledby="modal-modal-title"
                                                        aria-describedby="modal-modal-description"
                                                    >
                                                        <Box sx={style}>
                                                            <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginBottom: '20px' }}>
                                                                Số giường trong mỗi nhà/phòng cho thuê
                                                            </Typography>

                                                            <div>
                                                                {
                                                                    bed.map((item) => (

                                                                        <div className='d-flex justify-content-between' style={{ borderBottom: 'solid gray 1px', marginBottom: ' 15px' }}>
                                                                            <div>{item.type}</div>
                                                                            <div className='d-flex justify-content-between'>
                                                                                <button onClick={() => { item.quantity > 0 ? handleSetBed([{ type: item.type, quantity: item.quantity - 1 }]) : handleSetBed([{ type: item.type, quantity: item.quantity }]) }} style={{ width: '30px', height: '30px', borderRadius: '50%', border: 'solid 1px' }} className='me-3 ms-3'>-</button>
                                                                                <p>{item.quantity}</p>
                                                                                <button onClick={() => { handleSetBed([{ type: item.type, quantity: item.quantity + 1 }]) }} style={{ width: '30px', height: '30px', borderRadius: '50%', border: 'solid 1px' }} className='me-3 ms-3'>+</button>
                                                                            </div>
                                                                        </div>
                                                                    )

                                                                    )
                                                                }
                                                            </div>


                                                            <div className='d-flex flex-row-reverse'>
                                                                <div><button onClick={handleUpdateBed} style={{ backgroundColor: 'black', color: 'white', borderRadius: '5px', width: '60px', marginLeft: '30px' }}>Lưu</button></div>

                                                            </div>
                                                        </Box>
                                                    </Modal>
                                                </div>

                                            </div>
                                        </div>

                                    </>
                            }


                            </>
                        ))
                    }
                </div>
            </div>

        </>
    )
} export default EditRoom
