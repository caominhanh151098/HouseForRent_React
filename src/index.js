import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import BookingProvider from './Components/AirBnb/Book/Main/BookingProvider';
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "../node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/icons.min.css";
import "./assets/css/app.min.css";
import "./assets/images/favicon.ico";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BookingProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BookingProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
