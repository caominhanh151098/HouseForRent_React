import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import Navbar_create_room from './../LayoutCreateRoom/Navbar_create_room';
import CreateRoom from './../../../Services/CreateRoomUseState';

function B3_discount (){

        const [discount,setDiscount]=useState(CreateRoom?.getCreateRoom()?.discount||[])
        const handleChooseDiscount=(id)=>{
        
                if(discount.includes(id)){
                     let newList= discount.filter((e) => id != e)
                     setDiscount(newList)
                }else{
                 setDiscount([...discount,id])
                }
             }
  return (
    <>
    <Navbar_create_room></Navbar_create_room>
        <div className='col-6 ' style={{marginLeft:'200px'}}>
            <div className='fs-3 mb-4'>Thêm ưu đãi giảm giá</div>
            <div className='fs-6 mb-4' >Giúp chỗ ở của bạn trở nên nổi bật để nhanh chóng được đặt phòng và thu hút những bài đánh giá đầu tiên.</div>
            <div  onClick={()=>handleChooseDiscount(1)} className={`mb-5 ${discount.includes(1)?'dark':''}`} style={{borderRadius:'5px',backgroundColor:'',border:'solid 1px '}}>
                    <div className='d-flex alight-items-center justify-content-around'>
                        <div>20%</div>
                        <div >
                                <div>Khuyến mãi cho nhà/phòng cho thuê mới</div>
                                <div>Giảm giá 20% cho 3 lượt đặt phòng đầu tiên của bạn</div>
                        </div>
                        
                    </div>
            </div>
            <div  onClick={()=>handleChooseDiscount(2)} className={`mb-5 ${discount.includes(2)?'dark':''}`}  style={{borderRadius:'5px',backgroundColor:'var(---pc-g-v-g)',border:'solid 1px '}}>
                    <div className='d-flex alight-items-center justify-content-around'>
                        <div>10%</div>
                        <div >
                                <div>Giảm giá theo tuần</div>
                                <div>Dành cho thời gian ở từ 7 đêm trở lê</div>
                        </div>
                        
                    </div>
            </div>
            <div  onClick={()=>handleChooseDiscount(3)} className={`mb-5 ${discount.includes(3)?'dark':''}`}  style={{borderRadius:'5px',backgroundColor:'',border:'solid 1px '}}>
                    <div className='d-flex alight-items-center justify-content-around'>
                        <div>20%</div>
                        <div >
                                <div>Giảm giá theo tháng</div>
                                <div>Dành cho thời gian ở từ 28 đêm trở lên</div>
                        </div>
                  
                    </div>
            </div>
        </div>
        <div className='fixed-bottom d-flex justify-content-between'>
    <Link className="btn btn-sm ms-5 ms-5 mb-5 fs-5" to={'/host/create/b3/price'}>
                            <i className="fa fa-arrow-left me-2" />
                            quay lại
                        </Link>
                        <div><Link className="" to={'/host/create/b3/finish'}> <button onClick={()=>{CreateRoom.setCreateRoom({...CreateRoom.getCreateRoom(), discount:discount})}} className='btn bg-dark text-white me-5 mb-5' >Tiếp theo</button></Link></div>
    </div>
    </>
  )
}export default B3_discount
