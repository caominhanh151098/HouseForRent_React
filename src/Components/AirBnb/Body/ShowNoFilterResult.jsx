import React from 'react'
import "../AirBnb.css"

const ShowNoFilterResult = () => {
    return (
        <div>
            <div className='no-filter-results'>
                <h2>Không có kết quả tìm kiếm phù hợp</h2>
                <p>Hãy thử thay đổi hoặc xóa một số bộ lọc hoặc điều chỉnh khu vực tìm kiếm của bạn.</p>
            </div>
        </div>
    )
}

export default ShowNoFilterResult