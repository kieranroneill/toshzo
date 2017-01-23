import BaseService from './BaseService';

// Strings.
import strings from '../config/strings.json';

const route = strings.endpoints.API + strings.endpoints.REFERENCES;

class ReferencesService {
    static getReferences() {
        return BaseService.httpGet(route);
    }
}

export default ReferencesService;
