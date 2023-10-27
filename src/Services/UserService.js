import axios from "axios";

import MyAxios from "./MyAxios";
import { API_USER_URL } from './common';

class UserService {
    static async loginUser(value) {
        const resp = await axios.post(`http://localhost:8080/api/auth/login`, { value })
        if (resp.status == 200) {
            if (!resp.data) {
                return true;
            }
            else {
                localStorage.setItem("jwt", resp.data.token);
                return false;
            }
        }
    }

    static register(data) {
        axios.post(`http://localhost:8080/api/auth/register`, data)
            .then(resp => {
                if (resp.status == 200) {
                    localStorage.setItem('userInfo', JSON.stringify(resp.data.userInfo))
                    return localStorage.setItem("jwt", resp.data.token);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    static addPhoneUser() {
        MyAxios(API_USER_URL).post(`/client/add-phone/`)
            .then(resp => {
            })
            .catch(err => {
                console.log(err);
            })
    }

    static verifyEmail() {

    }




}

export default UserService;