import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../../Components/AirBnb/Home/Home';
import HouseDetail from '../../Components/AirBnb/Detail/HouseDetail';
import BookHouse from '../../Components/AirBnb/Book/Main/BookHouse';
import ErrorBookBody from '../../Components/AirBnb/Book/Body/ErrorBookBody';
import AccountSetting from '../../Components/User/AccountSetting';
import PersonalInfo from '../../Components/User/PersonalInfo/PersonalInfo';
import Identity from './../../Components/User/PersonalInfo/Identity';
import Trip from '../../Components/User/Trip/Trip';
import WishList from '../../Components/User/WishList/WishList';
import WishListDetails from '../../Components/User/WishList/WishListDetails';
const RoutesClient = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/verify/:status' element={<Home />} />
      <Route path='/loggout' element={<Home />} />
      <Route path='/account-settings' element={<AccountSetting/>} />
      <Route path='/account-settings/personal-info' element={<PersonalInfo/>} />
      <Route path='/identity-verification' element={<Identity/>} />
      <Route path='/trip' element={<Trip/>} />
      <Route path='/wish-lists' element={<WishList/>} />
      <Route path='/wish-lists/:IdWishList/:NameWishList' element={<WishListDetails/>} />
      <Route path='/house/:houseID' element={<HouseDetail />} />
      <Route path='/house/:houseID/:CountOld/:CountYoung/:CountBaby/:CountPet/:GoDay/:BackDay' element={<HouseDetail />} />
      {/* <Route path='/house' element={<Home />} /> */}
      <Route path='/book/:houseID/:CountOld/:CountYoung/:CountBaby/:CountPet/:GoDay/:BackDay' element={<BookHouse />} />
      <Route path='/book/:houseID/:CountOld/:CountYoung/:CountBaby/:CountPet/:GoDay/:BackDay/:paymentID/:tnxRef' element={<BookHouse />} />
      <Route path='/error/:houseID/:CountOld/:CountYoung/:CountBaby/:CountPet/:GoDay/:BackDay' element={<ErrorBookBody />} />
    </Routes>
  );
}

export default RoutesClient;