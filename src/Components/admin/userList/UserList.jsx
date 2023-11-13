import axios from "axios";
import React, { useEffect, useState } from "react";
import us from "../../../assets/images/animat-rocket-color.gif";
import emailjs from '@emailjs/browser';
import { result } from "lodash";
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { API_ADMIN } from "../../../Services/common";


const SERVICE_ID = "service_jvlas79";
const TEMPLATE_ID = "template_ui2iuli";
const PUBLIC_KEY = "ZrnhuJTlDmN2xJsgA";

function UserList() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [size, setSize] = useState(5);
    const [user, setUser] = useState({});

    useEffect(() => {
        async function getData() {
            const response = await axios.get(API_ADMIN + `users?page=${page - 1}&size=${size}`);
            setUsers(response.data.content);
            setTotalPage(response.data.totalPages);
        };
        getData()
    }, [page, size]);

    const handleRenderPagination = () => {
        const pages = [];

        // const pageToShow = 3;

        const startPage = Math.max(1, page - Math.floor(size / 2));
        const endPage = Math.min(totalPage, startPage + size - 1);
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <li role="button" className={`${page === i ? "page-item active" : "page-item"}`} key={i}>
                    <a className="page-link" onClick={() => handelClickPage(i)}>
                        {i}
                    </a>
                </li>)
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
    const reloadPage = () => {
        window.location.reload();
    };

    const handleLock = async (item) => {
        item.status = 'false';

        await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
            admin: "AirBNB",
            name: item.lastName || item.firstName,
            message: `We're so sorry to report this news.
        Your account have been banned to business on our platform for violating our terms.
        We will update the reason here: 

        Hope you will respond to us as soon as possible.
         `
        }, PUBLIC_KEY).then((result) => {
            console.log('Send email success', result);
            setUser(item);
        }).catch((error) => {
            console.log('Send email fail', error);
        })


    }

    const handleChange = (event, value) => {
        setPage(value);
    };

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

        if (user.id) {
            sendData();
            reloadPage();
        }
    }, [user])

    return (
        <div className="container">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className='h2'>Customers</h1>
            </div>
            <div className='table-responsive'>
                <table className='table table-striped table-sm text-center '>
                    <thead>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col' colSpan={2}>First Name</th>
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
                                    <button className='btn btn-danger me-2' data-bs-toggle="modal" data-bs-target={`#staticDeny${index}`}>
                                        <span className='fa-solid fa-user-lock'></span>
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
                                                    <p>Do you want to block {user.firstName || user.lastName} account?</p>
                                                </div>
                                                <div className="modal-footer">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        data-bs-dismiss="modal"
                                                    >
                                                        Close
                                                    </button>
                                                    <button onClick={() => handleLock(user)} type="button" className="btn btn-success">
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
                        <Pagination count={totalPage} page={page} onChange={handleChange} siblingCount={3} color="secondary" />
                    </Stack>
                </div>
            </div>
        </div>
    )
}

export default UserList;