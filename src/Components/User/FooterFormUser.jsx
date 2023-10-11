import React from 'react'
import "./User.css"

const FooterFormUser = () => {
    return (
        <div className='div-footer-form-user'>
            <div className='choices-in-footer-div-form-user'>
                <div className='choice-footer-div'>
                    <h4>Hỗ trợ</h4>
                    <a className='a-tag-footer-div-form-user' href='https://www.airbnb.com.vn/help/'>Trung tâm trợ giúp</a>
                    <a className='a-tag-footer-div-form-user' href='https://www.airbnb.com.vn/help/contact-us?entry=DESKTOP_FOOTER_SAFETY'>Yêu cầu trợ giúp về vấn đề an toàn</a>
                    <a className='a-tag-footer-div-form-user' href='https://www.airbnb.com.vn/aircover'>AirCover</a>
                    <a className='a-tag-footer-div-form-user' href='https://www.airbnb.com.vn/against-discrimination'>Chống phân biệt đối xử</a>
                    <a className='a-tag-footer-div-form-user' href='https://www.airbnb.com.vn/accessibility'>Hỗ trợ người khuyết tật</a>
                    <a className='a-tag-footer-div-form-user' href='https://www.airbnb.com.vn/help/article/2701/extenuating-circumstances-policy-and-the-coronavirus-covid19'>Các tuỳ chọn huỷ</a>
                    <a className='a-tag-footer-div-form-user' href='https://www.airbnb.com.vn/neighbors'>Báo cáo lo ngại của khu dân cư</a>
                </div>
                <div className='choice-footer-div'>
                    <h4>Đón tiếp khách</h4>
                    <a className='a-tag-footer-div-form-user' href='https://www.airbnb.com.vn/host/homes?from_footer=1'>Cho thuê nhà trên Airbnb</a>
                    <a className='a-tag-footer-div-form-user' href='https://www.airbnb.com.vn/aircover-for-hosts'>AirCover cho chủ nhà</a>
                    <a className='a-tag-footer-div-form-user' href='https://www.airbnb.com.vn/resources/hosting-homes'>Tài nguyên về đón tiếp khách</a>
                    <a className='a-tag-footer-div-form-user' href='https://www.airbnb.com.vn/help/community?s=footer'>Diễn đàn cộng đồng</a>
                    <a className='a-tag-footer-div-form-user' href='https://www.airbnb.com.vn/help/responsible-hosting'>Đón tiếp khách có trách nhiệm</a>
                </div>
                <div className='choice-footer-div'>
                    <h4>Airbnb</h4>
                    <a className='a-tag-footer-div-form-user' href='https://news.airbnb.com/'>Trang tin tức</a>
                    <a className='a-tag-footer-div-form-user' href='https://www.airbnb.com.vn/release'>Tính năng mới</a>
                    <a className='a-tag-footer-div-form-user' href='https://careers.airbnb.com/'>Cơ hội nghề nghiệp</a>
                    <a className='a-tag-footer-div-form-user' href='https://investors.airbnb.com/'>Nhà đầu tư</a>
                    <a className='a-tag-footer-div-form-user' href='https://www.airbnb.org/?locale=vi'>Chỗ ở khẩn cấp Airbnb.org</a>
                </div>
            </div>
            <hr style={{ width: '66%' }} className='hr-form-user' />
            <div className='end-point-in-div-footer'>
                <div>
                    © 2023 Airbnb, Inc.
                    <a className='a-tag-footer-div-form-user' href="https://www.airbnb.com.vn/terms/privacy_policy"> Quyền riêng tư </a>
                    <a className='a-tag-footer-div-form-user' href="https://www.airbnb.com.vn/help/article/2908"> · Điều khoản  </a>
                    <a className='a-tag-footer-div-form-user' href="https://www.airbnb.com.vn/sitemaps/v2"> · Sơ đồ trang web  </a>

                </div>
                <div style={{display:'flex', alignItems:'center'}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style={{ display: "block", height: "32px", width: "32px", fill: "currentcolor", margin:'10px' }} aria-label="Chuyển tới Facebook" role="img" focusable="false"><path d="M30 0a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"></path><path fill="#fff" d="M22.94 16H18.5v-3c0-1.27.62-2.5 2.6-2.5h2.02V6.56s-1.83-.31-3.58-.31c-3.65 0-6.04 2.21-6.04 6.22V16H9.44v4.62h4.06V32h5V20.62h3.73z"></path></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style={{ display: "block", height: "32px", width: "32px", fill: "currentcolor" }} aria-label="Chuyển tới Twitter" role="img" focusable="false"><path d="M32 4v24a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4z"></path><path fill="#fff" d="M18.66 7.99a4.5 4.5 0 0 0-2.28 4.88A12.31 12.31 0 0 1 7.3 8.25a4.25 4.25 0 0 0 1.38 5.88c-.69 0-1.38-.13-2-.44a4.54 4.54 0 0 0 3.5 4.31 4.3 4.3 0 0 1-2 .06 4.64 4.64 0 0 0 4.19 3.13A8.33 8.33 0 0 1 5.8 23a12.44 12.44 0 0 0 19.32-11.19A7.72 7.72 0 0 0 27.3 9.5a8.3 8.3 0 0 1-2.5.75 4.7 4.7 0 0 0 2-2.5c-.87.5-1.81.87-2.81 1.06a4.5 4.5 0 0 0-5.34-.83z"></path></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false"
                        style={{ display: "block", height: "42px", width: "43px", fill: "currentcolor", margin:'2px' }}>
                        <path d="M15.71 4h1.25c2.4 0 2.85.02 3.99.07 1.28.06 2.15.26 2.91.56.79.3 1.46.72 2.13 1.38.6.6 1.08 1.33 1.38 2.13l.02.06c.28.74.48 1.58.54 2.8l.01.4c.05 1.02.06 1.63.06 4.4v.92c0 2.6-.02 3.05-.07 4.23a8.78 8.78 0 0 1-.56 2.91c-.3.8-.77 1.53-1.38 2.13a5.88 5.88 0 0 1-2.13 1.38l-.06.02c-.74.28-1.59.48-2.8.53l-.4.02c-1.02.05-1.63.06-4.4.06h-.92a73.1 73.1 0 0 1-4.23-.07 8.78 8.78 0 0 1-2.91-.56c-.8-.3-1.53-.77-2.13-1.38a5.88 5.88 0 0 1-1.38-2.13l-.02-.06a8.84 8.84 0 0 1-.54-2.8l-.01-.37A84.75 84.75 0 0 1 4 16.29v-1c0-2.62.02-3.06.07-4.24.06-1.26.26-2.13.55-2.88l.01-.03c.3-.8.77-1.53 1.38-2.13a5.88 5.88 0 0 1 2.13-1.38l.06-.02a8.84 8.84 0 0 1 2.8-.54l.37-.01C12.39 4 12.99 4 15.71 4zm.91 2.16h-1.24c-2.3 0-2.91.01-3.81.05l-.42.02c-1.17.05-1.8.25-2.23.41-.56.22-.96.48-1.38.9-.4.41-.67.8-.88 1.35l-.03.06a6.7 6.7 0 0 0-.4 2.2l-.02.45c-.04.9-.05 1.53-.05 3.94v1.08c0 2.64.02 3.05.07 4.23v.07c.06 1.13.25 1.74.42 2.16.21.56.47.96.9 1.38.4.4.8.67 1.34.88l.06.03a6.7 6.7 0 0 0 2.2.4l.45.02c.9.04 1.53.05 3.94.05h1.08c2.64 0 3.05-.02 4.23-.07h.07a6.51 6.51 0 0 0 2.16-.42c.52-.19.99-.5 1.38-.9.4-.4.67-.8.88-1.34l.03-.06a6.7 6.7 0 0 0 .4-2.2l.02-.45c.04-.9.05-1.53.05-3.94v-1.09c0-2.63-.02-3.04-.07-4.22v-.07a6.51 6.51 0 0 0-.42-2.16c-.19-.52-.5-.99-.9-1.38a3.7 3.7 0 0 0-1.34-.88l-.06-.03a6.63 6.63 0 0 0-2.16-.4l-.46-.02c-.9-.04-1.5-.05-3.8-.05zM16 9.84a6.16 6.16 0 1 1 0 12.32 6.16 6.16 0 0 1 0-12.32zM16 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm6.4-3.85a1.44 1.44 0 1 1 0 2.88 1.44 1.44 0 0 1 0-2.88z">
                        </path>
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default FooterFormUser