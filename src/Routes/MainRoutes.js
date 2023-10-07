import React from 'react'
import RoutesClient from './RoutesClient/RoutesClient'
import { Route, Routes } from 'react-router-dom'
import RoutesHost from './RoutesHost/RoutesHost';
import RoutesAdmin from './RoutesAdmin/RoutesAdmin';

const MainRoutes = () => {
  return (
    <>
      <RoutesClient />
      <RoutesHost />
      <RoutesAdmin/>
    </>
  )
}

export default MainRoutes