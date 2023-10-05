import React from 'react'
import '../main/CssHosting/reviews.css';
import { useEffect, useState } from 'react';
import MyAxios from '../../../services/MyAxios';
import { arrayIncludes } from '@mui/x-date-pickers/internals/utils/utils';
import NavbarHosting from '../../layout_hosting/NavbarHosting';
function Reviews() {
    const [listHouse, setListHouse] = useState([])
    const [house, setHouse] = useState(-1)
    const [listReview, setListReview] = useState([])
    const [size, setSize] = useState(5)
    const [total, setTotal] = useState()
    const [choose, setChoose] = useState([])
    useEffect(() => {
        async function getData() {


            let res = await MyAxios(`http://localhost:8080/api/host/house/getHouseRevenueHost`).get();
            setListHouse(res.data)
            
        }
        getData();
    }, [])
    useEffect(() => {
       
        if(house==-1){
            async function getData() {
                let res = await MyAxios(`http://localhost:8080/api/host/user/client/detail/review/31/1?page=0&size=${size}`).get();
                setListReview(res.data.content)
    
                
                setTotal(res.data.totalElements)
            }
            getData();  
        }else{
     
            async function getData() {
                let res = await MyAxios(`http://localhost:8080/api/host/house/detail/reviews/${house}?page=0&size=${size}`).get();
                setListReview(res.data.content)
                console.log(res.data.content);
               
                setTotal(res.data.totalElements)
            }
            getData(); 
        }
       
    }, [size,house])
    const getImg =(houseID)=>{
        
        listHouse.forEach(element => {
            if(element.id ==houseID){
               return element.images.srcImg
            }
        });
       
    }

    
    return (
        <>
        <NavbarHosting></NavbarHosting>
            <div className=' container-reviews'>
                <div className='fs-1 mb-3'>Đánh giá :</div>
                <div className='mb-3 col-6  '>
                    <select defaultValue={'-1'} onChange={(e) =>{setHouse(e.target.value);setSize(5);setChoose([])} } class="form-select" aria-label="Default select example">
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
                {
                    listReview.length == 0 ?
                        <>
                            <div className='container-not-review'>
                                <div className='fs-3 mb-2'>Đánh giá đầu tiên của bạn sẽ hiển thị ở đây</div>
                                <div className='fs-5'>Chúng tôi sẽ thông báo cho bạn khi khách gửi phản hồi.</div>
                            </div>
                        </> :
                        <>
                            <div>
                                <div className='fs-4 pb-2 border-bottom mb-3'>{total} đánh giá</div>
                                <div>
                                    {
                                        house==-1?
                                        listReview.map((item) => (
                                            <>
                                                {console.log(house)}
                                                <div className='border-bottom col-8'>
                                                    <div className='d-flex justify-content-between pb-3 '>
                                                        <div className='fs-4 pt-3'>{item?.house?.hotelName}</div>
                                                        <div className='pt-2'><img className='img-house' src={item?.house?.image} alt="" /></div>
                                                    </div>
                                                    <div className='d-flex  pb-3'>
                                                        <div className='me-3'><img className='img-avatar' src={item?.review?.user?.avatar || "https://docsach24.co/no-avatar.png"} alt="" /></div>
                                                        <div className='mt-2'>
                                                            <div className='fs-4'>{item?.review?.user?.lastName}</div>
                                                            <div style={{ color: 'grey' }}>{item?.review?.reviewDate}</div>
                                                        </div>
                                                    </div>
                                                    <div className='mb-5'>{item?.review?.content}</div>
                                                    <div style={{paddingBottom:'50px'}}>
                                                        <div style={{marginLeft:'600px',marginBottom:'100px'}} className='text-decoration-underline  mb-3' onClick={() =>{!choose.includes(item?.review?.id) ?setChoose([...choose, item?.review?.id]): setChoose(choose.filter(function (number) {
                                                                    return number !=item?.review?.id;
                                                                }))}}>{!choose.includes(item?.review?.id) ? "Xem số sao đánh giá" : "Thu gọn"}</div>
                                                        <div className={!choose.includes(item?.review?.id) ? "d-none" : "container-review"}>
                                                        {
                                          (
                                                <div class="rating-container">
                                                    <div class="rating-label" >
                                                        <span>Mức độ sạch sẽ: </span>
                                                    </div>
                                                    <span className='review-point'>{item?.review?.reviewPoint?.cleanlinessPoint}</span>
                                                    <div class="rating-bar" style={{ display: 'flex' }}>
                                                        <div class="filled-bar" style={{ width: `${(item?.review?.reviewPoint?.cleanlinessPoint / 5) * 100}%` }}></div>
                                                        <div class="empty-bar"></div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            (
                                                <div class="rating-container">
                                                    <div class="rating-label" >
                                                        <span>Độ chính xác :</span>
                                                    </div>
                                                    <span className='review-point'>{item?.review?.reviewPoint?.accuracyPoint}</span>
                                                    <div class="rating-bar" style={{ display: 'flex' }}>
                                                        <div class="filled-bar" style={{ width: `${(item?.review?.reviewPoint?.accuracyPoint / 5) * 100}%` }}></div>
                                                        <div class="empty-bar"></div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            (
                                                <div class="rating-container">
                                                    <div
                                                        class="rating-label" >Giao tiếp: </div>
                                                    <span
                                                        className='review-point'>{item?.review?.reviewPoint?.communicationPoint}</span>
                                                    <div class="rating-bar" style={{ display: 'flex' }}>
                                                        <div class="filled-bar" style={{ width: `${(item?.review?.reviewPoint?.communicationPoint / 5) * 100}%` }}></div>
                                                        <div class="empty-bar"></div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            (
                                                <div class="rating-container">
                                                    <div class="rating-label" >Vị trí: </div>
                                                    <span
                                                        className='review-point'>{item?.review?.reviewPoint?.locationPoint}</span>
                                                    <div class="rating-bar" style={{ display: 'flex' }}>
                                                        <div class="filled-bar" style={{ width: `${(item?.review?.reviewPoint?.locationPoint / 5) * 100}%` }}></div>
                                                        <div class="empty-bar"></div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            (
                                                <div class="rating-container">
                                                    <div class="rating-label">Nhận phòng: </div>
                                                    <span
                                                        className='review-point'>{item?.review?.reviewPoint?.checkInPoint}</span>
                                                    <div class="rating-bar" style={{ display: 'flex' }}>
                                                        <div class="filled-bar" style={{ width: `${(item?.review?.reviewPoint?.checkInPoint / 5) * 100}%` }}></div>
                                                        <div class="empty-bar"></div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            (
                                                <div class="rating-container">
                                                    <div class="rating-label" >Giá trị: </div>
                                                    <span
                                                        className='review-point'>{item?.review?.reviewPoint?.valuePoint}</span>
                                                    <div class="rating-bar" style={{ display: 'flex' }}>
                                                        <div class="filled-bar" style={{ width: `${(item?.review?.reviewPoint?.valuePoint / 5) * 100}%` }}></div>
                                                        <div class="empty-bar"></div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                                          
                                                        </div>
                                                    </div>

                                                </div>
                                            </>
                                        ))
                                        :<>
                                            {
                                                
                                                listReview.map((item)=>(
                                                    <>
                                                <div className='border-bottom col-8'>
                                                    
                                                    <div className='d-flex  pb-3'>
                                                        <div className='me-3'><img className='img-avatar' src={item?.user?.avatar || "https://docsach24.co/no-avatar.png"} alt="" /></div>
                                                        <div className='mt-2'>
                                                            <div className='fs-4'>{item?.user?.lastName}</div>
                                                            <div style={{ color: 'grey' }}>{item?.reviewDate}</div>
                                                        </div>
                                                    </div>
                                                    <div className='mb-5'>{item?.content}</div>
                                                    <div style={{paddingBottom:'50px'}}>
                                                        <div style={{marginLeft:'600px',marginBottom:'100px'}} className='text-decoration-underline  mb-3' onClick={() =>{!choose.includes(item?.id) ?setChoose([...choose, item?.id]): setChoose(choose.filter(function (number) {
                                                                    return number !=item?.id;
                                                                }))}}>{!choose.includes(item?.id) ? "Xem số sao đánh giá" : "Thu gọn"}</div>
                                                        <div className={!choose.includes(item?.id) ? "d-none" : "container-review"}>
                                                        {
                                          (
                                                <div class="rating-container">
                                                    <div class="rating-label" >
                                                        <span>Mức độ sạch sẽ: </span>
                                                    </div>
                                                    <span className='review-point'>{item?.reviewPoint?.cleanlinessPoint}</span>
                                                    <div class="rating-bar" style={{ display: 'flex' }}>
                                                        <div class="filled-bar" style={{ width: `${(item?.reviewPoint?.cleanlinessPoint / 5) * 100}%` }}></div>
                                                        <div class="empty-bar"></div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            (
                                                <div class="rating-container">
                                                    <div class="rating-label" >
                                                        <span>Độ chính xác :</span>
                                                    </div>
                                                    <span className='review-point'>{item?.reviewPoint?.accuracyPoint}</span>
                                                    <div class="rating-bar" style={{ display: 'flex' }}>
                                                        <div class="filled-bar" style={{ width: `${(item?.reviewPoint?.accuracyPoint / 5) * 100}%` }}></div>
                                                        <div class="empty-bar"></div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            (
                                                <div class="rating-container">
                                                    <div
                                                        class="rating-label" >Giao tiếp: </div>
                                                    <span
                                                        className='review-point'>{item?.reviewPoint?.communicationPoint}</span>
                                                    <div class="rating-bar" style={{ display: 'flex' }}>
                                                        <div class="filled-bar" style={{ width: `${(item?.reviewPoint?.communicationPoint / 5) * 100}%` }}></div>
                                                        <div class="empty-bar"></div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            (
                                                <div class="rating-container">
                                                    <div class="rating-label" >Vị trí: </div>
                                                    <span
                                                        className='review-point'>{item?.reviewPoint?.locationPoint}</span>
                                                    <div class="rating-bar" style={{ display: 'flex' }}>
                                                        <div class="filled-bar" style={{ width: `${(item?.reviewPoint?.locationPoint / 5) * 100}%` }}></div>
                                                        <div class="empty-bar"></div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            (
                                                <div class="rating-container">
                                                    <div class="rating-label">Nhận phòng: </div>
                                                    <span
                                                        className='review-point'>{item?.reviewPoint?.checkInPoint}</span>
                                                    <div class="rating-bar" style={{ display: 'flex' }}>
                                                        <div class="filled-bar" style={{ width: `${(item?.reviewPoint?.checkInPoint / 5) * 100}%` }}></div>
                                                        <div class="empty-bar"></div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            (
                                                <div class="rating-container">
                                                    <div class="rating-label" >Giá trị: </div>
                                                    <span
                                                        className='review-point'>{item?.reviewPoint?.valuePoint}</span>
                                                    <div class="rating-bar" style={{ display: 'flex' }}>
                                                        <div class="filled-bar" style={{ width: `${(item?.reviewPoint?.valuePoint / 5) * 100}%` }}></div>
                                                        <div class="empty-bar"></div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                                          
                                                        </div>
                                                    </div>

                                                </div>
                                            </>
                                                ))
                                            }
                                        
                                        </>
                                    }
                                </div>
                                <div className='mt-3 mb-3'><button onClick={() => setSize(size + 5)} className='btn-showmore fs-5  '>Hiển thị thêm đánh giá </button> </div>
                            </div>
                        </>
                }
            </div>
        </>
    )
} export default Reviews;
