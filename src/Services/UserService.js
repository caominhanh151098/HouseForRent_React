import axios from "axios";
import React from "react";
import { API_USER_LIST_URL } from "./common";

class UserService{
    static getUserList(){
        return axios.get(API_USER_LIST_URL);
    }
}

export default UserService;