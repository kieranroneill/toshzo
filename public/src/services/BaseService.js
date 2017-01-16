import axios from 'axios';

class BaseService {
    constructor() {}

    httpGet(url) {
        return axios.get(url);
    }
}

export default BaseService;
