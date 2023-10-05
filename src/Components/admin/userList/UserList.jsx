import axios from "axios";
import React, { useEffect, useState } from "react";
import us from "../../../assets/images/animat-rocket-color.gif";


function UserList() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [size, setSize] = useState(3);

    useEffect(() => {
        async function getData() {
            const response = await axios.get(`http://localhost:8080/api/admin/users?page=${page - 1}&size=${size}`);
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

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className='h2'>Customers</h1>
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
                        {users.map((user) => (
                            <tr>
                                <td className='align-middle'>{user.id}</td>
                                <td>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <img style={{ width: "50px", height: "50px", borderRadius: "50%" }} src={user.avatar || us} alt='img' />
                                        {user.firstName}
                                    </div>
                                </td>
                                <td className='align-middle'>{user.lastName}</td>
                                <td className='align-middle'>{user.email}</td>
                                <td className='align-middle'>
                                    <button className='btn btn-danger me-2'>
                                        <span className='fa fa-ban'></span>
                                        Ban
                                    </button>
                                    <button className='btn btn-warning'>UnBan</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='d-flex justify-content-center'>
                    <nav className='' aria-label="...">
                        <ul className="pagination">
                            <li className={`${page === 1 ? 'page-item disabled' : 'page-item'}`}>
                                <a className="page-link" role='button' tabindex="-1" aria-disabled="true" onClick={() => handlePrePage()} >Previous</a>
                            </li>
                            {handleRenderPagination()}
                            <li className={`${page === totalPage ? 'page-item disabled' : 'page-item'}`}>
                                <a className="page-link" role='button' onClick={() => handleNextPage()}>Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>  
            </div>
        </>
    )
}

export default UserList;