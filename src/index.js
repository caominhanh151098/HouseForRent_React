import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js'
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import BookingProvider from './Components/AirBnb/Book/Main/BookingProvider';
import { HouseProvider } from './Components/AirBnb/Header/HouseContext';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BookingProvider>
      <HouseProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </HouseProvider>
    </BookingProvider>
  </React.StrictMode>
);



