import React, { useEffect } from 'react'
import HeaderFormUser from '../../User/HeaderFormUser'
import FooterFormUser from '../../User/FooterFormUser'
import "../AirBnb.css"
import { Link } from 'react-router-dom'

const Error = () => {
    useEffect(() => {
        const gifElement = document.getElementById('gif-element');

        const restartGif = () => {
            gifElement.src = gifElement.src;
        };

        gifElement.addEventListener('ended', restartGif);

        return () => {
            gifElement.removeEventListener('ended', restartGif);
        };
    }, []);
    return (
        <>
            <HeaderFormUser />
            <div className='error-page'>
                <h1>Có vẻ như chúng tôi không tìm được trang bạn cần</h1>
                <p>Dưới đây là một số liên kết hữu ích để thay thế:</p>
                <Link to='/' className='link-tag-error'>
                    <h3>Nhà</h3>
                </Link>
                <Link className='link-tag-error'
                    to='https://www.airbnb.com.vn/help/article/2503#article-content'>
                    <h3>Đi lại cùng Airbnb</h3>
                </Link>
                <Link className='link-tag-error'
                    to='https://www.airbnb.com.vn/help/article/2503#article-content'>
                    <h3>Đón tiếp khách trên Airbnb</h3>
                </Link>
                <Link className='link-tag-error'
                    to='https://www.airbnb.com.vn/help/article/2503#article-content'>
                    <h3>Tin cậy và an toàn</h3>
                </Link>
                <Link className='link-tag-error'
                    to='https://www.airbnb.com.vn/help/article/2503#article-content'>
                    <h3>Sơ đồ trang web</h3>
                </Link>
                <div className='img-tag-error'>
                    <img autoplay id='gif-element' src="https://a0.muscache.com/airbnb/static/error_pages/404-Airbnb_final-d652ff855b1335dd3eedc3baa8dc8b69.gif" alt="" loop />
                </div>
            </div>
            <FooterFormUser />
        </>
    )
}

export default Error