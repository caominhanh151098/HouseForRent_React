import React, { useEffect, useState } from 'react'
import UseFetchHouse from '../../../Hooks/UseFetchHouse'
import ShowLocation from './ShowLocation';
import { Link } from 'react-router-dom';
import LoadingHouseList from './LoadingHouseList';
import HouseSlider from './HouseSlider';
import "../Slider.css"

const HouseList = () => {
    const { houseList, loading } = UseFetchHouse();
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showMap, setShowMap] = useState(false);
    const [showMapStates, setShowMapStates] = useState({});
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);

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
    return (
        <div>
            <div className="search-results">
                {
                    loading ? <LoadingHouseList /> : (
                        Array.isArray(houseList) && houseList.length > 0 ? (
                            houseList?.map((house, index) => (
                                <div key={index} className="listing">
                                    <div>
                                        <div>
                                            <div>
                                                <HouseSlider house={house} />
                                                {/* <i style={{color: "revert"}} className="fa-brands fa-gratipay icon-conmemya"></i> */}
                                            </div>
                                        </div>
                                        {/* <i style={{color: "revert"}} class="fa-brands fa-gratipay icon-conmemya"></i> */}
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

                                    {/* {(
                                        <div className={`overlay2 ${isOverlayVisible ? '' : 'd-none'}`} >
                                            <div className={`appearing-div ${isOverlayVisible ? 'active' : ''}`}>
                                                <div>
                                                    <i onClick={toggleOverlay} class="fa-solid fa-xmark close-description" ></i>
                                                </div>
                                                <div className='container-description-details'>

                                                </div>
                                            </div>
                                        </div>
                                    )} */}


                                    <div>
                                        <div className="listing-header">
                                            <h3 className="hotel-name">{house.hotelName}</h3>
                                            <span className="review">{house.review}</span>
                                        </div>
                                        <span>{house.title}</span>
                                        <button onClick={() => {
                                            setShowMapStates((prevState) => ({ ...prevState, [index]: true }))
                                        }}>
                                            Xem vị trí
                                        </button>
                                        <p>Tổng <span>${house.price}</span></p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <LoadingHouseList />
                        )
                    )
                }
            </div>

        </div>
    )
}

export default HouseList