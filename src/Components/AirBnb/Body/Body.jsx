import React, { useState, useEffect, useRef } from 'react'
import '../AirBnb.css'
import UseFetchCategory from '../../../Hooks/UseFetchCategory';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import HouseList from './HouseList';
import UseFetchHouse from '../../../Hooks/UseFetchHouse';
import L from 'leaflet';
import markerIcon from "../../../Pictures/marker.png"
import { divIcon } from 'leaflet';
import ImgSliderOnMap from '../Footer/ImgSliderOnMap';
import "../../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import HouseSlider from './HouseSlider';
import "../Slider.css";
import CircularProgressVariants from '../Book/Body/CircularProgressVariants';
import ShowNoFilterResult from './ShowNoFilterResult';
import { API_ADD_FAVORITE_HOUSE, API_CREATE_NEW_LIST, API_DELETE_WISH_LISTS_BY_ID, API_GET_FAVORITE_HOUSE_BY_USER, API_GET_HOUSES_BY_COMFORTABLE_ID, API_GET_WISH_LISTS_BY_USER, API_REMOVE_HOUSE_FAVORITE } from '../../../Services/common';
import axios from 'axios';
import UseFetchListFilter from './../../../Hooks/UseFetchListFilter';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import format from 'date-fns/format';
import { useHouse } from '../Header/HouseContext';
import Pagination from './Pagination';
import CustomPagination from './PaginationList';
import { IonIcon } from '@ionic/react';
import { heartOutline, heartCircleOutline } from 'ionicons/icons';
import { ToastContainer, toast } from 'react-toastify';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Textarea from '@mui/joy/Textarea';
import Typography from '@mui/joy/Typography';

const itemsPerLoad = 7;
const options = [
    'Lựa chọn 1', 'Lựa chọn 2', 'Lựa chọn 3', 'Lựa chọn 4',
    'Lựa chọn 5', 'Lựa chọn 6', 'Lựa chọn 7', 'Lựa chọn 8',
];

