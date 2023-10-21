import axios from "axios";
import { API_HOUSE_URL } from "./common";
import { differenceInDays } from "date-fns";

class HouseService {
    static getHouseList() {
        return axios.get(API_HOUSE_URL)
    }

    // static getShowCancellationPolicy(selectedDates, house) {
    //     const startDate = selectedDates[0];
    //     const endDate = selectedDates[1];
    //     let cancellationPolicy;
    //     let shortTerm;
    //     let longTerm;
    //     if (house?.cancellationPolicyDetailList) {
    //         shortTerm = house?.cancellationPolicyDetailList[0];
    //         longTerm = house?.cancellationPolicyDetailList[1];
    //     }
    //     if (!startDate || !endDate)
    //         return "Thêm ngày cho chuyến đi của bạn để nhận thông tin về chính sách hủy cho đặt phòng này.";


    //     const dateDifference = endDate.diff(startDate, 'day');
    //     cancellationPolicy = dateDifference > 28 ? longTerm : shortTerm;


    //     console.log("cancellationPolicy", cancellationPolicy);
    // }
}

export default HouseService;