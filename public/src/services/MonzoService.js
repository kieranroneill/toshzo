import BaseService from './BaseService';

// Strings.
import strings from '../../../config/strings.json';

const route = strings.endpoints.API + strings.endpoints.MONZO;

class MonzoService {
    static createMonzoRedirectUri() {
        return window.location.protocol + '//' +
            window.location.hostname +
            (window.location.port ? ':' + window.location.port : '') +
            '/' + strings.routes.AUTH;
    }

    static getStateToken() {
        let url = route + strings.endpoints.TOKEN + strings.endpoints.STATE;

        return BaseService.httpPost(url, {});
    }

    static getAccessToken(stateToken, authorisationCode) {
        const url = route + strings.endpoints.TOKEN + strings.endpoints.ACCESS;
        const body = {
            code: authorisationCode,
            redirectUri: MonzoService.createMonzoRedirectUri(),
            token: stateToken
        };

        return BaseService.httpPost(url, body);
    }
}

export default MonzoService;