const Body = () => {

    const categories = UseFetchCategory();
    const categoriesIds = categories.map(cate => cate.id);
    const listFilter = UseFetchListFilter();
    console.log("listFilter", listFilter);
    const { houseList, loading } = UseFetchHouse();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFilterForm, setShowFilterForm] = useState(false);
    const [selectedBed, setSelectedBed] = useState('any');
    const [selectedBathroom, setSelectedBathroom] = useState('any');
    const [selectedHouseType, setSelectedHouseType] = useState(null);
    const [visibleOptions, setVisibleOptions] = useState(options.slice(0, itemsPerLoad));
    const [currentIndexInt, setCurrentIndexInt] = useState(itemsPerLoad);
    const [isCheckedBookNow, setIsCheckedBookNow] = useState(false);
    const [isCheckedBookAuto, setIsCheckedBookAuto] = useState(false);
    const [isCheckedPetAllow, setIsCheckedPetAllow] = useState(false);
    const [isCheckedShowTotal, setIsCheckedShowTotal] = useState(false);
    const [isCheckedStayWithHost, setIsCheckedStayWithHost] = useState(false);
    const [rangeValue, setRangeValue] = useState([13, 456]);
    const [minRange, setMinrange] = useState(13)
    const [maxRange, setMaxrange] = useState(456)
    const [countLocation, setCountLocation] = useState(houseList ? houseList.length : 0);
    const [houseFilter, setHouseFilter] = useState([])
    const [loadingFilterHouse, setLoadingFilterHouse] = useState(false)
    const [showNoFilterResults, setShowNoFilterResults] = useState(false);
    const [filteredResultCount, setFilteredResultCount] = useState(0);
    const [comfortableSelected, setComfortableSelected] = useState(null)
    const [houseFilterByComfortable, setHouseFilterByComfortable] = useState([])
    const [filterState, SetFilterState] = useState({
        hasFilterPrice: false,
        hasFilterMinBeds: false,
        hasFilterMinBathRooms: false,
        hasFilterComfortables: false,
        hasFilterCategory: false
    })

    const { houseSearchByCity, setHouseSearchByCity, loadingSearchByCity } = useHouse();

    useEffect(() => {
        console.log("houseSearchByCity", houseSearchByCity);
    }, [houseSearchByCity])

    useEffect(() => {
        console.log("loadingSearchByCity", loadingSearchByCity);
    }, [loadingSearchByCity])


    useEffect(() => {
        if (houseList.length > 0) {
            const minPrice = Math.min(...houseList.map(house => house.price));
            setMinrange(minPrice);
            const maxPrice = Math.max(...houseList.map(house => house.price));
            setMaxrange(maxPrice);
            setRangeValue([minPrice, maxPrice]);
        }
    }, [houseList])

    // useEffect(() => {
    //     setCountLocation(houseList ? houseList.length : 0);
    // }, [houseList]);

    const handleHouseTypeClick = (type) => {
        setSelectedHouseType(type);
    };


    const [showMap, setShowMap] = useState(false);
    const handleToggleShowMap = () => {
        setShowMap(!showMap);
    };

    const handleDeleteAll = () => {
        setRangeValue([tempMinPrice, tempMaxPrice])
        if (selectedBed !== null) {
            setSelectedBed('any')
            if (minBeds !== null) {
                setMinBeds(0)
            }
        }
        if (selectedBathroom !== null) {
            setSelectedBathroom('any')
            if (minBathrooms !== null) {
                setMinBathrooms(0)
            }
        }

        if (comfortableIds !== null) {
            setComfortableIds([])
        }

        if (categoriesIds !== 0) {
            setCategoryIds(0);
            if (selectedHouseType !== null) {
                setSelectedHouseType(null)
            }
        }
        if (isCheckedBookNow) {
            setIsCheckedBookNow(false)
        }
        if (isCheckedBookAuto) {
            setIsCheckedBookAuto(false)
        }
        if (isCheckedPetAllow) {
            setIsCheckedPetAllow(false)
        }
        if (isCheckedStayWithHost) {
            setIsCheckedStayWithHost(false)
        }

    }

    useEffect(() => {
        setMinrange(rangeValue[0]);
        setMaxrange(rangeValue[1]);
    }, [rangeValue, minRange, maxRange]);

    const handleSliderChange = (value) => {
        setRangeValue(value);
        // setMinrange(value[0])
        // setMaxrange(value[1]);
    };

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         const newCountlocation = houseList.filter(house => house.price >= minRange && house.price <= maxRange).length;
    //         setCountLocation(newCountlocation)
    //     }, 500);

    //     return () => clearTimeout(timer);
    // }, [minRange, maxRange])

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10);
    const [minGuests, setMinGuests] = useState(0);
    const [minRooms, setMinRooms] = useState(0);
    const [minBeds, setMinBeds] = useState(0);
    const [minBathrooms, setMinBathrooms] = useState(0);
    const [comfortableIds, setComfortableIds] = useState([]);
    const [categoryIds, setCategoryIds] = useState(0);
    const [filteredHouses, setFilteredHouses] = useState([]);

    useEffect(() => {
        if (comfortableIds.length === 0) {
            setComfortableIds(categoriesIds);
        }
    }, [comfortableIds, categoriesIds])
    console.log("comfortableIds", comfortableIds);


    const [tempHouseFilter, setTempHouseFilter] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = `http://localhost:8080/api/house/filter?minPrice=${minRange}&maxPrice=${maxRange}&minGuests=${minGuests}&minRooms=${minRooms}&minBeds=${minBeds}&minBathrooms=${minBathrooms}`;
                if (comfortableIds) {
                    url += `&comfortableIds=${comfortableIds.join(',')}`;
                }
                const response = await fetch(url);
                const data = await response.json();
                if (tempHouseFilter.length === 0) {
                    setTempHouseFilter(data);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, [comfortableIds])
    useEffect(() => {
        console.log("tempHouseFilter", tempHouseFilter);
    }, [tempHouseFilter])


    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = `http://localhost:8080/api/house/filter?minPrice=${minRange}&maxPrice=${maxRange}&minGuests=${minGuests}&minRooms=${minRooms}&minBeds=${minBeds}&minBathrooms=${minBathrooms}`;
                if (comfortableIds) {
                    url += `&comfortableIds=${comfortableIds.join(',')}`;
                }
                if (categoryIds) {
                    url += `&categoryIds=${categoryIds}`;
                }


                const response = await fetch(url);
                const data = await response.json();
                setFilteredHouses(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [comfortableIds, minPrice, maxPrice, rangeValue, minGuests, minRooms, minBeds, minBathrooms, categoryIds])
    console.log("filteredHouses", filteredHouses);

    useEffect(() => {
        const timer = setTimeout(() => {
            // if (comfortableIds.length !== categoriesIds.length){
            //     const newCountlocation = tempHouseFilter.filter(house =>
            //         house.price >= minRange &&
            //         house.price <= maxRange &&
            //         Number(house.quantityOfBeds) >= minBeds &&
            //         Number(house.quantityOfBathrooms) >= minBathrooms
            //     ).length;
            //     console.log("newCountlocation truong hop 1", newCountlocation);
            //     setCountLocation(newCountlocation)
            // } else {
            //     const newCountlocation = tempHouseFilter.filter(house =>
            //         house.price >= minRange &&
            //         house.price <= maxRange &&
            //         Number(house.quantityOfBeds) >= minBeds &&
            //         Number(house.quantityOfBathrooms) >= minBathrooms &&
            //         house.comfortables && house.comfortables.some(comfortable => comfortableIds.includes(comfortable.id))
            //     ).length;
            //     console.log("newCountlocation truong hop 2", newCountlocation);
            //     setCountLocation(newCountlocation)
            // }
            setCountLocation(filteredHouses && filteredHouses.length)
        }, 500);

        return () => clearTimeout(timer);
    }, [filteredHouses])


    const handleCheckboxChange = (event, id) => {
        const checked = event.target.checked;
        setComfortableIds(prevIds => {
            if (checked && prevIds.length === categoriesIds.length) {
                return [id]
            } else if (checked) {
                return [...prevIds, id]
            } else {
                return prevIds.filter(comfortableIds => comfortableIds !== id)
            }
        });
    };



    const [tempMinPrice, setTempMinPrice] = useState(minRange)
    const [tempMaxPrice, setTempMaxPrice] = useState(maxRange)
    const handleFilterHouse = () => {
        setLoadingFilterHouse(true)

        const newHouseList = tempHouseFilter && tempHouseFilter.filter(house =>
            house.price >= minRange &&
            house.price <= maxRange &&
            Number(house.quantityOfBeds) >= minBeds &&
            Number(house.qquantityOfBathrooms) >= minBathrooms);

        setTimeout(() => {
            if (houseFilterByComfortable && houseFilterByComfortable.length > 0) {
                setHouseFilter(houseFilterByComfortable)
            } else {
                setHouseFilter(filteredHouses);
            }



            if (filteredHouses.length === 0) {
                setShowNoFilterResults(true)
            } else {
                setShowNoFilterResults(false)
            }

            setLoadingFilterHouse(false)
            setShowFilterForm(prev => !prev)

            if ((tempMinPrice !== minRange || tempMaxPrice !== maxRange) && !filterState.hasFilterPrice) {
                setFilteredResultCount(prev => prev + 1)
                SetFilterState(prevState => ({
                    ...prevState,
                    hasFilterPrice: true
                }));
            } else if ((tempMinPrice == minRange && tempMaxPrice == maxRange) && filterState.hasFilterPrice) {
                setFilteredResultCount(prev => prev - 1)
                SetFilterState(prevState => ({
                    ...prevState,
                    hasFilterPrice: false
                }));
            }

            if (minBeds !== 0 && !filterState.hasFilterMinBeds) {
                setFilteredResultCount(prev => prev + 1);
                SetFilterState(prevState => ({
                    ...prevState,
                    hasFilterMinBeds: true
                }));
            } else if (minBeds === 0 && filterState.hasFilterMinBeds) {
                setFilteredResultCount(prev => prev - 1);
                SetFilterState(prevState => ({
                    ...prevState,
                    hasFilterMinBeds: false
                }))
            }

            if (minBathrooms != 0 && !filterState.hasFilterMinBathRooms) {
                setFilteredResultCount(prev => prev + 1);
                SetFilterState(prevState => ({
                    ...prevState,
                    hasFilterMinBathRooms: true
                }))
            } else if (minBathrooms === 0 && filterState.hasFilterMinBathRooms) {
                setFilteredResultCount(prev => prev - 1);
                SetFilterState(prevState => ({
                    ...prevState,
                    hasFilterMinBathRooms: false
                }))
            }

            if (comfortableIds.length !== categoriesIds.length && !filterState.hasFilterComfortables) {
                setFilteredResultCount(prev => prev + 1);
                SetFilterState(prevState => ({
                    ...prevState,
                    hasFilterComfortables: true
                }))
            } else if (comfortableIds.length === categoriesIds.length && filterState.hasFilterComfortables) {
                setFilteredResultCount(prev => prev - 1);
                SetFilterState(prevState => ({
                    ...prevState,
                    hasFilterComfortables: false
                }))
            }

            if (categoryIds !== 0 && !filterState.hasFilterCategory) {
                setFilteredResultCount(prev => prev + 1);
                SetFilterState(prevState => ({
                    ...prevState,
                    hasFilterCategory: true
                }))
            } else if (categoryIds === 0 && filterState.hasFilterCategory) {
                setFilteredResultCount(prev => prev - 1);
                SetFilterState(prevState => ({
                    ...prevState,
                    hasFilterCategory: false
                }))
            }
            setHouseSearchByCity([]);

            setComfortableSelected(null)

            setHouseFilterByComfortable([])
        }, 500)
    }

    useEffect(() => {
        console.log("houseFilter", houseFilter);
    }, [houseFilter])




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
    const handleTogglePetAllow = () => {
        setIsCheckedPetAllow(!isCheckedPetAllow);
        if (!isCheckedPetAllow) {
            console.log('PetAllow bật');
        } else {
            console.log('PetAllow tắt');
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
    useEffect(() => {
        console.log("minBed", minBeds);
    }, [minBeds])

    const updateFilters = (filterType, value) => {
        switch (filterType) {
            case 'minBed':
                setMinBeds(value);
                break;
            case 'minBathRoom':
                setMinBathrooms(value);
                break;
            case 'randomBed':
                setMinBeds(0);
                break;
            case 'randomBathRoom':
                setMinBathrooms(0);
                break;
            case 'bedAbove8':
                setMinBeds(value);
                break
            case 'bathRoomAbove8':
                setMinBathrooms(value);
                break;
            default:
                break;
        }
    }


    const handleButtonSelectedBathroom = (buttonvalue) => {
        setSelectedBathroom(buttonvalue);
        if (buttonvalue === 'any') {
            updateFilters('randomBathRoom', 0);
        }
        if (buttonvalue >= 1 && buttonvalue < 8) {
            updateFilters('minBathRoom', buttonvalue)
        }
        if (buttonvalue === 8) {
            updateFilters('bathRoomAbove8', buttonvalue)
        }
    }

    const handleButtonSelectedBed = (buttonValue) => {
        setSelectedBed(buttonValue);
        if (buttonValue === 'any') {
            updateFilters('randomBed', 0);
        }

        if (buttonValue >= 1 && buttonValue <= 8) {
            updateFilters('minBed', buttonValue)
        }
        if (buttonValue === 8) {
            updateFilters('bedAbove8', buttonValue)
        }
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

    const [showMapList, setshowMapList] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    const [roomLocations, setRoomLocations] = useState([]);
    const [roomLocationsByCity, setRoomLocationsByCity] = useState([]);
    const [showUserLocation, setShowUserLocation] = useState(false);
    const [showBtnCurrentLocation, setShowBtnCurrentLocation] = useState(false)
    const [showSpinner, setShowSpinner] = useState(false)
    const [hasClickedButtonSpinner, setHasClickedButtonSpinner] = useState(false);
    const [mapZoomed, setMapZoomed] = useState(false);
    console.log('houseList', houseList);

    const customIconCurrent = new L.Icon({
        iconUrl: markerIcon,
        iconSize: [32, 32],
    });

    const customIcon = (price) => {
        // const roundedPrice = Math.ceil(price);
        const formatPrice = formatCurrencyOnMap(price);

        return divIcon({
            className: ' test',
            html: `<div class='custom-div-icon-leaflet'> 
        ${formatPrice} 
      </div>`,
        });
    };

    useEffect(() => {
        // console.log('house', houseList)

        if (houseList && houseList.length > 0) {

            const locations = houseList && houseList?.map(item => {
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
            setRoomLocations(locations);
        }
    }, [houseList]);

    useEffect(() => {
        console.log("roomLocations", roomLocations);
    }, [roomLocations])

    useEffect(() => {
        // console.log('house', houseList)

        if (houseSearchByCity && houseSearchByCity.length > 0) {

            const locations = houseSearchByCity && houseSearchByCity?.map(item => {
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
    }, [houseSearchByCity]);

    useEffect(() => {
        console.log("roomLocationsByCity", roomLocationsByCity);
    }, [roomLocationsByCity])
    // console.log("roomLocations", roomLocations);

    const mapRef = useRef();


    const getUserLocation = () => {
        setShowUserLocation(true)
        if (userLocation) {
            mapRef.current.setView(userLocation, 15); // Set view to user location with a zoom level of 15
        }
    };

    const handleShowCurrentLocation = () => {
        if (!hasClickedButtonSpinner) {
            setShowSpinner(true);

            setTimeout(() => {
                getUserLocation();
                setShowSpinner(false);
            }, 500);
            setHasClickedButtonSpinner(true)
        } else {
            getUserLocation();
        }

    }

    const handleShowMap = () => {
        setshowMapList(prevShowMap => !prevShowMap);
        setShowBtnCurrentLocation(prevBtn => !prevBtn)
        if (!showMapList) {
            setShowUserLocation(false)
        }
        if (hasClickedButtonSpinner) {
            setHasClickedButtonSpinner(false)
        }

    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
                // console.log(userLocation);
            });
        } else {
            alert('Trình duyệt không hỗ trợ xác định vị trí.');
        }
    }, [])

    const handleFilterHouseByComfortable = async (comfortableId) => {
        const res = await axios.get(API_GET_HOUSES_BY_COMFORTABLE_ID + comfortableId);
        if (res.data.length && res.data.length > 0) {
            setHouseFilterByComfortable(res.data);
            setHouseSearchByCity([])
        }

    }

    useEffect(() => {
        console.log("houseFilterByComfortable", houseFilterByComfortable);
        // Thực hiện các tác vụ tiếp theo sau khi houseFilterByComfortable đã được cập nhật
    }, [houseFilterByComfortable]);

    const handleSelectedComfotable = (id) => {
        setComfortableSelected(id)
    }

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const BpIcon = styled('span')(({ theme }) => ({
        borderRadius: 4,
        width: 22,
        height: 22,
        boxShadow:
            theme.palette.mode === 'dark'
                ? '0 0 0 1px rgb(16 22 26 / 40%)'
                : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
        backgroundImage:
            theme.palette.mode === 'dark'
                ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
                : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '.Mui-focusVisible &': {
            outline: '2px auto rgba(19,124,189,.6)',
            outlineOffset: 2,
        },
        'input:hover ~ &': {
            backgroundColor: 'black',
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background:
                theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : 'rgba(206,217,224,.5)',
        },
    }));

    const BpCheckedIcon = styled(BpIcon)({
        backgroundColor: 'black',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
            display: 'block',
            width: 22,
            height: 22,
            backgroundImage:
                "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
                " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
                "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
            content: '""',
        },
        'input:hover ~ &': {
            backgroundColor: 'black',
        },
    });

    // Inspired by blueprintjs
    function BpCheckbox(props) {
        return (
            <Checkbox
                sx={{
                    '&:hover': { bgcolor: 'transparent' },
                }}
                disableRipple
                color="default"
                checkedIcon={<BpCheckedIcon />}
                icon={<BpIcon />}
                inputProps={{ 'aria-label': 'Checkbox demo' }}
                {...props}
            />
        );
    }

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 5);

    const formattedToday = format(today, "'Ngày' dd");
    const formattedFutureDate = format(futureDate, "'Ngày' dd 'tháng' M");

    const [currentPage, setCurrentPage] = useState(1);
    const housesPerPage = 4;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const startIdx = (currentPage - 1) * housesPerPage;
    const endIdx = Math.min(currentPage * housesPerPage, houseSearchByCity.length);

    const displayedHouses = houseSearchByCity && houseSearchByCity.slice(startIdx, endIdx);
    const displayedLocations = roomLocationsByCity && roomLocationsByCity.slice(startIdx, endIdx);

    const totalPages = Math.ceil(houseSearchByCity && houseSearchByCity.length / housesPerPage);
    console.log("totalPages", totalPages);

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

    const [hoveredIndex, setHoveredIndex] = useState(null);

    const toggleHover = (index) => {
        setHoveredIndex(index);
    };






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

    const formatCurrencyOnMap = (item) => {
        const formater = new Intl.NumberFormat('vi-VN', {
            style:'currency',
            currency: 'VND'
        })
        return formater.format(item).replace('₫', '')
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
                                <div key={index}
                                    onClick={() => {
                                        handleFilterHouseByComfortable(index);
                                        handleSelectedComfotable(index)
                                    }}
                                    className={`category-item ${comfortableSelected === index ? 'category-item-selected-comfortable' : ''}`}>
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
                        <button class={`filter-icon ${filteredResultCount > 0 ? 'btn-filter-condition' : ''}`}
                            onClick={handleShowFilterForm}>
                            <i class="fa-solid fa-filter"></i> Bộ lọc</button>
                        {
                            filteredResultCount > 0 && (
                                <div className='count-filter-results'>{filteredResultCount}</div>
                            )
                        }
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
                                                    max={456}
                                                    step={1}
                                                    value={rangeValue}
                                                    onChange={handleSliderChange}
                                                />
                                                <div className="building-icons">
                                                    {Array.from({ length: 456 - 13 + 1 }, (_, index) => (
                                                        <div
                                                            key={index}
                                                            className={`building-icon ${index + 13 >= rangeValue[0] && index + 13 <= rangeValue[1] ? 'active' : ''}`}
                                                        ></div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <button className='btn-distance'>Tối thiểu <br /> {formatCurrency(minRange)} </button>
                                                <span style={{ fontSize: '22px' }}>-</span>
                                                <button className='btn-distance'>Tối đa <br /> {formatCurrency(maxRange)}</button>
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
                                                    className={selectedBed === 8 ? 'bold' : 'selectbed'}
                                                    onClick={() => handleButtonSelectedBed(8)}
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
                                                    className={selectedBathroom === 8 ? 'bold' : 'selectedBathroom'}
                                                    onClick={() => handleButtonSelectedBathroom(8)}
                                                >
                                                    8+
                                                </button>
                                            </div>
                                        </div>
                                        <hr className='hr' />
                                        <div className='text-left'>
                                            <h3>Loại nhà/ phòng</h3>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <button className={`typeofhouse ${selectedHouseType === 'home' ? 'selected-type-of-house' : ''}`}
                                                    onClick={() => {
                                                        setSelectedHouseType('home');
                                                        setCategoryIds(1);
                                                    }}
                                                >
                                                    <i class="fa-solid fa-house-chimney"></i> <br /> Nhà
                                                </button>
                                                <button className={`typeofhouse ${selectedHouseType === 'apartment' ? 'selected-type-of-house' : ''}`}
                                                    onClick={() => {
                                                        setSelectedHouseType('apartment')
                                                        setCategoryIds(2);
                                                    }}>
                                                    <i class="fa-solid fa-building"></i> <br />Căn hộ
                                                </button>
                                                <button className={`typeofhouse ${selectedHouseType === 'hotel' ? 'selected-type-of-house' : ''}`}
                                                    onClick={() => {
                                                        setSelectedHouseType('hotel')
                                                        setCategoryIds(3);
                                                    }}>
                                                    <i class="fa-solid fa-hotel"></i> <br />Nhà khách
                                                </button>
                                            </div>
                                        </div>
                                        <hr className='hr' />
                                        <div className='text-left'>
                                            <h3>Tiện nghi</h3>
                                            <span>Đồ dùng thiết yếu <br /></span>
                                            <div className='convenient'>
                                                <div className="button-convenient">
                                                    {
                                                        listFilter && listFilter.length > 0 && listFilter.map((field, index) => (
                                                            <div key={index}>
                                                                <h3>{field?.nameComfortableType}</h3>
                                                                <div style={{ display: 'flex', flexWrap: 'wrap', width: '180%' }}>
                                                                    {field && field.comfortableDetailList &&
                                                                        field?.comfortableDetailList?.map((item, itemIndex) => (
                                                                            <div style={{ display: 'flex', width: '50%' }}>
                                                                                <BpCheckbox
                                                                                    checked={comfortableIds.includes(item.id)}
                                                                                    onChange={(e) => handleCheckboxChange(e, item.id)}
                                                                                />
                                                                                <p>{item.name}</p>
                                                                                <p style={{ opacity: '0' }}>{item.id}</p>
                                                                            </div>
                                                                        ))}
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                    <button>Hiển thị thêm</button>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className='hr' />
                                        <div className='text-left'>
                                            <h3>Tuỳ chọn đặt phòng</h3>
                                            <div style={{ display: 'flex' }}>
                                                <div>
                                                    <span> Đặt ngay <br />
                                                        <span style={{ opacity: '0.6' }}>Nhà/phòng cho thuê bạn có thể đặt mà không cần chờ chủ nhà chấp thuận</span></span>
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
                                                        <span style={{ opacity: '0.6' }}>Dễ dàng vào chỗ ở sau khi bạn đến</span></span>
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
                                            <div style={{ display: 'flex' }}>
                                                <div>
                                                    <span>Cho phép mang theo thú cưng<br />
                                                        <span style={{ opacity: '0.6' }}>Bạn sẽ mang theo động vật phục vụ?</span></span>
                                                </div>
                                                <div className="switch">
                                                    <input
                                                        type="checkbox"
                                                        id="switchToggle5"
                                                        className="switch-input5"
                                                        checked={isCheckedPetAllow}
                                                        onChange={handleTogglePetAllow}
                                                    />
                                                    <label htmlFor="switchToggle5" className="switch-label5"></label>
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
                                        {
                                            countLocation === 0 ? (
                                                <button className='count-location'
                                                    onClick={handleFilterHouse}
                                                >Không có kết quả phù hợp</button>
                                            ) :
                                                loadingFilterHouse ? (
                                                    <button className='btn-loading-filter-house'><CircularProgressVariants /></button>
                                                ) : (
                                                    <button className='count-location'
                                                        onClick={handleFilterHouse}
                                                    >Hiển thị {countLocation} địa điểm</button>
                                                )
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </div>



                </div>
                <div style={{ textAlign: 'center' }}>
                    <button className='show-total'>
                        <span style={{ fontWeight: 'bold', padding: '10px' }}>Hiển thị tổng trước thuế </span>
                        <span className="separator">|</span>&nbsp;
                        <span style={{ opacity: '0.8', padding: '10px' }}>Bao gồm mọi khoản phí, trước thuế</span>
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
                <div class="spinner" style={{ display: showSpinner ? 'block' : 'none' }}>
                    <div class="bounce1"></div>
                    <div class="bounce2"></div>
                    <div class="bounce3"></div>
                </div>

                <button className='show-map' onClick={handleShowMap}>
                    {showMapList ? 'Ẩn bản đồ' : 'Hiện bản đồ'}
                </button>
                {
                    showBtnCurrentLocation && (
                        <button className='btn-show-current-location'
                            onClick={handleShowCurrentLocation}>
                            <i class="fa-solid fa-location-crosshairs"></i>
                        </button>
                    )
                }
                {showMapList ? (
                    <div id="map-container" style={{ height: '500px' }}>
                        <MapContainer
                            center={(userLocation) || [0, 0]}
                            zoom={10}
                            style={{ height: '200%', width: '100%' }}
                            ref={mapRef}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution={`
                                    &copy; <a href="https://www.openstreetmap.org/copyright">Điều khoản sử dụng</a>
                                    `}
                            />
                            {roomLocations.map((location, index) => (
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
                                                <p style={{ fontSize: '17px' }}> <span style={{ fontWeight: 'bold' }}>{formatCurrency(location.info.price)}</span>  / đêm</p>
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
                        </MapContainer>
                    </div>
                ) :
                    loadingSearchByCity ?
                        (
                            <div class="cssload-preloader">
                                <span>L</span>
                                <span>o</span>
                                <span>a</span>
                                <span>d</span>
                                <span>i</span>
                                <span>n</span>
                                <span>g</span>

                            </div>
                        ) : houseSearchByCity.length > 0 ?
                            (
                                <div className='div-search'>
                                    <div style={{ width: '47%' }}
                                        className="search-results">
                                        {displayedHouses.map((house, index) => {
                                            const isHouseLiked = houseLiked.includes(Number(house.id))
                                            return (
                                                <div style={{ width: '28%' }}
                                                    key={index} className="listing">
                                                    <div>
                                                        <div>
                                                            <div>
                                                                <HouseSlider house={house} />
                                                                {
                                                                    isHouseLiked ? (
                                                                        <div className='outer-div' style={{right:'-210px'}}
                                                                            onMouseEnter={() => toggleHover(index)} onMouseLeave={() => toggleHover(null)}>
                                                                            <i onClick={() => { handleRemoveFavorite(house.id) }}
                                                                                class="fa-solid fa-heart" style={{ color: '#f21202' }}></i>
                                                                        </div>
                                                                    ) : (
                                                                        <div className='outer-div' style={{right:'-210px'}}
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
                                                    <div>
                                                        <div style={{ marginTop: '13px' }} className="listing-header">
                                                            <h3 className="hotel-name">{house?.location?.address}</h3>
                                                            {/* <span className="review">
                                                    <i class="fa-solid fa-star"></i>&nbsp;{house?.review}</span> */}
                                                        </div>
                                                        <span>{formattedToday} - {formattedFutureDate}</span>
                                                        <p style={{ marginTop: '10px' }}><span style={{ fontWeight: 'bold' }}>{formatCurrency(house.price)} </span>/ đêm</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <div style={{ width: '50%' }}>
                                        <div id="map-container" style={{ height: '500px' }}>
                                            <MapContainer
                                                center={(userLocation) || [0, 0]}
                                                zoom={10}
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
                                                                    <p style={{ fontSize: '17px' }}> <span style={{ fontWeight: 'bold' }}>{formatCurrency(location.info.price)}</span>  / đêm</p>
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
                                            </MapContainer>
                                        </div>
                                    </div>
                                    <div className='container-pagination'>
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}

                                            // itemsPerPage={housesPerPage}
                                            onPageChange={handlePageChange}
                                            handlePrevPage={handlePrevPage}
                                            handleNextPage={handleNextPage}
                                        />

                                    </div>
                                    <div className='show-result-count-by-city'>
                                        <div className='div-img-show-result-count'>
                                            <img src="https://a0.muscache.com/pictures/b887040f-0968-4174-9a4f-2d41f8728248.jpg" alt="" />
                                            <p>Tìm kiếm</p>
                                        </div>
                                        <hr />
                                        <div className='p-count-result-by-city'>
                                            <p>{houseSearchByCity && houseSearchByCity.length} chỗ ở tại {houseSearchByCity && houseSearchByCity[0] && houseSearchByCity[0]?.location?.address}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                            :
                            (
                                houseFilterByComfortable.length > 0 ? (
                                    <div className="search-results">
                                        {houseFilterByComfortable.map((house, index) => {
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
                                                    <div>
                                                        <div style={{ marginTop: '13px' }} className="listing-header">
                                                            <h3 className="hotel-name">{house?.location?.address}</h3>
                                                            {/* <span className="review">
                                                        <i class="fa-solid fa-star"></i>&nbsp;{house?.review}</span> */}
                                                        </div>
                                                        <span>{formattedToday} - {formattedFutureDate}</span>
                                                        <p style={{ marginTop: '10px' }}><span style={{ fontWeight: 'bold' }}>{formatCurrency(house.price)} </span>/ đêm</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) :
                                    showNoFilterResults ? (
                                        <ShowNoFilterResult />
                                    ) :
                                        houseFilter && houseFilter.length > 0 ? (
                                            <div className="search-results">
                                                {houseFilter.map((house, index) => {
                                                    const isHouseLiked = houseLiked.includes(Number(house.id))
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
                                                                        {/* <i style={{color: "revert"}} className="fa-brands fa-gratipay icon-conmemya"></i> */}
                                                                    </div>
                                                                </div>
                                                                {/* <i style={{color: "revert"}} class="fa-brands fa-gratipay icon-conmemya"></i> */}
                                                            </div>
                                                            <div>
                                                                <div style={{ marginTop: '13px' }} className="listing-header">
                                                                    <h3 className="hotel-name">{house?.location?.address}</h3>
                                                                    {/* <span className="review">
                                                                <i class="fa-solid fa-star"></i>&nbsp;{house?.review}</span> */}
                                                                </div>
                                                                <span>{formattedToday} - {formattedFutureDate}</span>
                                                                <p style={{ marginTop: '10px' }}><span style={{ fontWeight: 'bold' }}>{formatCurrency(house.price)} </span>/ đêm</p>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <HouseList />
                                        )
                            )}
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
            </>
        </div>
    )
}

export default Body