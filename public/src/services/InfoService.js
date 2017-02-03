import BaseService from './BaseService';

// Strings.
import strings from '../../../config/strings.json';

const route = strings.endpoints.API + strings.endpoints.INFO;

class InfoService {
    static getInfo() {
        return BaseService.httpGet(route);
    }
}

export default InfoService;
