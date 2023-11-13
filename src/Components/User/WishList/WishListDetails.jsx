import React, { useEffect, useState, useRef } from 'react'
import HeaderFormUser from '../HeaderFormUser'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { API_DETAILS_WISH_LIST } from '../../../Services/common'
import "../User.css"
import "../../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import HouseSlider from '../../AirBnb/Body/HouseSlider'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Pagination from '../../AirBnb/Body/Pagination';
import L from 'leaflet';
import { divIcon } from 'leaflet';
import markerIcon from "../../../Pictures/marker.png"
import ImgSliderOnMap from '../../AirBnb/Footer/ImgSliderOnMap';
import { Link } from 'react-router-dom'


const WishListDetails = () => {
    const { IdWishList, NameWishList } = useParams();
    const mapRef = useRef();
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
            });
        } else {
            alert('Trình duyệt không hỗ trợ xác định vị trí.');
        }
    }, [])

    const token = localStorage.getItem('jwt')
    const [house, setHouse] = useState()
    const handleGetListHouseByWish = async () => {
        try {
            const response = await axios.get(API_DETAILS_WISH_LIST + IdWishList, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.status === 200) {
                setHouse(response.data.content)
            } else {
                alert('Lỗi khi lấy list house' + IdWishList);
            }
        } catch (err) {
            console.error('Lỗi khi lấy list house' + IdWishList);
            alert('Lỗi khi lấy list house' + IdWishList);
        }
    }
    useEffect(() => {
        handleGetListHouseByWish()
    }, [])

    const [showUserLocation, setShowUserLocation] = useState(false);

    const [roomLocationsByCity, setRoomLocationsByCity] = useState([]);

    useEffect(() => {
        if (house && house) {

            const locations = house && house?.map(item => {
                if (item.location && item.location.latitude && item.location.longitude) {
                    return {

                        lat: item.location.latitude,
                        lng: item.location.longitude,
                        info: {
                            price: item.price,
                            hotelName: item.hotelName,
                            images: item.images.map(image => image.srcImg),
                            id: item.id,
                        }
                    };
                }
                return null;
            });
            setRoomLocationsByCity(locations);
        }
    }, [house]);

    const customIconCurrent = new L.Icon({
        iconUrl: markerIcon,
        iconSize: [32, 32],
    });

    const customIcon = (price) => {
        const roundedPrice = Math.ceil(price);

        return divIcon({
            className: ' test',
            html: `<div class='custom-div-icon-leaflet'> 
        $${roundedPrice}
      </div>`,
        });
    };


    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }
    const housesPerPage = 4;

    const startIdx = (currentPage - 1) * housesPerPage;
    const endIdx = Math.min(currentPage * housesPerPage, house && house.length);

    const displayedHouses = house && house.slice(startIdx, endIdx);
    const displayedLocations = roomLocationsByCity && roomLocationsByCity.slice(startIdx, endIdx);

    const totalPages = Math.ceil(house && house.length / housesPerPage);

    const [isSelected, setIsSelected] = useState(false);

    const handleMarkerClick = () => {
        setIsSelected(!isSelected); // Khi click, chuyển đổi trạng thái isSelected
    }

    return (
        <>
            <HeaderFormUser />
            <div className='div-details-wish-lists'>
                <div className='div-left-details-wish-lists'>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to={'/wish-lists'}>
                            <i class="fa-solid fa-chevron-left icon-details-wish-list"></i>
                        </Link>
                        <i class="fa-solid fa-ellipsis icon-details-wish-list"></i>
                    </div>
                    <h1>{decodeURIComponent(NameWishList)}</h1>
                    <div className='div-search'>
                        <div style={{ width: '100%' }}
                            className="search-results">
                            {displayedHouses && displayedHouses.map((house, index) => (
                                <div style={{ width: '28%' }}
                                    key={index} className="listing">
                                    <div>
                                        <div>
                                            <div>
                                                <HouseSlider house={house} />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ marginTop: '13px' }} className="listing-header">
                                            <h3 className="hotel-name hover-location">{house?.location?.address}</h3>
                                            <span className="review">
                                                <i class="fa-solid fa-star"></i>&nbsp;{house?.review}</span>
                                        </div>
                                        {/* <span>{formattedToday} - {formattedFutureDate}</span>
                                        <p style={{ marginTop: '10px' }}><span style={{ fontWeight: 'bold' }}>${house.price} </span>/ đêm</p> */}
                                    </div>
                                </div>
                            ))}
                        </div>


                        <div className='container-pagination' style={{ top: '100%' }}>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}

                                // itemsPerPage={housesPerPage}
                                onPageChange={handlePageChange}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                            />

                        </div>
                    </div>
                </div>
                <div className='div-right-details-wish-lists'>
                    <div style={{ width: '100%' }}>
                        <div id="map-container" style={{ height: '500px' }}>
                            {userLocation !== null && <MapContainer
                                center={userLocation}
                                zoom={12}
                                style={{ height: '163%', width: '100%' }}
                                ref={mapRef}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution={`
                                    &copy; <a href="https://www.openstreetmap.org/copyright">Điều khoản sử dụng</a>
                                    `}
                                />
                                {displayedLocations.map((location, index) => (
                                    <Marker
                                        key={index}
                                        position={location}
                                        icon={customIcon(location.info.price)}
                                    >
                                        <Popup>
                                            <div style={{
                                                width: '115.3%', right: "21px",
                                                position: "relative",
                                                top: "-14px",
                                                borderRadius: "5px 5px 5px 5px"
                                            }}>
                                                <div>
                                                    <ImgSliderOnMap house={location.info} />
                                                </div>
                                                <div style={{ margin: '0px 20px' }}>
                                                    <h2>{location.info.hotelName}</h2>
                                                    <p style={{ fontSize: '17px' }}> <span style={{ fontWeight: 'bold' }}>${location.info.price}</span>  / đêm</p>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                                {
                                    showUserLocation && (
                                        <Marker
                                            position={userLocation}
                                            icon={customIconCurrent}
                                        >
                                        </Marker>
                                    )
                                }
                            </MapContainer>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WishListDetails