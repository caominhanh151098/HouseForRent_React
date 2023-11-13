import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from "axios"
import Navbar_create_room from './../LayoutCreateRoom/Navbar_create_room';
import CreateRoom from './../../../Services/CreateRoom';


function B1_address() {
  const [address, setAddress] = useState(CreateRoom?.getCreateRoom()?.address || 'Huế')
  const [addressValue, setAddressValue] = useState(CreateRoom?.getCreateRoom()?.address || 'Huế')

  const [location, setLocation] = useState({
    add: 'huế',
    lat: '16.46234',
    lon: '107.58483'
  })
  const handleOnChangeTxtSearch = (e) => {
    setAddressValue(e.target.value);
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => setAddress(addressValue), 1000);
    return () => clearTimeout(timeOutId);
  }, [addressValue])

  useEffect(() => {
    async function getData() {
      if (address != '') {
        let res = await axios.get(`https://mapquestapi.com/geocoding/v1/address?key=XH0jLaU2elxOJPVY7rBcFYs5UbVsly1p&location=${address}`);
        setLocation({
          add: address,
          lat: res.data.results[0].locations[0].displayLatLng.lat,
          lon: res.data.results[0].locations[0].displayLatLng.lng,
        })
      } else {
        let res = await axios.get(`https://mapquestapi.com/geocoding/v1/address?key=XH0jLaU2elxOJPVY7rBcFYs5UbVsly1p&location=vietnam}`);
        setLocation({
          add: address,
          lat: res.data.results[0].locations[0].displayLatLng.lat,
          lon: res.data.results[0].locations[0].displayLatLng.lng,
        })
      }

    }
    getData();

  }, [address])
  let map;

  return (
    <>
      <Navbar_create_room></Navbar_create_room>
      <div style={{ textAlign: 'center' }}>
        <h4>Chỗ ở của bạn nằm ở đâu?</h4>
        <p>Địa chỉ của bạn chỉ được chia sẻ với khách sau khi họ đặt phòng thành công.</p>
        <input placeholder='Nhập địa chỉ của bạn ...' style={{ width: '650px', height: '40px', borderRadius: '5px' }} onChange={handleOnChangeTxtSearch} value={Location.add}></input>
      </div >

      <div style={{ marginLeft: '230px', width: '700px', borderRadius: '10px' }} className='col-8'>

        <div className="mapouter"><div className="gmap_canvas"><iframe src={`https://maps.google.com/maps?q=${address}&z=13&ie=UTF8&iwloc=&output=embed`} frameBorder={0} scrolling="no" style={{ width: '890px', height: '400px' }} /><style dangerouslySetInnerHTML={{ __html: ".mapouter{position:relative;height:400px;width:890px}.gmap_canvas{overflow:hidden;height:400px;width:890px}.gmap_canvas iframe{position:relative;z-index:2}.gmap_canvas a{top:0;z-index:0}" }} /><a href="https://www.eireportingonline.com">ei reporting online</a></div></div>
      </div>

      <div className='fixed-bottom d-flex justify-content-between'>
        <Link className="btn btn-sm ms-5 ms-5 mb-5 fs-5" to={'/host/create/b1/chooseTypeRoom'}>
          <i className="fa fa-arrow-left me-2" />
          quay lại
        </Link>
        <div><Link className="" to={'/host/create/b1/infor'}> <button onClick={() => { CreateRoom.setCreateRoom({ ...CreateRoom.getCreateRoom(), address: address, lon: location.lon, lat: location.lat }) }} className={`btn bg-dark text-white me-5 mb-5 ${address == '' ? 'disabled' : ''}`} >Tiếp theo</button></Link></div>
      </div>


    </>
  )
} export default B1_address
