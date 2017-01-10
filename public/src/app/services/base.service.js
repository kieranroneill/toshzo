'use strict';

const axios = require('axios');

export default class BaseService {
    constructor() {}

    httpGet(url) {
        return axios.get(url);
    }
}
