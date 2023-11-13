import React, { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Button, Dropdown, DropdownButton, Form, InputGroup, Table } from "react-bootstrap";
import useFetchListHouseCancel from "../../../Hooks/admin/listHouse/useFetchListHouseCancel";
import axios from "axios";
import emailjs from '@emailjs/browser';
import { API_ADMIN } from './../../../Services/common';


const reloadPage = () => {
    window.location.reload();
};
const SERVICE_ID = "service_jvlas79";
const TEMPLATE_ID = "template_ui2iuli";
const PUBLIC_KEY = "ZrnhuJTlDmN2xJsgA";
const HouseBan = () => {
    const [houses, setHouses] = useState([]);
    const [totalPage, setTotalPage] = useState(1);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(3);
    const [search, setSearch] = useState("");
    const [nameField, setNameField] = useState("id");
    const [type, setType] = useState('DESC');
    const [houseUnlock, setHouseUnlock] = useState({})

    const data = useFetchListHouseCancel(search, page, size, nameField, type);

    useEffect(() => {
        let timeout;

        if (data) {
            timeout = setTimeout(() => {
                setHouses(data.content);
                setTotalPage(data.totalPages)

            }, 200)
        }
        return (() => {
            clearTimeout(timeout);
        })


    }, [data])

    const handleChange = (event, value) => {
        setPage(value);
    };

    const handleSearch = (value) => {
        setSearch(value)

    }

    const handleSortAtoZ = () => {
        setNameField("hotelName");
        setType("ASC")
    }

    const handleSortZtoA = () => {
        setNameField("hotelName");
        setType("DESC");
    }

    const handleUnlockHouse = async (item) => {
        item.status = 'ACCEPTED';

        await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
            admin: "AirBnb",
            name: item.user.lastName || item.user.firstName,
            message: `We're so glad to report this news.
            Your house ${item.hotelName} have been unlocked to business on our platform.
            
            If you have any response, please call 00000000
            `
        }, PUBLIC_KEY).then((result) => {
            console.log("Send Email Success", result);
            setHouseUnlock(item)
        }).catch(error => {
            console.log("Send Email Fail", error);
        })


    }

    useEffect(() => {
        const sendData = async () => {
            await axios.patch(API_ADMIN + `houses/set-status/${houseUnlock.id}`, houseUnlock).then((response) => {
                console.log(response);
            }).catch(error => {
                console.log("Patch Error", error);
            });

        }
        if (houseUnlock && houseUnlock.id) {
            sendData();
            reloadPage();
        }
    }, [houseUnlock])

    return (
        <div className="container">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Houses Ban</h1>
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
                                    <button className="btn btn-outline-success" data-bs-toggle="modal" data-bs-target={`#staticDeny${index}`}>
                                        <i className="fa-solid fa-lock-open me-2"></i>
                                        Unlock
                                    </button>


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
                                                    <p>Do you want to unlock this {house.hotelName}?</p>
                                                </div>
                                                <div className="modal-footer">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        data-bs-dismiss="modal"
                                                    >
                                                        Close
                                                    </button>
                                                    <button onClick={() => handleUnlockHouse(house)} type="button" className="btn btn-success">
                                                        Unlock
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
            </div>
            <div className="d-flex justify-content-center">
                <Stack spacing={2}>
                    <Typography>Page: {page}</Typography>
                    <Pagination count={totalPage} page={page} onChange={handleChange} color="secondary" />
                </Stack>
            </div>
        </div>
    )
}

export default HouseBan;