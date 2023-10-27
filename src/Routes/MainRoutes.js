import React from 'react'
import RoutesClient from './RoutesClient/RoutesClient';

import RoutesHost from './RoutesHost/RoutesHost';
import { Route, Routes } from 'react-router-dom'
import RoutesAdmin from './RoutesAdmin/RoutesAdmin';

const MainRoutes = () => {
  return (
    <>
      <RoutesClient />
      <RoutesHost />
      <RoutesAdmin />
    </>
  )
}

export default MainRoutes