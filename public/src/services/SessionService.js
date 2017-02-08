import BaseService from './BaseService';

// Strings.
import strings from '../../../config/strings.json';

const route = strings.endpoints.API + strings.endpoints.SESSION;

class SessionService extends BaseService {
    createSessionToken(monzoToken, toshlToken) {
        return this.httpPost(route, { monzoToken: monzoToken, toshlToken: toshlToken });
    }

    verifySessionToken(token) {
        const url = route + '?token=' + token;

        return this.httpGet(url);
    }
}

export default new SessionService();
