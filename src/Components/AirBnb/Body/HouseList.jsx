import React, { useEffect, useState } from 'react'
import UseFetchHouse from '../../../Hooks/UseFetchHouse'
import ShowLocation from './ShowLocation';
import { Link } from 'react-router-dom';
import LoadingHouseList from './LoadingHouseList';

const HouseList = () => {
    const {houseList, loading} = UseFetchHouse();
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showMap, setShowMap] = useState(false);
    const [showMapStates, setShowMapStates] = useState({});

    const nextImage = () => {
        setActiveImageIndex((prevIndex) => (prevIndex + 1) % houseList[activeImageIndex].images.length);
    };

    const prevImage = () => {
        setActiveImageIndex((prevIndex) => (prevIndex - 1 + houseList[activeImageIndex].images.length) % houseList[activeImageIndex].images.length);
    };
    return (
        <div>
            <div className="search-results">
                {
                    loading ? <LoadingHouseList/> : (
                        Array.isArray(houseList) ? (
                            houseList?.map((house, index) => (
                                <div key={index} className="listing">
                                    <div>
                                        <Link to={`/house/${house.id}`}>
                                            <img src={house.images[activeImageIndex].srcImg} alt="Accommodation" />
                                        </Link>
    
                                        <i class="fa-brands fa-gratipay"></i>
                                    </div>
                                    {showMapStates[index] && (
                                        <div className='house-on-map'>
                                            <ShowLocation latitude={house.location.latitude} longitude={house.location.longitude} />
                                            <button onClick={() => setShowMapStates((prevState) => ({ ...prevState, [index]: false }))}>
                                                <i className="fa-solid fa-circle-xmark"></i>
                                            </button>
                                        </div>
                                    )}
                                    <div>
                                        <button onClick={prevImage}>Previous</button>
                                        <button onClick={nextImage}>Next</button>
                                        <div className="listing-header">
                                            <h3 className="hotel-name">{house.hotelName}</h3>
                                            <span className="review">{house.review}</span>
                                        </div>
                                        <span>{house.title}</span>
                                        <button onClick={() => setShowMapStates((prevState) => ({ ...prevState, [index]: true }))}>
                                            Xem vị trí
                                        </button>
                                        <p>Tổng <span>${house.price}</span></p>
                                    </div>
                                </div>
                            ))
                        ) : (
                           <LoadingHouseList/>
                        )
                    )
                }
            </div>

        </div>
    )
}

export default HouseList