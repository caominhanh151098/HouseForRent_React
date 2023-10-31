import React from 'react'
import { Routes, Route } from 'react-router-dom'
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js'
import '../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import MultiCalendar from '../../Components/calendar/MultiCalendar';
// import MultiCalendar from './../../Components/calendar/MultiCalendar';
import '../../Components/Host/LayoutHosting/bstrap/css/bootstrap2.css';
// import Error from '../../Components/AirBnb/Error/Error';
// import NavbarHosting from './../../Components/Host/LayoutHosting/NavbarHosting';
import HomeList from './../../Components/Host/Hosting/Main/HomeList';
import HouseOfHostDetail from './../../Components/Host/Hosting/Main/HouseOfHostDetail';
import EditRoom from './../../Components/Host/Hosting/Main/EditRoom';
import EditRule from './../../Components/Host/Hosting/Main/EditRule';
import EditComfortable from './../../Components/Host/Hosting/Main/EditComfortable';
import BookedToday from './../../Components/Host/Hosting/Main/BookedToday';
import AllReservation from './../../Components/Host/Hosting/Main/AllReservation';
import RevenueHost from './../../Components/Host/Hosting/Main/RevenueHost';
import Reviews from './../../Components/Host/Hosting/Main/Reviews';
import First_create_room from './../../Components/Host/MainCreateRoom/First_create_room';
import B1_share_add from './../../Components/Host/MainCreateRoom/B1_share_add';
import B1_chooseType from './../../Components/Host/MainCreateRoom/B1_chooseTypeHouse';
import B1_ChooseTypeRoom from './../../Components/Host/MainCreateRoom/B1_ChooseTypeRoom';
import B1_address from './../../Components/Host/MainCreateRoom/B1_address';
import B1_infor from './../../Components/Host/MainCreateRoom/B1_infor';
import B1_bathroom from './../../Components/Host/MainCreateRoom/B1_bathroom';
import Second from './../../Components/Host/MainCreateRoom/Second';
import B2_comfortable from './../../Components/Host/MainCreateRoom/B2_comfortable';
import B2_uploadImage from './../../Components/Host/MainCreateRoom/B2_uploadImage';
import B2_title from './../../Components/Host/MainCreateRoom/B2_title';
import B2_description from './../../Components/Host/MainCreateRoom/B2_description';
import Third from './../../Components/Host/MainCreateRoom/Third';
import B3_bookNow from './../../Components/Host/MainCreateRoom/B3_bookNow';
import B3_price from './../../Components/Host/MainCreateRoom/B3_price';
import B3_discount from './../../Components/Host/MainCreateRoom/B3_discount';
import Finish from './../../Components/Host/MainCreateRoom/Finish';


const RoutesHost = () => {
  return (
    <div className='local-bootstrap'>
      <Routes>
        <Route path='/host/firstCreateRoom' element={<First_create_room />} />
        <Route path='/host/create/b1/shareAdd' element={<B1_share_add />} />
        <Route path='/host/create/b1/chooseType' element={<B1_chooseType />} />
        <Route path='/host/create/b1/chooseTypeRoom' element={<B1_ChooseTypeRoom />} />
        <Route path='/host/create/b1/address' element={<B1_address />} />
        <Route path='/host/create/b1/infor' element={<B1_infor />} />
        <Route path='/host/create/b1/bathroom' element={<B1_bathroom />} />
        <Route path='/host/create/second' element={<Second />} />
        <Route path='/host/create/b2/comfortable' element={<B2_comfortable />} />
        <Route path='/host/create/b2/uploadImage' element={<B2_uploadImage />} />
        <Route path='/host/create/b2/title' element={<B2_title />} />
        <Route path='/host/create/b2/description' element={<B2_description />} />
        <Route path='/host/create/third' element={<Third />} />
        <Route path='/host/create/b3/booknow' element={<B3_bookNow />} />
        <Route path='/host/create/b3/price' element={<B3_price />} />
        <Route path='/host/create/b3/discount' element={<B3_discount />} />
        <Route path='/host/create/b3/finish' element={<Finish />} />
        <Route path='/host/homeList' element={<HomeList />} />
        <Route path='/host/houseOfHostDetail/:houseID' element={<HouseOfHostDetail />} />
        <Route path='/host/editRoom/:houseID' element={<EditRoom />} />
        <Route path='/host/editRule/:houseID' element={<EditRule />} />
        <Route path='/host/editComfortable/:houseID' element={<EditComfortable />} />
        <Route path='/host/bookedToday' element={<BookedToday />} />
        <Route path='/host/AllReservation' element={<AllReservation />} />
        <Route path='/host/calendar' element={<MultiCalendar />} />
        <Route path='/host/revenueHost' element={<RevenueHost />} />
        <Route path='/host/reviews' element={<Reviews />} />
      </Routes>
    </div>

  )
}

export default RoutesHost