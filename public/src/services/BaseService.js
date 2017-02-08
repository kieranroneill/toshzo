import _ from 'underscore';
import axios from 'axios';
import Promise from 'bluebird';

import configureStore from '../config/store';

const store = configureStore();
const initialRequestConfig = {
    headers: {},
    validateStatus: () => true // Return resolved for all requests.
};

class BaseService {
    static getRequestConfig(state) {
        const requestConfig = _.clone(initialRequestConfig);

        if(state.session.token) {
            requestConfig.headers[strings.headers.SESSION_TOKEN] = state.session.token;
        }

        return requestConfig;
    }

    static handleResponse(response) {
        if(response.status >= 400) {
            return Promise.reject(response.data);
        }

        return Promise.resolve(response.data);
    }

    httpGet(url) {
        return Promise
            .resolve(axios.get(url, BaseService.getRequestConfig(store.getState()))) // Covert to bluebird promise.
            .then(BaseService.handleResponse);
    }

    httpPost(url, body) {
        return Promise
            .resolve(axios.post(url, body, BaseService.getRequestConfig(store.getState())))
            .then(BaseService.handleResponse);
    }
}

export default BaseService;
