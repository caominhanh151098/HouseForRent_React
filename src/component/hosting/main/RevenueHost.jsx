import React from 'react'
import '../main/CssHosting/revenueHost.css';
function RevenueHost() {

    return (
        <>
            <div className='col-7 container-revenue'>
                <div className='fs-2 mb-5'>Lịch sử giao dịch</div>
                <div className=' d-flex justify-content-between pb-3 mb-3 border-bottom'>
                    <div className='fs-5'>Các khoản thanh toán đã hoàn tất</div>
                    <div className='fs-5'>Các khoản thanh toán sắp tới</div>
                    <div className='fs-5'>Thu nhập thuần</div>
                </div>
                <div className='mb-3'>
                    <select class="form-select" aria-label="Default select example">
                        <option selected>Tất cả nhà / phòng cho thuê</option>
                    </select>
                </div>
                <div className=' d-flex justify-content-around mb-4'>
                    <div className='d-flex'>
                        <div style={{ verticalAlign: 'middle' }} className='fs-4'> Từ :  </div>
                        <select class="form-select month-select me-2 ms-2" aria-label="Default select example">
                            <option selected>Tháng 9</option>
                        </select>
                        <select class="form-select year-select me-2 ms-2" aria-label="Default select example">
                            <option selected>2023</option>
                        </select>
                    </div>
                    <div className='d-flex '>
                        <div style={{ verticalAlign: 'middle' }} className='fs-4'>Đến : </div>
                        <select class="form-select  month-select me-2 ms-2" aria-label="Default select example">
                            <option selected>Tháng 9</option>
                        </select>
                        <select class="form-select year-select me-2 ms-2" aria-label="Default select example">
                            <option selected>2023</option>
                        </select>
                    </div>
                </div>
                <div className='d-flex justify-content-between mb-3'>
                    <div className='fs-4'> Đã thanh toán : 0.0</div>
                    <div><button>xuất file CSV</button></div>
                </div>
                <div className='not-found'>
                    hiện không có giao dịch nào .
                </div>
            </div>
        </>
    )
} export default RevenueHost
