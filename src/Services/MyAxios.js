import axios from "axios";
import { API_USER_AUTH_URL } from "./common";

    
const MyAxios = axios.create({
    baseURL: API_USER_AUTH_URL,
    headers: {
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
    }
})
export default MyAxios;