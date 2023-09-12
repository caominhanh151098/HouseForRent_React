import logo from './logo.svg';
import './App.css';
import Header from './Components/AirBnb/Header/Header';
import Body from './Components/AirBnb/Body/Body';
import Footer from './Components/AirBnb/Footer/Footer';
import HouseDetail from './Components/AirBnb/Detail/HouseDetail';
import { Route, Routes } from 'react-router-dom';
import Home from './Components/AirBnb/Home/Home';

function App() {
  return (
    <div className="App">
      {/* <Header/>
      <Body/>
      <Footer/>
      <HouseDetail/> */}
      <Routes>
        <Route path='' element={<Home/>}></Route>
        <Route path='/house/:houseID' element={<HouseDetail/>}></Route>
        <Route path='/house' element={<Home/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
