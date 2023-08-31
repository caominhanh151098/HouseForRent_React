import axios from "axios";
import { API_CATEGORY_URL } from "./common";

class CategoryService{
    static getCategoriesList(){
        return axios.get(API_CATEGORY_URL)
    }
}

export default CategoryService;