import React from 'react'
import RoutesClient from './RoutesClient/RoutesClient';

import RoutesHost from './RoutesHost/RoutesHost';
import { Route, Routes } from 'react-router-dom'

const MainRoutes = () => {
  return (
    <>
      <RoutesClient />
      <RoutesHost />
    </>
  )
}

export default MainRoutes