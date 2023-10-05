import React, { useEffect, useState } from 'react'
import { auth } from '../../Hooks/FireBase.config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import UserService from './../../Services/UserService';

export default function OTPAddPhone() {
    const [valueOTP, setValueOTP] = useState("");
    const [phone, setPhone] = useState("");
    const [formatPhone, setFormatPhone] = useState("");
    const [user, setUser] = useState(null);
    const [showOTP, setShowOTP] = useState(false)
    const [count, setCount] = useState(0);

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
                UserService.addPhoneUser(1, res.user.accessToken);
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

    const handleChangePhone = (event) => {
        setPhone(event?.target?.value);
    }

    const handleChangeValueOTP = (event) => {
        setValueOTP(event?.target?.value);
    }

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
                        <div >
                            <h4>
                                <div>Xác nhận số điện thoại của bạn</div>
                            </h4>
                        </div>
                        <div />
                    </header>
                    <div style={{ padding: "45px" }}>
                        <div className='py-3'>Nhập mã gồm 6 chữ số mà Airbnb vừa gửi tới số: {formatPhone}</div>
                        <div><input className='input-otp p-3' maxLength="6" type="tel" value={valueOTP} placeholder='------' onChange={handleChangeValueOTP} /></div>
                        <div><button onClick={onOTPVerify} type="button" className='button-next-modal my-4 py-2 px-3'>Tiếp tục</button></div>
                        <div>Bạn chưa nhận được tin nhắn? {count > 0 ? <span style={{ fontWeight: 'bold' }}>Gửi lại sau {count} giây</span> : <span onClick={onSignUpAgain} style={{ fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }}>Gửi lại</span>} </div>

                    </div >
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
                        <div >
                            <h4>
                                <div >Thêm số điện thoại</div>
                            </h4>
                        </div>
                        <div />
                    </header>
                    <div style={{ padding: "45px" }}>
                        <div>Chúng tôi sẽ gửi cho bạn thông tin cập nhật về chuyến đi cùng một tin nhắn để xác minh số điện thoại này.
                            <div className='py-3' >
                                <div style={{ borderRadius: '8px', border: '1px solid' }}>
                                    <div >
                                        <div >
                                            <div className='m-2' >
                                                <label >
                                                    <div>
                                                        <div ><span id="country-label">Quốc gia/Khu vực</span></div>
                                                    </div>
                                                    <div id="country-trigger" >Việt Nam (+84)</div>
                                                </label>
                                                <div >
                                                    <svg viewBox="0 0 18 18" role="presentation" aria-hidden="true" focusable="false" style={{ height: '16px', width: '16px', display: 'block', fill: 'currentcolor' }}><path d="m16.29 4.3a1 1 0 1 1 1.41 1.42l-8 8a1 1 0 0 1 -1.41 0l-8-8a1 1 0 1 1 1.41-1.42l7.29 7.29z" fillRule="evenodd" /></svg></div></div>
                                            <div />
                                        </div>
                                    </div>
                                    <div>
                                        <div className='m-2' >
                                            <div >
                                                <label htmlFor="phone_number">
                                                    <div >
                                                        <div >Số điện thoại</div></div>
                                                    <div dir="ltr">
                                                        <div >
                                                            <div >+84</div>
                                                            <input onChange={handleChangePhone} value={phone} aria-required="true" name="phone_number" id="phone_number" autoComplete="tel-national" type="tel" aria-describedby />
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div >
                                    <div>Chúng tôi sẽ nhắn tin gửi mã đến cho bạn để xác nhận số điện thoại. Có áp dụng phí dữ liệu và phí tin nhắn tiêu chuẩn.</div>
                                </div>
                            </div>
                            <button onClick={onSignup} type="button" className='button-next-modal py-2 px-3'>Tiếp tục</button>
                        </div>
                    </div >
                </>}
        </>
    )
}
