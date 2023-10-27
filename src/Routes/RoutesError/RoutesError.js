import React from 'react'
import Error from '../../Components/AirBnb/Error/Error'
import { Routes, Route } from 'react-router-dom';

const RoutesError = () => {
    return (
        <>
            <Routes>
                <Route path='*' element={<Error />} />
            </Routes>
        </>
    )
}

export default RoutesError