import BaseService from './BaseService';

// Strings.
import strings from '../../../config/strings.json';

const route = strings.endpoints.API + strings.endpoints.TOSHL;

class ToshlService extends BaseService {
    getAccounts() {
        const url = route + strings.endpoints.ACCOUNTS;

        return this.httpGet(url);
    }

    verifyToken(personalToken) {
        let url = route + strings.endpoints.TOKEN;

        url += '?token=' + personalToken;

        return this.httpGet(url);
    }
}

export default new ToshlService();
