import React, { useState, useEffect } from 'react'
import '../AirBnb.css'
import UseFetchCategory from '../../../Hooks/UseFetchCategory';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import HouseList from './HouseList';


const itemsPerLoad = 7;
const options = [
    'Lựa chọn 1', 'Lựa chọn 2', 'Lựa chọn 3', 'Lựa chọn 4',
    'Lựa chọn 5', 'Lựa chọn 6', 'Lựa chọn 7', 'Lựa chọn 8',
];

const Body = () => {
    
    const categories = UseFetchCategory();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFilterForm, setShowFilterForm] = useState(false);
    const [selectedBed, setSelectedBed] = useState(null);
    const [selectedBathroom, setSelectedBathroom] = useState(null);
    const [visibleOptions, setVisibleOptions] = useState(options.slice(0, itemsPerLoad));
    const [currentIndexInt, setCurrentIndexInt] = useState(itemsPerLoad);
    const [isCheckedBookNow, setIsCheckedBookNow] = useState(false);
    const [isCheckedBookAuto, setIsCheckedBookAuto] = useState(false);
    const [isCheckedShowTotal, setIsCheckedShowTotal] = useState(false);
    const [isCheckedStayWithHost, setIsCheckedStayWithHost] = useState(false);
    const [rangeValue, setRangeValue] = useState([0, 100]);
    const [minRange, setMinrange] = useState(rangeValue[0])
    const [maxRange, setMaxrange] = useState(rangeValue[1])
    const [countLocation, setCountLocation] = useState(699);


    const handleDeleteAll = () => {
        setRangeValue([0, 100])
        setSelectedBed(null)
        setSelectedBathroom(null)
        setIsCheckedBookNow(false)
        setIsCheckedBookAuto(false)
        setIsCheckedStayWithHost(false)
    }
    useEffect(() => {
        setMinrange(rangeValue[0]);
        setMaxrange(rangeValue[1]);
    }, [rangeValue, minRange, maxRange]);

    const handleSliderChange = (value) => {
        setRangeValue(value);
        setMinrange(value[0])
        setMaxrange(value[1]);
    };

    const handleToggleShowTotal = () => {
        setIsCheckedShowTotal(!isCheckedShowTotal);
        if (!isCheckedShowTotal) {
            console.log('Show Total bật');
        } else {
            console.log('Show Total tắt');
        }
    }
    const handleToggleBookNow = () => {
        setIsCheckedBookNow(!isCheckedBookNow);
        if (!isCheckedBookNow) {
            console.log('BookNow bật');
        } else {
            console.log('BookNow tắt');
        }
    };
    const handleToggleBookAuto = () => {
        setIsCheckedBookAuto(!isCheckedBookAuto);
        if (!isCheckedBookAuto) {
            console.log('BookAuto bật');
        } else {
            console.log('BookAuto tắt');
        }
    };
    const handleToggleStayWithHost = () => {
        setIsCheckedStayWithHost(!isCheckedStayWithHost);
        if (!isCheckedStayWithHost) {
            console.log('Stay With Home bật');
        } else {
            console.log('Stay With Home tắt');
        }
    }




    const loadMore = () => {
        const nextIndexInt = currentIndexInt + itemsPerLoad;
        if (nextIndexInt <= options.length) {
            setVisibleOptions(options.slice(0, nextIndexInt));
            setCurrentIndexInt(nextIndexInt);
        }
    };

    const handleButtonSelectedBathroom = (buttonvalue) => {
        setSelectedBathroom(buttonvalue)
    }

    const handleButtonSelectedBed = (buttonValue) => {
        setSelectedBed(buttonValue);
    };
    const itemWidth = 220;

    const updateCategoryPosition = () => {
        const translateX = -currentIndex * itemWidth;
        return { transform: `translateX(${translateX}px)` };
    };

    const handleLeftArrowClick = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleRightArrowClick = () => {
        if (currentIndex < categories.length - 5) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleShowFilterForm = () => {
        setShowFilterForm(true)
    }

    return (
        <div>
            <>
                <div className="category-container">
                    <div className={`overlay ${showFilterForm ? 'active' : ''}`} onClick={() => setShowFilterForm(false)}></div>
                    <div className="category-container">
                        <button className="arrow left-arrow" onClick={handleLeftArrowClick}><i class="fa-solid fa-circle-chevron-left"></i></button>
                        <div className="category" style={updateCategoryPosition()} >
                            {categories.map((item, index) => (
                                <div key={index} className="category-item">
                                    <img src={item.iconUrl}
                                        alt={item.alt}
                                        style={{ width: '40px', height: '40px' }} />
                                    <p>{item.name}</p>
                                </div>
                            ))}
                        </div>
                        <button className="arrow right-arrow" onClick={handleRightArrowClick}><i class="fa-solid fa-circle-chevron-right"></i></button>
                    </div>
                    <div class="filter-button" id="filterButton">
                        <button class="filter-icon" onClick={handleShowFilterForm}><i class="fa-solid fa-filter"></i> Bộ lọc</button>
                    </div>
                    <div>
                        {
                            showFilterForm && (
                                <div className="filter-form">
                                    <div>
                                        <h2 style={{ marginTop: '-13px' }}>Bộ lọc</h2>
                                        <button onClick={() => setShowFilterForm(false)} className='closeFilter'><i class="fa-solid fa-xmark"></i></button>
                                    </div>
                                    <hr className='hr' />
                                    <div className='scroll-filter'>
                                        <div className='text-left'>
                                            <h3>Khoảng giá</h3>
                                            <span>Giá theo đêm chưa bao gồm phí và thuế</span>
                                            <div className="price-range">
                                                <Slider
                                                    range
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    value={rangeValue}
                                                    onChange={handleSliderChange}
                                                />
                                                <div className="building-icons">
                                                    {Array.from({ length: 101 }, (_, index) => (
                                                        <div
                                                            key={index}
                                                            className={`building-icon ${index >= rangeValue[0] && index <= rangeValue[1] ? 'active' : ''}`}
                                                        ></div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <button className='btn-distance'>Tối thiểu <br /> $ {minRange}</button>
                                                <span style={{ fontSize: '22px' }}>-</span>
                                                <button className='btn-distance'>Tối đa <br /> $ {maxRange}</button>
                                            </div>

                                        </div>
                                        <hr className='hr' />
                                        <div className='text-left'>
                                            <h3>Giường và phòng tắm</h3>
                                            <span>Giường<br></br></span>
                                            <div>
                                                <button
                                                    className={selectedBed === 'any' ? 'bold' : 'selectbed'}
                                                    onClick={() => handleButtonSelectedBed('any')}
                                                >
                                                    Bất kỳ
                                                </button>
                                                {[1, 2, 3, 4, 5, 6, 7].map((number) => (
                                                    <button
                                                        key={number}
                                                        className={selectedBed === number ? 'bold' : 'selectbed'}
                                                        onClick={() => handleButtonSelectedBed(number)}
                                                    >
                                                        {number}
                                                    </button>
                                                ))}
                                                <button
                                                    className={selectedBed === '8+' ? 'bold' : 'selectbed'}
                                                    onClick={() => handleButtonSelectedBed('8+')}
                                                >
                                                    8+
                                                </button>
                                            </div>
                                            <span>Phòng tắm <br /></span>
                                            <div>
                                                <button
                                                    className={selectedBathroom === 'any' ? 'bold' : 'selectedBathroom'}
                                                    onClick={() => handleButtonSelectedBathroom('any')}
                                                >
                                                    Bất kỳ
                                                </button>
                                                {[1, 2, 3, 4, 5, 6, 7].map((number) => (
                                                    <button
                                                        key={number}
                                                        className={selectedBathroom === number ? 'bold' : 'selectedBathroom'}
                                                        onClick={() => handleButtonSelectedBathroom(number)}
                                                    >
                                                        {number}
                                                    </button>
                                                ))}
                                                <button
                                                    className={selectedBathroom === '8+' ? 'bold' : 'selectedBathroom'}
                                                    onClick={() => handleButtonSelectedBathroom('8+')}
                                                >
                                                    8+
                                                </button>
                                            </div>
                                        </div>
                                        <hr className='hr' />
                                        <div className='text-left'>
                                            <h3>Loại nhà/ phòng</h3>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <button className='typeofhouse'> <i class="fa-solid fa-house-chimney"></i> <br /> Nhà</button>
                                                <button className='typeofhouse'> <i class="fa-solid fa-building"></i> <br />Căn hộ</button>
                                                <button className='typeofhouse'>  <i class="fa-solid fa-hotel"></i> <br />Nhà khách</button>
                                            </div>
                                        </div>
                                        <hr className='hr' />
                                        <div className='text-left'>
                                            <h3>Tiện nghi</h3>
                                            <span>Đồ dùng thiết yếu <br /></span>
                                            <div className='convenient'>
                                                <div className="button-convenient">
                                                    {visibleOptions.map((option, index) => (
                                                        <button className="check-button" key={index}>
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                                {currentIndexInt < options.length && (
                                                    <button className="load-more" onClick={loadMore}>
                                                        Hiển thị thêm
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <hr className='hr' />
                                        <div className='text-left'>
                                            <h3>Tuỳ chọn đặt phòng</h3>
                                            <div style={{ display: 'flex' }}>
                                                <div>
                                                    <span>Đặt ngay <br />
                                                        <span style={{ opacity: '0.7' }}>Nhà/phòng cho thuê bạn có thể đặt mà không cần chờ chủ nhà chấp thuận</span></span>
                                                </div>
                                                <div className="switch">
                                                    <input
                                                        type="checkbox"
                                                        id="switchToggle"
                                                        className="switch-input"
                                                        checked={isCheckedBookNow}
                                                        onChange={handleToggleBookNow}
                                                    />
                                                    <label htmlFor="switchToggle" className="switch-label"></label>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex' }}>
                                                <div>
                                                    <span>Tự nhận phòng<br />
                                                        <span style={{ opacity: '0.7' }}>Dễ dàng vào chỗ ở sau khi bạn đến</span></span>
                                                </div>
                                                <div className="switch">
                                                    <input
                                                        type="checkbox"
                                                        id="switchToggle2"
                                                        className="switch-input2"
                                                        checked={isCheckedBookAuto}
                                                        onChange={handleToggleBookAuto}
                                                    />
                                                    <label htmlFor="switchToggle2" className="switch-label2"></label>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className='hr' />
                                        <div className='text-left'>
                                            <h3>Chỗ ở hàng đầu</h3>
                                            <div>
                                                <span>Chủ nhà siêu cấp<br />
                                                    <span style={{ opacity: '0.7' }}>Ở cùng với các chủ nhà được công nhận</span></span>
                                            </div>
                                            <div className="switch">
                                                <input
                                                    type="checkbox"
                                                    id="switchToggle3"
                                                    className="switch-staywith"
                                                    checked={isCheckedStayWithHost}
                                                    onChange={handleToggleStayWithHost}
                                                />
                                                <label htmlFor="switchToggle3" className="switch-stay"></label>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='hr' />
                                    <div>
                                        <button className='del-all' onClick={() => handleDeleteAll()}>Xoá tất cả</button>
                                        <button className='count-location' >Hiển thị {countLocation} địa điểm</button>
                                    </div>
                                </div>
                            )
                        }
                    </div>



                </div>
                <div>
                    <button className='show-total'>
                        <span style={{fontWeight: 'bold', padding: '10px'}}>Hiển thị tổng trước thuế </span>
                        <span className="separator">|</span>&nbsp;
                        <span style={{ opacity: '0.8',padding: '10px'}}>Bao gồm mọi khoản phí, trước thuế</span>
                        <div className="switch">
                            <input
                                type="checkbox"
                                id="switchToggle4"
                                className="switch-total"
                                checked={isCheckedShowTotal}
                                onChange={handleToggleShowTotal}
                            />
                            <label htmlFor="switchToggle4" className="switch-show"></label>
                        </div>
                    </button>
                </div>
                <HouseList/>
            </>
        </div>
    )
}

export default Body