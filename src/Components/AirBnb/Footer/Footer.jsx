import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '../AirBnb.css';
import UseFetchHouse from '../../../Hooks/UseFetchHouse';
import L from 'leaflet';
import markerIcon from "../../../Pictures/marker.png"
import { divIcon } from 'leaflet';
import ImgSliderOnMap from './ImgSliderOnMap';
import "../../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css"

const Footer = () => {
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const { houseList, loading } = UseFetchHouse();
  const [roomLocations, setRoomLocations] = useState([]);
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [showBtnCurrentLocation, setShowBtnCurrentLocation] = useState(false)
  console.log('houseList', houseList);

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

  useEffect(() => {
    console.log('house', houseList)

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

  console.log("roomLocations", roomLocations);

  const mapRef = useRef();


  const getUserLocation = () => {
        setShowUserLocation(true)
        if (userLocation) {
          mapRef.current.setView(userLocation, 15); // Set view to user location with a zoom level of 15
        }
  };

  const handleShowMap = () => {
    setShowMap(prevShowMap => !prevShowMap);
    setShowBtnCurrentLocation(prevBtn => !prevBtn)
    if(!showMap){
      setShowUserLocation(false)
    }
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        console.log(userLocation);
      });
    } else {
      alert('Trình duyệt không hỗ trợ xác định vị trí.');
    }
  }, [])



  return (
    <div>
      <button className='show-map' onClick={handleShowMap}>
        {showMap ? 'Ẩn bản đồ' : 'Hiện bản đồ'}
      </button>
      {
        showBtnCurrentLocation && (
          <button className='btn-show-current-location'
            onClick={getUserLocation}>
            <i class="fa-solid fa-location-crosshairs"></i>
          </button>
        )
      }

      {showMap && (
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
            <button><i class="fa-solid fa-location-crosshairs"></i>Hello</button>
            {/* <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <button>Vị trí hiện tại</button>'
            /> */}

            {/* {userLocation && (
                <Marker position={userLocation}>
                  <Popup>Vị trí của bạn</Popup>
                </Marker>
              )} */}
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
                    {/* <img className='img-custom-div-leaflet' src={location.info.images[0]} alt="" /> */}
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
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default Footer;