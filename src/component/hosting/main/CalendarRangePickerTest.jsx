import { startOfDay } from 'date-fns';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarRangePickerTest(props){

    const [value, onChange] = useState(new Date());
    const dataNotYetFetched = useState();

    // disabled some days until I fetched the data...
    var disabledDates = [
        new Date(2023, 10, 1),
        new Date(2023, 10, 2),
    ];
    //console.log(disabledDates);
    var modifiers = null;
    if(props.modifiers != null) {
        modifiers = props.modifiers;
        console.log(modifiers);
        disabledDates = modifiers.disabled;
    }

    return (
        <div style={{width:'1000px'}}>
        <Calendar 
            // Make calendar not viewable for previous months
            minDate={new Date()}
            // Whether to show two months 
            showDoubleView = {false}
            ActiveStartDate = {new Date()}
            returnValue={"range"}
            // settings for the calendar
            onChange={onChange} 
            value={value} 
            selectRange={false} 
            locale="en-US"
            autofocus={false}
            // disabled dates. Got data from channel manager
            tileDisabled={({date, view}) =>
            (view === 'month') && // Block day tiles only
            disabledDates.some(disabledDate =>
            date.getFullYear() === disabledDate.getFullYear() &&
            date.getMonth() === disabledDate.getMonth() &&
            date.getDate() === disabledDate.getDate()
            )}
        />
        </div>
    );
}

export default CalendarRangePickerTest;