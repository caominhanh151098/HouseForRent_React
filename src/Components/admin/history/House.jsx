import React from "react";
import '../history/HouseCSS.css'
import { Dropdown, DropdownButton, Form, InputGroup, Pagination, Table } from "react-bootstrap";
import useFetchListHouseAccepted from "../../../Hooks/admin/listHouse/useFetchListHouseAccepted";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";




const House = () => {

    const [houses, setHouses] = useState([]);
    const [totalPage, setTotalPage] = useState(1);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(3);
    const [search, setSearch] = useState("");
    const [nameField , setNameField] = useState("hotelName");
    const [type , setType] = useState('DESC');

    const data = useFetchListHouseAccepted(page, size);

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
        if(page >= 0){
            setPage(1)
        }
    }

    const handleEndPage = () => {
        if(page < totalPage){
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
            timeout = setTimeout(() => {
                axios.get(`http://localhost:8080/api/admin/houses/accepted?search=${search}&page=${page - 1}&size=${size}&sort=${nameField},${type}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    console.log(response);
                    const data = response.data.content;
                    setHouses(data);
                    setTotalPage(response.data.totalPages);
                }).catch((e) => {
                    console.error("Lỗi search", e);
                })
            }, 1000);
        }
        return () => {
            clearTimeout(timeout)
        }
    }, [search, page, size , nameField , type])


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
                        {houses?.map(house => (
                            <tr key={house.id}>
                                <td>{house.hotelName}</td>
                                <td>{house.user.firstName || ""} {house.user.lastName || ""}</td>
                                <td>{house.user.email || ""}</td>
                                <td>
                                    <button onClick={() => handlefilePDF(house)} className="btn btn-outline-success">Records Confirm</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination className="justify-content-center">
                    <Pagination.First disabled={page === 1} onClick={() => handleStartPage()}/>
                    <Pagination.Prev disabled={page === 1} onClick={() => handlePrePage()} />
                    {handlePagination()}
                    <Pagination.Next disabled={page === totalPage} onClick={() => handleNextPage()} />
                    <Pagination.Last disabled={page === totalPage} onClick={() => handleEndPage()}/>
                </Pagination>
            </div>
        </div>
    )
}

export default House;