import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import multiMonthPlugin from '@fullcalendar/multimonth';
import { eachDayOfInterval } from 'date-fns';


export default function MultiCalendar() {
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const getDatesInRange = (startDate, endDate) => {
        return eachDayOfInterval({ start: startDate, end: endDate });
    };

    const handleDateClick = (arg) => {
        const clickedDate = arg.date;
        const isDateSelected = selectedDates.find(date => date.getTime() === clickedDate.getTime());
        if (!isDateSelected) {
            setSelectedDates([...selectedDates, clickedDate])
        }
    };

    console.log(selectedDates);

    const handleSelect = (arg) => {
        const { start, end } = arg;
        const selectedRange = getDatesInRange(start, end);
        const filteredDates = selectedRange.filter((date) => !selectedDates.includes(date));
        setSelectedDates([...selectedDates, ...filteredDates]);
    };

    return (
        <FullCalendar
            plugins={[multiMonthPlugin, interactionPlugin]}
            initialView="multiMonthYear"
            multiMonthMaxColumns={1}
            headerToolbar={false}
            height={"700px"}
            locale={{ code: "vi" }}
            titleFormat={{ year: 'numeric', month: 'long' }}
            handleWindowResize={true}
            expandRows={true}
            selectMirror={true}
            dayMaxEvents={true}
            selectable={true}
            dateClick={handleDateClick}
            select={handleSelect}
        />
    );
}

