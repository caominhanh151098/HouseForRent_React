import React, { useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";

import { useState } from 'react';
import Navbar_create_room from './../LayoutCreateRoom/Navbar_create_room';
import { comfortableShowList } from './../../../Services/listComfortable';
import CreateRoom from './../../../Services/CreateRoom';

function B2_comfortable() {
    const [comfortable, setComfortable] = useState(CreateRoom?.getCreateRoom()?.comfortableDetailList || [])
    const checkInclues = (id) => {
        let check = false
        comfortable.forEach(element => {
            if (element == id) {
                check = true
            }
        });
        return check
    }
    const handleChooseComfortable = (id) => {
        let check = false
        comfortable.forEach(element => {
            if (element == id) {
                check = true
            }
        });
        if (check == true) {
            let newList = comfortable.filter((e) => id != e)
            setComfortable(newList)

        } else {
            setComfortable([...comfortable, id])

        }
    }

    return (
        <>
            <Navbar_create_room></Navbar_create_room>
            <div style={{ marginLeft: '300px' }}>
                <div className='fs-2 mb-3'>Cho khách biết chỗ ở của bạn có những gì</div>
                <div className='mb-3 fs-4'>Bạn có thể thêm tiện nghi sau khi đăng mục cho thuê.</div>
                <div className=' d-flex col-7 flex-wrap'>
                    {
                        comfortableShowList?.basic?.map((item) => (
                            <div onClick={() => { handleChooseComfortable(item.id) }} key={item.id} className={`card mb-3  me-3 ms-3 ${checkInclues(item.id) ? 'dark' : ''}`} style={{ width: '10rem' }}>
                                <div className="card-body row">
                                    <i className={item.icon}></i>
                                    <h6 className=" mb-2 text-muted">{item.name}</h6>
                                </div>
                            </div>
                        ))
                    }

                </div>
                <div className='mb-3 fs-4'>Bạn có tiện nghi nào nổi bật</div>
                <div className=' d-flex col-7 flex-wrap'>
                    {
                        comfortableShowList?.outstanding?.map((item) => (
                            <div onClick={() => { handleChooseComfortable(item.id) }} key={item.id} className={`card mb-3  me-3 ms-3 ${checkInclues(item.id) ? 'dark' : ''}`} style={{ width: '10rem' }}>
                                <div className="card-body row">
                                    <i className={item.icon}></i>
                                    <h6 className=" mb-2 text-muted">{item.name}</h6>
                                </div>
                            </div>
                        ))
                    }

                </div>
                <div className='mb-3 fs-4'>Bạn có tiện nghi nào trong số những tiện nghi đảm bảo an toàn sau đây không?</div>
                <div className=' d-flex col-7 flex-wrap'>
                    {
                        comfortableShowList.safe.map((item) => (
                            <div onClick={() => { handleChooseComfortable(item.id) }} key={item.id} className={`card mb-3  me-3 ms-3 ${checkInclues(item.id) ? 'dark' : ''}`} style={{ width: '10rem' }}>
                                <div className="card-body row">
                                    <i className={item.icon}></i>
                                    <h6 className=" mb-2 text-muted">{item.name}</h6>
                                </div>
                            </div>
                        ))
                    }
                </div>

            </div>
            <div className='fixed-bottom d-flex justify-content-between'>
                <Link className="btn btn-sm ms-5 ms-5 mb-5 fs-5" to={'/host/create/second'}>
                    <i className="fa fa-arrow-left me-2" />
                    quay lại
                </Link>
                <div><Link className="" to={'/host/create/b2/uploadImage'}> <button onClick={() => { CreateRoom.setCreateRoom({ ...CreateRoom.getCreateRoom(), comfortableDetailList: comfortable }) }} className='btn bg-dark text-white me-5 mb-5' >Tiếp theo</button></Link></div>
            </div>

        </>
    )
} export default B2_comfortable
