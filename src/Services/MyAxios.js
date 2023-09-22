import axios from "axios";
import { API_USER_URL } from "./common";

    
class MyAxios {
    static createInstance(token) {
        return axios.create({
            baseURL: API_USER_URL,
            headers: {
                'Authorization': token
            }
        })
    };
} 

export default MyAxios;