import React, { useState, useEffect, useRef } from 'react'
import HeaderFormUser from '../HeaderFormUser'
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { API_UPDATE_USER_INFO } from '../../../Services/common';
import { Link } from 'react-router-dom';

const Identity = () => {
    const [result, setResult] = useState(null);

    const [loadingCheckImg, setIsLoadingCheckImg] = useState(false);
    const [failCheckSimilar, setFailCheckSimilar] = useState(false);
    const [isOverLayFailCheckSimilar, setIsOverLayFailCheckSimilar] = useState(false);
    const [isOverLaySuccessCheckSimilar, setIsOverLaySuccessCheckSimilar] = useState(false);

    const toggleFailCheckSimilar = () => {
        setIsOverLayFailCheckSimilar(!isOverLayFailCheckSimilar);
    }

    const toggleSuccessCheckSimilar = () => {
        setIsOverLaySuccessCheckSimilar(!isOverLaySuccessCheckSimilar);
    }

    const checkSimilarity = async () => {
        setIsLoadingCheckImg(true);

        // const blob = new Blob([uploadedImageFront], { type: uploadedImageFront.type });
        // const file = new File([blob], uploadedImageFront.name, { type: uploadedImageFront.type });
        // const blob2 = new Blob([uploadedImageBack], { type: uploadedImageFront.type });
        // const file2 = new File([blob2], uploadedImageBack.name, { type: uploadedImageBack.type });

        const imageFront = document.getElementById('imageFront');
        const imageWebcam = document.getElementById('imageWebcam');

        if (imageFront && imageWebcam) {
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

            const detectionFront = await faceapi.detectSingleFace(imageFront, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
            const detectionWebcam = await faceapi.detectSingleFace(imageWebcam, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

            if (detectionFront && detectionWebcam) {
                const up1 = await uploadImgToCloud(uploadedImageFront[0])
                const up2 = await uploadImgToCloud(uploadedImageBack[0])

                const faceMatcher = new faceapi.FaceMatcher([detectionFront.descriptor]);
                const match = faceMatcher.findBestMatch(detectionWebcam.descriptor);

                const similarityPercentage = (1 - match._distance) * 100;
                console.log(`Sự tương tự: ${similarityPercentage.toFixed(2)}%`);

                if (match.distance <= 0.45) {
                    setResult(`Sự tương tự: ${match.toString()}`);

                    const srcImgFrontSide = up1.data.url;
                    const srcImgBackSide = up2.data.url;

                    await handleSaveChanges(srcImgFrontSide, srcImgBackSide)

                    const updateUserInfo = JSON.parse(localStorage.getItem('userInfo'));

                    if (!updateUserInfo) {
                        updateUserInfo = {};
                    }

                    if (!updateUserInfo.identity) {
                        updateUserInfo.identity = {};
                    }

                    updateUserInfo.identity.srcImgFrontSide = srcImgFrontSide || null;
                    updateUserInfo.identity.srcImgBackSide = srcImgBackSide || null;

                    localStorage.setItem('userInfo', JSON.stringify(updateUserInfo))

                    setIsLoadingCheckImg(false);
                    setIsOverLaySuccessCheckSimilar(true);
                } else {
                    setResult('Không nhận diện được khuôn mặt');
                    console.error('Không nhận diện được khuôn mặt');
                    setIsLoadingCheckImg(false);
                    setIsOverLayFailCheckSimilar(true)
                }
            } else {
                setResult('Không nhận diện được khuôn mặt');
                console.error('Không nhận diện được khuôn mặt');
                setIsLoadingCheckImg(false);
                setIsOverLayFailCheckSimilar(true)
            }
        }


    };

    const webcamRef = useRef(null);
    const [uploadedImageFront, setUploadedImageFront] = useState(null);
    const [uploadedImageBack, setUploadedImageBack] = useState(null);
    const [isWebcamActive, setIsWebcamActive] = useState(false);

    const [isOpenDiv, setIsOpenDiv] = useState({
        step1: true,
        step2: false,
        step3: false,
        step4: false
    })

    const handleToggleStep = (step) => {
        setIsOpenDiv(prev => ({
            step1: step === 'step1',
            step2: step === 'step2',
            step3: step === 'step3',
            step4: step === 'step4'
        }))
    }

    const handleBack = () => {
        if (isOpenDiv.step4) {
            handleToggleStep('step3');
        } else if (isOpenDiv.step3) {
            handleToggleStep('step2');
        } else if (isOpenDiv.step2) {
            handleToggleStep('step1');
        }
    }

    const handleDeleteImageFront = () => {
        setUploadedImageFront(null)
    }

    const handleDeleteImageBack = () => {
        setUploadedImageBack(null);
    };

    const [loadingUploadImg, setLoadingUploadImg] = useState(false)
    const [loadingUploadImg2, setLoadingUploadImg2] = useState(false)

    const onDropFront = (acceptedFiles) => {
        setLoadingUploadImg(true);
        setTimeout(() => {
            const images = acceptedFiles
                .filter(file => file.type.includes('image/'));
            setUploadedImageFront(images);
            setLoadingUploadImg(false)
        }, 500)
    };
    const onDropBack = (acceptedFiles) => {
        setLoadingUploadImg2(true);
        setTimeout(() => {
            const images = acceptedFiles.filter(file => file.type.includes('image/'));
            setUploadedImageBack(images);
            setLoadingUploadImg2(false)
        }, 500)

    };

    const { getRootProps: getRootProps1, getInputProps: getInputProps1 } = useDropzone({
        onDrop: onDropFront,
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        maxFiles: 1
    });

    const { getRootProps: getRootProps2, getInputProps: getInputProps2 } = useDropzone({
        onDrop: onDropBack,
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        maxFiles: 1
    });

    const toggleWebcam = () => {
        setIsWebcamActive(!isWebcamActive);
    };

    const [capturedImage, setCapturedImage] = useState(null);

    const [countdown, setCountdown] = useState(0);

    const startCountdown = () => {
        let counter = 3;
        setCountdown(counter);

        const interval = setInterval(() => {
            counter -= 1;
            setCountdown(counter);

            if (counter === 0) {
                clearInterval(interval);
                handleCapture();
            }
        }, 1000)
    }

    const uploadImgToCloud = (avatarFile) => {
        const formData = new FormData();
        formData.append("file", avatarFile);
        formData.append("upload_preset", "iywrjs6b");
        return axios.post('https://api-ap.cloudinary.com/v1_1/dw6kopnfo/image/upload', formData)
    }

    const handleCapture = () => {
        if (isWebcamActive) {
            const screenshot = webcamRef.current.getScreenshot();
            setCapturedImage(screenshot);
            setIsWebcamActive(false);
        }
    }

    const handleDeleteCapture = () => {
        setCapturedImage(null);

        setIsWebcamActive(true);
    }

    const handleSaveChanges = async (value, value2) => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await axios.patch(API_UPDATE_USER_INFO, {
                identity: {
                    "srcImgFrontSide": value,
                    "srcImgBackSide": value2
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                console.log('Cập nhật thành công');
            } else {
                console.error('Cập nhật không thành công');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <HeaderFormUser />
            <div className='div-identity-verify'>
                {
                    isOpenDiv.step1 && (
                        <div>
                            <div className='div-identity-step1'>
                                <h2>Chọn một loại giấy tờ tùy thân để thêm vào</h2>
                                <div style={{ width: '50%' }}>
                                    <RadioGroup aria-label="Your plan" name="people" defaultValue="Giấy tờ tuỳ thân">
                                        <List
                                            sx={{
                                                minWidth: 240,
                                                '--List-gap': '0.5rem',
                                                '--ListItem-paddingY': '1rem',
                                                '--ListItem-radius': '8px',
                                                '--ListItemDecorator-size': '32px',
                                                border: 'none', outline: 'none'
                                            }}
                                        >
                                            {['Giấy phép lái xe', 'Hộ chiếu', 'Giấy tờ tuỳ thân'].map((item, index) => (
                                                <ListItem variant="outlined" key={item} sx={{ boxShadow: 'sm' }}>
                                                    <ListItemDecorator>
                                                        {[<i className="fa-solid fa-car"></i>, <i className="fa-solid fa-passport"></i>, <i className="fa-solid fa-user-large"></i>][index]}
                                                    </ListItemDecorator>
                                                    <Radio
                                                        overlay
                                                        value={item}
                                                        label={item}
                                                        sx={{ flexGrow: 1, flexDirection: 'row-reverse' }}
                                                        slotProps={{
                                                            action: ({ checked }) => ({
                                                                sx: (theme) => ({
                                                                    ...(checked && {
                                                                        inset: -1,
                                                                        border: '2px solid',
                                                                        borderColor: '#000', // Nền màu đen
                                                                        color: '#FFF'
                                                                    }),
                                                                }),
                                                            }),
                                                        }}
                                                    />
                                                    <hr />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </RadioGroup>
                                    <div className='div-contains-btn-continue-and-back'>
                                        <Link to={'/account-settings/personal-info'}>
                                            <button className='btn-back-to-step-identity'><i className="fa-solid fa-angle-left"></i> Quay lại</button>
                                        </Link>
                                        <button onClick={() => handleToggleStep('step2')}
                                            className='btn-continue-to-step-identity'>Tiếp tục</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    isOpenDiv.step2 && (
                        <div className='div-identity-step2'>
                            <h2>Tải lên ảnh giấy tờ tùy thân của bạn</h2>
                            <div className='dropzone-container'>
                                <h3>Đảm bảo ảnh của bạn không bị nhòe, mờ và mặt trước giấy tờ tùy thân thể hiện rõ khuôn mặt bạn.</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                                    {
                                        loadingUploadImg ? (
                                            <div className="loadingio-spinner-spinner-tb47fg7vz6o"><div className="ldio-h59lw1on0l">
                                                <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                                            </div></div>
                                        ) :
                                            uploadedImageFront ? (
                                                <div {...getRootProps1()} className='dropzone div-upload-image-identity div-hover-img-front' >
                                                    <input {...getInputProps1()} />
                                                    <div>
                                                        {Object.values(uploadedImageFront).map((file, index) => (
                                                            <div key={index}>
                                                                <img id='imageFront' className='img-uploaded-indentity'
                                                                    src={URL.createObjectURL(file)} alt={`Uploaded Image ${index}`} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div {...getRootProps1()} className='dropzone div-upload-image-identity' >
                                                    <input {...getInputProps1()} />
                                                    <div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "32px", width: "32px", fill: "currentcolor" }}><path d="M29 5a2 2 0 0 1 2 1.85V25a2 2 0 0 1-1.85 2H3a2 2 0 0 1-2-1.85V7a2 2 0 0 1 1.85-2H3zm0 2H3v18h26zm-3 12v2h-8v-2zm-16-8a3 3 0 0 1 2.5 4.67A5 5 0 0 1 15 20h-2a3 3 0 0 0-2-2.83V14a1 1 0 0 0-2-.12v3.29A3 3 0 0 0 7 20H5a5 5 0 0 1 2.5-4.33A3 3 0 0 1 10 11zm16 4v2h-8v-2zm0-4v2h-8v-2z"></path></svg>
                                                            <h3>Tải lên ảnh mặt trước</h3>
                                                            <p>Chỉ định dạng JPEG hoặc PNG</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                    }

                                    {
                                        loadingUploadImg2 ? (
                                            <div className="loadingio-spinner-spinner-tb47fg7vz6o"><div className="ldio-h59lw1on0l">
                                                <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                                            </div></div>
                                        ) :
                                            uploadedImageBack ? (
                                                <div {...getRootProps2()} className='dropzone div-upload-image-identity'>
                                                    <input {...getInputProps2()} />
                                                    <div>
                                                        {Object.values(uploadedImageBack).map((file, index) => (
                                                            <div key={index}>
                                                                <img className='img-uploaded-indentity'
                                                                    src={URL.createObjectURL(file)} alt={`Uploaded Image ${index}`} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div {...getRootProps2()} className='dropzone div-upload-image-identity'>
                                                    <input {...getInputProps2()} />
                                                    <div >
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "32px", width: "32px", fill: "currentcolor" }}><path d="M29 5a2 2 0 0 1 2 1.85V25a2 2 0 0 1-1.85 2H3a2 2 0 0 1-2-1.85V7a2 2 0 0 1 1.85-2H3zm0 6H3v14h26zm-3 10a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7-14H3v2h26z"></path></svg>
                                                            <h3>Tải lên ảnh mặt sau</h3>
                                                            <p>Chỉ định dạng JPEG hoặc PNG</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                    }
                                    {
                                        uploadedImageFront && (
                                            <div className='btn-close-image-front'
                                                onClick={() => handleDeleteImageFront()}><i className="fa-regular fa-circle-xmark btn-close-image-front"></i></div>
                                        )
                                    }
                                    {
                                        uploadedImageBack && (
                                            <div className='btn-close-image-back'
                                                onClick={() => handleDeleteImageBack()}><i className="fa-regular fa-circle-xmark"></i></div>
                                        )
                                    }
                                </div>
                            </div>

                            <hr style={{ marginTop: '8%' }} />
                            <div className='div-contains-btn-continue-and-back'>
                                <button onClick={(() => handleBack())}
                                    className='btn-back-to-step-identity'><i className="fa-solid fa-angle-left"></i> Quay lại</button>
                                <button style={{ display: 'flex', alignItems: 'center' }}
                                    onClick={() => handleToggleStep('step3')}
                                    className='btn-continue-to-step-identity'
                                    disabled={uploadedImageBack === null || uploadedImageFront === null}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "13px", width: "13px", fill: "currentcolor" }}><path d="M10.25 4a2.25 2.25 0 0 0-4.5-.15V6h-1.5V4a3.75 3.75 0 0 1 7.5-.2V6H13a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h7.25V4z"></path></svg>
                                    Tiếp tục</button>
                            </div>
                        </div>
                    )
                }

                {
                    isOpenDiv.step3 && (
                        <div className='div-identity-step2'>
                            <h2>Tiếp theo, bạn hãy tự chụp ảnh mình</h2>
                            <div className='dropzone-container'>
                                <p>Chúng tôi sẽ đối chiếu ảnh chụp này với ảnh trên giấy tờ tùy thân của bạn để xác nhận đó chính là bạn.</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                                </div>
                            </div>

                            <hr style={{ marginTop: '28%' }} />
                            <div className='div-contains-btn-continue-and-back'>
                                <button onClick={(() => handleBack())}
                                    className='btn-back-to-step-identity'><i className="fa-solid fa-angle-left"></i> Quay lại</button>
                                <button style={{ display: 'flex', alignItems: 'center' }}
                                    onClick={() => handleToggleStep('step4')}
                                    className='btn-continue-to-step-identity'
                                    disabled={uploadedImageBack === null || uploadedImageFront === null}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "13px", width: "13px", fill: "currentcolor" }}><path d="M10.25 4a2.25 2.25 0 0 0-4.5-.15V6h-1.5V4a3.75 3.75 0 0 1 7.5-.2V6H13a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h7.25V4z"></path></svg>
                                    Tiếp tục</button>
                            </div>
                        </div>
                    )
                }

                {
                    isOpenDiv.step4 && (
                        <div className='div-identity-step3'>
                            <div className='detail-div-personal-info'>
                                <div>
                                    <h2>Hãy tự chụp ảnh mình</h2>
                                    <div style={{ display: 'none' }}>
                                        {Object.values(uploadedImageFront).map((file, index) => (
                                            <div key={index}>
                                                <img id='imageFront' className='img-uploaded-indentity'
                                                    src={URL.createObjectURL(file)} alt={`Uploaded Image ${index}`} />
                                            </div>
                                        ))}
                                    </div>
                                    <p>Hãy thử giữ thiết bị thẳng trước mặt bạn hoặc nhờ bạn bè chụp cho bạn. Đảm bảo toàn bộ khuôn mặt đều hiện trong khung hình.</p>
                                    <div>
                                        <h3 onClick={toggleWebcam} className='edit-tag-personal-info'>
                                            {isWebcamActive ? 'Tắt Webcam' : 'Mở Webcam'}
                                        </h3>
                                        <div className='webcam-container'>
                                            {
                                                capturedImage ? (
                                                    <div>
                                                        <h3>Xem lại ảnh của bạn</h3>
                                                        <p>Đảm bảo ảnh đủ ánh sáng, rõ ràng và trùng khớp với người trên giấy tờ tùy thân.</p>
                                                        <img id='imageWebcam' src={capturedImage} alt='Captured ID' />
                                                    </div>
                                                ) : (
                                                    isWebcamActive && (
                                                        <div>
                                                            <Webcam ref={webcamRef}
                                                                videoConstraints={{ width: 500, height: 350 }} />
                                                        </div>
                                                    )
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div>

                                </div>
                            </div>
                            <hr />
                            {
                                capturedImage ? (
                                    <div className='div-contains-btn-continue-and-back'>
                                        <button onClick={(() => handleDeleteCapture())}
                                            className='btn-back-to-step-identity'>Chụp lại ảnh
                                        </button>
                                        {
                                            loadingCheckImg ? (
                                                <div className="loadingio-spinner-ellipsis-9qckgagjpyq"><div className="ldio-mqwte4ljm49">
                                                    <div></div><div></div><div></div><div></div><div></div>
                                                </div></div>
                                            ) : (
                                                <button onClick={
                                                    checkSimilarity
                                                }
                                                    className=' btn-continue-to-step-identity'><i className="fa-solid fa-camera"></i> Gửi ảnh
                                                </button>
                                            )
                                        }


                                    </div>
                                ) : countdown > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <h1>Giữ nguyên nhé...</h1>
                                        <h2>{countdown}</h2>
                                    </div>
                                ) : (
                                    <div className='div-contains-btn-continue-and-back'>
                                        <button onClick={(() => handleBack())}
                                            className='btn-back-to-step-identity'><i className="fa-solid fa-angle-left"></i> Quay lại</button>
                                        <button onClick={() => startCountdown()} disabled={isWebcamActive === false}
                                            className=' btn-continue-to-step-identity'><i className="fa-solid fa-camera"></i> Chụp ảnh</button>

                                    </div>
                                )
                            }
                        </div >
                    )
                }

                {(
                    <div className={`overlay2 ${isOverLayFailCheckSimilar ? '' : 'd-none'}`} >
                        <div className={`appearing-div ${isOverLayFailCheckSimilar ? 'active' : ''}`}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <h2><i style={{ fontSize: '33px' }} className="fa-solid fa-circle-exclamation"></i></h2>
                            </div>
                            <hr />
                            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                <img style={{ width: '20%' }} src="data:image/png;base64,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" alt="" />
                                <h2>Xác minh thất bại. Vui lòng thử lại</h2>
                            </div>
                            <hr />
                            <div style={{ textAlign: 'right' }}>
                                <button onClick={toggleFailCheckSimilar}
                                    className='btn-back-and-restar-check-similar-img'>Thử lại</button>
                            </div>

                        </div>
                    </div>
                )}

                {(
                    <div className={`overlay2 ${isOverLaySuccessCheckSimilar ? '' : 'd-none'}`} >
                        <div className={`appearing-div ${isOverLaySuccessCheckSimilar ? 'active' : ''}`}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <h2><i style={{ fontSize: '33px' }} className="fa-regular fa-circle-check"></i></h2>
                            </div>
                            <hr />
                            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                                <img style={{ width: '20%' }} src="data:image/png;base64,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" alt="" />
                                <h2>Xác minh thành công</h2>
                            </div>
                            <hr />
                            <div style={{ textAlign: 'right' }}>
                                <Link to={'/account-settings/personal-info'}>
                                    <button onClick={toggleSuccessCheckSimilar}
                                        className='btn-back-and-restar-check-similar-img'>Hoàn tất
                                    </button>
                                </Link>
                            </div>

                        </div>
                    </div>
                )}


            </div >
        </>
    )
}

export default Identity