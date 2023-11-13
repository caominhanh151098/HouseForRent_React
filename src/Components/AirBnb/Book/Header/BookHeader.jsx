import React from 'react'
import "../Book.css"
import { Link } from 'react-router-dom'

const BookHeader = () => {
  return (
    <div className='book-header'>
      <Link to={'/'}>
        <img
          className='logo-airbnb'
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png"
          alt=""
        />
      </Link>
      <hr className='book-hr' />
    </div>
  )
}

export default BookHeader