import React from 'react'
import Navbar_create_room from './../../component/layout_create_room/Navbar_create_room';
import First_create_room from './../../component/main_create_room/First_create_room';
import B1_share_add from './../../component/main_create_room/B1_share_add';
import B1_chooseType from './../../component/main_create_room/B1_chooseTypeHouse';
import { Routes, Route } from 'react-router-dom'
import B1_ChooseTypeRoom from './../../component/main_create_room/B1_ChooseTypeRoom';
import B1_address from './../../component/main_create_room/B1_address';
import B1_infor from './../../component/main_create_room/B1_infor';
import B1_bathroom from './../../component/main_create_room/B1_bathroom';
import Second from './../../component/main_create_room/Second';
import B2_comfortable from './../../component/main_create_room/B2_comfortable';
import B2_uploadImage from './../../component/main_create_room/B2_uploadImage';
import B2_title from './../../component/main_create_room/B2_title';
import B2_description from './../../component/main_create_room/B2_description';
import Third from './../../component/main_create_room/Third';
import B3_bookNow from './../../component/main_create_room/B3_bookNow';
import B3_price from './../../component/main_create_room/B3_price';
import B3_discount from './../../component/main_create_room/B3_discount';
import Finish from './../../component/main_create_room/Finish';
import HomeList from './../../component/hosting/main/HomeList';
import HouseOfHostDetail from './../../component/hosting/main/HouseOfHostDetail';
import EditRoom from './../../component/hosting/main/EditRoom';
import EditRule from './../../component/hosting/main/EditRule';
import EditComfortable from './../../component/hosting/main/EditComfortable';
import NavbarHosting from './../../component/layout_hosting/NavbarHosting';
import BookedToday from './../../component/hosting/main/BookedToday';
import AllReservation from './../../component/hosting/main/AllReservation';
// import ShowCalendar from './../../component/hosting/main/ShowCalendar.jsx';
import RevenueHost from './../../component/hosting/main/RevenueHost';
import Reviews from './../../component/hosting/main/Reviews';
import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js'
import '../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import MultiCalendar from '../../Components/calendar/MultiCalendar';
// import MultiCalendar from './../../Components/calendar/MultiCalendar';
import '../../component/layout_hosting/bstrap/css/bootstrap2.css';
import Error from '../../Components/AirBnb/Error/Error';


const RoutesHost = () => {
  return (
    <div >
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