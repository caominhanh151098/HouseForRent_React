import axios from "axios";

class MyAxios {
    static axiosWithHeader(URL) {
        return axios.create({
            baseURL: URL,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
            }
        })
    }
}
export default MyAxios;