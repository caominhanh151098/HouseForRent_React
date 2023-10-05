import React from 'react'
import RoutesClient from './RoutesClient/RoutesClient'
import { Route, Routes } from 'react-router-dom'
import RoutesHost from './RoutesHost/RoutesHost';

const MainRoutes = () => {
  return (
    <>
      <RoutesClient />
      <RoutesHost />
    </>
  )
}

export default MainRoutes