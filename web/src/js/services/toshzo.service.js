'use strict';

import BaseService from './base.service';

let instance;

class Toshzo extends BaseService {
    constructor() {
        super();
        this.monzo = {
            clientId: null,
            redirectUri: null
        };
    }

    getReferences() {
        this.httpGet('/api/reference')
            .bind(this)
            .then((response) => {
                this.monzo.clientId = response.data.monzo.clientId;
                this.monzo.redirectUri = response.data.monzo.redirectUri;

                return response;
            });
    }
}

instance = new Toshzo();

export default instance;
