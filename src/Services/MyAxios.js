import axios from "axios";
import { API_USER_URL } from "./common";

    
const MyAxios = axios.create({
    baseURL: API_USER_URL,
    headers: {
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
    }
})
export default MyAxios;