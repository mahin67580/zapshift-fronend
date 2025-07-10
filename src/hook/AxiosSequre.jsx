import axios from 'axios';

const AxiosSecure = axios.create({
    baseURL: 'http://localhost:3000',
})
const AxiosSequre = () => {
    return AxiosSecure;
};

export default AxiosSequre;