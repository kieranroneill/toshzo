import BaseService from './BaseService';

// Strings.
import strings from '../config/strings.json';

const route = strings.endpoints.API + strings.endpoints.SESSION;

class SessionService {
    static createSessionToken(monzoToken, toshlToken) {
        return BaseService.httpPost(route, { monzoToken: monzoToken, toshlToken: toshlToken });
    }

    static verifySessionToken(token) {
        const url = route + '?token=' + token;

        return BaseService.httpGet(url);
    }
}

export default SessionService;
