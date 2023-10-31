import { startOfDay } from 'date-fns';
import { useState } from 'react';
import MultipleDatesPicker from '@ambiot/material-ui-multiple-dates-picker'
function CalendarRangePickerTest(props){

   
    // // disabled some days until I fetched the data...
    // var disabledDates = [
    //     new Date(2023, 10, 1),
    //     new Date(2023, 10, 2),
    // ];
    // const [selectedDates, setSelectedDates] = useState([]);

    // const handleDateChange = (date) => {
    //     console.log(date);

    //     // Nếu chưa chọn đủ hai ngày, thêm ngày vào mảng
    //     setSelectedDates([...selectedDates, date[0]]);
      
      
    // };
    // //console.log(disabledDates);
    // var modifiers = null;
    // if(props.modifiers != null) {
    //     modifiers = props.modifiers;
    //     console.log(modifiers);
    //     disabledDates = modifiers.disabled;
    // }
    // const handleLog =()=>console.log(selectedDates);
    const [open, setOpen] = useState(false)
    const [values, setValues] = useState(["2023-10-03", "2023-10-04"])
    return (
        <div>
            <button onClick={() => setOpen(!open)}>
        Select Dates
      </button>
        <MultipleDatesPicker
          open={open}
          selectedDates={[]}
          onCancel={() => setOpen(false)}
          value={values} 
          onSubmit={dates => console.log('selected dates', dates)}
        />
      </div>
        // <div style={{width:'1000px'}}>
        //     <button onClick={handleLog}>log</button>
        // <Calendar 
        //     // Make calendar not viewable for previous months
        //     minDate={new Date()}
        //     // Whether to show two months 
        //     showDoubleView = {false}
        //     ActiveStartDate = {new Date()}
        //     returnValue={"range"}
        //     // settings for the calendar
        //     onChange={(date)=>handleDateChange(date)} 
        //     value={selectedDates} 
        //     selectRange={false} 
        //     locale="en-US"
        //     autofocus={false}
        //     multiple 
        //     // disabled dates. Got data from channel manager
        //     tileDisabled={({date, view}) =>
        //     (view === 'month') && // Block day tiles only
        //     disabledDates.some(disabledDate =>
        //     date.getFullYear() === disabledDate.getFullYear() &&
        //     date.getMonth() === disabledDate.getMonth() &&
        //     date.getDate() === disabledDate.getDate()
        //     )}
        // />
        // </div>
    );
}

export default CalendarRangePickerTest;