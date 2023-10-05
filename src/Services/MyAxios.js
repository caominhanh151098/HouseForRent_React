import axios from "axios";
import { API_USER_URL } from "./common";

    
const MyAxios =(url)=> axios.create({
    baseURL: url,
    headers: {
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
    }
})
export default MyAxios;