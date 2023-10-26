import React, { useEffect, useState, useRef } from 'react'
import UseFetchHouse from '../../../Hooks/UseFetchHouse'
import ShowLocation from './ShowLocation';
import { Link } from 'react-router-dom';
import LoadingHouseList from './LoadingHouseList';
import HouseSlider from './HouseSlider';
import "../Slider.css"
import "../../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import { IonIcon } from '@ionic/react';
import { heartOutline, heartCircleOutline } from 'ionicons/icons';
import format from 'date-fns/format';

import axios from 'axios';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Textarea from '@mui/joy/Textarea';
import Typography from '@mui/joy/Typography';
import { API_ADD_FAVORITE_HOUSE, API_CREATE_NEW_LIST, API_DELETE_WISH_LISTS_BY_ID, API_GET_FAVORITE_HOUSE_BY_USER, API_GET_WISH_LISTS_BY_USER, API_REMOVE_HOUSE_FAVORITE } from '../../../Services/common';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const HouseList = () => {
    const { houseList, loading } = UseFetchHouse();
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showMap, setShowMap] = useState(false);
    const [showMapStates, setShowMapStates] = useState({});
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);



    const toggleHover = (index) => {
        setHoveredIndex(index);
    };


    console.log(houseList);

    const nextImage = () => {
        setActiveImageIndex((prevIndex) => (prevIndex + 1) % houseList[activeImageIndex].images.length);
    };

    const prevImage = () => {
        setActiveImageIndex((prevIndex) => (prevIndex - 1 + houseList[activeImageIndex].images.length) % houseList[activeImageIndex].images.length);
    };

    const toggleOverlay = () => {
        setIsOverlayVisible(!isOverlayVisible);
    };

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 5);

    const formattedToday = format(today, "'Ngày' dd");
    const formattedFutureDate = format(futureDate, "'Ngày' dd 'tháng' M");




    const [isOverLayOpenFormWishList, setIsOverLayOpenFormWishList] = useState(false)
    const [isOverLayOpenFormCreatNewWishList, setIsOverLayOpenFormCreatNewWishList] = useState(false);

    const toggleOpenFormWishList = () => {
        setIsOverLayOpenFormWishList(!isOverLayOpenFormWishList)
    }
    const toggleOpenFormCreatNewWishList = () => {
        setIsOverLayOpenFormCreatNewWishList(!isOverLayOpenFormCreatNewWishList)
        if (isOverLayOpenFormWishList) {
            setIsOverLayOpenFormWishList(false);
        }
        if (!isOverLayOpenFormWishList) {
            setIsOverLayOpenFormWishList(true);
        }
    }

    const [text, setText] = React.useState('');
    const addEmoji = (emoji) => () => {
        if (text.length < 50) {
            setText(`${text}${emoji}`);
        }
    };

    const handleChange = (event) => {
        if (event.target.value.length <= 50) {
            setText(event.target.value);
        }
    };

    const resetCharacters = () => {
        setText('');
    }

    const [userWishLists, setUserWishLists] = useState([]);

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
                const updatedWishLists = response.data;


                if (JSON.stringify(updatedWishLists) !== JSON.stringify(userWishLists)) {
                    setUserWishLists(updatedWishLists);
                    localStorage.setItem('userWishLists', JSON.stringify(updatedWishLists));
                }
            } catch (error) {
                console.error(error);
            }
        }

        handleSaveChanges();
    }, [userWishLists])

    useEffect(() => {
        console.log("userWishLists", userWishLists);
    }, [userWishLists])

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

            const wishListEmpty = response.data.filter(wishList => wishList.quantityHouse === 0);
            const idsToDelete = wishListEmpty.map(wishList => wishList.id);
            const nameToDelete = wishListEmpty.map(wishList => wishList.name);

            for (const id of idsToDelete) {
                await handleDeleteWishListById(id, nameToDelete);
            }

            const updatedWishLists = response.data.filter(wishList => wishList.quantityHouse !== 0);

            setUserWishLists(updatedWishLists);
            localStorage.setItem('userWishLists', JSON.stringify(updatedWishLists));
        } catch (error) {
            console.error(error);
        }
    }
    const handleSubmitCreateNewList = async () => {
        const token = localStorage.getItem('jwt');
        try {
            const response = await axios.post(API_CREATE_NEW_LIST, text, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                await handleAddFavorite(response.data, idHouseSelected, text);
                if (isOverLayOpenFormCreatNewWishList) {
                    setIsOverLayOpenFormCreatNewWishList(false);
                }
                toast.success('Đã lưu vào ' + text, {
                    className: 'custom-toast-create-new-wish-list-success'
                });
                setText('');
            }
        } catch (err) {
            console.log('Lỗi khi thêm', err);
        }
    }

    // const handleSubmitCreateNewList = async () => {
    //     const token = localStorage.getItem('jwt')
    //     axios.post(API_CREATE_NEW_LIST, text, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`
    //         }
    //     })
    //         .then(response => {
    //             console.log('thêm thành công', response)
    //             handleAddFavorite(response.data, idHouseSelected, text)
    //             if (isOverLayOpenFormCreatNewWishList) {
    //                 setIsOverLayOpenFormCreatNewWishList(false)
    //             }
    //             toast.success('Đã lưu vào ' + text, {
    //                 className: 'custom-toast-create-new-wish-list-success'
    //             });
    //             setText('')
    //         })
    //         .catch(err => {
    //             console.log('Lỗi khi thêm');
    //         })
    // }
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || null

    const [houseLiked, setHouseLiked] = useState([]);

    const getFavoriteHouse = async () => {
        const token = localStorage.getItem('jwt') || null;
        if (token !== null) {
            try {
                const resp = await axios.get(API_GET_FAVORITE_HOUSE_BY_USER, {
                    headers: {
                        'Content-Type': 'Application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                setHouseLiked(resp.data);
            } catch (err) {
                console.log('Lỗi khi lấy danh sách yêu thích:', err);
            }
        } else {
            console.log('Token không tồn tại');
        }
    }

    const [isLikeChecked, setIsLikeChecked] = useState(false)

    useEffect(() => {
        if (userInfo && !isLikeChecked) {
            getFavoriteHouse();
            setIsLikeChecked(true)
        }
    }, [userInfo]);

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
            }
        } catch (err) {
            console.log(err);
        }
    }


    const handleRemoveFavorite = async (id) => {
        const token = localStorage.getItem('jwt') || null;
        if (token !== null) {
            try {
                const response = await axios.delete(API_REMOVE_HOUSE_FAVORITE + id, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                if (response.status === 200) {
                    toast.success('Đã xoá khỏi danh sách', {
                        className: 'custom-toast-create-new-wish-list-success'
                    });
                    await getFavoriteHouse();
                    await handleSaveChanges();
                } else {
                    console.error(`Lỗi khi xóa nhà yêu thích - mã lỗi: ${response.status}`);
                }
            } catch (err) {
                console.log('Lỗi khi xoá');
            }
        }
    }


    const handleAddFavorite = async (idFavoriteList, idHouse, name) => {
        const token = localStorage.getItem('jwt') || null;
        if (token !== null) {
            try {
                const response = await axios.post(API_ADD_FAVORITE_HOUSE + idFavoriteList + '/' + idHouse,
                    null,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    })

                if (response.status === 200) {

                    await handleSaveChanges();
                    await getFavoriteHouse();
                    toast.success('Đã lưu vào danh sách ' + name, {
                        className: 'custom-toast-create-new-wish-list-success'
                    });
                    if (isOverLayOpenFormWishList) {
                        setIsOverLayOpenFormWishList(false)
                    }
                }
            } catch (err) {
                console.log('Lỗi khi thêm');
            }
        }
    }

    const [idHouseSelected, setIdHouseSelected] = useState(null)

    const handleImageClick = async (item) => {
        await handleAddFavorite(item.id, idHouseSelected, item.name);
    }

    const formatCurrency = (item) => {
        const formater = new Intl.NumberFormat('vi-VN', {
            style:'currency',
            currency: 'VND'
        })
        return formater.format(item).replace('₫', 'VNĐ')
    }

    return (
        <div>
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
            <div className="search-results">
                {
                    loading ? <LoadingHouseList /> : (
                        Array.isArray(houseList) && houseList.length > 0 ? (
                            houseList?.map((house, index) => {
                                const isHouseLiked = houseLiked.includes(Number(house.id));
                                return (
                                    <div key={index} className="listing">
                                        <div>
                                            <div>
                                                <div>
                                                    <HouseSlider house={house} />
                                                    {
                                                        isHouseLiked ? (
                                                            <div className='outer-div'
                                                                onMouseEnter={() => toggleHover(index)} onMouseLeave={() => toggleHover(null)}>
                                                                <i onClick={() => { handleRemoveFavorite(house.id) }}
                                                                    class="fa-solid fa-heart" style={{ color: '#f21202' }}></i>
                                                            </div>
                                                        ) : (
                                                            <div className='outer-div'
                                                                onMouseEnter={() => toggleHover(index)} onMouseLeave={() => toggleHover(null)}>
                                                                {hoveredIndex === index ? (
                                                                    <IonIcon onClick={() => {
                                                                        toggleOpenFormWishList();
                                                                        setIdHouseSelected(house.id)
                                                                    }}
                                                                        icon={heartCircleOutline} className="heartCircle-icon" />
                                                                ) : (
                                                                    <IonIcon icon={heartOutline} className='heart-icon' />
                                                                )}
                                                            </div>
                                                        )
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                        <div className='div-show-map-details-on-list'>
                                            {showMapStates[index] && (
                                                <div className='house-on-map'>
                                                    <ShowLocation latitude={house.location.latitude} longitude={house.location.longitude} />
                                                    <button onClick={() => setShowMapStates((prevState) => ({ ...prevState, [index]: false }))}>
                                                        <i className="fa-solid fa-circle-xmark"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="listing-header">
                                                <h3 className="hotel-name">{house?.location?.address}</h3>
                                                <span className="review">
                                                    <i class="fa-solid fa-star"></i>&nbsp;{house.review}</span>
                                            </div>
                                            <span>{formattedToday} - {formattedFutureDate}</span>
                                            {/* <button onClick={() => {
                                            setShowMapStates((prevState) => ({ ...prevState, [index]: true }))
                                        }}>
                                            Xem vị trí
                                        </button> */}
                                            <p style={{ marginTop: '10px' }}><span style={{ fontWeight: 'bold' }}>{formatCurrency(house.price)} </span>/ đêm</p>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <LoadingHouseList />
                        )
                    )
                }
            </div>

            {(
                <div className={`overlay2 ${isOverLayOpenFormWishList ? '' : 'd-none'}`} >
                    <div className={`appearing-div ${isOverLayOpenFormWishList ? 'active' : ''}`}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <i style={{ marginRight: '20%' }}
                                onClick={toggleOpenFormWishList} class="fa-solid fa-chevron-left close-description" ></i>
                            <h2>Thêm vào Danh sách yêu thích</h2>
                        </div>
                        <hr style={{ marginBottom: '4%' }} />
                        <div className='div-contain-wish-lists'>
                            <div className='lists-wish-container'>
                                {
                                    userWishLists && userWishLists.map((item, index) => (
                                        <div key={index} className='wish-details-div' style={{ width: '42%' }}>
                                            <div className='container-card'>
                                                <img onClick={() => {
                                                    handleImageClick(item)
                                                }}
                                                    className='img-wish-details'
                                                    src={item.images[0]} alt="" />
                                            </div>
                                            <h2>{item.name}</h2>
                                            <p>Đã lưu {item.quantityHouse} mục</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <hr style={{ marginBottom: '4%' }} />
                        <button onClick={toggleOpenFormCreatNewWishList}
                            className='btn-create-new-a-wish-list'>Tạo danh sách mong muốn mới</button>
                    </div>
                </div>
            )}

            {(
                <div className={`overlay2 ${isOverLayOpenFormCreatNewWishList ? '' : 'd-none'}`} >
                    <div className={`appearing-div ${isOverLayOpenFormCreatNewWishList ? 'active' : ''}`} style={{ width: '555px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <i style={{ marginRight: '24%' }}
                                onClick={toggleOpenFormCreatNewWishList} class="fa-solid fa-chevron-left close-description" ></i>
                            <h2>Tạo Danh sách yêu thích</h2>
                        </div>
                        <hr />
                        <Textarea
                            placeholder="Tên danh sách yêu thích…"
                            value={text}
                            onChange={handleChange}
                            minRows={2}
                            maxRows={4}
                            startDecorator={
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <IconButton variant="outlined" color="neutral" onClick={addEmoji('👍')}>
                                        👍
                                    </IconButton>
                                    <IconButton variant="outlined" color="neutral" onClick={addEmoji('🏖')}>
                                        🏖
                                    </IconButton>
                                    <IconButton variant="outlined" color="neutral" onClick={addEmoji('😍')}>
                                        😍
                                    </IconButton>
                                </Box>
                            }
                            endDecorator={
                                <Typography level="body-xs" sx={{ ml: 'auto' }}>
                                    {text.length} / 50 ký tự
                                </Typography>
                            }
                            sx={{ minWidth: 300 }}
                        />
                        <hr />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={resetCharacters}
                                className='btn-delete-characters'>Xoá</button>
                            <button onClick={handleSubmitCreateNewList}
                                className='btn-confirm-create-new-a-wish-list'>Tạo</button>
                        </div>

                    </div>
                </div>
            )}


        </div>
    )
}

export default HouseList