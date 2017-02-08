import BaseService from './BaseService';

// Strings.
import strings from '../../../config/strings.json';

const route = strings.endpoints.API + strings.endpoints.REFERENCES;

class ReferencesService extends BaseService {
    constructor(store) {
        super(store);
    }

    getReferences() {
        return this.httpGet(route);
    }
}

export default ReferencesService;
