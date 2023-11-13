import axios from "axios";


class ComfortableService{
    static getComfortable(){
        return axios.get('https://quarter-rois.cghue.com/api/comfortables')
    }
}

export default ComfortableService;