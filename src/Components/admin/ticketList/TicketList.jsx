import React, { useEffect, useRef, useState } from "react";
import "../ticketList/TicketListCSS.css";
import rocket from "../../../assets/images/animat-rocket-color.gif";
import img from "../../../assets/images/animat-diamond-color.gif";
import img2 from "../../../assets/images/users/avatar-2.jpg"
import axios from "axios";
import jsPDF from "jspdf";
import moment from "moment/moment";
import emailjs from '@emailjs/browser';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { green } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import { Dropdown, DropdownButton, Form, InputGroup } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import "../../../../node_modules/react-toastify/dist/ReactToastify.css";

const SERVICE_ID = "service_jvlas79";
const TEMPLATE_ID = "template_hsk232n";
const PUBLIC_KEY = "ZrnhuJTlDmN2xJsgA";

function TicketList() {

    const [rocketLoading, setRocketLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [houses, setHouses] = useState([]);
    const [listImg, setListImg] = useState([]);
    const [house, setHouse] = useState({});
    const [search, setSearch] = useState(" ");
    const [sort, setSort] = useState({
        name: "hotelName",
        type: "DESC"
    });



    useEffect(() => {
        async function getData() {

            const response = await axios.get("http://localhost:8080/api/admin/houses");
            if (response) {
                const data = response.data.content;
                data.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));

                setHouses(data);
                setRocketLoading(true);
            }

        }
        getData();
    }, [houses])

    const handleSetListImg = (data) => {
        setListImg(data);
    }
    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
    };

    const handleRenderListImg = () => {
        const elements = listImg.map((img, i) => {
            if (i % 3 === 0) {
                return (
                    <div key={i}>
                        <img className="img-large" src={img.srcImg} alt={`Image ${i}`} />
                        <div className="mt-2 grid-small">
                            {listImg[i + 1] && (
                                <img className={`img-small ${listImg[i + 1] ? "" : "d-none"}`} src={listImg[i + 1].srcImg} alt={`Image ${i + 1}`} />
                            )}
                            {listImg[i + 2] && (
                                <img className={`img-small ${listImg[i + 2] ? "" : "d-none"}`} src={listImg[i + 2].srcImg} alt={`Image ${i + 2}`} />
                            )}
                        </div>
                    </div>
                )
            }
            return null;
        })
        return elements;
    }

    const handleExportPDF = async (item) => {
        if (!loading) {
            setSuccess(false);
            setLoading(true);
            const doc = new jsPDF();
            doc.setFontSize(40);
            doc.text("Biên bản xác nhận!", 10, 10);

            const pdfData = doc.output('arraybuffer');

            const pdfBlob = new Blob([pdfData], { type: 'application/pdf' });

            const formData = new FormData();
            formData.append("file", pdfBlob);

            await axios.post('https://api.cloudinary.com/v1_1/dunzabaf5/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                params: {
                    upload_preset: 'b6kmzeig'
                }
            })
                .then(async response => {
                    // item.preventDefault();
                    console.log('Upload success:', response.data);
                    const newHouse = {
                        id: item.id,
                        status: 'ACCEPTED',
                        confirmPDF: response.data.url
                    }

                    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
                        admin: "AirBNB",
                        name: item.user.lastName,
                        message: `Welcome to AirBnb.
                    Your house ${item.hotelName} have been accepted to business on our platform.
                    Hope you will successfull and make money with us.
                    Here's your confirm: ${response.data.url} `
                    }, PUBLIC_KEY).then((result) => {
                        console.log('Send Email success', result);
                    }).catch((error) => {
                        console.log('error send email', error);
                    })

                    setHouse(newHouse);
                    setSuccess(true);
                    setLoading(false);
                    toast.success('Success', {
                        position: "top-center",
                        autoClose: 2000
                    })
                })
                .catch(error => {
                    console.error('error upload PDF:', error);
                    toast.error('Lỗi upload PDF', {
                        position: "top-center",
                        autoClose: 6000
                    })
                });
        }


    };

    const handleDenyHouse = (item) => {
        const newHouse = {
            id: item.id,
            status: 'CANCEL',
            confirmPDF: " "
        }
        setHouse(newHouse);
    }



    useEffect(() => {
        async function updateData() {
            const id = house.id;
            const status = house.status;
            const pdf = house.confirmPDF;
            try {
                await axios.patch(`http://localhost:8080/api/admin/houses/update/${id}`, { status: status, confirmPDF: pdf }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

            } catch (error) {
                console.error("error patch", error);
            }
        }

        if (house.id && house.status) {
            updateData();
            houses.filter((e) => e.id === house.id);
        }
    }, [house]);

    const countDateTime = (date) => {
        const createDate = moment(date);

        const createMoment = moment(createDate, 'YYYY-MM-DD');

        const currentDate = moment();

        const daysAgo = currentDate.diff(createMoment, 'days');
        const minutesAgo = currentDate.diff(createMoment, 'minutes');
        const hoursAgo = currentDate.diff(createMoment, 'hours');

        if (daysAgo > 0) {
            return (
                <small className="texted-muted">Last update {daysAgo} days ago</small>
            )
        }
        else {
            return (
                <small className="texted-muted">Last update {hoursAgo}h{minutesAgo % 60} ago</small>
            )
        }
    }

    const handleSearch = (e) => {
        setSearch(e);
    }

    const handleSortAtoZ = () => {
        const type = {
            name: "hotelName",
            type: "DESC"
        }
        setSort(type);
    }

    const handleSortZtoA = () => {
        const type = {
            name: "hotelName",
            type: "ASC"
        }
        setSort(type);
    }

    useEffect(() => {
        let timeout;

        if (search) {
            timeout = setTimeout(() => {
                axios.get(`http://localhost:8080/api/admin/houses?search=${search}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    const data = response.data.content;
                    data.sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
                    setHouses(data);
                }).catch((e) => {
                    console.error("Lỗi search", e);
                })
            }, 2000);
        }
        return () => {
            clearTimeout(timeout)
        }
    }, [search])



    return (
        <div className="container">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Browse Tickets</h1>
            </div>
            <ToastContainer />
            <div className="col-5">
                <InputGroup className="mb-3">
                    <DropdownButton
                        variant="outline-secondary"
                        title="Sort"
                        id="input-group-dropdown-1"
                    >
                        <Dropdown.Item
                            onClick={() => handleSortAtoZ()}
                        >A-Z</Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => handleSortZtoA()}
                        >Z-A</Dropdown.Item>
                        <Dropdown.Divider />
                    </DropdownButton>
                    <Form.Control onChange={(e) => handleSearch(e.target.value || " ")} />
                </InputGroup>
            </div>
            {rocketLoading ? <div className="row row-cols-1 row-cols-md-3 g-4">
                {houses?.map((house, index) => (
                    <div className="col">

                        <div style={{ width: "350px", height: "740px" }} className="card">
                            <div id={`carouselExampleCaptions${index}`} className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-indicators">
                                    {house?.images?.map((image, i) =>
                                    (
                                        <button key={i} type="button" data-bs-target={`#carouselExampleCaptions${index}`} data-bs-slide-to={i} className={i === 0 ? "active" : ""} aria-current={i === 0 ? "true" : ""} aria-label={`Slide ${i + 1}`}></button>
                                    )
                                    )}
                                </div>
                                <div className="carousel-inner">
                                    {house?.images?.map((image, i) => (
                                        <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                                            <img src={image.srcImg} className="d-block w-100" alt="..." />
                                            <div className="carousel-caption d-none d-md-block">
                                                <h5>{image.name || ""}</h5>
                                                <p style={{ maxHeight: "3 * 1.2em", overflow: "hidden" }}>{image.description || ""}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className="carousel-control-prev"
                                    type="button"
                                    data-bs-target={`#carouselExampleCaptions${index}`}
                                    data-bs-slide="prev"
                                >
                                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button
                                    className="carousel-control-next"
                                    type="button"
                                    data-bs-target={`#carouselExampleCaptions${index}`}
                                    data-bs-slide="next"
                                >
                                    <span className="carousel-control-next-icon" aria-hidden="true" />
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{house.hotelName}</h5>
                                <p className="card-text">
                                    {house.description.listingDescription.length > 200 ? house.description.listingDescription.slice(0, 200) + "..." : house.description.listingDescription}
                                </p>
                                <p className="card-text">
                                    {house.quantityOfGuests} khách · {house.quantityOfRooms} phòng ngủ · {house.quantityOfBeds} giường · {house.quantityOfBathrooms} phòng tắm
                                </p>
                                <div>
                                    <button className="btn btn-outline-warning me-2" data-bs-toggle="modal" data-bs-target={`#exampleModal${index}`}>Detail</button>
                                    <button className="btn btn-outline-success me-2" data-bs-toggle="modal" data-bs-target={`#staticBackdrop${index}`}>Accept</button>
                                    <button className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target={`#staticDeny${index}`}>Deny</button>
                                </div>
                            </div>
                            <div className="card-footer">
                                {countDateTime(house.createDate)}

                            </div>
                        </div>
                        {/* Modal */}
                        <div
                            className="modal fade"
                            id={`exampleModal${index}`}
                            tabIndex={-1}
                            aria-labelledby={`exampleModalLabel${index}`}
                            aria-hidden="true"
                        >
                            <div className="modal-dialog modal-dialog-scrollable modal-xl">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id={`exampleModalLabel${index}`}>
                                            {house.typeRoom} · Chủ nhà {house.user.lastName} · <img src={house.user.avatar} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        />
                                    </div>
                                    <div className="modal-body">
                                        <div className="d-flex">
                                            <div className="me-2">
                                                <img className="img-house-bigger" src={house.images[0].srcImg} />

                                            </div>
                                            <div className="img-grid">
                                                {house?.images?.slice(1, 4).map((image) => (
                                                    <img className="m-2 size-of-img-house" src={image.srcImg || ""} />
                                                ))}
                                                <div data-bs-target={`#exampleModal${index}-${index}`} data-bs-toggle="modal" data-bs-dismiss="modal" className="img-overlay" onClick={() => handleSetListImg(house.images)}>
                                                    <img className="m-2 img-house-pointer" src={house.images[4].srcImg || ""} />
                                                    <div className="overlay-text">+{house.images.length - 5 || 0}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-evenly" style={{ width: "100%" }}>
                                            <div>
                                                <div className="text-center">
                                                    <h5>Tiện nghi</h5>
                                                </div>
                                                <div className="d-flex justify-content-around convenient">
                                                    {house?.comfortableList?.slice(0, 6).map((comfort) => (
                                                        <div className="d-flex convenient-detail">
                                                            <svg>
                                                                <path d={comfort.icon}></path>
                                                            </svg>
                                                            <p>{comfort.name}</p>
                                                        </div>
                                                    ))}

                                                </div>
                                            </div>
                                            <div className="vertical-line"></div>
                                            <div>
                                                <div className="text-center">
                                                    <h5>Giá cho thuê</h5>
                                                </div>

                                                <div className="price-top">
                                                    <div>
                                                        <div style={{ marginBottom: "50px" }} >
                                                            <p className="d-flex justify-content-between">Giá cơ sở: <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(house?.price))}</span></p>
                                                            <p className="d-flex justify-content-between">Phí dịch vụ dành cho khách: <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(house?.price * 0.14))}</span></p>
                                                            <div className="d-flex justify-content-center">
                                                                <hr style={{ width: "90%" }} />
                                                            </div>
                                                            <p className="d-flex justify-content-between">Giá cho khách:  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(house?.price * 0.14) + parseFloat(house?.price))}</span></p>
                                                        </div>

                                                    </div>

                                                </div>
                                                <div className="price-bot">
                                                    <p className="d-flex justify-content-between">Lợi nhuận kiếm được: <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(house?.price * 0.03) + parseFloat(house?.price * 0.14))}</span></p>
                                                </div>
                                            </div>

                                        </div>
                                        <hr />
                                        <div>
                                            <div>
                                                <h5>Giới thiệu về chỗ ở này</h5>
                                            </div>
                                            <div>
                                                <h6 className="h6">Mô tả</h6>
                                                <p>{house?.description?.listingDescription}</p>
                                                <h6 className="h6">Không gian</h6>
                                                <p>{house?.description?.space}</p>
                                                <h6 className="h6">Tiện ích đi kèm</h6>
                                                <p>{house?.description?.guestAccess}</p>
                                                {house?.description?.other && (
                                                    <>
                                                        <h6 className="h6">Thông tin khác</h6>
                                                        <p>{house?.description?.other}</p>
                                                    </>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            data-bs-dismiss="modal"
                                        >
                                            Close
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="modal fade"
                            id={`exampleModal${index}-${index}`}
                            aria-hidden="true"
                            aria-labelledby={`exampleModalToggleLabel${index}-${index}`}
                            tabIndex={-1}
                        >
                            <div className="modal-dialog modal-fullscreen">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id={`exampleModalToggleLabel${index}-${index}`}>
                                            List Image
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        />
                                    </div>
                                    <div className="modal-body d-flex justify-content-center">
                                        <div>
                                            <div className="grid-large">
                                                {handleRenderListImg()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            className="btn btn-primary"
                                            data-bs-target={`#exampleModal${index}`}
                                            data-bs-toggle="modal"
                                            data-bs-dismiss="modal"
                                        >
                                            Back to first
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <>
                            {/* Modal */}
                            <div
                                className="modal fade"
                                id={`staticBackdrop${index}`}
                                data-bs-backdrop="static"
                                data-bs-keyboard="false"
                                tabIndex={-1}
                                aria-labelledby={`staticBackdropLabel${index}`}
                                aria-hidden="true"
                            >
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id={`staticBackdropLabel${index}`}>
                                                <p className="d-flex align-items-center">
                                                    <span className="fa-solid fa-circle-exclamation fa-beat me-3"></span>
                                                    <span>Confirm Alert</span>
                                                </p>

                                            </h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            />
                                        </div>
                                        <div className="modal-body">
                                            <p>Do you want to accept this {house.hotelName}?</p>
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                data-bs-dismiss="modal"
                                            >
                                                Close
                                            </button>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>

                                                <Box sx={{ m: 1, position: 'relative' }}>
                                                    <Button
                                                        variant="contained"
                                                        sx={buttonSx}
                                                        disabled={loading}
                                                        onClick={() => handleExportPDF(house)}
                                                    >
                                                        Accept
                                                    </Button>
                                                    {loading && (
                                                        <CircularProgress
                                                            size={24}
                                                            sx={{
                                                                color: green[500],
                                                                position: 'absolute',
                                                                top: '50%',
                                                                left: '50%',
                                                                marginTop: '-12px',
                                                                marginLeft: '-12px',
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>

                        <>
                            {/* Modal */}
                            <div
                                className="modal fade"
                                id={`staticDeny${index}`}
                                data-bs-backdrop="static"
                                data-bs-keyboard="false"
                                tabIndex={-1}
                                aria-labelledby={`staticDenyLabel${index}`}
                                aria-hidden="true"
                            >
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id={`staticDenyLabel${index}`}>
                                                <p className="d-flex align-items-center">
                                                    <span className="fa-solid fa-circle-exclamation fa-beat me-3"></span>
                                                    <span>Confirm Alert</span>
                                                </p>

                                            </h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                                aria-label="Close"
                                            />
                                        </div>
                                        <div className="modal-body">
                                            <p>Do you want to deny this {house.hotelName}?</p>
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                data-bs-dismiss="modal"
                                            >
                                                Close
                                            </button>
                                            <button onClick={() => handleDenyHouse(house)} type="button" className="btn btn-danger">
                                                Deny
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>

                    </div>
                ))}

            </div>
                :
                <div className="d-flex justify-content-center">
                    <img style={{ width: "250px", height: "250px" }} src={rocket} />
                </div>}
        </div>
    )
}

export default TicketList;