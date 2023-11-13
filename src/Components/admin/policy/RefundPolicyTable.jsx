import React from "react";
import { Dropdown, DropdownButton, Form, InputGroup, Table } from "react-bootstrap";

const RefundPolicyTable = () => {
    return (
        <div className="container">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Refund Policy</h1>
            </div>
            <div>
                <div className="d-flex justify-content-between">
                    <div className="col-5">
                        <InputGroup className="mb-3">
                            <DropdownButton
                                variant="outline-secondary"
                                title="Sort"
                                id="input-group-dropdown-1"
                            >
                                <Dropdown.Item
                                // onClick={() => handleSortAtoZ()}
                                >A-Z
                                </Dropdown.Item>
                                <Dropdown.Item
                                // onClick={() => handleSortZtoA()}
                                >Z-A
                                </Dropdown.Item>
                                <Dropdown.Divider />
                            </DropdownButton>
                            <Form.Control />
                        </InputGroup>
                    </div>
                    <div>
                        <button className="btn btn-primary">
                            <i className="fa-solid fa-square-plus me-2"></i>
                            <span>Create</span>
                        </button>
                    </div>
                </div>
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

                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default RefundPolicyTable;