import React from 'react'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { addDays } from 'date-fns';
import { useState } from 'react';
import { DateRangePicker } from "react-date-range";
import CalendarRangePickerTest from './CalendarRangePickerTest';
function ShowCalendar() {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);
  return (
//     <>
       
// <DateRangePicker
//   onChange={item => setState([item.selection])}
//   showSelectionPreview={true}
//   moveRangeOnFirstSelection={false}
//   months={1}
//   ranges={state}
 
// />;
//     </>
<>
    <CalendarRangePickerTest style={{width:'1000px'}}></CalendarRangePickerTest>
</>
  )
} export default ShowCalendar

