import axios from "axios";
import { API_HOUSE_URL } from "./common";

class HouseService{
    static getHouseList(){
        return axios.get(API_HOUSE_URL)
    }
}

export default HouseService;