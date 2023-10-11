import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../../Components/AirBnb/Home/Home';
import HouseDetail from '../../Components/AirBnb/Detail/HouseDetail';
import BookHouse from '../../Components/AirBnb/Book/Main/BookHouse';
import ErrorBookBody from '../../Components/AirBnb/Book/Body/ErrorBookBody';
import AccountSetting from '../../Components/User/AccountSetting';
import PersonalInfo from '../../Components/User/PersonalInfo/PersonalInfo';
const RoutesClient = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/loggout' element={<Home />} />
      <Route path='/account-settings' element={<AccountSetting/>} />
      <Route path='/account-settings/personal-info' element={<PersonalInfo/>} />
      <Route path='/house/:houseID' element={<HouseDetail />} />
      <Route path='/house/:houseID/:CountOld/:CountYoung/:CountBaby/:CountPet/:GoDay/:BackDay' element={<HouseDetail />} />
      {/* <Route path='/house' element={<Home />} /> */}
      <Route path='/book/:houseID/:CountOld/:CountYoung/:CountBaby/:CountPet/:GoDay/:BackDay' element={<BookHouse />} />
      <Route path='/error/:houseID/:CountOld/:CountYoung/:CountBaby/:CountPet/:GoDay/:BackDay' element={<ErrorBookBody />} />
    </Routes>
  );
}

export default RoutesClient;