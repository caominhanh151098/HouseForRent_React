import axios from "axios"
// import sha1 from '../../node_modules/sha1/sha1'

class fileServive {
    static uploadAvatar(avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        formData.append("upload_preset", "iqwi1b1d");
        return axios.post('https://api-ap.cloudinary.com/v1_1/dk9i8myax/image/upload', formData);
    }
}

export default fileServive;