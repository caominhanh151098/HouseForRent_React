import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import "../AirBnb.css"
import { useParams } from 'react-router-dom'
import { API_HOUSE_DETAIL_URL } from '../../../Services/common'
import "../AirBnbDetail.css"
import BodyDetail from './BodyDetail'

const HouseDetail = () => {
  
  return (
    <div>
        <Header/>
        <BodyDetail/>
    </div>
  )
}

export default HouseDetail