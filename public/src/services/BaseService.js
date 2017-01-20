import axios from 'axios';

class BaseService {
    static httpGet(url) {
        return axios.get(url);
    }

    static httpPost(url, body) {
        return axios.post(url, body);
    }
}

export default BaseService;
