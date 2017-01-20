import BaseService from './BaseService';

const route = '/api/reference';

class MonzoService {
    static getReferences() {
        return BaseService.httpGet(route);
    }
}

export default MonzoService;
