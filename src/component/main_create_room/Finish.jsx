import axios from 'axios';
import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import CreateRoom from '../../service/create_room_usestate';
function Finish  ()  {
  const handleLog=()=>{
    console.log(CreateRoom.getCreateRoom());
  }
  const handleCreateHouse=()=>{
    axios.post('http://localhost:8080/api/host/house', CreateRoom.getCreateRoom(),
    {headers: {
      'Authorization': `Bearer ${localStorage.getItem("jwt")}`
  }});
  }
  return (
    <>
    
        <div className='col-8' style={{marginLeft:'250px'}}>
            <p style={{textAlign:'center'}}  className='fs-3 mb-4'>Xin chúc mừng</p>
            <div className='fs-4'>Hoan nghênh bạn đăng mục cho thuê – Lời chia vui từ Chủ nhà đến Chủ nhà. Cảm ơn bạn đã chia sẻ nhà mình và giúp tạo ra những trải nghiệm tuyệt vời cho các vị khách của chúng ta.</div>
        </div>
        <div className='fixed-bottom d-flex justify-content-between'>
    <Link className="btn btn-sm ms-5 ms-5 mb-5 fs-5" to={'/create/b3/discount'}>
                            <i className="fa fa-arrow-left me-2" />
                            quay lại
                        </Link>
                        <div><Link className="" to={'/bookedToday'}> <button onClick={handleCreateHouse} className='btn bg-dark text-white me-5 mb-5' >Hoàn thành</button></Link></div>
    </div>
    </>
  )
}export default Finish
