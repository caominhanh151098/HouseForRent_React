import React from 'react'
import RoutesClient from './RoutesClient/RoutesClient';

import RoutesHost from './RoutesHost/RoutesHost';
import { Route, Routes } from 'react-router-dom'
import RoutesAdmin from './RoutesAdmin/RoutesAdmin';
import RoutesError from './RoutesError/RoutesError';


const MainRoutes = () => {
  return (
    <>
      <Routes>
        <Route path='/' Component={RoutesClient} />
        <Route path='/host' Component={RoutesHost} />
        <Route path='/admin' Component={RoutesAdmin} />
        <Route path='/*' Component={RoutesError} />
      </Routes>
      {/* <RoutesError/> */}

    </>
  )
}

export default MainRoutes