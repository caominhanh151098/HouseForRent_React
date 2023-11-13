import axios from "axios";
import React, { useEffect, useState } from "react";
import us from "../../../assets/images/animat-rocket-color.gif";
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import emailjs from '@emailjs/browser';
import { Button, Dropdown, DropdownButton, Form, InputGroup, Modal, Table } from "react-bootstrap";
import { API_ADMIN } from "../../../Services/common";


const SERVICE_ID = "service_jvlas79";
const TEMPLATE_ID = "template_ui2iuli";
const PUBLIC_KEY = "ZrnhuJTlDmN2xJsgA";
const UserBan = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [size, setSize] = useState(3);
    const [user, setUser] = useState({});
    const [search, setSearch] = useState("");
    const [nameField, setNameField] = useState("id");
    const [type, setType] = useState("ASC");

    useEffect(() => {
        async function getData() {
            const response = await axios.get(API_ADMIN + `users/user_ban?search=${search}&page=${page - 1}&size=${size}&sort=${nameField},${type}`);
            setUsers(response.data.content);
            setTotalPage(response.data.totalPages);
        };
        getData()
    }, [page, size, search, nameField, type]);

    const handleChange = (event, value) => {
        setPage(value);
    };

    const handleUnlock = async (item) => {
        item.status = 'true';

        await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
            admin: "AirBNB",
            name: item.lastName || item.firstName,
            message: `We're so glad to report this news.
        Your account have been unlocked to business on our platform.
        
        If you have any response, please call 00000000.
         `
        }, PUBLIC_KEY).then((result) => {
            console.log('Send email success', result);
            setUser(item);
        }).catch((error) => {
            console.log('Send email fail', error);
        })

    }

    useEffect(() => {
        async function sendData() {
            try {
                await axios.patch(API_ADMIN + `users/update/${user.id}`, user, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            } catch (error) {
                console.log("Lỗi sendData", error);
            }
        }

        sendData();
    }, [user]);

    const handleSearch = (value) => {
        setSearch(value)
    }

    const handleSortAtoZ = () => {
        setNameField("firstName");
        setType("ASC");
    }

    const handleSortZtoA = () => {
        setNameField("firstName");
        setType("DESC");
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className='h2'>Customers</h1>
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
            <div className='table-responsive'>
                <table className='table table-striped table-sm text-center '>
                    <thead>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>First Name</th>
                            <th scope='col'>Last Name</th>
                            <th scope='col'>Email</th>
                            <th scope='col'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id}>
                                <td className='align-middle'>{(page - 1) * 5 + index + 1}</td>
                                <td style={{ width: '70px' }}>
                                    <img style={{ width: "50px", height: "50px", borderRadius: "50%" }} src={user.avatar || us} alt='img' />
                                </td>
                                <td className='align-middle' style={{ width: '200px' }}>{user.firstName}</td>
                                <td className='align-middle'>{user.lastName}</td>
                                <td className='align-middle'>{user.email}</td>
                                <td className='align-middle'>
                                    <button className='btn btn-success' data-bs-toggle="modal" data-bs-target={`#staticDeny${index}`}>
                                        <span className="fa-solid fa-unlock" style={{ color: "white" }}></span>
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
                                                    <p>Do you want to unlock {user.firstName || user.lastName} account?</p>
                                                </div>
                                                <div className="modal-footer">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        data-bs-dismiss="modal"
                                                    >
                                                        Close
                                                    </button>
                                                    <button onClick={() => handleUnlock(user)} type="button" className="btn btn-success">
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
                </table>
                <div className="d-flex justify-content-center">
                    <Stack spacing={2}>
                        <Typography>Page: {page}</Typography>
                        <Pagination count={totalPage} page={page} onChange={handleChange} siblingCount={3} color="primary" />
                    </Stack>
                </div>
            </div>
        </div>
    )

}

export default UserBan;