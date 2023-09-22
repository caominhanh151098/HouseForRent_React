import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import UserService from '../../Services/UserService';
import { auth } from '../../Hooks/FireBase.config';

export default function FormLogin() {
    const [valueOTP, setValueOTP] = useState("");
    const [phone, setPhone] = useState("");
    const [count, setCount] = useState(0);
    const [user, setUser] = useState(null);
    const [showOTP, setShowOTP] = useState(false)
    const [formatPhone, setFormatPhone] = useState("");

    useEffect(() => {
        const countDown = setInterval(() => {
            setCount((prevCount) => prevCount - 1);
        }, 1000);

        return () => {
            clearInterval(countDown);
        };
    }, []);

    function onOTPVerify() {
        window.confirmationResult
            .confirm(valueOTP)
            .then(async (res) => {
                setUser(res.user)
                UserService.loginOrRegister(1, res.user.accessToken);
                console.log(res.user);
            }).catch((err) => {
                console.log(err)
            })
    }

    const onSignup = () => {
        onCaptchVerify()
        const appVerifier = window.applicationVerifier
        const formatPhone = '+84' + phone;
        setFormatPhone(formatPhone);

        signInWithPhoneNumber(auth, formatPhone, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                console.log(confirmationResult);
                setShowOTP(true);
            }).catch((error) => {
                console.log(error);
            });
    }

    const onSignUpAgain = () => {
        setCount(60);
        onSignup();
    }

    function onCaptchVerify() {
        if (!window.applicationVerifier) {
            window.applicationVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': "invisible",
                'callback': (response) => {
                    onSignup();
                },
                'expired-callback': () => {
                }
            });
        }
    }

    useEffect(() => {
        if (showOTP) {
            document.querySelector('.rc-anchor').style.display = 'none'
        }
    }, [showOTP])
    return (
        <>
            <div id="recaptcha-container"></div>
            {showOTP ?
                <>
                    <header style={{
                        borderBottom: '1px solid', borderTopLeftRadius: '20px',
                        borderTopRightRadius: '20px'
                    }}>
                        <button type="button" className='button-close-modal' >
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: 3, overflow: 'visible' }}>
                                    <path d="m6 6 20 20M26 6 6 26" />
                                </svg>
                            </span>
                        </button>
                        <div>
                            <h4>
                                <div>Xác nhận số điện thoại của bạn</div>
                            </h4>
                        </div>
                        <div />
                    </header>
                    <body style={{ padding: "45px" }}>
                        <div className='py-3'>Nhập mã gồm 6 chữ số mà Airbnb vừa gửi tới số: {formatPhone}</div>
                        <div><input className='input-otp p-3' maxLength="6" type="tel" value={valueOTP} placeholder='------' onChange={(e) => setValueOTP(e?.target?.value)} /></div>
                    </body>
                    <footer className='px-4' style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>Bạn chưa nhận được tin nhắn? {count > 0 ? <span style={{ fontWeight: 'bold' }}>Gửi lại sau {count} giây</span> : <span style={{ fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }}>Gửi lại</span>} </div>
                        <button onClick={onOTPVerify} type="button" className='button-next-modal my-4 py-2 px-3'>Tiếp tục</button>
                    </footer>
                </> : <>
                    <header style={{
                        borderBottom: '1px solid', borderTopLeftRadius: '20px',
                        borderTopRightRadius: '20px'
                    }}>
                        <button type="button" className='button-close-modal' >
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: 3, overflow: 'visible' }}>
                                    <path d="m6 6 20 20M26 6 6 26" />
                                </svg>
                            </span>
                        </button>
                        <div>
                            <h4>
                                <div>Đăng nhập hoặc đăng ký</div>
                            </h4>
                        </div>
                        <div />
                    </header>
                    <div style={{ padding: "45px" }}>
                        <div><h3>Chào mừng bạn đến với Airbnb</h3>
                            <div className='py-3' >
                                <div style={{ borderRadius: '8px', border: '1px solid' }}>
                                    <div>
                                        <div>
                                            <div className='m-2' >
                                                <label >
                                                    <div>
                                                        <div><span id="country-label">Quốc gia/Khu vực</span></div>
                                                    </div>
                                                    <div id="country-trigger" >Việt Nam (+84)</div>
                                                </label>
                                                <div>
                                                    <svg viewBox="0 0 18 18" role="presentation" aria-hidden="true" focusable="false" style={{ height: '16px', width: '16px', display: 'block', fill: 'currentcolor' }}><path d="m16.29 4.3a1 1 0 1 1 1.41 1.42l-8 8a1 1 0 0 1 -1.41 0l-8-8a1 1 0 1 1 1.41-1.42l7.29 7.29z" fillRule="evenodd" /></svg></div>
                                            </div>
                                            <div />
                                        </div>
                                    </div>
                                    <div>
                                        <div className='m-2' >
                                            <div>
                                                <label htmlFor="phone_number">
                                                    <div>
                                                        <div>Số điện thoại</div></div>
                                                    <div dir="ltr">
                                                        <div>
                                                            <div>+84</div>
                                                            <input onChange={(e) => setPhone(e.target?.value)} value={phone} aria-required="true" name="phone_number" id="phone_number" autoComplete="tel-national" type="tel" aria-describedby />
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: "12px", marginTop: "2px" }}>Chúng tôi sẽ nhắn tin gửi mã đến cho bạn để xác nhận số điện thoại. Có áp dụng phí dữ liệu và phí tin nhắn tiêu chuẩn.</div>
                                </div>
                            </div>
                            <button onClick={onSignup} type="button" className='button-next-login py-2 px-3'>Tiếp tục</button>
                            <div>hoặc</div>
                            <button type="button" className='button-other-login py-2 px-3 my-2'>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "20px", width: "20px" }}>
                                        <path fill="#1877F2" d="M32 0v32H0V0z"></path>
                                        <path fill="#FFF" d="M22.94 16H18.5v-3c0-1.27.62-2.5 2.6-2.5h2.02V6.56s-1.83-.31-3.58-.31c-3.65 0-6.04 2.21-6.04 6.22V16H9.44v4.63h4.06V32h5V20.62h3.73l.7-4.62z"></path>
                                    </svg>
                                </span>
                                <div style={{ flex: "0%" }}>Tiếp tục với Facebook</div>
                            </button>
                            <button type="button" className='button-other-login py-2 px-3 my-2'>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "20px", width: "20px" }}>
                                        <path fill="#4285f4" d="M24.12 25c2.82-2.63 4.07-7 3.32-11.19H16.25v4.63h6.37A5.26 5.26 0 0 1 20.25 22z"></path><path fill="#34a853" d="M5.62 21.31A12 12 0 0 0 24.12 25l-3.87-3a7.16 7.16 0 0 1-10.69-3.75z"></path>
                                        <path fill="#fbbc02" d="M9.56 18.25c-.5-1.56-.5-3 0-4.56l-3.94-3.07a12.08 12.08 0 0 0 0 10.7z"></path><path fill="#ea4335" d="M9.56 13.69c1.38-4.32 7.25-6.82 11.19-3.13l3.44-3.37a11.8 11.8 0 0 0-18.57 3.43l3.94 3.07z"></path>
                                    </svg>
                                </span>
                                <div style={{ flex: "0%" }}>Tiếp tục với Gmail</div>
                            </button>
                            <button type="button" className='button-other-login py-2 px-3 my-2'>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "20px", width: "20px", fill: "currentcolor" }}>
                                        <path d="M30.51 5.88A5.06 5.06 0 0 0 26 3H6a5.06 5.06 0 0 0-4.51 2.88A4.94 4.94 0 0 0 1 8v16a5 5 0 0 0 5 5h20a5 5 0 0 0 5-5V8a4.94 4.94 0 0 0-.49-2.12ZM6 5h20a2.97 2.97 0 0 1 1.77.6L17.95 14a2.98 2.98 0 0 1-3.9 0L4.23 5.6A2.97 2.97 0 0 1 6 5Zm23 19a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a2.97 2.97 0 0 1 .1-.74l9.65 8.27a4.97 4.97 0 0 0 6.5 0l9.65-8.27A2.97 2.97 0 0 1 29 8Z"></path>
                                    </svg>
                                </span>
                                <div style={{ flex: "0%" }}>Tiếp tục bằng email</div>
                            </button>
                        </div>
                    </div>
                </>
            }

        </>
    )
}
