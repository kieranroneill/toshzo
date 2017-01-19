import axios from 'axios';

class BaseService {
    static httpGet(url) {
        return axios.get(url);
    }
}

export default BaseService;
