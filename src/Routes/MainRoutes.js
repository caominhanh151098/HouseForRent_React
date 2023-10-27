import React from 'react'
import RoutesClient from './RoutesClient/RoutesClient';

import RoutesHost from './RoutesHost/RoutesHost';
import { Route, Routes } from 'react-router-dom'
import RoutesAdmin from './RoutesAdmin/RoutesAdmin';
// import RoutesError from './RoutesError/RoutesError';

const MainRoutes = () => {
  return (
    <>
    {/* <RoutesError/> */}
      <RoutesClient />
      <RoutesHost />
      <RoutesAdmin />
    </>
  )
}

export default MainRoutes