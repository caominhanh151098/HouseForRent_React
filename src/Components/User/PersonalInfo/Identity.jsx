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

    const checkSimilarity = async () => {
        setIsLoadingCheckImg(true);
        console.log("uploadedImageFront", uploadedImageFront);
        console.log(typeof (uploadedImageFront[0]));
        console.log("uploadedImageBack", uploadedImageBack);

        // const blob = new Blob([uploadedImageFront], { type: uploadedImageFront.type });
        // const file = new File([blob], uploadedImageFront.name, { type: uploadedImageFront.type });
        // const blob2 = new Blob([uploadedImageBack], { type: uploadedImageFront.type });
        // const file2 = new File([blob2], uploadedImageBack.name, { type: uploadedImageBack.type });
        // console.log(typeof(file));
        const up1 = await uploadImgToCloud(uploadedImageFront[0])
        console.log("up1.data.url", up1.data.url);
        const up2 = await uploadImgToCloud(uploadedImageBack[0])
        console.log("up2.data.url", up2.data.url)


        // console.log(up2);
        const imageFront = document.getElementById('imageFront');
        console.log("imageFront", imageFront);
        const imageWebcam = document.getElementById('imageWebcam');
        console.log("imageWebcam", imageWebcam);

        if (imageFront && imageWebcam) {
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

            const detectionFront = await faceapi.detectSingleFace(imageFront, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
            const detectionWebcam = await faceapi.detectSingleFace(imageWebcam, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

            console.log("detectionFront", detectionFront);
            console.log("detectionWebcam", detectionWebcam);
            if (detectionFront && detectionWebcam) {
                const faceMatcher = new faceapi.FaceMatcher([detectionFront.descriptor]);
                const match = faceMatcher.findBestMatch(detectionWebcam.descriptor);
                console.log("match", match);

                const similarityPercentage = (1 - match._distance) * 100;
                console.log(`Sự tương tự: ${similarityPercentage.toFixed(2)}%`);

                if (match.distance <= 0.6) {
                    setResult(`Sự tương tự: ${match.toString()}`);
                    console.log('nhận diện được khuôn mặt', `${match.toString()}`);

                    const srcImgFrontSide = up1.data.url;
                    const srcImgBackSide = up2.data.url;

                    await handleSaveChanges(srcImgFrontSide, srcImgBackSide)

                    const updateUserInfo = JSON.parse(localStorage.getItem('userInfo'));

                    updateUserInfo.identity.srcImgFrontSide = srcImgFrontSide || null;
                    updateUserInfo.identity.srcImgBackSide = srcImgBackSide || null;

                    localStorage.setItem('userInfo', JSON.stringify(updateUserInfo))

                    setIsLoadingCheckImg(false);
                } else {
                    setResult('Không nhận diện được khuôn mặt');
                    console.log('Không nhận diện được khuôn mặt');
                    setIsLoadingCheckImg(false);
                }
            } else {
                setResult('Không nhận diện được khuôn mặt');
                console.log('Không nhận diện được khuôn mặt');
                setIsLoadingCheckImg(false);
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

    useEffect(() => {
        console.log("uploadedImageFront", uploadedImageFront);
    }, [uploadedImageFront])
    useEffect(() => {
        console.log("uploadedImageBack", uploadedImageBack);
    }, [uploadedImageBack])

    useEffect(() => {
        console.log("capturedImage", capturedImage);
    }, [capturedImage])

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
                                                        {[<i class="fa-solid fa-car"></i>, <i class="fa-solid fa-passport"></i>, <i class="fa-solid fa-user-large"></i>][index]}
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
                                            <button className='btn-back-to-step-identity'><i class="fa-solid fa-angle-left"></i> Quay lại</button>
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
                                            <div class="loadingio-spinner-spinner-tb47fg7vz6o"><div class="ldio-h59lw1on0l">
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
                                            <div class="loadingio-spinner-spinner-tb47fg7vz6o"><div class="ldio-h59lw1on0l">
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
                                    className='btn-back-to-step-identity'><i class="fa-solid fa-angle-left"></i> Quay lại</button>
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
                                    className='btn-back-to-step-identity'><i class="fa-solid fa-angle-left"></i> Quay lại</button>
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
                                                <div class="loadingio-spinner-ellipsis-9qckgagjpyq"><div class="ldio-mqwte4ljm49">
                                                    <div></div><div></div><div></div><div></div><div></div>
                                                </div></div>
                                            ) : (
                                                <button onClick={
                                                    checkSimilarity
                                                }
                                                    className=' btn-continue-to-step-identity'><i class="fa-solid fa-camera"></i> Gửi ảnh
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
                                            className='btn-back-to-step-identity'><i class="fa-solid fa-angle-left"></i> Quay lại</button>
                                        <button onClick={() => startCountdown()} disabled={isWebcamActive === false}
                                            className=' btn-continue-to-step-identity'><i class="fa-solid fa-camera"></i> Chụp ảnh</button>

                                    </div>
                                )
                            }
                        </div >
                    )
                }


            </div >
        </>
    )
}

export default Identity