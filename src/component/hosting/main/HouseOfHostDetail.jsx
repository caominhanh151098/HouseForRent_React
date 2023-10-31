import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import NavbarHosting from '../../layout_hosting/NavbarHosting';
import FileService from './../../../Services/fileService';
function HouseOfHostDetail() {
    const typeRoomList = ["ENTIRE_PLACE", "ROOM", "SHARED_ROOM"]
    const [reder, setRender] = useState(false);
    const [houseOfHostDetail, sethouseOfHostDetail] = useState({})
    const [comfotableList, setComfortableList] = useState([])
    const { houseID } = useParams();
    const [updateHotelName, setUpdateHotlName] = useState(true)
    const [newHotelName, setNewHotelName] = useState(houseOfHostDetail.hotelName)
    const [updateDescription, setUpdatDescription] = useState(true)
    const [newDescription, setNewDescription] = useState(houseOfHostDetail?.description?.listingDescription)
    // const [updateComfortable, SetUpdateComfortable] = useState(true)
    const [updateAddress, setUpdateAddress] = useState(true)
    const [categoryList, setCategoryList] = useState([])
    const [updateTypeRoom, setUpdateTypeRoom] = useState(true)
    const [updateQuantityOfGuests, setUpdateQuantityOfGeusts] = useState(true)
    const [newQuantityOfguests, setNewQuantityOfguests] = useState(parseInt(houseOfHostDetail?.quantityOfGuests))
    const [newLocation, setNewLocation] = useState(houseOfHostDetail?.location)
    const [newTypeRoom, setNewTypeRoom] = useState({
        categoryHotel: houseOfHostDetail?.categoryHotel?.id,
        typeRoom: houseOfHostDetail?.typeRoom
    })
    const [listImage, setListImage] = useState([])
    const [selectAvatar, setSelectAvatar] = useState([{
        id: 0,
        file: null,
        fakeUrl: null
    }])
    const [uploadedAvatar, setUploadedAvatar] = useState([])
    const [uploading, setUploading] = useState(false);
    useEffect(() => {
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/host/house/getImageListUrl/${houseID}`);
            let list = res.data.map((item, index) => (
                {
                    id: index,
                    file: null,
                    fakeUrl: item.srcImg
                }
            ))
            list.push({
                id: list?.length,
                file: null,
                fakeUrl: null
            })
            setListImage(list)

        }
        getData();
    }, [])
    useEffect(() => {
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/host/categories`);
            setCategoryList(res.data)
        }
        getData();
    }, [reder, updateHotelName, updateDescription, updateQuantityOfGuests])
    useEffect(() => {
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/host/house/houseOfHostDetail/${houseID}`);
            sethouseOfHostDetail(res.data)
        }
        getData();
    }, [reder, updateHotelName, updateDescription, updateQuantityOfGuests, updateAddress, updateTypeRoom])
   
    
    const handleUpdateHotelName = () => {
        async function getData() {
            const formData = new FormData();

            formData.append("stringRequest", newHotelName);
            let res = await axios.post(`http://localhost:8080/api/host/house/edit/title/${houseID}`, formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            setUpdateHotlName(true)
        }
        getData();
    }
    const handleUpdateDescription = () => {
        async function getData() {
            const formData = new FormData();

            formData.append("stringRequest", newDescription);
            let res = await axios.post(`http://localhost:8080/api/host/house/edit/description/${houseID}`, formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            setUpdatDescription(true)
        }
        getData();
    }
    const handleUpdateQuantityOfGuests = (type) => {

        async function getData() {

            let res = await axios.get(`http://localhost:8080/api/host/house/edit/quantityOfGuests/${houseID}/${type}`, newQuantityOfguests, {
                headers: { 'Content-Type': 'application/json' },
            });
            setUpdateQuantityOfGeusts(true)
        }
        getData();
    }
    const handleSetLocation = (e) => {
        async function getData() {

            let res = await axios.get(`https://mapquestapi.com/geocoding/v1/address?key=XH0jLaU2elxOJPVY7rBcFYs5UbVsly1p&location=${e.target.value}`);
            setNewLocation({
                address: e.target.value,
                latitude: res.data.results[0]?.locations[0]?.displayLatLng.lat,
                longitude: res.data.results[0]?.locations[0]?.displayLatLng.lng,
            })

        }
        getData();

    }
    const handleupdateLocation = () => {

        async function getData2() {

            let res2 = await axios.post(`http://localhost:8080/api/host/house/edit/location/${houseID}`, newLocation, {
                headers: { 'Content-Type': 'application/json' },
            });
            setUpdateAddress(true);
        }
        getData2();
    }
    const handleUpdateTypeRoom = () => {
        async function getData2() {

            let res2 = await axios.post(`http://localhost:8080/api/host/house/edit/typeRoomAndCategory/${houseID}`, newTypeRoom, {
                headers: { 'Content-Type': 'application/json' },
            });
            setUpdateTypeRoom(true);
        }
        getData2();
    }
    const handleSelectAvatar = (e, id) => {

        const temporaryAvatarUrl = 'URL.createObjectURL(e.target.files[0])';
        const temporaryAvatarUrlList = []
        for (let index = 0; index < e.target.files.length; index++) {
            temporaryAvatarUrlList.push({
                file: e.target.files[index],
                fakeUrl: URL.createObjectURL(e.target.files[index])
            }

            )
        }
        console.log(temporaryAvatarUrlList);
        let newSelectedAvatar = []
        let check = false
        listImage.forEach(element => {
            if (id == element.id && id == listImage.length - 1) {
                temporaryAvatarUrlList.forEach((item, i) => {
                    newSelectedAvatar.push({
                        id: id + i,
                        file: item.file,
                        fakeUrl: item.fakeUrl
                    })
                });

                newSelectedAvatar.push({
                    id: id + temporaryAvatarUrlList.length,
                    file: null,
                    fakeUrl: null
                })
            } else if (id == element.id) {
                temporaryAvatarUrlList.forEach((item, i) => {
                    newSelectedAvatar.push({
                        id: id + i,
                        file: item.file,
                        fakeUrl: item.fakeUrl
                    })
                });
            } else if (id != element.id) {
                newSelectedAvatar.push(element)
            }

        });
        console.log(newSelectedAvatar);
        setListImage(newSelectedAvatar)
    }
    const handleUploadAvatar = async () => {

        let list = [...uploadedAvatar]
        await listImage.forEach(async (element) => {

            if (element.id != listImage.length - 1 && element.file != null) {

                let uploadResult = await FileService.uploadAvatar(element.file);
                if (element.id == listImage.length - 2) { setUploading(false) }
                if (uploadResult?.data.url) {
                    list = ([...list, uploadResult?.data.url]

                    );
                    setUploadedAvatar([...list])

                    toast.info("Avatar uploaded success", { position: "top-right", autoClose: 2 * 1000 });


                }


            } else if (element.id != listImage.length - 1) {
                list = ([...list, element.fakeUrl])
                setUploadedAvatar([...list])
                if (element.id == listImage.length - 2) { setUploading(false) }
            }

        });
        console.log(list);

    }
    const handleUPDATEIMAGE = () => {
        async function getData() {

            let res = await axios.post(`http://localhost:8080/api/host/house/edit/image/${houseID}`, uploadedAvatar, {
                headers: { 'Content-Type': 'application/json' },
            });
            setRender(reder?false:true)

        }
        getData();
    }
    return (
        <>
        <NavbarHosting></NavbarHosting>
        <div className='fs-5 text-decoration-underline ' style={{marginLeft:'1100px'}}><Link style={{color:'black'}} to={`/host/homeList`}> <i className="fa-solid fa-chevron-left fa-2xs"></i> Quay lại</Link></div>
            <div style={{ marginLeft: '120px' }} className=' col-10' >
                <div className='fs-3 '>{houseOfHostDetail.hotelName}</div>
                <div className='fs-4'>Ảnh</div>
                <div className='d-flex border-bottom pb-3 pt-3'>
                    <div className='d-flex me-3 ms-3  flex-wrap'>
                        {
                            houseOfHostDetail?.images?.map((item) => (
                                <div >
                                    <img className='me-2 ms-2 mb-2 rounded' src={item.srcImg} style={{ width: "200px", height: "130px" }}></img>
                                </div>
                            ))
                        }</div>
                    <div className='fs-5 text-decoration-underline' data-bs-toggle="modal" data-bs-target="#exampleModal1" style={{width:'150px'}}>
                        Chỉnh sửa

                    </div>


                </div>
                <div className='fs-4'>Thông tin cơ bản về nhà ? Phòng cho thuê</div>

                <div className='d-flex justify-content-between'>
                    {updateHotelName == true ?
                        <>
                            <div className=' border-bottom pb-3 pt-3'>
                                <div className='fs-4'>tiêu đề Phòng /nhà cho thuê</div>
                                <div>{houseOfHostDetail?.hotelName}</div>
                            </div>
                            <div className='fs-5 text-decoration-underline' onClick={() => { setUpdateHotlName(false); setNewHotelName(houseOfHostDetail.hotelName) }}>Chỉnh sửa</div>
                        </>
                        :
                        <>
                            <div className=' border-bottom pb-3 pt-3'>
                                <div className='fs-4'>Tiêu đề nhà/phòng cho thuê</div>
                                <div>Tiêu đề nhà/phòng cho thuê của bạn cần nêu bật được những điểm đặc biệt của chỗ ở</div>
                                <div> <textarea onChange={(e) => { setNewHotelName(e.target.value) }} style={{ width: '1120px' }} value={newHotelName} type="text" className="form-control mb-4 mt-4  " /></div>
                                <div className='d-flex flex-row-reverse'>
                                    <div><button onClick={handleUpdateHotelName} style={{ backgroundColor: 'black', color: 'white', borderRadius: '5px', width: '60px', marginLeft: '30px' }}>Lưu</button></div>
                                    <div><button style={{ borderRadius: '5px' }} onClick={() => { setUpdateHotlName(true) }}>Huỷ</button></div>
                                </div>
                            </div>
                        </>
                    }




                </div>
                <div className=' border-bottom pb-5 d-flex justify-content-between '>
                    {
                        updateDescription ?
                            <>
                                <div className='col-9'>
                                    <div className='fs-4'>Mô tả nhà/phòng cho thuê</div>
                                    <div>{houseOfHostDetail?.description?.listingDescription}</div>
                                </div>
                                <div className='fs-5 text-decoration-underline' onClick={() => { setUpdatDescription(false); setNewDescription(houseOfHostDetail?.description?.listingDescription) }}>Chỉnh sửa</div>
                            </> :
                            <>

                                <div className=' border-bottom pb-3 pt-3'>
                                    <div className='fs-4'>Mô tả nhà/phòng cho thuê</div>
                                    <div>Hãy giúp khách hình dung về cảm giác khi ở chỗ của bạn, bao gồm cả lý do tại sao họ sẽ thích ở đó.</div>
                                    <div> <textarea onChange={(e) => { setNewDescription(e.target.value) }} style={{ width: '1120px' }} value={newDescription} type="text" className="form-control mb-4 mt-4  " /></div>
                                    <div className='d-flex flex-row-reverse'>
                                        <div><button onClick={handleUpdateDescription} style={{ backgroundColor: 'black', color: 'white', borderRadius: '5px', width: '60px', marginLeft: '30px' }}>Lưu</button></div>
                                        <div><button style={{ borderRadius: '5px' }} onClick={() => { setUpdatDescription(true) }}>Huỷ</button></div>
                                    </div>
                                </div>
                            </>
                    }

                </div>
                <div className='border-bottom pb-3 pt-3'>
                    <div className='d-flex'>
                        <div className='fs-4'>
                            Số lượng khách
                        </div>
                        {
                            houseOfHostDetail.quantityOfGuests > 1 ?
                                <div className='d-flex' style={{ marginLeft: '830px' }}>
                                    <button onClick={() => { handleUpdateQuantityOfGuests("t"); setUpdateQuantityOfGeusts(false) }} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'solid 1px' }} className=' me-4 ms-4'>-</button>
                                    <p>{houseOfHostDetail.quantityOfGuests}</p>
                                    <button onClick={() => { handleUpdateQuantityOfGuests("c"); setUpdateQuantityOfGeusts(false) }} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'solid 1px' }} className='  me-4 ms-4'>+</button>
                                </div> :
                                <div className='d-flex' style={{ marginLeft: '830px' }}>
                                    <button disabled onClick={() => { handleUpdateQuantityOfGuests("t"); setUpdateQuantityOfGeusts(false) }} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'solid 1px' }} className=' me-4 ms-4'>-</button>
                                    <p>{houseOfHostDetail.quantityOfGuests}</p>
                                    <button onClick={() => { handleUpdateQuantityOfGuests("c"); setUpdateQuantityOfGeusts(false) }} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'solid 1px' }} className='  me-4 ms-4'>+</button>
                                </div>
                        }

                    </div>
                </div>
                <div className='border-bottom pb-3 pt-3 d-flex justify-content-between '>
                 
                                <div className='fs-4 '> Tiện nghi</div>

                                <div className='fs-5 text-decoration-underline' ><Link style={{color:'black',textDecoration:'underline'}} to={`/host/editComfortable/${houseOfHostDetail.id}`}>Chỉnh sửa</Link> </div>

                </div>
                <div className='border-bottom pb-3 pt-3 d-flex justify-content-between'>
                    {
                        updateAddress ?
                            <>
                                <div>
                                    <div className='fs-4'>Vị trí</div>
                                    <div className='fs-5'> địa chỉ</div>
                                    <div>{houseOfHostDetail?.location?.address}</div>
                                </div>
                                <div className='fs-5 text-decoration-underline' onClick={() => { setUpdateAddress(false); setNewLocation(houseOfHostDetail.location) }}>Chỉnh sửa</div>
                            </> :
                            <>
                                <div>
                                    <div className='fs-4'>Vị trí</div>
                                    <div className='fs-5'> địa chỉ</div>
                                    <div><textarea onInput={(e) => { handleSetLocation(e) }} style={{ width: '1120px' }} className='form-control mb-4 mt-4 ' name="" id="" cols="150" rows="3" placeholder='Nhập địa chỉ mới'></textarea></div>
                                    <div className='d-flex flex-row-reverse'>
                                        <div><button onClick={handleupdateLocation} style={{ backgroundColor: 'black', color: 'white', borderRadius: '5px', width: '60px', marginLeft: '30px' }}>Lưu</button></div>
                                        <div><button style={{ borderRadius: '5px' }} onClick={() => { setUpdateAddress(true) }}>Huỷ</button></div>
                                    </div>
                                </div>

                            </>
                    }

                </div>
                <div className='border-bottom pb-3 pt-3 d-flex justify-content-between '>
                    {
                        updateTypeRoom ?
                            <>
                                <div>
                                    <div className='fs-4'>Chỗ ở và phòng</div>
                                    <div>Loại chỗ ở</div>
                                    <div>{houseOfHostDetail?.typeRoom}</div>
                                    <div>Loại hình cho thuê : {houseOfHostDetail?.categoryHotel?.name} </div>
                                </div>

                                <div className='fs-5 text-decoration-underline' onClick={() => {
                                    setUpdateTypeRoom(false); setNewTypeRoom({
                                        categoryHotel: houseOfHostDetail?.categoryHotel?.id,
                                        typeRoom: houseOfHostDetail?.typeRoom
                                    })
                                }}>Chỉnh sửa </div>
                            </> :
                            <>
                                <div>
                                    <div className='fs-4'>Chỗ ở và phòng</div>
                                    <div>Loại chỗ ở</div>
                                    <div>
                                        <select onChange={(e) => { setNewTypeRoom({ ...newTypeRoom, categoryHotel: e.target.value }) }} style={{ width: '500px', height: '40px', borderRadius: '5px' }} name="" id="">
                                            {
                                                categoryList?.map((item) => (
                                                    houseOfHostDetail.categoryHotel.name == item.name ?
                                                        <option value={item?.id} selected>{item?.name}</option>
                                                        :
                                                        <option value={item?.id}>{item?.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div>Loại hình cho thuê :  </div>
                                    <div>
                                        <select onChange={(e) => { setNewTypeRoom({ ...newTypeRoom, typeRoom: e.target.value }) }} style={{ width: '500px', height: '40px', borderRadius: '5px' }} name="" className='mb-3' id="">
                                            {
                                                typeRoomList.map((item) => (
                                                    houseOfHostDetail.typeRoom == item ?
                                                        <option value={item} selected>{item}</option> :
                                                        <option value={item} >{item}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className='d-flex flex-row-reverse'>
                                        <div><button onClick={handleUpdateTypeRoom} style={{ backgroundColor: 'black', color: 'white', borderRadius: '5px', width: '60px', marginLeft: '30px' }}>Lưu</button></div>
                                        <div><button style={{ borderRadius: '5px' }} onClick={() => setUpdateTypeRoom(true)}>Huỷ</button></div>
                                    </div>
                                </div>
                            </>
                    }
                </div>
                <div className='border-bottom pb-3 pt-3 d-flex justify-content-between '>
                    <div>
                        <div>Phòng và không gian khác</div>
                        <div>Phòng ngủ {houseOfHostDetail.quantityOfRooms}</div>
                        <div>Giường {houseOfHostDetail.quantityOfBeds}</div>
                        <div>Phòng tắm {houseOfHostDetail.quantityOfBathrooms}</div>
                    </div>
                    <div className='fs-5 text-decoration-underline'><Link style={{color:'black',textDecoration:'underline'}} to={`/host/editRoom/${houseOfHostDetail.id}`}>Chỉnh sửa</Link> </div>
                </div>
                <div className='border-bottom pb-3 pt-3 d-flex justify-content-between '>
                    <div className='fs-4'>Chính sách và nội quy</div>    
                    <div className='fs-5'><Link style={{color:'black',textDecoration:'underline'}} to={`/host/editRule/${houseOfHostDetail.id}`}>Chỉnh sửa</Link></div>
                </div>    
            </div>


            {/* Modal */}
            <div
                className="modal fade"
                id="exampleModal1"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Modal title
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body d-flex flex-wrap ">
                            {

                                listImage?.map((item) => (
                                    <>
                                        <div key={item.id} className=''>
                                            <div className="col-md-4 ">
                                                <div className="card" style={{ width: '350px', height: '230px', marginRight: '30px', marginBottom: '30px' }}>
                                                    <img style={{ width: '350px', height: '230px' }} role="button" src={item.fakeUrl || "https://cdn.pixabay.com/photo/2017/11/10/05/24/add-2935429_960_720.png"} className="card-img-top" alt=""
                                                        onClick={() => document.getElementById(`fileUpload${item.id}`).click()}
                                                    />
                                                </div>
                                                <div className="card-footer">
                                                    <input multiple type="file" accept="image/*" className="d-none" id={`fileUpload${item.id}`}
                                                        onChange={(e) => { handleSelectAvatar(e, item.id) }}
                                                    />
                                                    <div className="d-grid gap-2">

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ))
                            }
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleUploadAvatar}
                            >
                                Upload
                            </button>
                            <button onClick={handleUPDATEIMAGE} type="button" className="btn btn-primary">
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default HouseOfHostDetail