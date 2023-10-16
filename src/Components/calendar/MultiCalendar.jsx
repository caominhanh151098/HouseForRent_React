import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import multiMonthPlugin from '@fullcalendar/multimonth';
import { eachDayOfInterval } from 'date-fns';
import NavbarHosting from './../../component/layout_hosting/NavbarHosting';
import axios from 'axios';
import dayjs from 'dayjs';
import { set } from 'lodash';
import "./Calendar.css"
const today = new Date();
const oneYearLater = new Date(today);
oneYearLater.setFullYear(today.getFullYear() + 1);

const datesList = [];
let currentDate = new Date(today);

while (currentDate <= oneYearLater) {
    datesList.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
}

export default function MultiCalendar() {
    const [clean, setClean] = useState(0)
    const [shortClean, setshortClean] = useState(0)
    const [pet, setPet] = useState(0)
    const [other, setOther] = useState(1);
    const [otherPrice, setOtherPrice] = useState(0)
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [price, setPrice] = useState(0)
    const [newPrice,setNewPrice]=useState(0)
    const [weekendPrice, setWeekendPrice] = useState(0)
    const [newWeekendPrice,SetNewWeekendPrice]=useState(0)
    const [priceEvent, setPriceEvent] = useState([])
    const [listDom, setListDom] = useState([])
    const [listHouse, setListHouse] = useState([])
    const [houseID, setHouse] = useState(0)
    const [blockStatus, setBlockStatus] = useState(true)
    const [listBlockingDate, setListBlockingDate] = useState([])
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [render, setRender] = useState(false)
    const [typeShow, setTypeShow] = useState('show')
    const [serviceFee, setServiceFee] = useState(0)
    const [dateFocus, setDateFocus] = useState(new Date(2023, 11))
    const [priceOnDate, setPriceOnDate] = useState([])
    const getDatesInRange = (startDate, endDate) => {
        return eachDayOfInterval({ start: startDate, end: endDate });
    };
    const valueOf = (type, listFeeHouse) => {
        let check = false
        listFeeHouse.forEach(element => {
            if (element.fee.feeType == type) {
                check = element
            }
        });
        return check
    }
    function getDateRange() {
        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
        const endDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());

        const dateList = [];
        let currentDateIterator = new Date(startDate);

        while (currentDateIterator <= endDate) {
            dateList.push(new Date(currentDateIterator));
            currentDateIterator.setDate(currentDateIterator.getDate() + 1);
        }
  
        return dateList;
    }
    useEffect(() => {
        
        let x =weekendPrice!=0?
        
        
        
        getDateRange().map((item) =>
        item.getDay()!==0 && item.getDay()!==6?
        (
            {
                title: `$${price}`,
                color: 'transparent',   // an option!
                textColor: 'black',
                start: dayjs(item).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                allDay: true,
            }
        ):
        (
            {
                title: `$${weekendPrice}`,
                color: 'transparent',   // an option!
                textColor: 'black',
                start: dayjs(item).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                allDay: true,
            }
        )
        ):
        getDateRange().map((item) =>
        (
            {
                title: `$${price}`,
                color: 'transparent',   // an option!
                textColor: 'black',
                start: dayjs(item).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                allDay: true,
            }
        )
        )
        setPriceOnDate(x)
    }, [price,weekendPrice])
    useEffect(() => {
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/host/surcharge/getServiceFee`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                    }
                });
            setServiceFee(res.data.percent)

        }
        getData();
    }, [houseID])
    useEffect(() => {
        async function getData() {


            let res = await axios.get(`http://localhost:8080/api/host/feeHouse/getFeeHouse/${houseID}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                    }
                });
            if (valueOf("CLEANING", res.data)) {
                setClean(valueOf("CLEANING", res.data).price)
            }
            if (valueOf("SHORT_STAY_CLEANING", res.data)) {
                setshortClean(valueOf("SHORT_STAY_CLEANING", res.data).price)
            }
            if (valueOf("PET", res.data)) {
                setPet(valueOf("PET", res.data).price)
            }
            if (valueOf("EXTRA_GUESS", res.data)) {
                setOther(valueOf("EXTRA_GUESS", res.data).other)
                setOtherPrice(valueOf("EXTRA_GUESS", res.data).price)
            }
        }
        getData();
    }, [houseID])
    useEffect(() => {
        async function getData() {


            let res = await axios.get(`http://localhost:8080/api/multiCalendars/client/getBlockingDate/${houseID}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                    }
                });
            let x = res?.data?.map((item) => ({
                title: 'Đã chặn',
                color: '#818181',   // an option!
                textColor: 'black',
                display: 'background',
                start: dayjs(item.blockingDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                allDay: true,

            }))
            console.log(x);
            setCalendarEvents(x)

        }
        getData();
    }, [houseID, render])


    useEffect(() => {
        async function getData() {


            let res = await axios.get(`http://localhost:8080/api/host/house/getPrice/${houseID}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                    }
                });
            setPrice(res.data.price)
            setNewPrice(res.data.price)
            setWeekendPrice(res.data.weekendPrice)
            SetNewWeekendPrice(res.data.weekendPrice)        
        }
        getData();
    }, [houseID,typeShow])

    useEffect(() => {
        async function getData() {


            let res = await axios.get(`http://localhost:8080/api/host/house/getHouseRevenueHost`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                    }
                });
            setListHouse(res.data)
            setHouse(res?.data[0]?.id)

        }
        getData();
    }, [])
    useEffect(() => {
        async function getData() {


            let res = await axios.get(`http://localhost:8080/api/host/house/getHouseRevenueHost`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                    }
                });
            setListHouse(res.data)
            setHouse(res?.data[0]?.id)

        }
        getData();
    }, [])

    const handleDateClick = (arg) => {

        const clickedDate = arg.date;

        var today = new Date(); // Lấy ngày hiện tại
        var yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (clickedDate >= yesterday) {
            const isDateSelected = selectedDates.find(date => date.getTime() === clickedDate.getTime());
            if (!isDateSelected) {
                setSelectedDates([...selectedDates, clickedDate])
                setListDom([...listDom, arg.dayEl])
                arg.dayEl.style.backgroundColor = "#454444"
            } else {
                setSelectedDates(selectedDates.filter((item) => item != isDateSelected))
                arg.dayEl.style.backgroundColor = "white"
                setListDom(listDom.filter((item) => item != arg.dayEl))

            }
        }
        arg.view.calendar.gotoDate(new Date(clickedDate.getFullYear(), clickedDate.getMonth()))
    };

    // console.log(selectedDates);

    // const handleSelect = (arg) => {
    //     const { start, end } = arg;
    //     const selectedRange = getDatesInRange(start, end);
    //     // const filteredDates = selectedRange.filter((date) => !selectedDates.includes(date));
    //     // setSelectedDates([...selectedDates, ...filteredDates]);
    // };
    const handleUnSelect = () => {
        listDom.forEach(element => {
            element.style.backgroundColor = 'white'
        });
        setListDom([])
        setSelectedDates([])
    }


    const handleBlock = () => {
        let newList = []
        selectedDates.forEach(element => {
            newList.push(formatDate(element))
        });
        let data = {
            idHouse: houseID,
            listBlocking: newList
        }
        console.log(data);
        if (blockStatus) {
            async function getData() {
                let res = await axios.post(`http://localhost:8080/api/multiCalendars/client/addBlockingDate`, data,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    });
                handleUnSelect()
                setRender(render ? false : true)
            }
            getData();
        } else {
            async function getData() {
                let res = await axios.post(`http://localhost:8080/api/multiCalendars/client/removeBlockingDate`, data,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    });
                handleUnSelect()
                setBlockStatus(true)
                setRender(render ? false : true)
            }
            getData();
        }
    }
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Lưu ý thêm 1 vào tháng vì tháng bắt đầu từ 0
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const handleUpdatePrice = () => {
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/host/house/editPrice/${houseID}/${newPrice}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                    }
                });
            setTypeShow("show")
        }
        getData();
    }
    const handleUpdateWeekendPrice = () => {
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/host/house/editWeekendPrice/${houseID}/${newWeekendPrice}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                    }
                });
            setTypeShow("show")
        }
        getData();
    }
    const handleUpdateSurcharge = (type, typePrice) => {
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/host/feeHouse/editSurcharge/${houseID}/${type}/${typePrice}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                    }
                });
            setTypeShow("surcharge")
        }
        getData();
    }
    const handleUpdateOther = () => {
        async function getData() {
            let res = await axios.get(`http://localhost:8080/api/host/feeHouse/editOther/${houseID}/${other}/${otherPrice}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                    }
                });
            setTypeShow("surcharge")
        }
        getData();
    }
    return (
        <>    <NavbarHosting />
            <div className='d-flex'>
                <div className='fs-5 me-5'>Chọn Phòng / Nhà :</div>
                <div className='mb-3 col-5 mb-3'>
                    <select defaultValue={'-1'} onChange={(e) => setHouse(e.target.value)} class="form-select" aria-label="Default select example">

                        {
                            listHouse?.map((item => (
                                <>
                                    <option value={item.id} key={item.id}>{item.hotelName}</option>
                                </>
                            )))
                        }
                    </select>
                </div>
            </div>


            <div className='d-flex'>
                <div className='col-8'>
                    <FullCalendar
                        plugins={[multiMonthPlugin, interactionPlugin]}
                        initialView="multiMonthYear"

                        multiMonthMaxColumns={1}
                        headerToolbar={{
                            left: '',
                            center: 'title',
                            right: 'prev,next'
                        }}
                        height={"700px"}
                        locale={{ code: "vi" }}
                        titleFormat={{ year: 'numeric', month: 'long' }}
                        handleWindowResize={false}
                        expandRows={false}
                        selectMirror={false}
                        dayMaxEvents={false}
                        navLinks={false}
                        dateClick={handleDateClick}
                        events={[...calendarEvents, ...priceOnDate]}
                        initialDate={dateFocus}
                    />
                </div>
                <div className='col-4 me-5 ms-5 pt-200'>
                    {
                        selectedDates.length == 0 ?

                            typeShow == "show" ?
                                <>
                                    <div className='pt-5'>
                                        <div className='fs-4 mt-3 mb-3'>Định giá </div>
                                        <div className='d-flex justify-content-between col-8 mb-4'>
                                            <div className='fs-5'>Giá cơ sở</div>
                                            <div className='fs-5'>USD</div>
                                        </div>
                                        <div>
                                            <div onClick={() => setTypeShow("updatePrice")} className='border rounded-3 col-8 container-btn-price pt-3 mb-3 ' >
                                                <div className='fs-5 ms-5 '>Mỗi đêm</div>
                                                <div className='d-flex ms-5 '>
                                                    <i class="fa-solid fa-dollar-sign fa-xl fs-3 mt-4 me-1"></i>
                                                    <div className='fs-3 fw-bold mt-1'>{price}</div>
                                                </div>

                                            </div>
                                            {
                                                weekendPrice == 0 ?
                                                    <>
                                                        <div onClick={() => setTypeShow("updateWeekendPrice")} className='d-flex border rounded-3 col-8 container-btn-price pt-3 mb-3'>
                                                            <div className='ms-3 pt-3'>Giá tuỳ chỉnh cho cuối tuần</div>
                                                            <div className=' pt-3 text-decoration-underline ms-3'>Thêm</div>
                                                        </div>
                                                    </>
                                                    : <div onClick={() => setTypeShow("updateWeekendPrice")} className='border rounded-3 col-8 container-btn-price pt-3 mb-3' >
                                                        <div className=' ms-5 fs-5'>Giá tùy chỉnh cho cuối tuần</div>
                                                        <div className='d-flex ms-5 '>
                                                            <i class="fa-solid fa-dollar-sign fa-xl fs-3 mt-4 me-1"></i>
                                                            <div className='fs-3 fw-bold mt-1'>{weekendPrice}</div>
                                                        </div>
                                                    </div>
                                            }

                                            <div onClick={() => setTypeShow("surcharge")} className='border rounded-3 col-8 container-btn-price pt-3 mb-3' >
                                                <div className=' ms-5 fs-5'>Phụ phí:</div>
                                                <div className='d-flex ms-5 '>

                                                    <div className='mt-1 fs-6'>vệ sinh, thú cưng, khách bổ sung</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                typeShow == "updatePrice" ?
                                    <>
                                        <div className='pt-200'>
                                            <div className='fs-4 text-center mb-5 mt-3 me-5'>Mỗi đêm</div>
                                            <div className='d-flex mb-5' style={{ marginLeft: '35%' }}>
                                                <i class="fa-solid fa-dollar-sign fa-xl fs-2 mt-5 "></i>
                                                <input onChange={(e) => setNewPrice(e.target.value)} type="number" className='col-8 fw-bold fs-1 mt-3' value={newPrice} />
                                            </div>
                                            <div className='ms-5 fs-5'>Giá cho khách (trước thuế) ${((newPrice * (serviceFee / 100)) +parseInt(newPrice)).toFixed(2) }</div>
                                            <div className='mt-5 mb-4'>
                                                <button onClick={handleUpdatePrice} className='fs-5 btn-luu'>
                                                    Lưu
                                                </button>
                                            </div>
                                            <div>
                                                <button onClick={() => setTypeShow("show")} className='fs-5 btn-huy'>
                                                    Huỷ
                                                </button>
                                            </div>

                                        </div>
                                    </>
                                    :
                                    typeShow == "updateWeekendPrice" ?
                                        <>
                                            <div className='pt-200'>
                                                <div className='fs-4 text-center mb-5 mt-3 me-5'>Giá tùy chỉnh cho cuối tuần</div>
                                                <div className='d-flex mb-5' style={{ marginLeft: '35%',paddingBottom:'70px' }}>
                                                    <i class="fa-solid fa-dollar-sign fa-xl fs-2 mt-5 "></i>
                                                    <input onChange={(e) => SetNewWeekendPrice(e.target.value)} type="number" className='col-8 fs-1 mt-3 fw-bold ' value={newWeekendPrice} />
                                                </div>
                                                <div className='mt-5 mb-4'>
                                                    <button onClick={handleUpdateWeekendPrice} className='fs-5 btn-luu'>
                                                        Lưu
                                                    </button>
                                                </div>
                                                <div>
                                                    <button onClick={() => setTypeShow("show")} className='fs-5 btn-huy'>
                                                        Huỷ
                                                    </button>
                                                </div>

                                            </div>
                                        </>
                                        :
                                        typeShow == "surcharge" ?
                                            <>
                                                <div>
                                                    <div className='mb-3 fs-4' onClick={() => setTypeShow("show")}><i class="fa-solid fa-chevron-left fa-sm fs-3"></i></div>
                                                    <div className='fs-4 mb-3'>Phí vệ sinh :</div>
                                                    <div onClick={() => setTypeShow("CLEANING")} className='border rounded-3 col-8 container-btn-price pt-3 mb-2' >
                                                        <div className='fs-5 ms-5'>Mức phí cho mỗi kì ở</div>
                                                        <div className='d-flex ms-5 '>
                                                            <i class="fa-solid fa-dollar-sign fa-xl fs-3 mt-4 me-1"></i>
                                                            <div className='fs-3 mt-1 fw-bold'>{clean}</div>
                                                        </div>
                                                    </div>
                                                    <div onClick={() => setTypeShow("SHORT_STAY_CLEANING")} className='border rounded-3 col-8 container-btn-price pt-3 mb-3' >
                                                        <div className='fs-5 ms-5'>Mức phí cho mỗi kì ở ngắn</div>
                                                        <div className='d-flex ms-5 '>
                                                            <i class="fa-solid fa-dollar-sign fa-xl fs-3 mt-4 me-1"></i>
                                                            <div className='fs-3 mt-1 fw-bold'>{shortClean}</div>
                                                        </div>
                                                    </div>
                                                    <div className='fs-4 mb-3'>Phí thú cưng :</div>
                                                    <div onClick={() => setTypeShow("PET")} className='border rounded-3 col-8 container-btn-price pt-3 mb-3' >
                                                        <div className='fs-5 ms-5'>Mức phí cho mỗi kì ở</div>
                                                        <div className='d-flex ms-5 '>
                                                            <i class="fa-solid fa-dollar-sign fa-xl fs-3 mt-4 me-1"></i>
                                                            <div className='fs-3 mt-1 fw-bold'>{pet}</div>
                                                        </div>
                                                    </div>
                                                    <div className='fs-4 mb-3 '>Phí khách bố sung :</div>
                                                    <div onClick={() => setTypeShow("EXTRA_GUESS")} className='border rounded-3 col-8 container-btn-price pt-3 mb-4' >
                                                        <div className='fs-5 ms-5'>sau {other} khách , mỗi đêm</div>
                                                        <div className='d-flex ms-5 '>
                                                            <i class="fa-solid fa-dollar-sign fa-xl fs-3 mt-4 me-1"></i>
                                                            <div className='fs-3 mt-1 fw-bold'>{otherPrice}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>

                                            :
                                            typeShow == "CLEANING" ?
                                                <>
                                                    <div className='pt-200'>
                                                        <div className='fs-4 text-center mb-5 mt-3 me-5'>Phí vệ sinh</div>
                                                        <div className='d-flex mb-5 pb-80' style={{ marginLeft: '35%' }}>
                                                            <i class="fa-solid fa-dollar-sign fa-xl fs-2 mt-5 "></i>
                                                            <input onChange={(e) => setClean(e.target.value)} type="number" className='col-8 fs-1 mt-3 fw-bold' value={clean} />
                                                        </div>
                                                        <div className='mt-5 mb-4'>
                                                            <button onClick={() => handleUpdateSurcharge("CLEANING", clean)} className='fs-5 btn-luu'>
                                                                Lưu
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <button onClick={() => setTypeShow("surcharge")} className='fs-5 btn-huy'>
                                                                Huỷ
                                                            </button>
                                                        </div>

                                                    </div>

                                                </>
                                                :
                                                typeShow == "SHORT_STAY_CLEANING" ?
                                                    <>
                                                        <div className='pt-200'>
                                                            <div className='fs-4 text-center mb-2 mt-3 me-5'>Phí vệ sinh cho kỳ ở ngắn</div>
                                                            <div className='fs-6 mb-5 text-center pe-5'>Mức phí cho 1 hoặc 2 đêm</div>
                                                            <div className='d-flex mb-5 pb-80' style={{ marginLeft: '35%' }}>
                                                                <i class="fa-solid fa-dollar-sign fa-xl fs-2 mt-5 "></i>
                                                                <input onChange={(e) => setshortClean(e.target.value)} type="number" className='col-8 fs-1 mt-3 fw-bold' value={shortClean} />
                                                            </div>
                                                            <div className='mt-5 mb-4'>
                                                                <button onClick={() => handleUpdateSurcharge("SHORT_STAY_CLEANING", shortClean)} className='btn-luu fs-5'>
                                                                    Lưu
                                                                </button>
                                                            </div>
                                                            <div>
                                                                <button onClick={() => setTypeShow("surcharge")} className='fs-5 btn-huy'>
                                                                    Huỷ
                                                                </button>
                                                            </div>

                                                        </div>

                                                    </>
                                                    :
                                                    typeShow == "PET" ?
                                                        <>
                                                            <div className='pt-200'>
                                                                <div className='fs-4 text-center mb-2 mt-3 me-5'>Phí thú cưng</div>
                                                                <div className='fs-6 mb-5 text-center pe-5'>Mức phí cho mỗi kì ở</div>
                                                                <div className='d-flex mb-5 pb-80' style={{ marginLeft: '35%' }}>
                                                                    <i class="fa-solid fa-dollar-sign fa-xl fs-2 mt-5 "></i>
                                                                    <input onChange={(e) => setPet(e.target.value)} type="number" className='col-8 fs-1 mt-3 fw-bold' value={pet} />
                                                                </div>
                                                                <div className='mt-5 mb-4'>
                                                                    <button onClick={() => handleUpdateSurcharge("PET", pet)} className='fs-5 btn-luu'>
                                                                        Lưu
                                                                    </button>
                                                                </div>
                                                                <div>
                                                                    <button onClick={() => setTypeShow("surcharge")} className='fs-5 btn-huy'>
                                                                        Huỷ
                                                                    </button>
                                                                </div>

                                                            </div>

                                                        </>
                                                        :
                                                        typeShow == "EXTRA_GUESS" ?
                                                            <>
                                                                <div className='pt-5'>
                                                                    <div className='fs-4 text-center mb-2 mt-3 me-5'>Phí khách bổ sung</div>
                                                                    <div className='mb-3 pe-5 fs-6 text-center'>Mức phí cho mỗi đêm</div>
                                                                  
                                                                    <div className='d-flex pb-80' style={{ marginLeft: '35%' }}>
                                                                        <i class="fa-solid fa-dollar-sign fa-xl fs-2 mt-5 "></i>
                                                                        <input onChange={(e) => setOtherPrice(e.target.value)} type="number" className='col-8 fs-1 mt-3 fw-bold' value={otherPrice} />
                                                                    </div>
                                                                    <div className='d-flex'>
                                                                        <div className='fs-5 me-3'>Cho mỗi khách sau</div>
                                                                        <div className='d-flex mb-3'>
                                                                            <button onClick={() => setOther(other > 1 ? other - 1 : other)} style={{width:"30px",height:'30px',borderRadius:'50%',border:'solid 1px gray'}}>-</button>
                                                                            <div className='me-3 ms-3  fs-5 '>{other}</div>
                                                                            <button onClick={() => setOther(other + 1)}style={{width:"30px",height:'30px',borderRadius:'50%',border:'solid 1px gray'}}>+</button>
                                                                        </div>
                                                                    </div>
                                                                    <div className='mt-5 mb-4'>
                                                                        <button onClick={() => handleUpdateOther} className='fs-5 btn-luu'>
                                                                            Lưu
                                                                        </button>
                                                                    </div>
                                                                    <div>
                                                                        <button onClick={() => setTypeShow("surcharge")} className='fs-5 btn-huy btn-luu'>
                                                                            Huỷ
                                                                        </button>
                                                                    </div>

                                                                </div>

                                                            </>
                                                            : ""


                            :
                            <>
                                <div className='mt-5'>
                                    <div className='fs-4 mb-3 mt-3' >Đã chọn {selectedDates.length} đêm</div>
                                    <div className='fs-5 mb-5'>Chỉnh sửa tình trạng còn phòng</div>
                                    <div>
                                        <div>
                                            <div className="form-check">
                                                <div className='fs-5 col-9  border rounded-top' style={{ height: '60px', textAlign: 'center', paddingTop: '13px' }}>
                                                    <input onClick={() => setBlockStatus(false)} className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                        Mở nhận khách các đêm
                                                    </label>
                                                </div>

                                            </div>
                                            <div className="form-check">
                                                <div className='fs-5 col-9  border rounded-bottom' style={{ height: '60px', textAlign: 'center', paddingTop: '13px' }}>
                                                    <input onClick={() => setBlockStatus(true)} className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" defaultChecked />
                                                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                        Chặn các đêm
                                                    </label>
                                                </div>

                                            </div>
                                        </div>
                                        {/* <div className='fs-5 col-9  border rounded-top' style={{height:'60px',textAlign:'center',paddingTop:'13px'}}>Mở nhận khách các đêm</div>
                            <div className='fs-5 col-9 border  rounded-bottom mb-5' style={{height:'60px',textAlign:'center',paddingTop:'13px'}}>Chặn các đêm</div> */}
                                    </div>
                                    <div className='mt-5'>
                                        <div><button onClick={handleBlock} className='col-9 fs-5 mb-4 mt-3' style={{ borderRadius: '5px', height: '40px', color: 'white', backgroundColor: 'black' }}>Lưu</button></div>
                                        <div><button onClick={handleUnSelect} className='col-9 fs-5' style={{ borderRadius: '5px', height: '40px' }}>Huỷ</button></div>
                                    </div>

                                </div>
                            </>
                    }
                </div>
            </div>
        </>

    );
}

