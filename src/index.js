import React from 'react';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import "./assets/css/icons.min.css";
// import "./assets/css/app.min.css";
// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';


import BookingProvider from './Components/AirBnb/Book/Main/BookingProvider';
import { HouseProvider } from './Components/AirBnb/Header/HouseContext';

// import './index.css';

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



