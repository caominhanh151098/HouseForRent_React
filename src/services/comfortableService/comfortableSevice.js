import axios from "axios";


class ComfortableService{
    static getComfortable(){
        return axios.get('http://localhost:8080/api/comfortables')
    }
}

export default ComfortableService;