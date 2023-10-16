import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../../Hooks/FireBase.config';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from 'react-hook-form'
import UserService from './../../Services/UserService';

const schema = yup.object({
    firstName: yup.string().required("Bắt buộc điền tên."),
    lastName: yup.string().required("Bắt buộc phải điền họ."),
    // dob: yup.string().date().required("Chọn ngày sinh của bạn để tiếp tục."),
    dob: yup.string().required("Chọn ngày sinh của bạn để tiếp tục.").test('is-over-18', 'Bạn phải từ 18 tuổi trở lên để có thể dùng Airbnb. Những người khác sẽ không thấy được ngày sinh của bạn.', (value) => {
        const currentDate = new Date();
        const selectedDate = new Date(value);
        const minAgeDate = new Date();
        minAgeDate.setFullYear(currentDate.getFullYear() - 18);

        return (
            selectedDate instanceof Date &&
            !isNaN(selectedDate) &&
            selectedDate <= minAgeDate
        );
    }),
    email: yup.string().email("Nhập địa chỉ email hợp lệ.").required("Bắt buộc phải điền email.")
})

export default function FormLogin() {
    const [valueOTP, setValueOTP] = useState("");
    const [phone, setPhone] = useState("123456");
    const [count, setCount] = useState(0);
    const [user, setUser] = useState(null);
    const [showPage, setShowPage] = useState(0)
    const [formatPhone, setFormatPhone] = useState("");
    let content;

    const { register, formState: { errors }, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema)
    })

    const handleCreateUser = async (data) => {
        data.preventDefault();
        data = {
            ...data,
            phone: phone
        }
        UserService.register(data);
    }

    useEffect(() => {
        const countDown = setInterval(() => {
            setCount((prevCount) => prevCount - 1);
        }, 1000);
        UserService.loginUser(phone)
        return () => {
            clearInterval(countDown);
        };
    }, []);



    function onOTPVerify() {
        window.confirmationResult
            .confirm(valueOTP)
            .then(async (res) => {
                console.log(await UserService.loginUser(res.user.phoneNumber));
                if (await UserService.loginUser(res.user.phoneNumber)) {
                    setShowPage(2);
                }
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
                setShowPage(1);
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

    switch (showPage) {
        case 0: content = (
            <div>
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
                <div className='p-3'>
                    <div><h3>Chào mừng bạn đến với Airbnb</h3>
                        <div className='py-3' >
                            <div className='form-input'>
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
            </div>
        );
            break;
        case 1: content = (
            <div>
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
                <body className='p-3'>
                    <div className='py-3'>Nhập mã gồm 6 chữ số mà Airbnb vừa gửi tới số: {formatPhone}</div>
                    <div>
                        <input className='input-otp p-3' maxLength="6" type="tel" value={valueOTP} placeholder='------' onChange={(e) => setValueOTP(e?.target?.value)} />
                    </div>
                </body>
                <footer className='px-4' style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>Bạn chưa nhận được tin nhắn? {count > 0 ? <span style={{ fontWeight: 'bold' }}>Gửi lại sau {count} giây</span> : <span style={{ fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }}>Gửi lại</span>} </div>
                    <button onClick={onOTPVerify} type="button" className='button-next-modal my-4 py-2 px-3'>Tiếp tục</button>
                </footer>
            </div>
        );
            break;
        case 2: content = (
            <div>
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
                            <div>Hoàn tất đăng ký</div>
                        </h4>
                    </div>
                    <div />
                </header>
                <div className='p-3'>
                    <form onSubmit={handleSubmit(handleCreateUser)}>
                        <div className='form-input'>
                            <div className='row m-0'>
                                <label className='pl-1 m-0' style={{ borderBottom: "1px solid" }}>
                                    <div className="input-group my-2">
                                        <div>Tên</div>
                                        <input type="text" className='ml-1 input-data' placeholder="Tên" {...register("firstName")} />
                                    </div>
                                </label>
                                <label className='pl-1 m-0'>
                                    <div className="input-group my-2">
                                        <div>Họ</div>
                                        <input type="text" className='ml-1 input-data' placeholder="Họ" {...register("lastName")} />
                                    </div>
                                </label>
                            </div>
                        </div>
                        {errors?.firstName?.message &&
                            <div className='text-danger d-flex pt-1'>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-label="Lỗi" role="img" focusable="false" style={{ display: 'block', height: '14px', width: '14px', fill: 'currentcolor' }}>
                                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 10.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm.8-6.6H7.2v5.2h1.6z" />
                                    </svg>
                                </span>
                                <div className="pb-2 ml-1" style={{ fontSize: "12px" }}>{errors?.firstName?.message}</div>
                            </div>
                        }
                        {errors?.lastName?.message && !errors?.firstName?.message &&
                            <div className='text-danger d-flex pt-1'>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-label="Lỗi" role="img" focusable="false" style={{ display: 'block', height: '14px', width: '14px', fill: 'currentcolor' }}>
                                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 10.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm.8-6.6H7.2v5.2h1.6z" />
                                    </svg>
                                </span>
                                <div className="pb-2 ml-1" style={{ fontSize: "12px" }}>{errors?.lastName?.message}</div>
                            </div>}
                        {errors?.lastName?.message || errors?.firstName?.message ? "" : (<div className="pb-2" style={{ fontSize: "12px" }}>Đảm bảo rằng tên bạn nhập khớp với tên trên giấy tờ tùy thân do chính phủ cấp của bạn.</div>)}
                        <div className='form-input'>
                            <label className='pl-1 m-0'>
                                <div className="input-group my-2">
                                    <div>Ngày sinh</div>
                                    <input type="date" className='ml-1 input-data' style={{ width: "50%" }} {...register("dob")} />
                                </div>
                            </label>
                        </div>
                        {errors?.dob?.message ?
                            <div className='text-danger d-flex pt-1'>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-label="Lỗi" role="img" focusable="false" style={{ display: 'block', height: '14px', width: '14px', fill: 'currentcolor' }}>
                                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 10.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm.8-6.6H7.2v5.2h1.6z" />
                                    </svg>
                                </span>
                                <div className="pb-2 ml-1" style={{ fontSize: "12px" }}>{errors?.dob?.message}</div>
                            </div>
                            :
                            <div className="pb-2 ml-1" style={{ fontSize: "12px" }}>Để đăng ký, bạn phải đủ 18 tuổi trở lên. Ngày sinh của bạn sẽ không được chia sẻ với người dùng Airbnb khác.</div>
                        }
                        <div className='form-input'>
                            <label className='pl-1 m-0'>
                                <div className="input-group my-2">
                                    <div>Email</div>
                                    <input type="text" className='ml-1 input-data' style={{ width: "80%" }} placeholder="Email" {...register("email")} />
                                </div>
                            </label>
                        </div>
                        {errors?.email?.message ?
                            <div className='text-danger d-flex pt-1'>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-label="Lỗi" role="img" focusable="false" style={{ display: 'block', height: '14px', width: '14px', fill: 'currentcolor' }}>
                                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm0 10.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm.8-6.6H7.2v5.2h1.6z" />
                                    </svg>
                                </span>
                                <div className="pb-2 ml-1" style={{ fontSize: "12px" }}>{errors?.email?.message}</div>
                            </div>
                            :
                            <div className="pb-2 ml-1" style={{ fontSize: "12px" }}>Chúng tôi sẽ gửi phiếu thu và xác nhận chuyến đi qua email cho bạn.</div>
                        }
                        <div>
                            <button type="submit" className='button-next-login py-2 px-3'>Đồng ý và tiếp tục</button>
                        </div>
                    </form>

                    <div className='my-3' style={{ borderBottom: "1px solid rgb(207 207 207)" }}></div>
                    <div style={{ fontSize: "12px" }}>
                        Airbnb sẽ gửi cho bạn các ưu đãi chỉ dành cho thành viên, bài viết truyền cảm hứng, email tiếp thị và thông báo đẩy. Bạn có thể chọn không nhận các thông tin này bất kỳ lúc nào trong cài đặt tài khoản của mình hoặc trực tiếp từ thông báo tiếp thị
                    </div>
                </div >

            </div >
        )
            break;
    }

    return (
        <>
            <div id="recaptcha-container"></div>
            {content}

        </>
    )
}
