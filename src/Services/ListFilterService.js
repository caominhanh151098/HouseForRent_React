import axios from "axios";
import { API_GET_LIST_FILTER } from "./common";

class ListFilterService{
    static getListFilter(){
        return axios.get(API_GET_LIST_FILTER);
    }
}

export default ListFilterService;