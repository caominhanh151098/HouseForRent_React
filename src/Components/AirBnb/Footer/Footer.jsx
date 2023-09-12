import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '../AirBnb.css';

const Footer = () => {
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setShowMap(!showMap); // Đảo ngược trạng thái showMap khi ấn vào nút
      });
    } else {
      alert('Trình duyệt không hỗ trợ xác định vị trí.');
    }
  };

  return (
    <div>
      <button className='show-map' onClick={getUserLocation}>
        {showMap ? 'Ẩn bản đồ' : 'Hiện bản đồ'}
      </button>

      {showMap && (
        <div id="map-container" style={{ height: '500px' }}>
          <MapContainer
            center={userLocation || [0, 0]}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Điều khoản sử dụng</a>'
            />
            {userLocation && (
              <Marker position={userLocation}>
                <Popup>Vị trí của bạn</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default Footer;