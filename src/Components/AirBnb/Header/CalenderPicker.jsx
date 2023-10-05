import React from 'react'
import "../AirBnb.css"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';

const CalenderPicker = () => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDateTimePicker className="custom-static-datetime-picker" orientation="landscape" />
        </LocalizationProvider>
    )
}

export default CalenderPicker