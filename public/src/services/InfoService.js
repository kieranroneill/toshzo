import BaseService from './BaseService';

// Strings.
import strings from '../../../config/strings.json';

const route = strings.endpoints.API + strings.endpoints.INFO;

class InfoService extends BaseService {
    constructor(store) {
        super(store);
    }

    getInfo() {
        return this.httpGet(route);
    }
}

export default InfoService;
