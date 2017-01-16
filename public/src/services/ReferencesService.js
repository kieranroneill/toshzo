import BaseService from './BaseService';

class ReferencesService extends BaseService {
    get() {
        return this.httpGet('/api/reference')
            .bind(this)
            .then(response => response);
    }
}

export default ReferencesService;
