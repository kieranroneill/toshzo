import BaseService from './BaseService';

// Strings.
import strings from '../../../config/strings.json';

const route = strings.endpoints.API + strings.endpoints.TOSHL;

class ToshlService {

    static verifyToken(personalToken) {
        let url = route + strings.endpoints.TOKEN;

        url += '?token=' + personalToken;

        return BaseService.httpGet(url);
    }
}

export default ToshlService;
