import useScript from './custom/admin/useScript';
import React, { useEffect, useState } from 'react';
// import './App.css';
import HouseDetail from './Components/AirBnb/Detail/HouseDetail';
import { Route, Routes } from 'react-router-dom';
import Home from './Components/AirBnb/Home/Home';
// import { el } from 'date-fns/locale';
import BookHouse from './Components/AirBnb/Book/Main/BookHouse';
import ErrorBookBody from './Components/AirBnb/Book/Body/ErrorBookBody';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/house/:houseID' element={<HouseDetail/>}></Route>
        <Route path='/house/:houseID/:CountOld/:CountYoung/:CountBaby/:CountPet/:GoDay/:BackDay' element={<HouseDetail/>}></Route>
        <Route path='/house' element={<Home/>}></Route>
      </Routes>
      <Routes>
        <Route path='/book/:houseID/:CountOld/:CountYoung/:CountBaby/:CountPet/:GoDay/:BackDay' 
        element={<BookHouse/>}></Route>
        <Route path='/error/:houseID/:CountOld/:CountYoung/:CountBaby/:CountPet/:GoDay/:BackDay' 
        element={<ErrorBookBody/>}></Route>
      </Routes>
     
    </div>
  );
}

export default App;
