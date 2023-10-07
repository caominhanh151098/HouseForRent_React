import React from 'react';

import { ToastContainer } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import BookingProvider from './Components/AirBnb/Book/Main/BookingProvider';
import { HouseProvider } from './Components/AirBnb/Header/HouseContext';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <ToastContainer> */}
    <BookingProvider>
      <HouseProvider>
        <ToastContainer/>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </HouseProvider>
    </BookingProvider>
    {/* </ToastContainer> */}
  </React.StrictMode>
);



