import axios from "axios";
import { API_ADD_PHONE_USER_URL } from "./common";
import MyAxios from "./MyAxios";

class UserService {
    static addPhoneUser(userId, token) {
        MyAxios.createInstance(token).post(`/client/add-phone/${userId}`)
            .then(resp => {
            })
            .catch(err => {
                console.log(err);
            })
    }

    static loginOrRegister(token) {
        MyAxios.createInstance(token).post(`/client/login`)
            .then(resp => {
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export default UserService;