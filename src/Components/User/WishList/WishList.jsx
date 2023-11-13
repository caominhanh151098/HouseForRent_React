import React, { useEffect, useState } from 'react'
import HeaderFormUser from '../HeaderFormUser'
import "../User.css"
import { API_GET_WISH_LISTS_BY_USER, API_DELETE_WISH_LISTS_BY_ID, API_DETAILS_WISH_LIST } from '../../../Services/common'
import axios from 'axios'
import "../../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'

const WishList = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [userWishLists, setUserWishLists] = useState([]);
    const [loadingWishList, setLoadingWishList] = useState(false);

    const token = localStorage.getItem('jwt')
    useEffect(() => {
        const handleSaveChanges = async () => {
            try {
                const token = localStorage.getItem('jwt');
                const response = await axios.get(API_GET_WISH_LISTS_BY_USER,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                setUserWishLists(response.data)
                localStorage.setItem('userWishLists', JSON.stringify(response.data))
            } catch (error) {
                console.error(error);
            }
        }
        handleSaveChanges();
    }, [userWishLists])

    useEffect(() => {
        setLoadingWishList(true);
        setTimeout(() => {
            setLoadingWishList(false)
        }, [500])
    }, [])

    const handleDeleteWishListById = async (id, name) => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await axios.delete(API_DELETE_WISH_LISTS_BY_ID + id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.status === 200) {
                toast.success('Xoá thành công danh sách' + ' "' + name + '" ', {
                    className: 'custom-toast-success'
                });
                toggleDeleteForm();
            }
        } catch (err) {
            console.error(err);
        }
    }

    const [selectedWishList, setSelectedWishList] = useState(null);

    const [isOverLayDeleteForm, setIsOverLayDeleteForm] = useState(false)

    const toggleDeleteForm = () => {
        setIsOverLayDeleteForm(!isOverLayDeleteForm)
    }



    return (
        <>
            <ToastContainer
                position="bottom-right"
                autoClose={5000} // Thời gian tự động đóng toast (5 giây)
                // hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <HeaderFormUser />
            <div className='div-wish-lists-form-user'>
                <h1>Yêu thích</h1>
                <div className='lists-wish-container'>
                    {
                        loadingWishList ? (
                            <div style={{ textAlign: 'center' }}>
                                <div class="loadingio-spinner-ellipsis-vy8amekyxyo"><div class="ldio-sesojbulmx">
                                    <div></div><div></div><div></div><div></div><div></div>
                                </div></div>
                            </div>
                        ) :
                            userWishLists && userWishLists.map((item, index) => (
                                <div key={index} className='wish-details-div'>
                                    <div className='container-card'>
                                        <Link to={`/wish-lists/${item.id}/${encodeURIComponent(item.name)}`}>
                                            <img
                                                className='img-wish-details'
                                                src={item.images[0]} alt="" />
                                        </Link>
                                        <span onClick={() => {
                                            setSelectedWishList(item);
                                            toggleDeleteForm()
                                        }}
                                            className="icon-container">
                                            <i class="fa-solid fa-circle-xmark"></i>
                                        </span>
                                    </div>
                                    <h2>{item.name}</h2>
                                    <p onClick={toggleDeleteForm}>Đã lưu {item.quantityHouse} mục</p>
                                </div>
                            ))
                    }

                    {(
                        <div className={`overlay2 ${isOverLayDeleteForm ? '' : 'd-none'}`} >
                            <div className={`appearing-div ${isOverLayDeleteForm ? 'active' : ''}`} style={{ width: '450px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <i style={{ marginRight: '20%' }}
                                        onClick={toggleDeleteForm} class="fa-solid fa-xmark close-description" ></i>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <h2>Xoá danh sách yêu thích này</h2>
                                    <p>Danh sách "{selectedWishList && selectedWishList.name}" sẽ bị xoá vĩnh viễn</p>
                                </div>
                                <hr />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <button className='btn-cancel-wish-lists'>Huỷ</button>
                                    <button onClick={() => {
                                        handleDeleteWishListById(selectedWishList && selectedWishList.id, selectedWishList && selectedWishList.name)
                                    }}
                                        className='btn-delete-wish-lists'>Xoá</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default WishList