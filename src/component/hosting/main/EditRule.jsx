import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import axios from 'axios';
function EditRule() {
    const list24h = ["Không có", "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]

    const [listRuleBoolean, setListRuleBoolean] = useState([])
    const { houseID } = useParams();
    const [ruleHouse, setRuleHouse] = useState([])
    const [house, setHouse] = useState({})
    const [render, setRender] = useState(false)
    const [renderBoolen, setRenderBooleen] = useState(false)
    const [openUpdatetimeQuiet, setOpenUpdateTimeQuiet] = useState(false)
    const [quietTime, setQuietTime] = useState({ startTime: "00:00", endTime: "00:00" })
    const [timeCheckIn,setTimeCheckin]=useState({startTimeCheckIn:"00:00",endTimeCheckIn:'00:00'})
    const [openTimeCHeckIn,setOpenTimeCheckIn]=useState(false)
    const [openTimeCheckOut, setOpenTimeCheckOut] = useState(false)
    const [timeCheckOut, setTimeCheckOut] = useState({ startTimeCheckOut: "00:00", endTimeCheckOut: "00:00" })
    const [openOther,setOpenOther]=useState(false)
    const [other,setOther]=useState("")
    
    useEffect(() => {
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/house/houseOfHostDetail/${houseID}`);
            setHouse(res.data)
        }
        getData();
    }, [render])
    useEffect(() => {
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/rule/getRuleBoolen`);
            setListRuleBoolean(res.data)
        }
        getData();
    }, [])
    useEffect(() => {
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/rule/getRule/${houseID}`);
            setRuleHouse(res.data)

        }
        getData();

    }, [render ,renderBoolen,openUpdatetimeQuiet,openTimeCHeckIn,openTimeCheckOut,openOther])
    const handleUpdateBookNow = () => {
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/house/setBookNow/${houseID}`);
            setRender(render?false:true)

        }
        getData();
    }
    const checkInclue = (item) => {
        let check = false
        ruleHouse.forEach(element => {
            if (item == element.rule.id) {
                check = element
            }
        });
        return check
    }
    const handleUpdateRuleBoolen = (ruleID, status) => {
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/house/updateRuleBoolen/${houseID}/${ruleID}/${status}`);
            setRenderBooleen(renderBoolen ? false : true)

        }
        getData();

    }
    const formatHour = (time) => {
        let parts = time.split(':');
        var hour = parts[0];
        let minute = parts[1];

        // Kết hợp giờ và phút để tạo chuỗi định dạng mới
        let formattedTime = hour + ':' + minute;
        return formattedTime
    }
    const handleUpdateQuietTime=(ruleID,startTime,endTime)=>{
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/rule/updateQuietTime/${houseID}/${startTime}/${endTime}/${ruleID}`);
            setOpenUpdateTimeQuiet(false)
            setOpenTimeCheckIn(false)
            setOpenTimeCheckOut(false)
        }
        getData();
    }
    const handleUpdateOther=()=>{
        
        async function getData() {

            let res2 = await axios.post(`http://localhost:8080/api/rule/updateOther/${houseID}`, other, {
                headers: { 'Content-Type': 'application/json' },
            });
            setOpenOther(false)
        }
        getData();
    }
    return (
        <>
            <div style={{ marginLeft: '120px' }} className='col-10'>
                <h3 style={{ paddingBottom: '30px' }} className='mb-5 border-bottom'>Chính sách và nội quy của nhà/ Phòng</h3>
                <div className='fs-4 mb-3'>Chính sách :</div>
                <div className='d-flex justify-content-between border-bottom mb-5' style={{ paddingBottom: '40px' }}>
                    <div className='col-6'>
                        <div className='fs-5 mb-3'>Đặt ngay :</div>
                        <div>Khi bật tính năng này, yêu cầu đặt phòng sẽ được chấp nhận tự động. Trong trường hợp tắt, bạn cần chấp nhận hoặc từ chối yêu cầu đặt phòng/đặt chỗ theo cách thủ công.</div>
                    </div>
                    <div className='mt-5 me-5'>

                        <i onClick={handleUpdateBookNow} className={`fa-solid ${house.bookNow == "true" ? "fa-toggle-on" : "fa-toggle-off"} fa-2xl`}></i>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className='fs-4'>Nội quy nhà :</div>
                    <div>Khách có trách nhiệm tuân thủ quy tắc bạn đặt ra và có thể bị xóa khỏi Airbnb nếu gây ra sự cố.</div>
                </div>
                {
                    listRuleBoolean?.map((item) => (
                        <div className='d-flex justify-content-between border-bottom mb-3' style={{ paddingBottom: '20px' }}>
                            <div>
                                <div className='fs-5' style={{ paddingTop: '15px' }}>{item.name}</div>
                            </div>
                            <div className='mt-2'>
                                {
                                    checkInclue(item.id) == false ?
                                        <>
                                            <button onClick={() => { handleUpdateRuleBoolen(item.id, false) }} className='me-2 ms-2' style={{ width: '35px', height: '35px', borderRadius: '50%', border: 'solid 1px' }}><i class="fa-solid fa-x "></i></button>
                                            <button onClick={() => { handleUpdateRuleBoolen(1, true) }} className='me-2 ms-2' style={{ width: '35px', height: '35px', borderRadius: '50%', border: 'solid 1px' }}><i class="fa-solid fa-check "></i></button>
                                        </> : (checkInclue(item.id)).status == "true" ?
                                            <>
                                                <button onClick={() => { handleUpdateRuleBoolen(item.id, false) }} className='me-2 ms-2' style={{ width: '35px', height: '35px', borderRadius: '50%', border: 'solid 1px' }}><i class="fa-solid fa-x "></i></button>
                                                <button className='me-2 ms-2 dark2' disabled style={{ width: '35px', height: '35px', borderRadius: '50%', border: 'solid 1px' }}><i class="fa-solid fa-check "></i></button>
                                            </> :
                                            <>
                                                <button className='me-2 ms-2 dark2' disabled style={{ width: '35px', height: '35px', borderRadius: '50%', border: 'solid 1px' }}><i class="fa-solid fa-x "></i></button>
                                                <button onClick={() => { handleUpdateRuleBoolen(item.id, true) }} className='me-2 ms-2' style={{ width: '35px', height: '35px', borderRadius: '50%', border: 'solid 1px' }}><i class="fa-solid fa-check "></i></button>
                                            </>
                                }

                            </div>
                        </div>
                    ))
                }

                {
                    openUpdatetimeQuiet == false ?
                        <>
                            <div className='d-flex justify-content-between border-bottom mb-3' style={{ paddingBottom: '40px' }}>
                                <div>
                                    <div className='fs-5'>Khung giờ cần giữ yên lặng</div>
                                    <div>{checkInclue(5) ? `${formatHour((checkInclue(5)).startTime)} - ${formatHour((checkInclue(5)).endTime)}` : " Chưa thiết lập"} </div>
                                </div>
                                <div className='mt-4'>
                                    <div onClick={() => { setOpenUpdateTimeQuiet(true); setQuietTime({ startTime: formatHour(checkInclue(5).startTime|| "00:00:00") , endTime: formatHour(checkInclue(5).endTime|| "00:00:00")  }) }} className='fs-5 text-decoration-underline'>Chỉnh sửa</div>
                                </div>
                            </div>
                        </> :
                        <>
                            <div className='border' style={{padding:'20px 20px 20px 20px',borderRadius:'10px'}}>
                                <div>
                                    <div className='fs-4 mb-3'>Khung giờ cần giữ yên lặng</div>
                                    <div>
                                        <div className='mb-2'>Khung giờ bắt đầu :</div>
                                        <select onChange={(e) => setQuietTime({ ...quietTime, startTime: e.target.value })} className='mb-2' style={{ width: '500px', height: '40px', borderRadius: '5px' }} name="" id="">
                                            {
                                                list24h.map((item) => (
                                                    <>
                                                        {
                                                            item == quietTime.startTime ?
                                                                <option value={item} selected>{item}</option> :
                                                                <option value={item}>{item}</option>
                                                        }
                                                    </>
                                                ))
                                            }
                                        </select>
                                        {
                                            console.log(quietTime)
                                        }
                                        <div className='mb-2'>Khung giờ kết thúc :</div>
                                        {
                                            quietTime.startTime != "Không có" ?
                                                <>
                                                    <select onChange={(e) => setQuietTime({ ...quietTime, endTime: e.target.value })} className='mb-2' style={{ width: '500px', height: '40px', borderRadius: '5px' }} name="" id="quietEnd">
                                                        {
                                                            list24h.map((item) => (
                                                                <>
                                                                    {   item=="Không có"?"":
                                                                        item == quietTime.endTime ?
                                                                            <option value={item} selected>{item}</option> :
                                                                            <option value={item}>{item}</option>
                                                                    }
                                                                </>
                                                            ))
                                                        }
                                                    </select>
                                                </> :
                                                <select className='mb-2 ' disabled style={{ width: '500px', height: '40px', borderRadius: '5px' }} name="" id="quietEnd"></select>

                                        }
                                    </div>
                                </div>

                                <div className='d-flex flex-row-reverse'>
                                    <div><button onClick={()=>handleUpdateQuietTime(5,quietTime.startTime,quietTime.endTime)} style={{ backgroundColor: 'black', color: 'white', borderRadius: '5px', width: '60px', marginLeft: '30px' }}>Lưu</button></div>
                                    <div><button onClick={()=>setOpenUpdateTimeQuiet(false)} style={{ borderRadius: '5px' }} >Huỷ</button></div>
                                </div>
                            </div>
                        </>

                }
                {
                      openTimeCHeckIn == false ?
                      <>
                          <div className='d-flex justify-content-between border-bottom mb-3' style={{ paddingBottom: '40px' }}>
                              <div>
                                  <div className='fs-5'>Khung thời gian nhận phòng</div>
                                  <div>{checkInclue(6) ? `${formatHour((checkInclue(6)).startTime)} - ${formatHour((checkInclue(6)).endTime)}` : " Chưa thiết lập"} </div>
                              </div>
                              <div className='mt-4'>
                                  <div onClick={() => { setOpenTimeCheckIn(true); setTimeCheckin({ startTimeCheckIn: formatHour(checkInclue(6).startTime|| "00:00:00") , endTimeCheckIn: formatHour(checkInclue(6).endTime|| "00:00:00")  }) }} className='fs-5 text-decoration-underline'>Chỉnh sửa</div>
                              </div>
                          </div>
                      </> :
                      <>
                          <div className='border' style={{padding:'20px 20px 20px 20px',borderRadius:'10px'}}>
                              <div>
                                  <div className='fs-4 mb-3'>Khung thời gian nhận phòng</div>
                                  <div>
                                      <div className='mb-2'>Khung giờ bắt đầu :</div>
                                      <select onChange={(e) => setTimeCheckin({ ...timeCheckIn, startTimeCheckIn: e.target.value })} className='mb-2' style={{ width: '500px', height: '40px', borderRadius: '5px' }} name="" id="">
                                          {
                                              list24h.map((item) => (
                                                  <>
                                                      {
                                                          item == timeCheckIn.startTimeCheckIn ?
                                                              <option value={item} selected>{item}</option> :
                                                              <option value={item}>{item}</option>
                                                      }
                                                  </>
                                              ))
                                          }
                                      </select>
                                     
                                      <div className='mb-2'>Khung giờ kết thúc :</div>
                                      {
                                          timeCheckIn.startTimeCheckIn != "Không có" ?
                                              <>
                                                  <select onChange={(e) => setTimeCheckin({ ...timeCheckIn, endTimeCheckIn: e.target.value })} className='mb-2' style={{ width: '500px', height: '40px', borderRadius: '5px' }} name="" id="">
                                                      {
                                                          list24h.map((item,index) => (
                                                              <>
                                                                  {   item=="Không có"?"":
                                                                      item != timeCheckIn.endTimeCheckIn &&list24h.indexOf(timeCheckIn.startTimeCheckIn)+1<index?
                                                                         <option value={item}>{item}</option>:
                                                                         item == timeCheckIn.endTimeCheckIn &&list24h.indexOf(timeCheckIn.startTimeCheckIn)+1<index?
                                                                          <option value={item} selected>{item}</option> :""
                                                                  }
                                                              </>
                                                          ))
                                                      }
                                                  </select>
                                              </> :
                                              <select className='mb-2 ' disabled style={{ width: '500px', height: '40px', borderRadius: '5px' }} name="" id="s"></select>

                                      }
                                  </div>
                              </div>

                              <div className='d-flex flex-row-reverse'>
                                  <div><button onClick={()=>handleUpdateQuietTime(6,timeCheckIn.startTimeCheckIn,timeCheckIn.endTimeCheckIn)} style={{ backgroundColor: 'black', color: 'white', borderRadius: '5px', width: '60px', marginLeft: '30px' }}>Lưu</button></div>
                                  <div><button onClick={()=>setOpenTimeCheckIn(false)} style={{ borderRadius: '5px' }} >Huỷ</button></div>
                              </div>
                          </div>
                      </>

                }

{
                      openTimeCheckOut == false ?
                      <>
                          <div className='d-flex justify-content-between border-bottom mb-3' style={{ paddingBottom: '40px' }}>
                              <div>
                                  <div className='fs-5'>Khung thời gian trả phòng</div>
                                  <div>{checkInclue(7) ? `${formatHour((checkInclue(7)).startTime)} - ${formatHour((checkInclue(7)).endTime)}` : " Chưa thiết lập"} </div>
                              </div>
                              <div className='mt-4'>
                                  <div onClick={() => { setOpenTimeCheckOut(true); setTimeCheckOut({ startTimeCheckOut: formatHour(checkInclue(7).startTime|| "00:00:00") , endTimeCheckOut: formatHour(checkInclue(7).endTime|| "00:00:00")  }) }} className='fs-5 text-decoration-underline'>Chỉnh sửa</div>
                              </div>
                          </div>
                      </> :
                      <>
                          <div className='border' style={{padding:'20px 20px 20px 20px',borderRadius:'10px'}}>
                              <div>
                                  <div className='fs-4 mb-3'>Khung thời gian trả phòng</div>
                                  <div>
                                      <div className='mb-2'>Khung giờ bắt đầu :</div>
                                      <select onChange={(e) => setTimeCheckOut({ ...timeCheckOut, startTimeCheckOut: e.target.value })} className='mb-2' style={{ width: '500px', height: '40px', borderRadius: '5px' }} name="" id="">
                                          {
                                              list24h.map((item) => (
                                                  <>
                                                      {
                                                          item == timeCheckOut.startTimeCheckOut ?
                                                              <option value={item} selected>{item}</option> :
                                                              <option value={item}>{item}</option>
                                                      }
                                                  </>
                                              ))
                                          }
                                      </select>
                                     
                                      <div className='mb-2'>Khung giờ kết thúc :</div>
                                      {
                                          timeCheckOut.startTimeCheckOut != "Không có" ?
                                              <>
                                                  <select onChange={(e) => setTimeCheckOut({ ...timeCheckOut, endTimeCheckOut: e.target.value })} className='mb-2' style={{ width: '500px', height: '40px', borderRadius: '5px' }} name="" id="">
                                                      {
                                                          list24h.map((item,index) => (
                                                              <>
                                                                  {   item=="Không có"?"":
                                                                      item != timeCheckOut.endTimeCheckOut &&list24h.indexOf(timeCheckOut.startTimeCheckOut)<index?
                                                                         <option value={item}>{item}</option>:
                                                                         item == timeCheckOut.endTimeCheckOut &&list24h.indexOf(timeCheckOut.startTimeCheckOut)<index?
                                                                          <option value={item} selected>{item}</option> :""
                                                                  }
                                                              </>
                                                          ))
                                                      }
                                                  </select>
                                              </> :
                                              <select className='mb-2 ' disabled style={{ width: '500px', height: '40px', borderRadius: '5px' }} name="" id="s"></select>

                                      }
                                  </div>
                              </div>

                              <div className='d-flex flex-row-reverse'>
                                  <div><button onClick={()=>handleUpdateQuietTime(7,timeCheckOut.startTimeCheckOut,timeCheckOut.endTimeCheckOut)} style={{ backgroundColor: 'black', color: 'white', borderRadius: '5px', width: '60px', marginLeft: '30px' }}>Lưu</button></div>
                                  <div><button onClick={()=>setOpenTimeCheckOut(false)} style={{ borderRadius: '5px' }} >Huỷ</button></div>
                              </div>
                          </div>
                      </>

                }
                
                <div className='d-flex justify-content-between border-bottom mb-3' style={{ paddingBottom: '40px' }}>
                    <div>
                        <div className='fs-5'>Các nội quy khác</div>
                        <div>chưa thiết lập </div>
                    </div>
                    <div className='mt-4'>
                        <div className='fs-5 text-decoration-underline'>Chỉnh sửa</div>
                    </div>
                </div>




                <div className='d-flex justify-content-between'>
                    {openOther ==  false ?
                        <>
                            <div className=' border-bottom pb-3 pt-3'>
                                <div className='fs-4'>Các nội quy khác</div>
                                <div>{checkInclue(9)?checkInclue(9).other:"chưa thiết lập"}</div>
                            </div>
                            <div className='fs-5' onClick={() => { setOpenOther(true);checkInclue(9)? setOther(checkInclue(9).other):setOther("") }}>Chỉnh sửa</div>
                        </>
                        :
                        <>
                            <div className=' border-bottom pb-3 pt-3'>
                                <div className='fs-4'>Các nội quy khác</div>
                              
                                <div> <textarea onChange={(e) => { setOther(e.target.value) }} style={{ width: '1120px' }} value={other} type="text" className="form-control mb-4 mt-4  " /></div>
                                <div className='d-flex flex-row-reverse'>
                                    <div><button onClick={handleUpdateOther} style={{ backgroundColor: 'black', color: 'white', borderRadius: '5px', width: '60px', marginLeft: '30px' }}>Lưu</button></div>
                                    <div><button style={{ borderRadius: '5px' }} onClick={() => { setOpenOther(false) }}>Huỷ</button></div>
                                </div>
                            </div>
                        </>
                    }




                </div>
            </div>
        </>
    )
} export default EditRule
