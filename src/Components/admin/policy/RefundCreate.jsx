import React from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";

const RefundCreate = () => {
    return (
        <div className="container">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Create Policy</h1>
            </div>
            <div className="d-flex justify-content-between">
                <div className="d-flex justify-content-between" style={{ width: "49%" }}>
                    <div style={{ width: "48%" }}>
                        <Form.Select aria-label="Default select example">
                            <option>--Choose--</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </Form.Select>
                    </div>
                    <div style={{ width: "48%" }}>
                        <Form.Select aria-label="Default select example">
                            <option>--Choose--</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </Form.Select>
                    </div>
                </div>
                <div style={{ width: "1%", borderLeft: "1px solid rgb(219, 210, 210)", height: "auto" }}></div>
                <div style={{ width: "49%" }}>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Select aria-label="Default select example">
                                <option>--Choose--</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as='textarea' rows={5} />
                        </Form.Group>
                        <Row>
                            <Form.Group as={Col}>
                                <InputGroup>
                                    <Form.Control />
                                    <InputGroup.Text>%</InputGroup.Text>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group as={Col}>
                                <InputGroup>
                                    <Form.Control />
                                    <InputGroup.Text>%</InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                        </Row>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default RefundCreate;