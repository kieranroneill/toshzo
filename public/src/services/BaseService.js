import axios from 'axios';
import Promise from 'bluebird';

const requestConfig = {
    validateStatus: () => true // Return resolved for all requests.
};

class BaseService {
    static handleResponse(response) {
        if(response.status >= 400) {
            return Promise.reject(response.data);
        }

        return Promise.resolve(response.data);
    }

    static httpGet(url) {
        return Promise
            .resolve(axios.get(url, requestConfig)) // Covert to bluebird promise.
            .then(BaseService.handleResponse);
    }

    static httpPost(url, body) {
        return Promise
            .resolve(axios.post(url, body, requestConfig))
            .then(BaseService.handleResponse);
    }
}

export default BaseService;
