import React from "react";
import '../history/HouseCSS.css'
import { Button, Dropdown, DropdownButton, Form, InputGroup, Modal, Table } from "react-bootstrap";
import useFetchListHouseAccepted from "../../../Hooks/admin/listHouse/useFetchListHouseAccepted";
import { useState } from "react";
import { useEffect } from "react";
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import axios from "axios";
import emailjs from '@emailjs/browser';
import { API_ADMIN } from "../../../Services/common";

const reloadPage = () => {
    window.location.reload();
};
const SERVICE_ID = "service_jvlas79";
const TEMPLATE_ID = "template_ui2iuli";
const PUBLIC_KEY = "ZrnhuJTlDmN2xJsgA";
const House = () => {

    const [houses, setHouses] = useState([]);
    const [totalPage, setTotalPage] = useState(1);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(3);
    const [search, setSearch] = useState("");
    const [nameField, setNameField] = useState("hotelName");
    const [type, setType] = useState('DESC');
    const [houseBlock, setHouseBlock] = useState({});

    const data = useFetchListHouseAccepted(page, size);

    const handleChange = (event, value) => {
        setPage(value);
    };



    useEffect(() => {
        if (data) {
            setHouses(data.content);
            setTotalPage(data.totalPages);
        }
    }, [data])


    const handlefilePDF = (item) => {
        window.open(item.confirmPDF, "_blank");
    }

    const handlePagination = () => {

        const pages = [];

        const startPage = Math.max(1, page - Math.floor(size / 2));
        const endPage = Math.min(totalPage, startPage + size - 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(

                <Pagination.Item active={page === i} onClick={() => handelClickPage(i)}>{i}</Pagination.Item>
            )
        }
        return pages;
    }

    const handelClickPage = (number) => {
        setPage(number);
    }
    const handleNextPage = () => {
        if (page < totalPage) {
            setPage(page + 1);
        }
    }

    const handlePrePage = () => {
        if (page >= 0) {
            setPage(page - 1)
        }
    }

    const handleSearch = (value) => {
        setSearch(value)
    }

    const handleStartPage = () => {
        if (page >= 0) {
            setPage(1)
        }
    }

    const handleEndPage = () => {
        if (page < totalPage) {
            setPage(totalPage);
        }
    }

    const handleSortAtoZ = () => {
        setNameField("hotelName");
        setType("ASC");
    }

    const handleSortZtoA = () => {
        setNameField("hotelName");
        setType("DESC");
    }

    useEffect(() => {
        let timeout;

        if (search) {
            timeout = setTimeout(async () => {
                await axios.get(API_ADMIN + `houses/accepted?search=${search}&page=${page - 1}&size=${size}&sort=${nameField},${type}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    const data = response.data.content;
                    setHouses(data);
                    setTotalPage(response.data.totalPages);
                }).catch((e) => {
                    console.error("Lỗi search", e);
                })
            }, 200);
        }
        return () => {
            clearTimeout(timeout)
        }
    }, [search, page, size, nameField, type])

    const handleBlock = async (item) => {
        item.status = 'CANCEL'
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
            admin: "AirBnb",
            name: item.user.lastName || item.user.firstName,
            message: `We're so sorry to report this news.
            Your house ${item.hotelName} have been banned to business on our platform for violating our terms.
            We will update the reason here: 
    
            If you have any response, please call 00000000
            `
        }, PUBLIC_KEY).then((result) => {
            console.log("Send Email Success", result);
            setHouseBlock(item);
        }).catch(error => {
            console.log("Send Email Fail", error);
        })
    }

    useEffect(() => {
        const sendData = async () => {
            if (houseBlock && houseBlock.id) {
                const id = houseBlock.id;
                await axios.patch(API_ADMIN + `houses/set-status/${id}`, houseBlock).then((response) => {
                    console.log(response);
                }).catch(error => {
                    console.log("Patch Error", error);
                });
            }
        }

        if (houseBlock && houseBlock.id) {
            sendData();
            reloadPage();
        }
    }, [houseBlock])


    return (

        <div className="container">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">List Houses</h1>
            </div>
            <div className="col-5">
                <InputGroup className="mb-3">
                    <DropdownButton
                        variant="outline-secondary"
                        title="Sort"
                        id="input-group-dropdown-1"
                    >
                        <Dropdown.Item
                            onClick={() => handleSortAtoZ()}
                        >A-Z
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => handleSortZtoA()}
                        >Z-A
                        </Dropdown.Item>
                        <Dropdown.Divider />
                    </DropdownButton>
                    <Form.Control onChange={(e) => handleSearch(e.target.value || " ")} />
                </InputGroup>
            </div>
            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Hotel Name</th>
                            <th>Host</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {houses?.map((house, index) => (

                            <tr key={house.id}>
                                <td>{house.hotelName}</td>
                                <td>{house.user.firstName || ""} {house.user.lastName || ""}</td>
                                <td>{house.user.email || ""}</td>
                                <td>
                                    <button onClick={() => handlefilePDF(house)} className="btn btn-outline-success me-2">Records Confirm</button>
                                    <button className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target={`#staticDeny${index}`}>Block</button>


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
                                                    <p>Do you want to block this {house.hotelName}?</p>
                                                </div>
                                                <div className="modal-footer">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        data-bs-dismiss="modal"
                                                    >
                                                        Close
                                                    </button>
                                                    <button onClick={() => handleBlock(house)} type="button" className="btn btn-danger">
                                                        Block
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>


                        ))}
                    </tbody>
                </Table>
                <div className="d-flex justify-content-center">
                    <Stack spacing={2}>
                        <Typography>Page: {page}</Typography>
                        <Pagination count={totalPage} page={page} onChange={handleChange} color="secondary" />
                    </Stack>
                </div>
            </div>
        </div>
    )
}

export default House;