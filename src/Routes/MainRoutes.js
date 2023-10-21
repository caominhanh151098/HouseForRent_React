import React from 'react'
import RoutesClient from './RoutesClient/RoutesClient';
import { Route, Routes } from 'react-router-dom'
import RoutesAdmin from './RoutesAdmin/RoutesAdmin';
import RoutesHost from './RoutesHost/RoutesHost';

const   MainRoutes = () => {
  return (
    <>
      <RoutesClient />
      <RoutesHost/>
      <RoutesAdmin/>
    </>
  )
}

export default MainRoutes