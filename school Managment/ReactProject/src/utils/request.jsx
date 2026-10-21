import axios from 'axios';
import { baseURL} from '../utils/config';


const request = (path="",method="GET" , data={}) =>{
    const isFormData = data instanceof FormData;

    return axios({
        method:method,
        url:baseURL+path,
        data :data,
        headers : isFormData
            ? {}
            : {
                'Content-Type' : 'application/json'
            }
    })
    .then((response) =>{
        return response.data;
    })
    .catch((error) =>{
        console.log(error);
        throw error;
    })
}

export default request;