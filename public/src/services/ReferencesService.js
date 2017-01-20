import BaseService from './BaseService';

const route = '/api/references';

class ReferencesService {
    static getReferences() {
        return BaseService.httpGet(route);
    }
}

export default ReferencesService;
