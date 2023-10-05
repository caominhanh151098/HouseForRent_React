import React, { useState } from 'react';
import BookingContext from './BookingContext';

const BookingProvider = ({ children }) => {
  const [bookingInfo, setBookingInfo] = useState({
    numReview: '',
    srcImg: '',
    goDay: '',
    backDay: ''
  });

  return (
    <BookingContext.Provider value={{ bookingInfo, setBookingInfo }}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingProvider;